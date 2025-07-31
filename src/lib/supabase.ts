
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your Supabase project URL and anon key
// You can find these in your Supabase project's settings under "API".
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings (cog icon) -> API
// 4. Copy the URL and the anon public key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY') {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase credentials are not set. Please update src/lib/supabase.ts. Image storage will not work.");
}

// Export a potentially null client and handle it in the functions that use it.
export const supabase = supabaseInstance;
