
'use client';
import { storage } from './firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

const imageCache = new Map<string, string>();

export async function storeImage(dataUrl: string): Promise<string> {
    if (!dataUrl.startsWith('data:image')) {
        // It's not a new upload, but likely an existing key or URL.
        return dataUrl;
    }

    const imageKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const storageRef = ref(storage, `images/${imageKey}`);
    
    // Firebase Storage's uploadString with 'data_url' correctly handles the Data URL format.
    await uploadString(storageRef, dataUrl, 'data_url');
    
    // After uploading, we store the key, not the URL. The URL will be fetched on demand.
    return imageKey;
}

export async function getImage(key: string): Promise<string | null> {
    if (!key || key.startsWith('http')) {
        return key;
    }
     if (imageCache.has(key)) {
        return imageCache.get(key)!;
    }

    try {
        const storageRef = ref(storage, `images/${key}`);
        const url = await getDownloadURL(storageRef);
        imageCache.set(key, url);
        return url;
    } catch (error: any) {
        if (error.code === 'storage/object-not-found') {
            console.warn(`Image with key "${key}" not found in Firebase Storage.`);
        } else {
            console.error(`Error fetching image with key "${key}":`, error);
        }
        // Return a placeholder if the image is not found or an error occurs.
        return "https://placehold.co/600x400.png";
    }
}

export async function deleteImage(key: string): Promise<void> {
    if (!key || key.startsWith('http')) {
        // This is a URL, not a key, so we can't delete it.
        return;
    }

    if (imageCache.has(key)) {
        imageCache.delete(key);
    }

    try {
        const storageRef = ref(storage, `images/${key}`);
        await deleteObject(storageRef);
    } catch (error: any) {
        if (error.code === 'storage/object-not-found') {
            // It's already deleted or never existed, so we can consider the operation successful.
            console.warn(`Image with key "${key}" not found for deletion, but that's okay.`);
        } else {
            console.error(`Error deleting image with key "${key}":`, error);
        }
    }
}
