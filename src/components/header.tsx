
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UtensilsCrossed, User, Crown as Crown1, Gem, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-context';
import React, { useMemo, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { AsyncImage } from './async-image';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const Crown2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" {...props}>
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
    </svg>
);

const Crown3 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" {...props}>
        <path d="M12 2C9.2 2 7 4.2 7 7c0 1.5.6 2.8 1.5 3.7L3 14h18l-5.5-3.3c.9-.9 1.5-2.2 1.5-3.7C17 4.2 14.8 2 12 2zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
    </svg>
);

const Crown4 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" {...props}>
        <path d="M12 2L9.5 7h-6L6 11.5 3.5 17h6l2.5-5 2.5 5h6l-2.5-5.5L18 7h-6z"/>
    </svg>
);


const baseNavLinks = [
  { href: '/', label: 'בית', isFeatured: false },
  { href: '/menu', label: 'תפריט', isFeatured: false },
  { href: '/about', label: 'עלינו', isFeatured: false },
  { href: '/gallery', label: 'גלריה', isFeatured: false },
  { href: '/contact', label: 'יצירת קשר', isFeatured: false },
];

const iconMap: { [key: string]: React.ElementType | null } = {
  default: UtensilsCrossed,
  crown: Crown1,
  crown2: Crown2,
  crown3: Crown3,
  crown4: Crown4,
  gem: Gem,
  star: Star,
  shield: Shield,
  none: null,
};


function MobileMenuNavigation({onLinkClick}: {onLinkClick: () => void}) {
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
                 <Link href="/menu" onClick={onLinkClick} className={cn('transition-colors hover:text-primary no-underline', pathname === '/menu' ? 'text-primary font-bold' : 'text-muted-foreground')}>כל המנות</Link>
                 {(isLoading ? Array(5).fill(null) : categories).map((category, index) => (
                    isLoading ? <Skeleton key={index} className="h-6 w-32" /> :
                    <Link
                        key={category.id}
                        href={`/menu/${category.slug}`}
                        onClick={onLinkClick}
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
                        onClick={onLinkClick}
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



export function Header() {
  const pathname = usePathname();
  const { state, isLoading } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const IconComponent = useMemo(() => iconMap[state.design.logo_icon] || UtensilsCrossed, [state.design.logo_icon]);
  const logoStyle = useMemo(() => state.design.logo_color ? { color: state.design.logo_color } : {}, [state.design.logo_color]);

  const navLinks = useMemo(() => {
    if (isLoading) {
        return baseNavLinks;
    }

    const { featured_category_id } = state.design;
    const newLinks = [...baseNavLinks];

    if (featured_category_id && featured_category_id !== 'none') {
        const featuredCategory = state.categories.find(c => c.id === featured_category_id);
        if (featuredCategory) {
            const featuredLink = {
                href: `/menu/${featuredCategory.slug}`,
                label: featuredCategory.name,
                isFeatured: true,
            };
            const galleryIndex = newLinks.findIndex(link => link.href === '/gallery');
            if (galleryIndex !== -1) {
                newLinks.splice(galleryIndex + 1, 0, featuredLink);
            } else { 
                const contactIndex = newLinks.findIndex(link => link.href === '/contact');
                 if (contactIndex !== -1) {
                    newLinks.splice(contactIndex, 0, featuredLink);
                 } else {
                    newLinks.push(featuredLink);
                 }
            }
        }
    }
    
    return newLinks;
  }, [isLoading, state.design, state.categories]);


  const Logo = () => {
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 font-headline text-2xl font-bold text-primary">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7 w-24" />
            </div>
        )
    }

    return (
      <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary" style={logoStyle}>
        {state.design.logo_image ? (
             <div className="relative flex items-center" style={{height: '40px'}}>
                 <AsyncImage 
                    imageKey={state.design.logo_image} 
                    alt="לוגו" height={40} 
                    width={state.design.logo_width || 120} 
                    style={{width: `${state.design.logo_width || 120}px`, height: 'auto'}}
                    className="object-contain" 
                 />
             </div>
        ) : (
            <>
                {IconComponent && <IconComponent className="h-7 w-7" />}
                <span>מלכתא</span>
            </>
        )}
    </Link>
    );
  };

  const NavLinks = ({ className }: { className?: string }) => {
    return (
        <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
        {isLoading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-6 w-16" />)
            ) : (
                <>
                    {navLinks.map(link => {
                        const isMenuActive = pathname.startsWith('/menu');
                        const isActive = (link.href === '/menu' && isMenuActive) || (link.href !== '/menu' && pathname === link.href);
                        
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'transition-colors hover:text-primary no-underline',
                                    link.isFeatured 
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs font-medium px-4 h-8 flex items-center' 
                                        : (isActive ? 'text-primary font-bold' : 'text-muted-foreground')
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </>
            )
        }
        </nav>
    );
  }
  
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
                {!isLoading && <Logo />}
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
          {!isLoading && <Logo />}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">פתח תפריט ניווט</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                  <SheetHeader className="p-6 pb-0 text-right">
                      <SheetTitle>
                          <span onClick={() => setIsMobileMenuOpen(false)}>
                              <Logo />
                          </span>
                      </SheetTitle>
                  </SheetHeader>
                  <div className="pt-6">
                      <MobileMenuNavigation onLinkClick={() => setIsMobileMenuOpen(false)} />
                  </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
