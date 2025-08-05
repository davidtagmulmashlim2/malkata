
'use client';

import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const baseNavLinks = [
  { href: '/', label: 'בית' },
  { href: '/menu', label: 'תפריט' },
  { href: '/about', label: 'עלינו' },
  { href: '/gallery', label: 'גלריה' },
  { href: '/contact', label: 'יצירת קשר' },
];

function MobileMenuNavigation() {
  const { state, isLoading } = useApp();
  const pathname = usePathname();
  const { categories } = state;

  const activeSlug = pathname.split('/').pop();

  return (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="categories">קטגוריות</TabsTrigger>
        <TabsTrigger value="main-menu">תפריט ראשי</TabsTrigger>
      </TabsList>
      <TabsContent value="categories">
        <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="flex flex-col items-start gap-4 p-4 text-lg">
                 <Link href="/menu" className={cn('transition-colors hover:text-primary no-underline', pathname === '/menu' ? 'text-primary font-bold' : 'text-muted-foreground')}>כל המנות</Link>
                 {(isLoading ? Array(5).fill(null) : categories).map((category, index) => (
                    isLoading ? <Skeleton key={index} className="h-6 w-32" /> :
                    <Link
                        key={category.id}
                        href={`/menu/${category.slug}`}
                        className={cn(
                            'transition-colors hover:text-primary no-underline',
                            activeSlug === category.slug ? 'text-primary font-bold' : 'text-muted-foreground'
                        )}
                    >
                        {category.name}
                    </Link>
                 ))}
            </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="main-menu">
        <ScrollArea className="h-[calc(100vh-200px)]">
             <div className="flex flex-col items-start gap-4 p-4 text-lg">
                {baseNavLinks.map((link) => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'transition-colors hover:text-primary no-underline',
                            pathname === link.href ? 'text-primary font-bold' : 'text-muted-foreground'
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}


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

      {/* Mobile navigation - only shows on menu pages */}
      {pathname.startsWith('/menu') && (
        <div className="md:hidden sticky top-16 z-30 border-b bg-card">
          <div className="container px-0">
             <MobileMenuNavigation />
          </div>
        </div>
      )}
      
      <main>{children}</main>
    </div>
  );
}
