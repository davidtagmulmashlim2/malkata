'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dish } from '@/lib/types';
import { Flame, ShoppingCart, Leaf } from 'lucide-react';
import { Badge } from './ui/badge';
import { useApp } from '@/context/app-context';
import { toast } from '@/hooks/use-toast';

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { addToCart } = useApp();

  const handleAddToCart = () => {
    addToCart(dish.id);
    toast({
        title: "נוסף לעגלה",
        description: `${dish.name} נוסף לעגלת הקניות שלך.`,
    });
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative">
        <Image
          src={dish.images[0] || 'https://placehold.co/600x400'}
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
            {dish.tags.includes('vegan') && <Badge variant="default" className="bg-green-600 text-white"><Leaf className="w-3 h-3 mr-1" /> טבעוני</Badge>}
            {dish.tags.includes('spicy') && <Badge variant="destructive"><Flame className="w-3 h-3 mr-1" /> חריף</Badge>}
        </div>
         {!dish.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-lg font-bold">אזל מהמלאי</p>
            </div>
        )}
      </div>
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
  );
}
