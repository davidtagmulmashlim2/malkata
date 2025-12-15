

'use client';
import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { CakeSlice, Salad, Fish, Soup, Beef, GlassWater, Wheat, Carrot, Utensils, Crown, UtensilsCrossed, Pizza } from 'lucide-react';

const baseNavLinks = [
  { href: '/', label: 'בית', isFeatured: false },
  { href: '/menu', label: 'תפריט', isFeatured: false },
  { href: '/about', label: 'עלינו', isFeatured: false },
  { href: '/gallery', label: 'גלריה', isFeatured: false },
  { href: '/contact', label: 'יצירת קשר', isFeatured: false },
];

const iconMap: { [key: string]: React.ElementType } = {
  CakeSlice, Salad, Fish, Soup, Beef, GlassWater, Wheat, Carrot, Utensils, Crown, UtensilsCrossed, Pizza
};


export function MobileMenuNavigation({onLinkClick}: {onLinkClick: () => void}) {
  const { state, isLoading } = useApp();
  const pathname = usePathname();
  const { categories, design } = state;
  const [activeTab, setActiveTab] = React.useState<'categories' | 'main-menu'>('categories');

  const activeSlug = pathname.split('/').pop();

  const mainNavLinks = useMemo(() => {
    if (isLoading) {
        return baseNavLinks;
    }

    const { featured_category_id } = design;
    const newLinks = [...baseNavLinks];

    if (featured_category_id && featured_category_id !== 'none') {
        const featuredCategory = categories.find(c => c.id === featured_category_id);
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
  }, [isLoading, design, categories]);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 p-1 bg-muted rounded-md mx-2">
        <Button
          variant={activeTab === 'categories' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('categories')}
          className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          קטגוריות
        </Button>
        <Button
          variant={activeTab === 'main-menu' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('main-menu')}
          className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          תפריט ראשי
        </Button>
      </div>

      <ScrollArea className="flex-grow mt-2">
        {activeTab === 'categories' && (
           <div className="flex flex-col items-end gap-6 p-4 text-lg text-right">
             <Link href="/menu" onClick={onLinkClick} className={cn('transition-colors hover:text-primary no-underline', pathname === '/menu' ? 'text-primary font-bold' : 'text-muted-foreground')}>כל המנות</Link>
             {(isLoading ? Array(5).fill(null) : categories).map((category, index) => {
                if (isLoading) return <Skeleton key={index} className="h-6 w-32" />
                
                const fontValue = category.title_font || '';
                const isIcon = fontValue.startsWith('icon-');
                const iconName = isIcon ? fontValue.replace('icon-', '') : null;
                const IconComponent = iconName ? iconMap[iconName] : null;

                return (
                    <Link
                        key={category.id}
                        href={`/menu/${category.slug}`}
                        onClick={onLinkClick}
                        className={cn(
                            'transition-colors hover:text-primary no-underline flex items-center justify-end gap-3',
                            activeSlug === category.slug ? 'text-primary font-bold' : 'text-muted-foreground'
                        )}
                    >
                        <span>{category.name}</span>
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                    </Link>
                )
             })}
           </div>
        )}
        {activeTab === 'main-menu' && (
           <div className="flex flex-col items-end gap-6 p-4 text-lg text-right">
            {mainNavLinks.map((link) => (
                 <Link
                    key={link.href}
                    href={link.href}
                    onClick={onLinkClick}
                    className={cn(
                        'transition-colors hover:text-primary no-underline',
                        pathname === link.href ? 'text-primary font-bold' : 'text-muted-foreground',
                        link.isFeatured && 'text-primary'
                    )}
                >
                    {link.label}
                </Link>
            ))}
           </div>
        )}
      </ScrollArea>
    </div>
  );
}

    
