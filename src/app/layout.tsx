'use client';
import { AppProvider, useApp } from '@/context/app-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartSheet } from '@/components/cart-sheet';
import { cn } from '@/lib/utils';
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
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect } from 'react';

const fontClasses: { [key: string]: string } = {
  'playfair': 'font-playfair',
  'pt-sans': 'font-pt-sans',
  'roboto-mono': 'font-roboto-mono',
  'chakra-petch': 'font-chakra-petch',
  'cormorant-garamond': 'font-cormorant-garamond',
  'lato': 'font-lato',
  'montserrat': 'font-montserrat',
  'open-sans': 'font-open-sans',
  'frank-ruhl-libre': 'font-frank-ruhl-libre',
};

function AppBody({ children }: { children: React.ReactNode }) {
    const { state } = useApp();
    const isClient = useIsClient();

    useEffect(() => {
        if(isClient) {
            // Theme
            const themeClasses = ['theme-default', 'theme-retro', 'theme-urban', 'theme-terminal', 'theme-ocean', 'theme-forest', 'theme-sunrise', 'theme-luxury', 'theme-natural', 'theme-minimal', 'theme-biblical'];
            document.documentElement.classList.remove(...themeClasses);
            document.documentElement.classList.add(`theme-${state.design.theme}`);
            
            // Fonts
            document.documentElement.style.setProperty('--font-headline-family', `var(--font-${state.design.headlineFont})`);
            document.documentElement.style.setProperty('--font-sans-family', `var(--font-${state.design.bodyFont})`);
        }
    }, [isClient, state.design]);

    if (!isClient) {
        return <body className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
        </body>;
    }

    return (
        <body className={cn('min-h-screen flex flex-col')}>
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
    <AppProvider>
        <html lang="he" dir="rtl">
            <head />
            <AppBody>
                {children}
            </AppBody>
        </html>
    </AppProvider>
  );
}
