

import type { AppState } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import { getImage } from '@/lib/image-store';
import { supabase } from '@/lib/supabase';
import React from 'react';
import type { Metadata, Viewport } from 'next';
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
import { AppProviderClient } from '@/components/app-provider';
import { cn } from '@/lib/utils';


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
      
      const siteContent = siteContentRes.data?.content ? { ...DEFAULT_APP_STATE.siteContent, ...siteContentRes.data.content } : DEFAULT_APP_STATE.siteContent;
      const design = designRes.data?.settings ? { ...DEFAULT_APP_STATE.design, ...designRes.data.settings } : DEFAULT_APP_STATE.design;

      const loadedState: AppState = {
          siteContent: siteContent,
          design: design,
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

export const viewport: Viewport = {
  themeColor: '#8B0000',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = await getInitialState();
  const { seo, hero } = initialState.siteContent;
  const { logo_image, favicon } = initialState.design;
  
  const title = seo?.title || (hero.title_first_word ? hero.title_first_word + ' ' + hero.title_rest : 'מלכתא');
  const description = seo?.description || hero.subtitle || 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.';
  
  let imageUrl: string | undefined = undefined;
  
  const seoImageKey = seo?.image;
  const logoImageKey = logo_image;

  if (seoImageKey) {
      const url = getImage(seoImageKey);
      if (url) imageUrl = url;
  }
  
  if (!imageUrl && logoImageKey) {
      const url = getImage(logoImageKey);
      if (url) imageUrl = url;
  }

  if (!imageUrl) {
      imageUrl = `https://placehold.co/1200x630/FAEBD7/8B0000/png?text=${encodeURIComponent(title)}`;
  }

  const faviconUrl = favicon ? getImage(favicon) : undefined;

  return (
    <html lang="he" dir="rtl">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {faviconUrl && (
          <link rel="icon" href={faviconUrl} sizes="any" />
        )}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </head>
      <body>
          <AppProviderClient initialAppState={initialState}>
              {children}
          </AppProviderClient>
      </body>
    </html>
  );
}
