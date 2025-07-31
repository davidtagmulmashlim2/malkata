
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'images';

export async function POST(request: Request) {
    try {
        const { image } = await request.json();

        if (!image || !image.startsWith('data:')) {
            return NextResponse.json({ error: 'Invalid image data provided.' }, { status: 400 });
        }

        // Extract mime type and base64 data
        const mimeMatch = image.match(/data:(image\/.*?);base64,/);
        if (!mimeMatch) {
            return NextResponse.json({ error: 'Invalid data URL format.' }, { status: 400 });
        }
        const mimeType = mimeMatch[1];
        const base64Data = image.replace(/^data:image\/.*;base64,/, '');
        const fileExtension = mimeType.split('/')[1] || 'png';
        
        // Convert base64 to a Buffer
        const buffer = Buffer.from(base64Data, 'base64');
        
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, buffer, {
                contentType: mimeType,
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
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
