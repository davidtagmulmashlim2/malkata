
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your Supabase project URL and anon key
// You can find these in your Supabase project's settings under "API".
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings (cog icon) -> API
// 4. Copy the URL and the anon public key
const supabaseUrl = 'https://pvjyjyrrszvepmseszle.supabase.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anlqeXJyc3p2ZXBtc2VzemxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1ODQ1NTgsImV4cCI6MjAzNzE2MDU1OH0.8QZkF_d1K7uL2gKCKaQzHxN8T5Rj6S5D5a4R36B4D6c';


// The Supabase client is initialized directly with the provided URL and key.
// No need for conditional checks here anymore as the user has provided the credentials.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
