
'use client';

import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, isLoading } = useApp();
  const { categories } = state;
  const pathname = usePathname();

  const activeSlug = pathname.split('/').pop();

  return (
    <div>
      {/* Desktop navigation */}
      <nav className="hidden md:block border-b bg-card sticky top-16 z-30">
        <div className="container flex justify-center p-2 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            {isLoading ? (
              <div className="flex gap-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24" />
                  ))}
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="relative">
                  <Link
                    href="/menu"
                    className={cn(
                      'pb-1',
                      pathname === '/menu' &&
                        'font-bold border-t-2 border-primary'
                    )}
                  >
                    כל המנות
                  </Link>
                </Button>

                {categories.map((category) => {
                  const isActive =
                    pathname !== '/menu' && activeSlug === category.slug;
                  return (
                    <Button
                      key={category.id}
                      asChild
                      variant="ghost"
                      size="sm"
                      className="relative"
                    >
                      <Link
                        href={`/menu/${category.slug}`}
                        className={cn('pb-1', isActive && 'font-bold border-t-2 border-primary')}
                      >
                        {category.name}
                      </Link>
                    </Button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navigation - handled in Header now */}
      
      <main>{children}</main>
    </div>
  );
}
