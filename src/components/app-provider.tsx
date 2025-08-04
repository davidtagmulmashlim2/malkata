
'use client';

import { AppProvider } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import type { AppState } from '@/lib/types';
import React from 'react';

export function AppProviderClient({ children, initialAppState }: { children: React.ReactNode, initialAppState: AppState }) {
  return (
    <AppProvider initialAppState={initialAppState}>
      <body className={cn('min-h-screen flex flex-col', `theme-${initialAppState.design.theme}`)} style={{
          '--font-headline-family': `var(--font-${initialAppState.design.headline_font})`,
          '--font-sans-family': `var(--font-${initialAppState.design.body_font})`,
      } as React.CSSProperties}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </body>
    </AppProvider>
  );
}
