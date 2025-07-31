
'use client';
import { supabase } from './supabase';

const BUCKET_NAME = 'images';

export async function storeImage(dataUrl: string): Promise<string> {
    if (!dataUrl.startsWith('data:image')) {
        // If it's not a data URL, assume it's already a valid key/URL
        return dataUrl;
    }

    try {
        // Use the new API route for uploading
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file: dataUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Image upload failed');
        }

        const { key } = await response.json();
        if (!key) {
            throw new Error('Image upload succeeded but did not return a key.');
        }
        
        return key;

    } catch (error) {
        console.error('Error in storeImage:', error);
        // Fallback or rethrow, depending on desired behavior
        // Using a placeholder to indicate an error to the user
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
