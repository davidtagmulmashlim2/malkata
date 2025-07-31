
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Buffer } from 'buffer';

const BUCKET_NAME = 'YOUR_BUCKET_NAME';

const generateFileKey = (mimeType: string) => {
    const extension = mimeType.split('/')[1] || 'png';
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return `img-${Date.now()}-${uuid}.${extension}`;
};

export async function POST(request: Request) {
    console.log('[DEBUG] Received POST request to /api/upload');
    console.log('[DEBUG] Request URL:', request.url);
    console.log('[DEBUG] Request Headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2));

    try {
        const body = await request.json();
        const dataUrl = body.image;

        if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
            console.error('[DEBUG] Error: Invalid or missing image data URL in request body.');
            return NextResponse.json({ error: 'Invalid image data URL' }, { status: 400 });
        }

        console.log('[DEBUG] Successfully parsed image data URL from request body.');
        console.log('[DEBUG] Data URL (first 50 chars):', dataUrl.substring(0, 50));
        
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        
        const fileBuffer = Buffer.from(base64Data, 'base64');
        const fileKey = generateFileKey(mimeType);

        console.log(`[DEBUG] Generated file key: ${fileKey}`);
        console.log(`[DEBUG] Uploading to Supabase bucket: "${BUCKET_NAME}"`);
        console.log(`[DEBUG] File size: ${fileBuffer.length} bytes`);
        console.log(`[DEBUG] MIME type: ${mimeType}`);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) {
            console.error('[DEBUG] Supabase upload error:', JSON.stringify(error, null, 2));
            return NextResponse.json({ error: `Supabase upload error: ${error.message}` }, { status: 500 });
        }

        if (!data?.path) {
            console.error('[DEBUG] Upload to Supabase succeeded but no path was returned. Full response:', JSON.stringify(data, null, 2));
            return NextResponse.json({ error: 'Upload to Supabase succeeded but no path was returned.' }, { status: 500 });
        }

        console.log('[DEBUG] Supabase upload successful. Response:', JSON.stringify(data, null, 2));
        
        const responsePayload = { key: data.path };
        console.log('[DEBUG] Sending successful response to client:', JSON.stringify(responsePayload, null, 2));

        return NextResponse.json(responsePayload, { status: 200 });

    } catch (e: any) {
        console.error('[DEBUG] API Error (outer catch block):', e);
        return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
