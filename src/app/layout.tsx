
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

// This component now correctly applies the theme class to the <html> element.
function ThemedHtml({ children }: { children: React.ReactNode }) {
    const { state } = useApp();
    const isClient = useIsClient();
    
    return (
        <html lang="he" dir="rtl" className={cn(isClient ? `theme-${state.design.theme}`: '')}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            {children}
        </html>
    );
}

function AppContent({ children }: { children: React.ReactNode }) {
    const { state } = useApp();
    const isClient = useIsClient();

    useEffect(() => {
        if(isClient) {
            document.title = state.siteContent.hero.title;
        }
    }, [isClient, state.siteContent.hero.title]);

    return (
        <body className={cn('font-body antialiased bg-background text-foreground')}>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
            <CartSheet />
            <Toaster />
        </body>
    )
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
        <ThemedHtml>
            <AppContent>{children}</AppContent>
        </ThemedHtml>
    </AppProvider>
  );
}
