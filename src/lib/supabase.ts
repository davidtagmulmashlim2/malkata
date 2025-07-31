
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your Supabase project URL and anon key
// You can find these in your Supabase project's settings under "API".
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings (cog icon) -> API
// 4. Copy the URL and the anon public key
const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';


// The Supabase client is initialized directly with the provided URL and key.
// No need for conditional checks here anymore as the user has provided the credentials.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
