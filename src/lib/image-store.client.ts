
'use client';
import { supabase } from './supabase';
import { getImage } from './image-store'; // We can still use the shared function

const BUCKET_NAME = 'malakatatest';

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
            let errorText = `Image upload failed with status: ${apiResponse.status}`;
            try {
                const errorData = await apiResponse.json();
                errorText = errorData.error || JSON.stringify(errorData);
            } catch (e) {
                // If response is not JSON, use the status text.
                errorText = apiResponse.statusText || errorText;
            }
            throw new Error(errorText);
        }

        const { key } = await apiResponse.json();
        if (!key) {
             throw new Error('Upload succeeded but no key was returned from API.');
        }

        return key;

    } catch (error: any) {
        console.error('Error in storeImage:', error);
        // Re-throw the error so the calling component can catch it and display a toast
        throw error;
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
