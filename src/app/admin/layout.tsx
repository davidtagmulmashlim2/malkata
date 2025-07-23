'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, logout } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const isClient = useIsClient();
    
    useEffect(() => {
        if (isClient && !isAuthenticated && pathname !== '/admin') {
            router.push('/admin');
        }
    }, [isAuthenticated, router, isClient, pathname]);

    if (!isClient) {
      return (
        <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }
    
    if (!isAuthenticated && pathname !== '/admin') {
        return <div className="flex items-center justify-center min-h-screen"><p>טוען...</p></div>;
    }

    return (
        <div>
            {isAuthenticated && pathname.startsWith('/admin/dashboard') && (
                 <header className="bg-card border-b p-4">
                    <div className="container flex justify-between items-center">
                        <h1 className="text-xl font-bold">מערכת ניהול</h1>
                        <button onClick={() => { logout(); router.push('/admin'); }} className="text-sm text-primary hover:underline">התנתק</button>
                    </div>
                </header>
            )}
            {children}
        </div>
    );
}
