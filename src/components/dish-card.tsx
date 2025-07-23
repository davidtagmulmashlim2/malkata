
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dish } from '@/lib/types';
import { Flame, ShoppingCart, Leaf } from 'lucide-react';
import { Badge } from './ui/badge';
import { useApp } from '@/context/app-context';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';
import { AsyncImage } from './async-image';

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { addToCart } = useApp();
  const isClient = useIsClient();
  
  const allImages = useMemo(() => {
    const images = [dish.mainImage, ...(dish.galleryImages || [])];
    return [...new Set(images)].filter(Boolean); // Remove duplicates and empty strings
  }, [dish.mainImage, dish.galleryImages]);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    const onSelect = (api: CarouselApi) => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.reInit(); // Re-init to apply listeners correctly after data loads
    onSelect(api); // Set initial state

    return () => {
        api.off("select", onSelect);
    }
  }, [api, allImages.length]);

  const handleAddToCart = () => {
    addToCart(dish.id);
    toast({
        title: "נוסף לעגלה",
        description: `${dish.name} נוסף לעגלת הקניות שלך.`,
    });
  }
  
  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  }

  return (
    <Dialog>
      <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-1 group text-right">
        <DialogTrigger asChild>
            <div className="relative cursor-pointer aspect-square w-full overflow-hidden">
                <AsyncImage imageKey={dish.mainImage} alt={dish.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110"/>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    הצגה מהירה
                </div>
                <div className="absolute top-2 end-2 flex gap-2">
                    {dish.tags?.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 me-1" /> טבעוני</Badge>}
                    {dish.tags?.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 me-1" /> חריף</Badge>}
                </div>
                {!dish.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <p className="text-white text-lg font-bold">אזל מהמלאי</p>
                    </div>
                )}
            </div>
        </DialogTrigger>
        <CardHeader>
          <CardTitle className="font-headline">{dish.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm">{dish.shortDescription}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-auto">
          <p className="text-xl font-bold text-primary">{dish.price} ₪</p>
          <Button onClick={handleAddToCart} disabled={!dish.isAvailable}>
            <ShoppingCart className="ms-2 h-4 w-4" />
            הוסף לעגלה
          </Button>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-4xl text-right">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="w-full">
                {isClient && allImages.length > 0 ? (
                    <div>
                        <Carousel setApi={setApi} className="w-full" dir="rtl">
                            <CarouselContent>
                                {allImages.map((imgKey, i) => (
                                    <CarouselItem key={imgKey ? `${imgKey}-${i}` : `item-${i}`}>
                                        <div className="w-full aspect-square relative">
                                            <AsyncImage 
                                                imageKey={imgKey} 
                                                alt={`${dish.name} - תמונה ${i+1}`} 
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                                data-ai-hint="food dish"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {allImages.length > 1 && <>
                              <CarouselPrevious />
                              <CarouselNext />
                            </>}
                        </Carousel>
                        {allImages.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                {allImages.map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => scrollTo(i)} 
                                        className={cn(
                                            "h-2 w-2 rounded-full transition-colors", 
                                            current === i ? "bg-primary" : "bg-muted hover:bg-muted-foreground"
                                        )}
                                        aria-label={`עבור לתמונה ${i+1}`}
                                    ></button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md">
                         <Skeleton className="w-full h-full" />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl mb-2 text-right">{dish.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 my-4 justify-start">
                        {dish.tags?.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 me-1" /> טבעוני</Badge>}
                        {dish.tags?.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 me-1" /> חריף</Badge>}
                    </div>
                    <p className="text-muted-foreground text-right">{dish.fullDescription}</p>
                </div>
                <DialogFooter className="mt-6">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-2xl font-bold text-primary">{dish.price} ₪</p>
                         <Button onClick={handleAddToCart} disabled={!dish.isAvailable} size="lg">
                            <ShoppingCart className="ms-2 h-5 w-5" />
                            הוסף לעגלה
                        </Button>
                    </div>
                </DialogFooter>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
