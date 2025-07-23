'use client';

import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useApp();
  const { categories } = state;
  const pathname = usePathname();

  return (
    <div>
        <nav className="border-b bg-card sticky top-16 z-30">
            <div className="container flex items-center justify-center p-2 overflow-x-auto">
                <div className="flex items-center gap-2">
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
                </div>
            </div>
        </nav>
        <main>{children}</main>
    </div>
  );
}
