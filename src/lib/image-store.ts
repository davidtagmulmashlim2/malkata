
'use client';
import { supabase } from './supabase';

const BUCKET_NAME = 'images';

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataurl: string): Blob | null {
    if (!dataurl || !dataurl.startsWith('data:')) return null;
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export async function storeImage(dataUrl: string): Promise<string> {
    // If it's not a data URL, it's probably an existing key or a placeholder. Don't re-upload.
    if (!dataUrl.startsWith('data:image')) {
        return dataUrl;
    }

    try {
        const blob = dataURLtoBlob(dataUrl);
        if (!blob) {
            throw new Error('Failed to convert data URL to blob.');
        }

        const fileExtension = blob.type.split('/')[1] || 'png';
        const fileKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, blob, {
                contentType: blob.type,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        if (!data?.path) {
            throw new Error('Upload succeeded but no path returned.');
        }

        return data.path;

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
