
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
import { useEffect } from 'react';

// This component now handles applying themes and fonts AFTER the initial client load.
function AppBody({ children }: { children: React.ReactNode }) {
    const { state, isLoading } = useApp();

    useEffect(() => {
        // Only apply theme and font changes on the client side, and after data has loaded.
        // This prevents hydration mismatches related to dynamic class names or styles.
        if(!isLoading) {
            const themeClasses = ['theme-default', 'theme-retro', 'theme-urban', 'theme-terminal', 'theme-ocean', 'theme-forest', 'theme-sunrise', 'theme-luxury', 'theme-natural', 'theme-minimal', 'theme-biblical'];
            document.documentElement.classList.remove(...themeClasses);
            document.documentElement.classList.add(`theme-${state.design.theme}`);
            
            document.documentElement.style.setProperty('--font-headline-family', `var(--font-${state.design.headlineFont})`);
            document.documentElement.style.setProperty('--font-sans-family', `var(--font-${state.design.bodyFont})`);
        }
    }, [isLoading, state.design]);

    // The body structure is now ALWAYS rendered on both server and client.
    // The `isLoading` state within child components will handle showing skeletons.
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
            {/* AppBody now correctly wraps the children and relies on the AppContext */}
            <AppBody>
                {children}
            </AppBody>
        </html>
    </AppProvider>
  );
}
