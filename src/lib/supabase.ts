
'use client';

import { createClient } from '@supabase/supabase-js'

// =================================================================================
// !! קריטי: יש להחליף את הערכים הבאים בפרטי הפרויקט האמיתיים שלך מ-Supabase !!
// 1. היכנס לחשבון שלך ב-Supabase
// 2. עבור אל הגדרות הפרויקט (אייקון גלגל שיניים)
// 3. לחץ על לשונית "API"
// 4. העתק את "Project URL" ואת "anon" "public" key והדבק אותם כאן.
// =================================================================================

const supabaseUrl = 'https://aapdlpaigmlpddgxctgx.supabase.co'; // <--- הדבק כאן את כתובת הפרויקט
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGRscGFpZ21scGRkZ3hjdGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTc0OTIsImV4cCI6MjA2OTU3MzQ5Mn0.vUSZ-4PNXlVU40u6RMMjRrAsw2caLnj9R7XYkwHh2i8'; // <--- הדבק כאן את מפתח ה-ANON PUBLIC


let supabaseInstance: any;

if (!supabaseUrl || supabaseUrl === 'YOUR_PROJECT_URL' || !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error("**********************************************************************************");
    console.error("!! שגיאת הגדרה חמורה: פרטי ההתחברות ל-Supabase חסרים או שגויים. !!");
    console.error("!! יש לעדכן את הקובץ src/lib/supabase.ts עם פרטי הפרויקט האמיתיים. !!");
    console.error("**********************************************************************************");
    
    // Create a dummy client to prevent the app from crashing.
    // Functions will fail, but the UI will load.
    supabaseInstance = {
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
