
import { AppProvider } from '@/context/app-context';
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
import type { AppState } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import { getImage } from '@/lib/image-store';
import { supabase } from '@/lib/supabase';
import React from 'react';


async function getInitialState(): Promise<AppState> {
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
      console.error("Failed to fetch initial state from Supabase, using default.", error);
      return DEFAULT_APP_STATE;
  }
}

function AppBody({ children, initialState }: { children: React.ReactNode, initialState: AppState }) {
  return (
    <AppProvider initialAppState={initialState}>
      <body className={cn('min-h-screen flex flex-col', `theme-${initialState.design.theme}`)} style={{
          fontFamily: `var(--font-${initialState.design.body_font})`,
          '--font-headline-family': `var(--font-${initialState.design.headline_font})`,
          '--font-sans-family': `var(--font-${initialState.design.body_font})`,
      } as React.CSSProperties}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartSheet />
          <Toaster />
      </body>
    </AppProvider>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = await getInitialState();

  const { seo } = initialState.siteContent;
  const { logo_image } = initialState.design;
  
  const title = seo?.title || DEFAULT_APP_STATE.siteContent.seo?.title || 'מלכתא';
  const description = seo?.description || DEFAULT_APP_STATE.siteContent.seo?.description || 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.';
  
  let image = 'https://placehold.co/1200x630/FAEBD7/8B0000/png?text=מלכתא'; // Final fallback
  if (seo?.image) {
      image = getImage(seo.image) || image;
  } else if (logo_image) {
      image = getImage(logo_image) || image;
  }

  return (
    <html lang="he" dir="rtl">
        <head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="theme-color" content="#8B0000" />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </head>
        <AppBody initialState={initialState}>
            {children}
        </AppBody>
    </html>
  );
}
