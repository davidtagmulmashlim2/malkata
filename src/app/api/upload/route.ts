
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { promises as fs } from 'fs';
import formidable from 'formidable';
import { NextRequest } from 'next/server';

const BUCKET_NAME = 'images';

// Helper to convert data URL to a Buffer
function dataURLToBuffer(dataURL: string) {
    const base64 = dataURL.split(',')[1];
    if (!base64) {
        throw new Error('Invalid data URL');
    }
    return Buffer.from(base64, 'base64');
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const fileDataUrl = body.file as string;

        if (!fileDataUrl || !fileDataUrl.startsWith('data:image')) {
            return NextResponse.json({ error: 'Invalid file data' }, { status: 400 });
        }
        
        const fileBuffer = dataURLToBuffer(fileDataUrl);
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: fileDataUrl.substring(fileDataUrl.indexOf(':') + 1, fileDataUrl.indexOf(';')),
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ key: fileKey }, { status: 200 });

    } catch (e: any) {
        console.error('API Route Error:', e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
