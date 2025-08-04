
'use client';

import { AppProvider } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { AppState } from '@/lib/types';
import React from 'react';

export function AppProviderClient({ children, initialAppState }: { children: React.ReactNode, initialAppState: AppState }) {
  return (
    <AppProvider initialAppState={initialAppState}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </AppProvider>
  );
}
