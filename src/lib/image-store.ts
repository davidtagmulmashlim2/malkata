
'use client';
import { supabase } from './supabase';

const BUCKET_NAME = 'images';

// Helper to convert data URL to Blob
const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return blob;
};

export async function storeImage(dataUrl: string): Promise<string> {
    if (!dataUrl.startsWith('data:image')) {
        return dataUrl;
    }

    try {
        const blob = await dataUrlToBlob(dataUrl);
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, blob, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Error uploading to Supabase:', error.message);
            throw error;
        }

        // We store the key, not the full URL.
        return fileKey;

    } catch (error) {
        console.error('Error in storeImage:', error);
        throw error;
    }
}

export function getImage(key: string): string | null {
    if (!key || key.startsWith('http')) {
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
