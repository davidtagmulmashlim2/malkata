
'use client';

import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
      <nav className="border-b bg-card sticky top-16 z-30">
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
                <Button
                  asChild
                  variant={pathname === '/menu' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link href="/menu">כל המנות</Link>
                </Button>

                {categories.map((category) => {
                  const isActive = activeSlug === category.slug;
                  return (
                    <Button
                      key={category.id}
                      asChild
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                    >
                      <Link href={`/menu/${category.slug}`}>
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
      <main>{children}</main>
    </div>
  );
}

    