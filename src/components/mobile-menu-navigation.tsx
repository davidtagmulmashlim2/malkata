
'use client';
import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';

const baseNavLinks = [
  { href: '/', label: 'בית', isFeatured: false },
  { href: '/menu', label: 'תפריט', isFeatured: false },
  { href: '/about', label: 'עלינו', isFeatured: false },
  { href: '/gallery', label: 'גלריה', isFeatured: false },
  { href: '/contact', label: 'יצירת קשר', isFeatured: false },
];

export function MobileMenuNavigation({onLinkClick}: {onLinkClick: () => void}) {
  const { state, isLoading } = useApp();
  const pathname = usePathname();
  const { categories, design } = state;

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
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
