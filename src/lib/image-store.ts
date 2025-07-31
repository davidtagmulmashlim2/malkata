
'use client';
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'images';

export async function storeImage(dataUrl: string): Promise<string> {
    // If it's not a data URL, it's probably an existing key or a placeholder. Don't re-upload.
    if (!dataUrl.startsWith('data:image')) {
        return dataUrl;
    }

    try {
        const response = await fetch(dataUrl);
        const fileBuffer = await response.arrayBuffer();
        const file = new File([fileBuffer], "upload", { type: response.headers.get('content-type') ?? 'image/png' });

        const fileExtension = file.type.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${uuidv4()}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error('Error uploading to Supabase:', error.message);
            throw error;
        }

        if (!data?.path) {
            throw new Error('Upload succeeded but no path was returned.');
        }

        return data.path;
    } catch (error) {
        console.error('Error in storeImage:', error);
        if (error instanceof Error && error.message.includes('fetch')) {
             return "https://placehold.co/600x400.png?text=Network+Error";
        }
        return "https://placehold.co/600x400.png?text=Upload+Error";
    }
}


export function getImage(key: string): string | null {
    if (!supabase) {
        return "https://placehold.co/600x400.png?text=Config+Error";
    }
    
    if (!key || key.startsWith('http') || key.startsWith('data:')) {
        return key;
    }
    
    try {
        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(key);
            
        return data.publicUrl;

    } catch (error) {
        console.error(`Error fetching image with key "${key}":`, error);
        return "https://placehold.co/600x400.png";
    }
}

export async function deleteImage(key: string): Promise<void> {
     if (!supabase) {
        console.error("Supabase client is not initialized. Cannot delete image.");
        return;
    }
    if (!key || key.startsWith('http')) {
        return;
    }

    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([key]);

        if (error) {
            console.error('Error deleting image from Supabase:', error.message);
        }
    } catch (error) {
        console.error(`Error deleting image with key "${key}":`, error);
    }
}
