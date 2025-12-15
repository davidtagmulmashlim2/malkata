
'use client';

import { AppProvider } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { AppState } from '@/lib/types';
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { DynamicThemeLoader } from './dynamic-theme-loader';
import { useApp } from '@/context/app-context';
import { WhatsappIcon } from '@/components/icons/whatsapp-icon';
import Link from 'next/link';
import { useIsClient } from '@/hooks/use-is-client';
import { AnnouncementBar } from './announcement-bar';
import { supabase } from '@/lib/supabase';
import { DEFAULT_APP_STATE } from '@/lib/data';

const FloatingWhatsAppButton = () => {
    const { state } = useApp();
    const { contact } = state.siteContent;
    const isClient = useIsClient();

    if (!isClient || !contact?.show_whatsapp || !contact?.whatsapp) {
        return null;
    }

    return (
        <Link
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="md:hidden fixed bottom-[16.66%] left-2 z-50 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
            <WhatsappIcon className="h-8 w-8" />
        </Link>
    );
}

const AppDataFetcher = ({ children }: { children: React.ReactNode }) => {
    const { dispatch } = useApp();

    useEffect(() => {
        const fetchInitialState = async () => {
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
                
                dispatch({ type: 'SET_FULL_STATE', payload: loadedState });

            } catch (error) {
                console.error("Failed to fetch initial state from Supabase, using default.", error);
                dispatch({ type: 'SET_FULL_STATE', payload: DEFAULT_APP_STATE });
            }
        };

        fetchInitialState();
    }, [dispatch]);

    return <>{children}</>;
};

export function AppProviderClient({ children, initialAppState }: { children: React.ReactNode, initialAppState: AppState }) {
  return (
    <AppProvider initialAppState={initialAppState}>
        <AppDataFetcher>
            <DynamicThemeLoader>
                <AnnouncementBar />
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <CartSheet />
                <FloatingWhatsAppButton />
                <Toaster />
            </DynamicThemeLoader>
        </AppDataFetcher>
    </AppProvider>
  );
}
