
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { promises as fs } from 'fs';
import formidable, { File } from 'formidable';
import { v4 as uuidv4 } from 'uuid';

export const config = {
    api: {
        bodyParser: false,
    },
};

const BUCKET_NAME = 'images';

const parseForm = (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = formidable({});
        form.parse(req as any, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
};

export async function POST(request: Request) {
    try {
        const { files } = await parseForm(request);
        
        const file = (files.file as File[])?.[0];

        if (!file) {
            return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 });
        }

        const fileContent = await fs.readFile(file.filepath);
        const fileExtension = file.mimetype?.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${uuidv4()}.${fileExtension}`;
        
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
             return NextResponse.json({ error: 'Upload succeeded but no path was returned.' }, { status: 500 });
        }

        return NextResponse.json({ key: data.path }, { status: 200 });

    } catch (e) {
        console.error('Unhandled error in upload API:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return NextResponse.json({ error: `Server error: ${errorMessage}` }, { status: 500 });
    }
}
