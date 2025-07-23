
'use client';
import type { Metadata } from 'next';
import { AppProvider, useApp } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { cn } from '@/lib/utils';
import './globals.css';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect } from 'react';


function AppLayout({ children }: { children: React.ReactNode }) {
    const { state } = useApp();
    const isClient = useIsClient();

    useEffect(() => {
        if(isClient) {
            document.documentElement.className = `theme-${state.design.theme}`;
        }
    }, [isClient, state.design.theme]);

    useEffect(() => {
        if(isClient) {
            document.title = state.siteContent.hero.title;
        }
    }, [isClient, state.siteContent.hero.title]);

    return (
        <>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSheet />
            <Toaster />
        </>
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body className={cn('font-body antialiased bg-background text-foreground min-h-screen flex flex-col')}>
            <AppProvider>
                <AppLayout>
                    {children}
                </AppLayout>
            </AppProvider>
        </body>
    </html>
  );
}
