
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, logout, isLoading } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    
    // This effect ensures that if a user is NOT authenticated,
    // they are redirected to the login page if they try to access
    // any page within the /admin/dashboard/* route.
    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname.startsWith('/admin/dashboard')) {
            router.push('/admin');
        }
    }, [isAuthenticated, router, isLoading, pathname]);

    if (isLoading && pathname.startsWith('/admin/dashboard')) {
      return (
        <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
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
