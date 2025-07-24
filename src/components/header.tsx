
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UtensilsCrossed, User, Crown as Crown1, Gem, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-context';
import React, { useMemo } from 'react';

const Crown2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
    </svg>
);

const Crown3 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C9.2 2 7 4.2 7 7c0 1.5.6 2.8 1.5 3.7L3 14h18l-5.5-3.3c.9-.9 1.5-2.2 1.5-3.7C17 4.2 14.8 2 12 2zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
    </svg>
);

const baseNavLinks = [
  { href: '/', label: 'בית' },
  { href: '/menu', label: 'תפריט' },
  { href: '/about', label: 'אודות' },
  { href: '/gallery', label: 'גלריה' },
  { href: '/contact', label: 'יצירת קשר' },
];

const iconMap: { [key: string]: React.ElementType | null } = {
  default: UtensilsCrossed,
  crown: Crown1,
  crown2: Crown2,
  crown3: Crown3,
  gem: Gem,
  star: Star,
  shield: Shield,
  none: null,
};


export function Header() {
  const pathname = usePathname();
  const { state } = useApp();
  const IconComponent = iconMap[state.design.logoIcon] || UtensilsCrossed;

  const navLinks = useMemo(() => {
    const { featuredCategoryId } = state.design;
    const newLinks = [...baseNavLinks];

    if (featuredCategoryId && featuredCategoryId !== 'none') {
        const featuredCategory = state.categories.find(c => c.id === featuredCategoryId);
        if (featuredCategory) {
            const featuredLink = {
                href: `/menu/${featuredCategory.slug}`,
                label: featuredCategory.name,
            };
            const galleryIndex = newLinks.findIndex(link => link.href === '/gallery');
            if (galleryIndex !== -1) {
                newLinks.splice(galleryIndex + 1, 0, featuredLink);
            } else {
                // Fallback in case gallery link isn't found
                const contactIndex = newLinks.findIndex(link => link.href === '/contact');
                newLinks.splice(contactIndex, 0, featuredLink);
            }
        }
    }
    
    return newLinks;
  }, [state.design, state.categories]);


  const Logo = () => (
     <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary">
        {IconComponent && <IconComponent className="h-7 w-7" />}
        מלכתא
    </Link>
  );

  const NavLinks = ({ className, mobile = false }: { className?: string, mobile?: boolean }) => (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'transition-colors hover:text-primary',
            pathname === link.href ? 'text-primary font-bold' : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
      {mobile && (
         <Link
          href="/admin"
          className={cn(
            'transition-colors hover:text-primary',
            pathname.startsWith('/admin') ? 'text-primary font-bold' : 'text-muted-foreground'
          )}
        >
          אזור אישי
        </Link>
      )}
    </nav>
  );

  const AdminButton = () => (
     <Link href="/admin">
        <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Admin</span>
        </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full items-center">
            <div className="flex justify-start">
                <Logo />
            </div>
            <div className="flex-1 flex justify-center">
                <NavLinks />
            </div>
            <div className="flex justify-end">
                <AdminButton />
            </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden flex w-full justify-between items-center">
          <Logo />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">פתח תפריט ניווט</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-6">
                <div className="mb-4">
                  <Logo />
                </div>
                <NavLinks className="flex-col items-start text-lg gap-6" mobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
