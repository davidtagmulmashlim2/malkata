
'use client';

import { Button } from '@/components/ui/button';
import type { Dish } from '@/lib/types';
import { Flame, Leaf, ChevronLeft, ChevronRight, Sparkles, Smile, Plus, Minus, Eye, Search, Heart, Star, Info, ZoomIn } from 'lucide-react';
import { ShoppingBagIcon } from '@/components/icons/shopping-bag-icon';
import { Badge } from './ui/badge';
import { useApp } from '@/context/app-context';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';
import { AsyncImage } from './async-image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';


interface DishCardProps {
  dish: Dish;
}

const quickViewIconMap: { [key: string]: React.ElementType | null } = {
  Eye, Search, Heart, Star, Info, ZoomIn, none: null,
};

const textSizeClasses: { [key: string]: string } = {
  'xs': 'text-xs', 'sm': 'text-sm', 'base': 'text-base', 'lg': 'text-lg', 'xl': 'text-xl', 
  '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl', 
  '6xl': 'text-6xl', '7xl': 'text-7xl', '8xl': 'text-8xl', '9xl': 'text-9xl',
};

export function DishCard({ dish }: DishCardProps) {
  const { cart, addToCart, updateCartQuantity, state } = useApp();
  const isClient = useIsClient();
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { siteContent } = state;
  const { dish_card: dishCardSettings } = siteContent;

  const QuickViewIcon = dishCardSettings?.quick_view_icon ? quickViewIconMap[dishCardSettings.quick_view_icon] : Eye;
  
  const allImages = useMemo(() => {
    const imageSet = new Set<string>();
    if (dish.main_image) {
        imageSet.add(dish.main_image);
    }
    if (dish.gallery_images && Array.isArray(dish.gallery_images)) {
        dish.gallery_images.forEach(imgKey => {
            if (imgKey) imageSet.add(imgKey);
        });
    }
    return Array.from(imageSet);
  }, [dish.main_image, dish.gallery_images]);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cartItem = useMemo(() => cart.find(item => item.dishId === dish.id), [cart, dish.id]);

  useEffect(() => {
    if (isDialogOpen) {
        setQuantity(cartItem?.quantity || 1);
    }
  }, [isDialogOpen, cartItem]);

  const handleUpdateCart = () => {
    if (cartItem) {
      updateCartQuantity(dish.id!, quantity);
      toast({
        title: "הכמות עודכנה",
        description: `הכמות של ${dish.name} עודכנה ל-${quantity}.`,
      });
    } else {
      addToCart(dish.id!, quantity);
      toast({
          title: "נוסף לסל",
          description: `${quantity}x ${dish.name} נוספו לסל הקניות שלך.`,
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleDirectAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (cartItem) {
      updateCartQuantity(dish.id!, cartItem.quantity + 1);
      toast({
        title: "הכמות עודכנה",
        description: `כמות מעודכנת בסל: ${cartItem.quantity + 1}`,
      });
    } else {
      addToCart(dish.id!, 1);
      toast({
          title: "נוסף לסל",
          description: `${dish.name} נוסף לסל הקניות שלך.`,
      });
    }
  };

  const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const prevImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  const renderTags = (tags: Dish['tags']) => {
    if (!tags || tags.length === 0) return null;
    const standardTags = tags.filter(t => !t.startsWith('n-fs-') && !t.startsWith('d-fs-'));
    return (
        <>
            {standardTags.includes('new') && <Badge variant="default" className="bg-blue-500 text-white"><Sparkles className="w-3 h-3 me-1" /> חדש</Badge>}
            {standardTags.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 me-1" /> טבעוני</Badge>}
            {standardTags.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 me-1" /> חריף</Badge>}
            {standardTags.includes('piquant') && <Badge variant="secondary" className="bg-orange-500 text-black"><Flame className="w-3 h-3 me-1" /> פיקנטי</Badge>}
            {standardTags.includes('kids-favorite') && <Badge variant="default" className="bg-yellow-500 text-black"><Smile className="w-3 h-3 me-1" /> ילדים אוהבים</Badge>}
        </>
    );
  };
  
  const buttonText = cartItem ? "עדכן כמות בסל" : "הוספה לסל";
  
  const nameFontSizeClass = useMemo(() => {
    const tag = dish.tags?.find(t => t.startsWith('n-fs-'));
    const sizeKey = tag ? tag.replace('n-fs-', '') : 'default';
    if(sizeKey === 'default') return 'text-lg';
    return textSizeClasses[sizeKey] || 'text-lg';
  }, [dish.tags]);

  const descriptionFontSizeClass = useMemo(() => {
    const tag = dish.tags?.find(t => t.startsWith('d-fs-'));
    const sizeKey = tag ? tag.replace('d-fs-', '') : 'default';
    if(sizeKey === 'default') return 'text-sm';
    return textSizeClasses[sizeKey] || 'text-sm';
  }, [dish.tags]);


  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => { 
        setIsDialogOpen(open);
        if(!open) {
            setCurrentImageIndex(0);
        }
    }}>
      <div className="flex flex-col h-full text-right group">
        <DialogTrigger asChild>
            <div className="cursor-pointer">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <AsyncImage imageKey={dish.main_image} alt={dish.name} layout="fill" objectFit="cover" />
                    <div
                        className={cn(
                            "absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 p-2",
                        )}
                        style={{ background: `linear-gradient(to top, rgba(0,0,0,${(dishCardSettings?.quick_view_overlay_opacity ?? 40)/50}) 0%, transparent 100%)` }}
                     >
                        <div className="flex items-center gap-2">
                            {QuickViewIcon && <QuickViewIcon className="w-5 h-5" />}
                            <h3
                              className="text-md font-bold"
                              style={{
                                color: dishCardSettings?.quick_view_color || '#FFFFFF',
                                fontFamily: dishCardSettings?.quick_view_font && dishCardSettings.quick_view_font !== 'default'
                                  ? `var(--font-${dishCardSettings.quick_view_font})`
                                  : undefined
                              }}
                            >
                              {dishCardSettings?.quick_view_text ?? 'הצגה מהירה'}
                            </h3>
                        </div>
                    </div>
                    <div className="absolute top-2 left-0 right-0 px-2 flex justify-between items-start pointer-events-none">
                        {isClient && cartItem ? (
                            <div className="bg-primary text-primary-foreground rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold z-10">
                                {cartItem.quantity || 0}
                            </div>
                        ) : <div />}
                        <div className="flex gap-2 flex-wrap justify-end max-w-[80%]">
                            {renderTags(dish.tags)}
                        </div>
                    </div>
                    {!dish.is_available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg pointer-events-none">
                            <p className="text-white text-lg font-bold">אזל מהמלאי</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogTrigger>

        <div className="mt-2 flex-grow flex flex-col">
             <div className="flex items-start justify-between gap-4">
                 <DialogTrigger asChild>
                    <div className="flex-1 min-w-0 cursor-pointer">
                         <h3 className={cn("font-headline font-bold", nameFontSizeClass)}>{dish.name}</h3>
                    </div>
                 </DialogTrigger>
                <div className="flex-shrink-0">
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                className="rounded-full h-8 w-8 md:h-9 md:w-9"
                                onClick={handleDirectAddToCart}
                                disabled={!dish.is_available}
                                variant="outline"
                            >
                                <ShoppingBagIcon className="h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                            </TooltipTrigger>
                             <TooltipContent
                                side="top"
                                align="center"
                                className="bg-transparent border-0 shadow-none p-0"
                             >
                                <div className="relative">
                                    <div className="bg-black text-white rounded-md py-1 px-2 text-xs">
                                         <p>הוספה לסל</p>
                                    </div>
                                    <div 
                                        className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                                        style={{
                                            borderLeft: '5px solid transparent',
                                            borderRight: '5px solid transparent',
                                            borderTop: '5px solid black',
                                        }}
                                    />
                                </div>
                            </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                </div>
            </div>
             <DialogTrigger asChild>
                <div className="flex-1 min-w-0 mt-1 cursor-pointer">
                     <p className={cn("text-muted-foreground", descriptionFontSizeClass)}>{dish.short_description}</p>
                </div>
             </DialogTrigger>
             <div className="text-right w-full mt-2">
                <span className="text-md md:text-lg font-bold leading-tight">{dish.price} ₪</span>
                {dish.price_subtitle && <p className="text-xs text-muted-foreground leading-tight">{dish.price_subtitle}</p>}
            </div>
        </div>
      </div>

      <DialogContent className="sm:max-w-4xl text-right">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="w-full">
                <div className="w-full aspect-square relative">
                    {isClient && allImages.length > 0 ? (
                        <>
                            <AsyncImage 
                                key={allImages[currentImageIndex]}
                                imageKey={allImages[currentImageIndex]} 
                                alt={`${dish.name} - תמונה ${currentImageIndex + 1}`} 
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                                data-ai-hint="food dish"
                            />
                            {allImages.length > 1 && (
                                <>
                                    <Button size="icon" variant="ghost" className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/30 hover:bg-black/50 text-white" onClick={prevImage}>
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/30 hover:bg-black/50 text-white" onClick={nextImage}>
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <Skeleton className="w-full h-full" />
                    )}
                </div>
                 {allImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {allImages.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentImageIndex(i)} 
                                className={cn(
                                    "h-2 w-2 rounded-full transition-colors", 
                                    currentImageIndex === i ? "bg-primary" : "bg-muted hover:bg-muted-foreground"
                                )}
                                aria-label={`עבור לתמונה ${i+1}`}
                            ></button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl mb-2 text-right">{dish.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 my-4 justify-start flex-wrap">
                        {renderTags(dish.tags)}
                    </div>
                    <p className="text-muted-foreground text-right">{dish.full_description}</p>
                </div>
                <DialogFooter className="mt-6">
                    <div className="flex justify-between items-center w-full gap-4">
                        <div>
                          <p className="text-2xl font-bold text-primary whitespace-nowrap">{dish.price * quantity} ₪</p>
                          {dish.price_subtitle && <p className="text-xs text-muted-foreground">{dish.price_subtitle}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1 rounded-md border">
                                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center text-md font-bold">{quantity}</span>
                                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(q => q + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button onClick={handleUpdateCart} disabled={!dish.is_available} size="lg">
                                <ShoppingBagIcon className="ms-2 h-5 w-5" />
                                {buttonText}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    