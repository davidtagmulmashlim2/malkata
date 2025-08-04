
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
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { AppProviderClient } from '@/components/app-provider';

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

export async function generateMetadata(): Promise<Metadata> {
  const initialState = await getInitialState();
  const { seo } = initialState.siteContent;
  const { logo_image } = initialState.design;

  const title = seo?.title || DEFAULT_APP_STATE.siteContent.seo?.title || 'מלכתא';
  const description = seo?.description || DEFAULT_APP_STATE.siteContent.seo?.description || 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.';
  
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
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

  return (
    <html lang="he" dir="rtl">
        <head />
        <AppProviderClient initialAppState={initialState}>
            {children}
            <CartSheet />
            <Toaster />
        </AppProviderClient>
    </html>
  );
}
