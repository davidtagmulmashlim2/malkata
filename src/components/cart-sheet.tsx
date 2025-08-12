
'use client';

import { Trash2, Plus, Minus } from 'lucide-react';
import { ShoppingBagIcon } from '@/components/icons/shopping-bag-icon';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useApp } from '@/context/app-context';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { AsyncImage } from './async-image';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

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

function CartSheetLogic() {
  const { cart, getDishById, updateCartQuantity, removeFromCart, state } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [orderNotes, setOrderNotes] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCartOpen = searchParams.get('cart') === 'open';

  // Effect to sync URL with cart state
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (isCartOpen) {
      if (params.get('cart') !== 'open') {
        params.set('cart', 'open');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [isCartOpen, searchParams, pathname, router]);

  const handleOpenChange = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set('cart', 'open');
    } else {
      params.delete('cart');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const cartDetails = useMemo(() => {
    const validCartItems = cart.filter(item => getDishById(item.dishId));
    return validCartItems
      .map(item => {
        const dish = getDishById(item.dishId);
        return dish ? { ...item, ...dish } : null; 
      })
      .filter(item => item !== null);
  }, [cart, getDishById]);
  
  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethod(method);
  };

  useEffect(() => {
      if (deliveryMethod === 'delivery' && viewportRef.current) {
          setTimeout(() => {
              if(viewportRef.current) {
                  viewportRef.current.scrollTo({
                      top: viewportRef.current.scrollHeight,
                      behavior: 'smooth'
                  });
              }
          }, 100);
      }
  }, [deliveryMethod]);


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
    message += `אופן קבלה: ${deliveryMethod === 'delivery' ? cartSettings.delivery_label : cartSettings.pickup_label}\n`
    if (isDelivery) {
        message += `כתובת למשלוח: ${customerAddress}\n`;
    }
    if (orderNotes) {
        message += `הערות להזמנה: ${orderNotes}\n`;
    }
    message += `\nברצוני לבצע הזמנה:\n\n`;
    
    cartDetails.forEach(item => {
      message += `${item!.name} (x${item!.quantity}) - ${item!.price * item!.quantity} ₪\n`;
    });
    message += `\nסה"כ לתשלום: ${total.toLocaleString()} ₪\n\n`;
    message += 'תודה!';
    
    const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleOpenChange(false);
  };
  
  const { cart: cartContent } = state.siteContent;
  const freeDeliveryTextParts = cartContent.free_delivery_text.split('{amount}');
  const canSubmit = customerName !== '' && customerPhone !== '' && (deliveryMethod === 'pickup' || customerAddress !== '');


  return (
    <>
      <button
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg lg:bottom-8 lg:right-8 bg-background border border-border flex items-center justify-center"
      >
        <ShoppingBagIcon className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {totalItems}
          </span>
        )}
        <span className="sr-only">פתח עגלת קניות</span>
      </button>
      <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="flex flex-col text-right">
          <SheetHeader>
            <SheetTitle className="text-right">סל הקניות שלך</SheetTitle>
          </SheetHeader>
          {cartDetails.length > 0 ? (
            <>
              <ScrollArea className="flex-grow pr-4 -mr-6" viewportRef={viewportRef}>
                <div className="flex flex-col gap-4 py-4">
                  {cartDetails.map(item => (
                    <div key={item!.id} className="flex flex-row-reverse items-center gap-4">
                      <div className="shrink-0">
                         <AsyncImage 
                            imageKey={item!.main_image} 
                            alt={item!.name} 
                            width={64}
                            height={64}
                            className="rounded-md object-cover h-16 w-16"
                            data-ai-hint="food dish"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <h4 className="font-semibold truncate" style={{direction: 'rtl', textAlign: 'right'}}>{item!.name}</h4>
                        <p className="text-sm text-muted-foreground">{item!.price} ₪</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5 rounded-md border">
                          <Button variant="ghost" className="h-7 w-7" onClick={() => updateCartQuantity(item!.id, Math.max(1, item!.quantity - 1))}>
                              <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 text-center text-sm font-bold">{item!.quantity}</span>
                          <Button variant="ghost" className="h-7 w-7" onClick={() => updateCartQuantity(item!.id, item!.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                          </Button>
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
                             <Label htmlFor="orderNotes">הערות להזמנה</Label>
                             <Textarea id="orderNotes" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder={cartContent.order_notes_placeholder} />
                          </div>
                           <div className='space-y-2'>
                              <Label>{cartContent.delivery_method_title}</Label>
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                  <Button
                                      type="button"
                                      variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                                      onClick={() => handleDeliveryMethodChange('pickup')}
                                  >
                                      {cartContent.pickup_label}
                                  </Button>
                                  <Button
                                      type="button"
                                      variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                                      onClick={() => handleDeliveryMethodChange('delivery')}
                                  >
                                      {cartContent.delivery_label}
                                  </Button>
                              </div>
                             {deliveryMethod === 'delivery' && total < cartContent.free_delivery_threshold && (
                                  <p className='text-xs text-muted-foreground text-center pt-1'>
                                      {freeDeliveryTextParts[0]}
                                      {cartContent.free_delivery_threshold}
                                      {freeDeliveryTextParts[1]}
                                  </p>
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
    </>
  );
}

export function CartSheet() {
  const isClient = useIsClient();

  if (!isClient) {
    // Render a static button on the server to avoid calling hooks
    return (
      <button
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg lg:bottom-8 lg:right-8 bg-background border border-border flex items-center justify-center"
      >
        <ShoppingBagIcon className="h-6 w-6" />
        <span className="sr-only">פתח עגלת קניות</span>
      </button>
    );
  }

  // On the client, render the component that uses the hooks
  return <CartSheetLogic />;
}
