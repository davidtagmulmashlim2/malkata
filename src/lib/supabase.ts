
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("**********************************************************************************");
    console.error("!! Critical Setup Error: Supabase URL or Anon Key is missing. !!");
    console.error("!! Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY !!");
    console.error("!! are set in your environment variables.                                     !!");
    console.error("**********************************************************************************");
    
    // Create a dummy client to prevent the app from crashing on build.
    // Functions will fail, but the UI might partially load.
    supabaseInstance = {
      from: () => ({
        select: () => Promise.resolve({ error: { message: 'Supabase not configured.' }, data: null }),
        insert: () => Promise.resolve({ error: { message: 'Supabase not configured.' }, data: null }),
        update: () => Promise.resolve({ error: { message: 'Supabase not configured.' }, data: null }),
        delete: () => Promise.resolve({ error: { message: 'Supabase not configured.' }, data: null }),
        limit:  () => ({
            single: () => Promise.resolve({ error: { message: 'Supabase not configured.' }, data: null })
        }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: { message: 'Supabase not configured.' } }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://placehold.co/600x400.png?text=Config+Error' } }),
          remove: () => Promise.resolve({ error: { message: 'Supabase not configured.' } }),
        }),
      },
    };

} else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
