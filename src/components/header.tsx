
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UtensilsCrossed, User, Crown, Gem, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-context';
import React from 'react';

const navLinks = [
  { href: '/', label: 'בית' },
  { href: '/menu', label: 'תפריט' },
  { href: '/about', label: 'אודות' },
  { href: '/gallery', label: 'גלריה' },
  { href: '/contact', label: 'צור קשר' },
];

const iconMap: { [key: string]: React.ElementType | null } = {
  default: UtensilsCrossed,
  crown: Crown,
  gem: Gem,
  star: Star,
  shield: Shield,
  none: null,
};


export function Header() {
  const pathname = usePathname();
  const { state } = useApp();
  const IconComponent = iconMap[state.design.logoIcon] || UtensilsCrossed;

  const Logo = () => (
     <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary">
        {IconComponent && <IconComponent className="h-7 w-7" />}
        מלכתא
    </Link>
  );

  const NavLinks = ({ className }: { className?: string }) => (
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
       <Link href="/admin">
          <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Admin</span>
          </Button>
      </Link>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="hidden md:flex">
          <NavLinks />
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">פתח תפריט ניווט</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Logo />
                <NavLinks className="flex-col items-start text-lg gap-6" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
