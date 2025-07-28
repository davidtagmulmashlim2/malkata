
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dish } from '@/lib/types';
import { Flame, Leaf, ChevronLeft, ChevronRight, Sparkles, Smile, Plus, Minus, Eye } from 'lucide-react';
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

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { cart, addToCart, updateCartQuantity } = useApp();
  const isClient = useIsClient();
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const allImages = useMemo(() => {
    const imageSet = new Set<string>();
    if (dish.mainImage) {
        imageSet.add(dish.mainImage);
    }
    if (dish.galleryImages && Array.isArray(dish.galleryImages)) {
        dish.galleryImages.forEach(imgKey => {
            if (imgKey) imageSet.add(imgKey);
        });
    }
    return Array.from(imageSet);
  }, [dish.mainImage, dish.galleryImages]);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cartItem = useMemo(() => cart.find(item => item.dishId === dish.id), [cart, dish.id]);

  useEffect(() => {
    if (isDialogOpen) {
        setQuantity(cartItem?.quantity || 1);
    }
  }, [isDialogOpen, cartItem]);

  const handleAddToCart = () => {
    addToCart(dish.id, 1);
    toast({
        title: "נוסף לסל",
        description: `${dish.name} נוסף לסל הקניות שלך.`,
    });
  }

  const handleUpdateCart = () => {
    updateCartQuantity(dish.id, quantity);
    toast({
        title: "הסל עודכן",
        description: `${quantity}x ${dish.name} בסל הקניות שלך.`,
    });
    setIsDialogOpen(false);
  };
  
  const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const prevImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  const renderTags = (tags: Dish['tags']) => {
    if (!tags || tags.length === 0) return null;
    return (
        <>
            {tags.includes('new') && <Badge variant="default" className="bg-blue-500 text-white"><Sparkles className="w-3 h-3 me-1" /> חדש</Badge>}
            {tags.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 me-1" /> טבעוני</Badge>}
            {tags.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 me-1" /> חריף</Badge>}
            {tags.includes('piquant') && <Badge variant="secondary" className="bg-orange-500 text-black"><Flame className="w-3 h-3 me-1" /> פיקנטי</Badge>}
            {tags.includes('kids-favorite') && <Badge variant="default" className="bg-yellow-500 text-black"><Smile className="w-3 h-3 me-1" /> ילדים אוהבים</Badge>}
        </>
    );
  };
  
  const buttonText = cartItem ? "עדכן כמות בסל" : "הוספה לסל";


  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => { 
        setIsDialogOpen(open);
        if(!open) {
            setCurrentImageIndex(0);
        }
    }}>
      <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg group text-right">
        <div className="relative cursor-pointer aspect-square w-full overflow-hidden">
            <AsyncImage imageKey={dish.mainImage} alt={dish.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110"/>
            <div className="absolute top-2 left-0 right-0 px-2 flex justify-between items-start">
                {isClient && cartItem ? (
                    <div className="bg-primary text-primary-foreground rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold z-10">
                        {cartItem.quantity}
                    </div>
                ) : <div />}
                <div className="flex gap-2 flex-wrap justify-end max-w-[80%]">
                    {renderTags(dish.tags)}
                </div>
            </div>
            {!dish.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white text-lg font-bold">אזל מהמלאי</p>
                </div>
            )}
            {dish.isAvailable && (
                 <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DialogTrigger asChild>
                        <button className="h-12 w-[48%] flex items-center justify-center bg-white/80 backdrop-blur-sm text-sm font-semibold hover:bg-white/90">
                            <Eye className="ms-2 h-4 w-4" />
                            הצגה מהירה
                        </button>
                    </DialogTrigger>
                    <button onClick={handleAddToCart} className="h-12 w-[48%] flex items-center justify-center bg-white/80 backdrop-blur-sm text-sm font-semibold hover:bg-white/90">
                        <ShoppingBagIcon className="ms-2 h-4 w-4" />
                        הוספה לסל
                    </button>
                </div>
            )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline">{dish.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm">{dish.shortDescription}</p>
        </CardContent>
        
      </Card>

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
                    <p className="text-muted-foreground text-right">{dish.fullDescription}</p>
                </div>
                <DialogFooter className="mt-6">
                    <div className="flex justify-between items-center w-full gap-4">
                        <div>
                          <p className="text-2xl font-bold text-primary whitespace-nowrap">{dish.price * quantity} ₪</p>
                          {dish.priceSubtitle && <p className="text-xs text-muted-foreground">{dish.priceSubtitle}</p>}
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
                            <Button onClick={handleUpdateCart} disabled={!dish.isAvailable} size="lg">
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

