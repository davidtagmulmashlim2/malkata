
'use client';
import { AppProvider, useApp } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { cn } from '@/lib/utils';
import './globals.css';
import '../styles/themes/default.css';
import '../styles/themes/retro.css';
import '../styles/themes/urban.css';
import '../styles/themes/terminal.css';
import '../styles/themes/ocean.css';
import '../styles/themes/forest.css';
import '../styles/themes/sunrise.css';
import '../styles/themes/luxury.css';
import '../styles/themes/natural.css';
import '../styles/themes/minimal.css';
import '../styles/themes/biblical.css';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_APP_STATE } from '@/lib/data';
import type { AppState } from '@/lib/types';


// This component now handles applying themes and fonts AFTER the initial client load.
function AppBody({ children, initialAppState }: { children: React.ReactNode, initialAppState: AppState }) {
    const { state, isLoading } = useApp();

    useEffect(() => {
        // Only apply theme and font changes on the client side, and after data has loaded.
        // This prevents hydration mismatches related to dynamic class names or styles.
        if(!isLoading) {
            const themeClasses = ['theme-default', 'theme-retro', 'theme-urban', 'theme-terminal', 'theme-ocean', 'theme-forest', 'theme-sunrise', 'theme-luxury', 'theme-natural', 'theme-minimal', 'theme-biblical'];
            document.documentElement.classList.remove(...themeClasses);
            document.documentElement.classList.add(`theme-${state.design.theme}`);
            
            document.documentElement.style.setProperty('--font-headline-family', `var(--font-${state.design.headlineFont})`);
            document.documentElement.style.setProperty('--font-sans-family', `var(--font-${state.design.bodyFont})`);
        }
    }, [isLoading, state.design]);

    // The body structure is now ALWAYS rendered on both server and client.
    // The `isLoading` state within child components will handle showing skeletons.
    return (
        <body className={cn('min-h-screen flex flex-col')}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <Toaster />
        </body>
    );
}

// This function now fetches all data on the server
async function getInitialAppState(): Promise<AppState> {
  try {
    const [
        siteContentRes,
        designRes,
        dishesRes,
        categoriesRes,
        galleryRes,
        testimonialsRes,
        subscribersRes,
        submissionsRes
    ] = await Promise.all([
        supabase.from('site_content').select('content').limit(1).single(),
        supabase.from('design').select('settings').limit(1).single(),
        supabase.from('dishes').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('subscribers').select('*').order('date', { ascending: false }),
        supabase.from('submissions').select('*').order('date', { ascending: false })
    ]);

    const loadedState: AppState = {
        siteContent: { ...DEFAULT_APP_STATE.siteContent, ...(siteContentRes.data?.content || {}) },
        design: { ...DEFAULT_APP_STATE.design, ...(designRes.data?.settings || {}) },
        dishes: dishesRes.data || [],
        categories: categoriesRes.data || [],
        gallery: galleryRes.data || [],
        testimonials: testimonialsRes.data || [],
        subscribers: subscribersRes.data || [],
        submissions: submissionsRes.data || [],
    };
    return loadedState;
  } catch (error) {
      console.error("Failed to fetch initial state from Supabase on server, using default.", error);
      return DEFAULT_APP_STATE;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAppState = await getInitialAppState();
  
  return (
    <html lang="he" dir="rtl">
        <head />
        <AppProvider initialAppState={initialAppState}>
            <AppBody initialAppState={initialAppState}>
                {children}
            </AppBody>
        </AppProvider>
    </html>
  );
}
