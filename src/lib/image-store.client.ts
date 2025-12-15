'use client';
import { supabase } from './supabase';
import { Buffer } from 'buffer';

const BUCKET_NAME = 'malakatatest';

const generateFileKey = (mimeType: string) => {
    const extension = mimeType.split('/')[1] || 'png';
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return `img-${Date.now()}-${uuid}.${extension}`;
};

// This function now uploads the image directly from the client to Supabase
export async function storeImage(dataUrl: string): Promise<string> {
    // If it's not a data URL, it's probably an existing key or a placeholder. Don't re-upload.
    if (!dataUrl.startsWith('data:image')) {
        return dataUrl;
    }

    try {
        if (!supabase) {
          throw new Error("Supabase client is not initialized.");
        }
        
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        
        const fileBuffer = Buffer.from(base64Data, 'base64');
        const fileKey = generateFileKey(mimeType);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileKey, fileBuffer, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', JSON.stringify(error, null, 2));
            throw new Error(`Supabase upload error: ${error.message}`);
        }

        if (!data?.path) {
            console.error('Upload to Supabase succeeded but no path was returned. Full response:', JSON.stringify(data, null, 2));
            throw new Error('Upload to Supabase succeeded but no path was returned.');
        }
        
        return data.path;

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
