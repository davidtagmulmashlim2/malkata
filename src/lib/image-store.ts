import { supabase } from './supabase';

const BUCKET_NAME = 'malakatatest';

// This function can run on both server and client
export function getImage(key: string): string | null {
    if (!supabase) {
        console.error("Supabase client is not available.");
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
