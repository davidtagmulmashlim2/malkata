
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Critical: Supabase environment variables are not set!");
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
const BUCKET_NAME = 'malakatatest';

const generateFileKey = (mimeType: string) => {
    const extension = mimeType.split('/')[1] || 'png';
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return `img-${Date.now()}-${uuid}.${extension}`;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const dataUrl = body.image;

        if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
            return NextResponse.json({ error: 'Invalid image data URL' }, { status: 400 });
        }
        
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        
        const fileBuffer = Buffer.from(base64Data, 'base64');
        const fileKey = generateFileKey(mimeType);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', JSON.stringify(error, null, 2));
            return NextResponse.json({ error: `Supabase upload error: ${error.message}` }, { status: 500 });
        }

        if (!data?.path) {
            console.error('Upload to Supabase succeeded but no path was returned. Full response:', JSON.stringify(data, null, 2));
            return NextResponse.json({ error: 'Upload to Supabase succeeded but no path was returned.' }, { status: 500 });
        }
        
        return NextResponse.json({ key: data.path }, { status: 200 });

    } catch (e: any) {
        console.error('API Error (outer catch block):', e);
        // If the error is due to body parsing (e.g., too large), it might land here.
        if (e.type === 'entity.too.large') {
             return NextResponse.json({ error: 'File is too large.' }, { status: 413 });
        }
        return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
