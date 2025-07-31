
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import formidable from 'formidable';
import fs from 'fs';

const BUCKET_NAME = 'images';

// This tells Next.js to not use its default body parser, so we can use formidable
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper to parse the form
const parseForm = (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = formidable({});
        form.parse(req as any, (err, fields, files) => {
            if (err) {
                reject(err);
            }
            resolve({ fields, files });
        });
    });
};

export async function POST(req: NextRequest) {
    try {
        const { files } = await parseForm(req);
        const file = files.file?.[0];

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }

        // Read the file content from the temporary path
        const fileContent = fs.readFileSync(file.filepath);
        const fileExtension = file.mimetype?.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileContent, {
                contentType: file.mimetype || 'image/png',
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error in API route:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data?.path) {
            return NextResponse.json({ error: 'Upload succeeded but no path returned.' }, { status: 500 });
        }

        return NextResponse.json({ key: data.path }, { status: 200 });

    } catch (e: any) {
        console.error('Error in API/upload:', e);
        return NextResponse.json({ error: e.message || 'An unknown error occurred.' }, { status: 500 });
    }
}
