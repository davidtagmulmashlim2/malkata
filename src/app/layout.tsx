

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
import { useEffect, useState, useMemo } from 'react';
import type { AppState } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import Head from 'next/head';
import { getImage } from '@/lib/image-store';


function AppBody({ children }: { children: React.ReactNode }) {
    const { state, isLoading } = useApp();
    const [themeLoaded, setThemeLoaded] = useState(false);
    
    useEffect(() => {
        if(!isLoading) {
            const themeClasses = ['theme-default', 'theme-retro', 'theme-urban', 'theme-terminal', 'theme-ocean', 'theme-forest', 'theme-sunrise', 'theme-luxury', 'theme-natural', 'theme-minimal', 'theme-biblical'];
            document.documentElement.classList.remove(...themeClasses);
            document.documentElement.classList.add(`theme-${state.design.theme}`);
            
            document.documentElement.style.setProperty('--font-headline-family', `var(--font-${state.design.headline_font})`);
            document.documentElement.style.setProperty('--font-sans-family', `var(--font-${state.design.body_font})`);
            setThemeLoaded(true);
        }
    }, [isLoading, state.design]);

    return (
        <body className={cn('min-h-screen flex flex-col', { 'opacity-0': !themeLoaded, 'opacity-100 transition-opacity duration-300': themeLoaded })}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <Toaster />
        </body>
    );
}

// This is the component that will handle the Head logic.
// It will only render on the client side after loading is complete to prevent hydration errors.
function SEOManager() {
    const { state, isLoading } = useApp();
    
    const [pageMetadata, setPageMetadata] = useState({
        ogTitle: 'מלכתא - אוכל ביתי',
        ogDescription: 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.',
        ogImage: 'https://placehold.co/1200x630/FAEBD7/8B0000/png?text=מלכתא'
    });

    useEffect(() => {
        if (!isLoading) {
            const { seo } = state.siteContent;
            const { logo_image } = state.design;

            const ogImageSrc = seo?.image ? getImage(seo.image) : (logo_image ? getImage(logo_image) : null);
            
            setPageMetadata({
                ogTitle: seo?.title || 'מלכתא - אוכל ביתי',
                ogDescription: seo?.description || 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.',
                ogImage: ogImageSrc || 'https://placehold.co/1200x630/FAEBD7/8B0000/png?text=מלכתא'
            });
        }
    }, [isLoading, state.siteContent, state.design]);
    
    // Don't render anything on the server or while loading on the client
    if (isLoading) {
        return null;
    }

    return (
        <Head>
            <title>{pageMetadata.ogTitle}</title>
            <meta name="description" content={pageMetadata.ogDescription} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageMetadata.ogTitle} />
            <meta property="og:description" content={pageMetadata.ogDescription} />
            <meta property="og:image" content={pageMetadata.ogImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={pageMetadata.ogTitle} />
            <meta property="twitter:description" content={pageMetadata.ogDescription} />
            <meta property="twitter:image" content={pageMetadata.ogImage} />
            
            <meta name="theme-color" content="#8B0000" />
        </Head>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
        <head>
          {/* Minimal head content for SSR */}
          <title>מלכתא - אוכל ביתי</title>
        </head>
        <AppProvider initialAppState={DEFAULT_APP_STATE}>
            <SEOManager />
            <AppBody>
                {children}
            </AppBody>
        </AppProvider>
    </html>
  );
}
