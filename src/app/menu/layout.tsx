
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

  const shabbatCategory = categories.find(c => c.slug === 'shabbat-malkata');
  const otherCategories = categories.filter(c => c.slug !== 'shabbat-malkata');

  return (
    <div>
        <nav className="border-b bg-card sticky top-16 z-30">
            <div className="container flex items-center justify-center p-2 overflow-x-auto">
                <div className="flex items-center gap-2">
                    <Button asChild variant={pathname === '/menu' ? 'default' : 'ghost'} size="sm">
                        <Link href="/menu">כל המנות</Link>
                    </Button>
                    {shabbatCategory && (
                         <Button
                            asChild
                            variant={pathname.includes(shabbatCategory.slug) ? 'default' : 'ghost'}
                            size="sm"
                            className={cn(
                                'bg-amber-300 text-amber-800 hover:bg-amber-300/90',
                                'dark:bg-amber-400 dark:text-amber-900 dark:hover:bg-amber-400/90',
                                pathname.includes(shabbatCategory.slug) && 'bg-amber-400 text-amber-900 hover:bg-amber-400/90 dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-500/90'
                            )}
                        >
                            <Link href={`/menu/${shabbatCategory.slug}`}>{shabbatCategory.name}</Link>
                        </Button>
                    )}
                    {otherCategories.map(category => (
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
