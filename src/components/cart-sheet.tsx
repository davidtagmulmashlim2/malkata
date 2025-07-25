
'use client';

import { Trash2 } from 'lucide-react';
import { ShoppingBagIcon } from '@/components/icons/shopping-bag-icon';
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { AsyncImage } from './async-image';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';

const CartItemSkeleton = () => (
    <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <Skeleton className="h-16 w-16 rounded-md shrink-0" />
            <div className="flex flex-col text-start flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-8" />
            <Skeleton className="h-8 w-8" />
        </div>
    </div>
);


export function CartSheet() {
  const { cart, getDishById, updateCartQuantity, removeFromCart, state } = useApp();
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');

  const cartDetails = useMemo(() => {
    if (!isClient) return [];
    return cart
      .map(item => {
        const dish = getDishById(item.dishId);
        return dish ? { ...item, ...dish } : null; 
      })
      .filter(item => item && getDishById(item.dishId));
  }, [isClient, cart, getDishById]);


  const total = cartDetails.reduce((sum, item) => sum + item!.price * item!.quantity, 0);
  const totalItems = cartDetails.reduce((acc, item) => acc + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    const isDelivery = deliveryMethod === 'delivery';
    if (!customerName || !customerPhone || (isDelivery && !customerAddress)) {
        alert('יש למלא את כל הפרטים הנדרשים לפני שליחת ההזמנה.');
        return;
    }
    const { contact, cart: cartSettings } = state.siteContent;

    let message = `שלום, אני ${customerName}, טלפון ${customerPhone}.\n`;
    message += `אופן קבלה: ${deliveryMethod === 'delivery' ? cartSettings.deliveryLabel : cartSettings.pickupLabel}\n`
    if (isDelivery) {
        message += `כתובת למשלוח: ${customerAddress}\n`;
    }
    message += `\nברצוני לבצע הזמנה:\n\n`;
    
    cartDetails.forEach(item => {
      message += `${item!.name} (x${item!.quantity}) - ${item!.price * item!.quantity} ₪\n`;
    });
    message += `\nסה"כ לתשלום: ${total.toLocaleString()} ₪\n\n`;
    message += 'תודה!';
    
    const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setOpen(false); // Close the sheet after sending
  };
  
  const { cart: cartContent } = state.siteContent;
  const freeDeliveryMessage = cartContent.freeDeliveryText.replace('{amount}', `${cartContent.freeDeliveryThreshold} ₪`);
  const canSubmit = customerName !== '' && customerPhone !== '' && (deliveryMethod === 'pickup' || customerAddress !== '');


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg lg:bottom-8 lg:right-8">
          <ShoppingBagIcon className="h-6 w-6" />
          {isClient && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {totalItems}
            </span>
          )}
          <span className="sr-only">פתח עגלת קניות</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col text-right">
        <SheetHeader>
          <SheetTitle className="text-right">סל הקניות שלך</SheetTitle>
        </SheetHeader>
        {!isClient ? (
           <div className="space-y-4 py-4">
                <CartItemSkeleton />
                <CartItemSkeleton />
            </div>
        ) : cartDetails.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="flex flex-col gap-4 py-4">
                {cartDetails.map(item => (
                  <div key={item!.id} className="flex flex-row-reverse items-center gap-4">
                    <div className="shrink-0">
                       <AsyncImage 
                          imageKey={item!.mainImage} 
                          alt={item!.name} 
                          width={64}
                          height={64}
                          className="rounded-md object-cover h-16 w-16"
                          data-ai-hint="food dish"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <h4 className="font-semibold truncate">{item!.name}</h4>
                      <p className="text-sm text-muted-foreground">{item!.price} ₪</p>
                    </div>
                    <div className="shrink-0">
                       <Input
                          type="number"
                          min="1"
                          value={item!.quantity}
                          onChange={e => updateCartQuantity(item!.id, parseInt(e.target.value, 10))}
                          className="w-16 h-8 text-center"
                        />
                    </div>
                    <div className="shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item!.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full space-y-4 text-right pt-4">
                    <Separator />
                    <div className='space-y-4 text-right'>
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
                            <Label>{cartContent.deliveryMethodTitle}</Label>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                                    onClick={() => setDeliveryMethod('pickup')}
                                >
                                    {cartContent.pickupLabel}
                                </Button>
                                <Button
                                    type="button"
                                    variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                                    onClick={() => setDeliveryMethod('delivery')}
                                >
                                    {cartContent.deliveryLabel}
                                </Button>
                            </div>
                             {deliveryMethod === 'delivery' && total < cartContent.freeDeliveryThreshold && (
                                <p className='text-xs text-muted-foreground text-center pt-1'>({freeDeliveryMessage})</p>
                            )}
                        </div>
                        {deliveryMethod === 'delivery' && (
                            <div className='space-y-2'>
                                <Label htmlFor="customerAddress">כתובת למשלוח</Label>
                                <Input id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder='רחוב, מספר בית, עיר' />
                            </div>
                        )}
                    </div>
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4">
                <div className="w-full space-y-4">
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>סה"כ:</span>
                        <span>{total.toLocaleString()} ₪</span>
                    </div>
                    <Button type="submit" className="w-full" onClick={handleWhatsAppOrder} disabled={!canSubmit}>
                      שליחת הזמנה ב-WhatsApp
                    </Button>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-grow flex-col items-center justify-center gap-4 text-center">
            <ShoppingBagIcon className="h-24 w-24 text-muted" />
            <h3 className="text-xl font-semibold">הסל שלך ריק</h3>
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
