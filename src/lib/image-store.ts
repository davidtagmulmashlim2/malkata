
'use client';
import { supabase } from './supabase';

const BUCKET_NAME = 'images';

// This function now sends the image data URL to our own API route
export async function storeImage(dataUrl: string): Promise<string> {
    // If it's not a data URL, it's probably an existing key or a placeholder. Don't re-upload.
    if (!dataUrl.startsWith('data:image')) {
        return dataUrl;
    }

    try {
        const apiResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataUrl }),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ error: 'Image upload failed with non-JSON response' }));
            throw new Error(errorData.error || `Image upload failed with status: ${apiResponse.status}`);
        }

        const { key } = await apiResponse.json();
        if (!key) {
             throw new Error('Upload succeeded but no key was returned from API.');
        }

        return key;

    } catch (error) {
        console.error('Error in storeImage:', error);
        if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
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
