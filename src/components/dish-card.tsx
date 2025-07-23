
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
import { getImage, getImageSync } from '@/lib/image-store';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

interface DishCardProps {
  dish: Dish;
}

const DishImage = ({ imageKey, alt }: { imageKey: string, alt: string }) => {
    const [src, setSrc] = useState(() => getImageSync(imageKey) || 'https://placehold.co/600x400');
    
    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            const imageSrc = await getImage(imageKey);
            if(isMounted && imageSrc) {
                setSrc(imageSrc);
            }
        }
        if (!src.startsWith('data:image')) {
             fetchImage();
        }
        return () => { isMounted = false; };
    }, [imageKey, src]);

    return (
         <Image
            src={src}
            alt={alt}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            data-ai-hint="food dish"
        />
    )
}

const CarouselDishImage = ({ imageKey, alt }: { imageKey: string, alt: string }) => {
    const [src, setSrc] = useState(() => getImageSync(imageKey) || 'https://placehold.co/600x600');

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            const imageSrc = await getImage(imageKey);
            if(isMounted && imageSrc) {
                setSrc(imageSrc);
            }
        }
        if (!src.startsWith('data:image')) {
             fetchImage();
        }
        return () => { isMounted = false; };
    }, [imageKey, src]);
    
    return (
        <Image
            src={src}
            alt={alt}
            width={600}
            height={600}
            className="w-full aspect-square object-cover rounded-md"
            data-ai-hint="food dish"
        />
    )
}


export function DishCard({ dish }: DishCardProps) {
  const { addToCart } = useApp();
  const isClient = useIsClient();
  const allImages = useMemo(() => [dish.mainImage, ...(dish.galleryImages || [])].filter(Boolean), [dish.mainImage, dish.galleryImages]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };
    api.on("select", onSelect);

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
      <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-1 group">
        <DialogTrigger asChild>
            <div className="relative cursor-pointer aspect-[4/3] w-full overflow-hidden">
                <DishImage imageKey={dish.mainImage} alt={dish.name} />
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

      <DialogContent className="sm:max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="w-full">
                {isClient && allImages.length > 0 ? (
                    <>
                        <Carousel setApi={setApi} className="w-full relative">
                            <CarouselContent>
                                {allImages.map((imgKey, i) => (
                                    <CarouselItem key={imgKey ? imgKey : `item-${i}`}>
                                        <CarouselDishImage imageKey={imgKey} alt={`${dish.name} - תמונה ${i+1}`} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {allImages.length > 1 && <>
                              <CarouselPrevious className="absolute start-2 top-1/2 -translate-y-1/2 z-10" />
                              <CarouselNext className="absolute end-2 top-1/2 -translate-y-1/2 z-10" />
                            </>}
                        </Carousel>
                        {allImages.length > 1 && (
                            <div className="flex justify-center gap-2 mt-2">
                                {allImages.map((_, i) => (
                                    <button key={i} onClick={() => scrollTo(i)} className={cn("h-2 w-2 rounded-full", current === i + 1 ? "bg-primary" : "bg-muted")}></button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md">
                        <p className="text-muted-foreground">טוען...</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl mb-2 text-start">{dish.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 my-4 justify-start">
                        {dish.tags?.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 me-1" /> טבעוני</Badge>}
                        {dish.tags?.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 me-1" /> חריף</Badge>}
                    </div>
                    <p className="text-muted-foreground text-start">{dish.fullDescription}</p>
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
