
'use client';

import Image from 'next/image';
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

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { addToCart } = useApp();
  const allImages = useMemo(() => [dish.mainImage, ...(dish.galleryImages || [])].filter(Boolean), [dish.mainImage, dish.galleryImages]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
      <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-1 group">
        <DialogTrigger asChild>
          <div className="relative cursor-pointer">
            <Image
              src={dish.mainImage || 'https://placehold.co/600x400'}
              alt={dish.name}
              width={600}
              height={600}
              className="w-full aspect-square object-cover"
              data-ai-hint="food dish"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                הצגה מהירה
            </div>
            <div className="absolute top-2 left-2 flex gap-2">
                {dish.tags?.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 mr-1" /> טבעוני</Badge>}
                {dish.tags?.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 mr-1" /> חריף</Badge>}
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
            <ShoppingCart className="ml-2 h-4 w-4" />
            הוסף לעגלה
          </Button>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="w-full">
                <Carousel setApi={setApi} className="w-full relative">
                    <CarouselContent>
                        {allImages.map((img, i) => (
                            <CarouselItem key={i}>
                                <Image
                                    src={img}
                                    alt={`${dish.name} - תמונה ${i+1}`}
                                    width={600}
                                    height={600}
                                    className="w-full aspect-square object-cover rounded-md"
                                    data-ai-hint="food dish"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {allImages.length > 1 && <>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                    </>}
                </Carousel>
                {allImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-2">
                        {allImages.map((_, i) => (
                            <button key={i} onClick={() => scrollTo(i)} className={cn("h-2 w-2 rounded-full", current === i + 1 ? "bg-primary" : "bg-muted")}></button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl mb-2">{dish.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 my-4">
                        {dish.tags?.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 mr-1" /> טבעוני</Badge>}
                        {dish.tags?.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 mr-1" /> חריף</Badge>}
                    </div>
                    <p className="text-muted-foreground">{dish.fullDescription}</p>
                </div>
                <DialogFooter className="mt-6">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-2xl font-bold text-primary">{dish.price} ₪</p>
                         <Button onClick={handleAddToCart} disabled={!dish.isAvailable} size="lg">
                            <ShoppingCart className="ml-2 h-5 w-5" />
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
