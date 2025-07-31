
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'images';

function base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { dataUrl } = body;

        if (!dataUrl || !dataUrl.startsWith('data:image')) {
            return NextResponse.json({ error: 'Invalid data URL provided.' }, { status: 400 });
        }

        const contentType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64Data = dataUrl.split(',')[1];
        
        if (!base64Data) {
            return NextResponse.json({ error: 'Invalid base64 data.' }, { status: 400 });
        }
        
        const fileBuffer = base64ToBuffer(base64Data);
        const fileExtension = contentType.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                contentType: contentType,
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
