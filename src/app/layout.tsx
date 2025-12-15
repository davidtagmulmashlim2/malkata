
import type { AppState } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import { getImage } from '@/lib/image-store';
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
import { supabase } from '@/lib/supabase';

async function getInitialServerState(): Promise<AppState> {
  try {
    const [
      siteContentRes,
      designRes,
    ] = await Promise.all([
      supabase.from('site_content').select('content').limit(1).single(),
      supabase.from('design').select('settings').limit(1).single(),
    ]);

    const siteContent = siteContentRes.data?.content ? { ...DEFAULT_APP_STATE.siteContent, ...siteContentRes.data.content } : DEFAULT_APP_STATE.siteContent;
    const design = designRes.data?.settings ? { ...DEFAULT_APP_STATE.design, ...designRes.data.settings } : DEFAULT_APP_STATE.design;

    // Return a minimal state for metadata, the client will fetch the rest.
    return {
      ...DEFAULT_APP_STATE,
      siteContent,
      design,
    };
  } catch (error) {
    console.error("Failed to fetch initial state on server, using default.", error);
    return DEFAULT_APP_STATE;
  }
}

export const viewport: Viewport = {
  themeColor: '#8B0000',
}

export async function generateMetadata(): Promise<Metadata> {
  const initialState = await getInitialServerState();
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

  const faviconUrl = favicon ? getImage(favicon) : '/favicon.ico';
  
  const metadata: Metadata = {
    title: title,
    description: description,
    icons: faviconUrl ? [{ rel: 'icon', url: faviconUrl, sizes: 'any' }] : [],
    openGraph: {
      title: title,
      description: description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    }
  };

  if (imageUrl) {
    metadata.openGraph!.images = [imageUrl];
    metadata.twitter!.images = [imageUrl];
  }
  
  return metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = await getInitialServerState();

  return (
    <html lang="he" dir="rtl">
      <body>
          <AppProviderClient initialAppState={initialState}>
              {children}
          </AppProviderClient>
      </body>
    </html>
  );
}
