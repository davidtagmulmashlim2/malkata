

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
import { useEffect, useState } from 'react';
import type { AppState } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import Head from 'next/head';
import { getImage } from '@/lib/image-store';


// This component now handles applying themes and fonts AFTER the initial client load.
function AppBody({ children }: { children: React.ReactNode }) {
    const { state, isLoading } = useApp();
    const [themeLoaded, setThemeLoaded] = useState(false);
    
    const { seo } = state.siteContent;
    const { logo_image } = state.design;

    const ogImageSrc = seo?.image ? getImage(seo.image) : (logo_image ? getImage(logo_image) : null);
    const ogImage = ogImageSrc ? `${ogImageSrc}?t=${new Date().getTime()}` : 'https://placehold.co/1200x630/e0a84c/FFFFFF/png?text=מלכתא';

    const ogTitle = seo?.title || 'מלכתא - אוכל ביתי';
    const ogDescription = seo?.description || 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.';


    useEffect(() => {
        // Only apply theme and font changes on the client side, and after data has loaded.
        // This prevents hydration mismatches related to dynamic class names or styles.
        if(!isLoading) {
            const themeClasses = ['theme-default', 'theme-retro', 'theme-urban', 'theme-terminal', 'theme-ocean', 'theme-forest', 'theme-sunrise', 'theme-luxury', 'theme-natural', 'theme-minimal', 'theme-biblical'];
            document.documentElement.classList.remove(...themeClasses);
            document.documentElement.classList.add(`theme-${state.design.theme}`);
            
            document.documentElement.style.setProperty('--font-headline-family', `var(--font-${state.design.headline_font})`);
            document.documentElement.style.setProperty('--font-sans-family', `var(--font-${state.design.body_font})`);
            setThemeLoaded(true);
        }
    }, [isLoading, state.design]);

    // The body structure is now ALWAYS rendered on both server and client.
    // The `isLoading` state within child components will handle showing skeletons.
    return (
        <body className={cn('min-h-screen flex flex-col', { 'opacity-0': !themeLoaded, 'opacity-100 transition-opacity duration-300': themeLoaded })}>
             <Head>
                <title>{ogTitle}</title>
                <meta name="description" content={ogDescription} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                <meta property="og:image" content={ogImage || undefined} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={ogTitle} />
                <meta property="twitter:description" content={ogDescription} />
                <meta property="twitter:image" content={ogImage || undefined} />
                
                <meta name="theme-color" content="#e0a84c" />
            </Head>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <Toaster />
        </body>
    );
}


// Layout no longer fetches data. It provides the context with a default state.
// The context provider will be responsible for fetching data on the client.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
        <head>
          {/* Fallback tags for server-side render. Client-side Head will override this. */}
          <title>מלכתא - אוכל ביתי</title>
          <meta name="description" content="מלכתא - טעמים של בית. אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש." />
        </head>
        <AppProvider initialAppState={DEFAULT_APP_STATE}>
            <AppBody>
                {children}
            </AppBody>
        </AppProvider>
    </html>
  );
}
