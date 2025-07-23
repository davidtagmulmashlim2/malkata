'use client';
import { AppProvider, useApp } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { cn } from '@/lib/utils';
import './globals.css';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect } from 'react';

function AppBody({ children }: { children: React.ReactNode }) {
    const { state } = useApp();
    const isClient = useIsClient();

    const themeClass = isClient ? `theme-${state.design.theme}` : '';
    const animationClass = state.design.animation === 'fadeIn' ? 'animation-fade-in' : state.design.animation === 'slideUp' ? 'animation-slide-up' : '';

    return (
        <body className={cn('min-h-screen flex flex-col', themeClass, animationClass)}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <Toaster />
        </body>
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
            {/* Font preconnects are now in globals.css via @import */}
        </head>
        <AppProvider>
            <AppBody>
                {children}
            </AppBody>
        </AppProvider>
    </html>
  );
}
