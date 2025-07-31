
'use client';
import { supabase } from './supabase';

const BUCKET_NAME = 'images';

// Helper to convert a data URL to a Buffer-like object for the server
function dataURLtoBuffer(dataurl: string): { buffer: Buffer, mime: string } | null {
    if (!dataurl || !dataurl.startsWith('data:')) return null;
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;

    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const base64Data = arr[1];
    
    // In the browser, we can't create a real Buffer, but the server will receive the base64 string
    // and can convert it. We'll simulate the structure for consistency.
    // The main part is sending the base64 data.
    return { buffer: Buffer.from(base64Data, 'base64'), mime };
}

export async function storeImage(dataUrl: string): Promise<string> {
    // If it's not a data URL, it's probably an existing key or a placeholder. Don't re-upload.
    if (!dataUrl.startsWith('data:image')) {
        return dataUrl;
    }

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Image upload failed with non-JSON response' }));
            throw new Error(errorData.error || 'Image upload failed');
        }

        const { key } = await response.json();
        if (!key) {
            throw new Error('Upload succeeded but no key was returned.');
        }
        return key;

    } catch (error) {
        console.error('Error in storeImage:', error);
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
