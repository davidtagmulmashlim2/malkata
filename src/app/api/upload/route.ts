
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'images';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }
        
        const fileContent = await file.arrayBuffer();
        const fileExtension = file.name.split('.').pop() || 'png';
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileContent, {
                contentType: file.type || 'image/png',
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
