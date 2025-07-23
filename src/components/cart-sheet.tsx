
'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
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
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useIsClient } from '@/hooks/use-is-client';
import { getImage, getImageSync } from '@/lib/image-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
            className="rounded-md object-cover h-16 w-16 shrink-0"
            data-ai-hint="food dish"
        />
    )
}


export function CartSheet() {
  const { cart, getDishById, updateCartQuantity, removeFromCart, state } = useApp();
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const cartDetails = isClient ? cart.map(item => {
    const dish = getDishById(item.dishId);
    return dish ? { ...item, ...dish } : null;
  }).filter(Boolean) : [];

  const total = cartDetails.reduce((sum, item) => sum + item!.price * item!.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
        alert('יש למלא שם, טלפון וכתובת לפני שליחת ההזמנה.');
        return;
    }
    const { contact } = state.siteContent;
    let message = `שלום, אני ${customerName}, טלפון ${customerPhone}.\n`;
    message += `כתובת למשלוח: ${customerAddress}\n\n`;
    message += `ברצוני לבצע הזמנה:\n\n`;
    
    cartDetails.forEach(item => {
      message += `${item!.name} (x${item!.quantity}) - ${item!.price * item!.quantity} ₪\n`;
    });
    message += `\nסה"כ לתשלום: ${total.toLocaleString()} ₪\n\n`;
    message += 'תודה!';
    
    const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setOpen(false); // Close the sheet after sending
  };

  const canSubmit = customerName !== '' && customerPhone !== '' && customerAddress !== '';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        <SheetHeader className="text-right">
          <SheetTitle>עגלת הקניות שלך</SheetTitle>
        </SheetHeader>
        {isClient && cart.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="flex flex-col gap-4 py-4">
                {cartDetails.map(item => (
                  <div key={item!.id} className="flex justify-between items-center gap-4 text-right">
                    <div className="flex items-center gap-4 flex-1">
                        <CartDishImage imageKey={item!.mainImage} alt={item!.name} />
                        <div className="flex flex-col">
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
                <div className="w-full space-y-4 text-right">
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>סה"כ:</span>
                        <span>{total.toLocaleString()} ₪</span>
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                        <h4 className='font-medium text-center'>פרטי הזמנה</h4>
                        <div className='space-y-2'>
                            <Label htmlFor="customerName">שם מלא</Label>
                            <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder='ישראל ישראלי' />
                        </div>
                         <div className='space-y-2'>
                            <Label htmlFor="customerPhone">טלפון</Label>
                            <Input id="customerPhone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder='050-1234567' />
                        </div>
                         <div className='space-y-2'>
                            <Label htmlFor="customerAddress">כתובת למשלוח</Label>
                            <Input id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder='רחוב, מספר בית, עיר' />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" onClick={handleWhatsAppOrder} disabled={!canSubmit}>
                      שליחת הזמנה ב-WhatsApp
                    </Button>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-grow flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-24 w-24 text-muted" />
            <h3 className="text-xl font-semibold">העגלה שלך ריקה</h3>
            <p className="text-muted-foreground">מוזמנים להוסיף מנות מהתפריט שלנו.</p>
            <SheetClose asChild>
                <Link href="/menu">
                    <Button>לתפריט</Button>
                </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
