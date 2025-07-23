'use client';

import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useApp();
  const { categories } = state;
  const pathname = usePathname();
  const isClient = useIsClient();

  return (
    <div>
        <nav className="border-b bg-card sticky top-16 z-30">
            <div className="container flex justify-center p-2 overflow-x-auto">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {isClient ? (
                        <>
                            <Button asChild variant={pathname === '/menu' ? 'default' : 'ghost'} size="sm">
                                <Link href="/menu">כל המנות</Link>
                            </Button>
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    asChild
                                    variant={pathname === `/menu/${category.slug}` ? 'default' : 'ghost'}
                                    size="sm"
                                >
                                    <Link href={`/menu/${category.slug}`}>{category.name}</Link>
                                </Button>
                            ))}
                        </>
                    ) : (
                        <div className="flex gap-2">
                           {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-24" />)}
                        </div>
                    )}
                </div>
            </div>
        </nav>
        <main>{children}</main>
    </div>
  );
}
