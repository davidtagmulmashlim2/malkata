
'use client';

import { AppProvider } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { AppState } from '@/lib/types';
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { DynamicThemeLoader } from './dynamic-theme-loader';
import { useApp } from '@/context/app-context';
import { WhatsappIcon } from '@/components/icons/whatsapp-icon';
import Link from 'next/link';
import { useIsClient } from '@/hooks/use-is-client';

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
            className="md:hidden fixed bottom-[16.66%] left-4 z-50 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
            <WhatsappIcon className="h-8 w-8" />
        </Link>
    );
}

export function AppProviderClient({ children, initialAppState }: { children: React.ReactNode, initialAppState: AppState }) {
  return (
    <AppProvider initialAppState={initialAppState}>
        <DynamicThemeLoader>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <FloatingWhatsAppButton />
            <Toaster />
        </DynamicThemeLoader>
    </AppProvider>
  );
}
