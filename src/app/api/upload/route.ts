
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'images';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.type.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${uuidv4()}.${fileExtension}`;
        
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                contentType: file.type || 'image/png',
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
