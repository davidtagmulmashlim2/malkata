
'use client';

import { AppProvider } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { AppState } from '@/lib/types';
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { DynamicThemeLoader } from './dynamic-theme-loader';

export function AppProviderClient({ children, initialAppState }: { children: React.ReactNode, initialAppState: AppState }) {
  return (
    <AppProvider initialAppState={initialAppState}>
        <DynamicThemeLoader>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <Toaster />
        </DynamicThemeLoader>
    </AppProvider>
  );
}
