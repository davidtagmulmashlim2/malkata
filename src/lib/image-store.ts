
'use client';
import { supabase } from './supabase';

const BUCKET_NAME = 'images';

function dataURLToBuffer(dataURL: string) {
    const base64 = dataURL.split(',')[1];
    if (!base64) {
        throw new Error('Invalid data URL');
    }
    return Buffer.from(base64, 'base64');
}


export async function storeImage(dataUrl: string): Promise<string> {
    if (!dataUrl.startsWith('data:image')) {
        // If it's not a data URL, assume it's already a valid key/URL
        return dataUrl;
    }

    try {
        const fileBuffer = dataURLToBuffer(dataUrl);
        const contentType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const fileExtension = contentType.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                contentType: contentType,
                upsert: false,
            });

        if (error) {
            console.error('Error uploading to Supabase:', error.message);
            throw error;
        }

        if (!data?.path) {
             throw new Error('Image upload succeeded but did not return a key.');
        }

        return data.path;

    } catch (error) {
        console.error('Error in storeImage:', error);
        return "https://placehold.co/600x400.png?text=Upload+Error";
    }
}


export function getImage(key: string): string | null {
    if (!supabase) {
        // Return a placeholder if supabase is not configured
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
