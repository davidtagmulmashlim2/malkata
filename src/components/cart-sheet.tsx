
'use client';

import { ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useApp } from '@/context/app-context';
import Image from 'next/image';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useIsClient } from '@/hooks/use-is-client';
import { getImage, getImageSync } from '@/lib/image-store';
import { useEffect, useState } from 'react';

const CartDishImage = ({ imageKey, alt }: { imageKey: string; alt: string }) => {
    const [src, setSrc] = useState(() => getImageSync(imageKey) || "https://placehold.co/64x64");

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            const imageSrc = await getImage(imageKey);
            if (isMounted && imageSrc) {
                setSrc(imageSrc);
            }
        };

        if (!src.startsWith('data:image')) {
            fetchImage();
        }
        
        return () => { isMounted = false; };
    }, [imageKey, src]);
    
    return (
        <Image
            src={src}
            alt={alt}
            width={64}
            height={64}
            className="rounded-md object-cover h-16 w-16"
            data-ai-hint="food dish"
        />
    )
}


export function CartSheet() {
  const { cart, getDishById, updateCartQuantity, removeFromCart, state } = useApp();
  const isClient = useIsClient();

  const cartDetails = isClient ? cart.map(item => {
    const dish = getDishById(item.dishId);
    return dish ? { ...item, ...dish } : null;
  }).filter(Boolean) : [];

  const total = cartDetails.reduce((sum, item) => sum + item!.price * item!.quantity, 0);

  const handleWhatsAppOrder = () => {
    const { contact } = state.siteContent;
    let message = 'שלום, ברצוני לבצע הזמנה:\n\n';
    cartDetails.forEach(item => {
      message += `${item!.name} (x${item!.quantity}) - ${item!.price * item!.quantity} ₪\n`;
    });
    message += `\nסה"כ לתשלום: ${total} ₪\n\n`;
    message += 'תודה!';
    
    const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg lg:bottom-8 lg:right-8">
          <ShoppingCart className="h-6 w-6" />
          {isClient && cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
          <span className="sr-only">פתח עגלת קניות</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>עגלת הקניות שלך</SheetTitle>
        </SheetHeader>
        {isClient && cart.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="flex flex-col gap-4 py-4">
                {cartDetails.map(item => (
                  <div key={item!.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <CartDishImage imageKey={item!.mainImage} alt={item!.name} />
                        <div className="flex-grow">
                          <h4 className="font-semibold">{item!.name}</h4>
                          <p className="text-sm text-muted-foreground">{item!.price} ₪</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item!.quantity}
                        onChange={e => updateCartQuantity(item!.id, parseInt(e.target.value, 10))}
                        className="w-16 h-8 text-center"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item!.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
                <div className="w-full space-y-4">
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>סה"כ:</span>
                        <span>{total.toLocaleString()} ₪</span>
                    </div>
                    <SheetClose asChild>
                        <Button type="submit" className="w-full" onClick={handleWhatsAppOrder}>
                        שליחת הזמנה ב-WhatsApp
                        </Button>
                    </SheetClose>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-grow flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-24 w-24 text-muted" />
            <h3 className="text-xl font-semibold">העגלה שלך ריקה</h3>
            <p className="text-muted-foreground">מוזמנים להוסיף מנות מהתפריט שלנו.</p>
            <SheetClose asChild>
              <Button>לתפריט</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
