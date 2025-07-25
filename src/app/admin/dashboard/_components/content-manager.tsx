

'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { storeImage } from '@/lib/image-store';
import { AsyncImage } from '@/components/async-image';

const contentSchema = z.object({
  hero: z.object({
    titleFirstWord: z.string().min(1, 'חובה'),
    titleRest: z.string(),
    subtitle: z.string().min(1, 'חובה'),
    image: z.string().min(1, 'חובה'),
    titleFirstWordColor: z.string(),
    titleFirstWordFontSize: z.string(),
    titleFirstWordOpacity: z.number().min(0).max(1),
    titleRestColor: z.string(),
    titleRestFontSize: z.string(),
    titleRestOpacity: z.number().min(0).max(1),
    subtitleOpacity: z.number().min(0).max(1),
    animationInterval: z.coerce.number().min(0, 'חייב להיות מספר חיובי'),
    heroImageBrightness: z.coerce.number().min(0).max(100),
    verticalAlign: z.enum(['top', 'center', 'bottom']),
    horizontalAlign: z.enum(['left', 'center', 'right']),
    textAlign: z.enum(['left', 'center', 'right']),
  }),
  about: z.object({
    short: z.string().min(1, 'חובה'),
    long: z.string().min(1, 'חובה'),
    image: z.string().min(1, 'חובה'),
  }),
  contact: z.object({
    address: z.string().min(1, 'חובה'),
    phone: z.string().min(1, 'חובה'),
    whatsapp: z.string().min(1, 'חובה'),
    email: z.string().email('אימייל לא חוקי'),
    hours: z.string().min(1, 'חובה'),
    instagram: z.string().url('כתובת אינטרנט לא חוקית').optional().or(z.literal('')),
  }),
  menu: z.object({
      mainImage: z.string().min(1, 'חובה'),
  }),
  newsletter: z.object({
      headline: z.string().min(1, 'חובה'),
      subheadline: z.string().min(1, 'חובה'),
  }),
  testimonials: z.object({
    headline: z.string().min(1, 'חובה'),
  }),
  footer: z.object({
    tagline: z.string().optional(),
    contactTitle: z.string().optional(),
    hoursTitle: z.string().optional(),
    copyright: z.string().optional(),
    hoursContent: z.string().optional(),
  }),
  cart: z.object({
    deliveryMethodTitle: z.string().min(1, 'חובה'),
    pickupLabel: z.string().min(1, 'חובה'),
    deliveryLabel: z.string().min(1, 'חובה'),
    freeDeliveryThreshold: z.coerce.number().min(0),
    freeDeliveryText: z.string().min(1, 'חובה'),
  }),
});

type ContentFormValues = z.infer<typeof contentSchema>;

const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

const ImagePreview = ({ imageKey, alt }: { imageKey: string | undefined, alt: string }) => {
    if (!imageKey) return null;
    return <AsyncImage imageKey={imageKey} alt={alt} width={80} height={80} className="mt-2 h-20 w-20 rounded-md object-cover" />;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function ContentManager() {
  const { state, dispatch } = useApp();
  const { siteContent } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: siteContent,
  });

  const heroImage = form.watch('hero.image');
  const aboutImage = form.watch('about.image');
  const menuImage = form.watch('menu.mainImage');

  useEffect(() => {
    if (siteContent) {
      form.reset(siteContent);
    }
  }, [siteContent, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ContentFormValues['hero'] | keyof ContentFormValues['about'] | keyof ContentFormValues['menu']) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
          const dataUrl = await fileToDataUrl(file);
          const imageKey = await storeImage(dataUrl);
          
          // This is a bit tricky due to the nested structure
          const [section, key] = (fieldName as string).split('.');
          form.setValue(fieldName as any, imageKey, { shouldValidate: true });
          
      } catch (error) {
          console.error("Error uploading image:", error);
          toast({ title: 'שגיאה בהעלאת תמונה', variant: 'destructive' });
      }
  };


  const onSubmit = (values: ContentFormValues) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: values });
    toast({ title: 'תוכן האתר עודכן בהצלחה!' });
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>ניהול תוכן האתר</CardTitle>
        <CardDescription>ערוך את הטקסטים והתמונות בעמודים השונים.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" defaultValue={['hero', 'about', 'contact', 'menu', 'newsletter', 'testimonials', 'cart', 'footer']} className="w-full">
              <AccordionItem value="hero">
                <AccordionTrigger className="font-headline text-xl">עמוד הבית (אזור עליון)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="hero.titleFirstWord" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>כותרת - מילה ראשונה</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField name="hero.titleRest" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>כותרת - שאר המשפט</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                      <FormField name="hero.titleFirstWordColor" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>צבע מילה ראשונה</FormLabel>
                          <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.titleFirstWordFontSize" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>גודל מילה ראשונה</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>{fontSizes.map(s => <SelectItem key={s} value={s}>text-{s}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.titleRestColor" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>צבע שאר המשפט</FormLabel>
                          <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.titleRestFontSize" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>גודל שאר המשפט</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>{fontSizes.map(s => <SelectItem key={s} value={s}>text-{s}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                     <FormField name="hero.titleFirstWordOpacity" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>שקיפות מילה ראשונה ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                          <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.titleRestOpacity" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>שקיפות שאר המשפט ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                          <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>
                  <FormField name="hero.subtitle" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת משנה</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="hero.subtitleOpacity" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>שקיפות כותרת משנה ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                        <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                        <FormMessage />
                    </FormItem>
                  )} />
                   <FormField name="hero.animationInterval" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>מרווח הנפשה חוזרת (בשניות, 0 להפעלה חד-פעמית)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField name="hero.verticalAlign" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>יישור אנכי</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="top">למעלה</SelectItem>
                              <SelectItem value="center">מרכז</SelectItem>
                              <SelectItem value="bottom">למטה</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField name="hero.horizontalAlign" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>יישור אופקי</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="left">שמאל</SelectItem>
                              <SelectItem value="center">מרכז</SelectItem>
                              <SelectItem value="right">ימין</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField name="hero.textAlign" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>יישור טקסט</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="left">שמאל</SelectItem>
                              <SelectItem value="center">מרכז</SelectItem>
                              <SelectItem value="right">ימין</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>
                  <Controller
                    control={form.control}
                    name="hero.image"
                    render={({ field }) => (
                       <FormItem>
                         <FormLabel>תמונת רקע</FormLabel>
                          <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileChange(e, 'hero.image')}
                            />
                          </FormControl>
                         <FormMessage />
                         <ImagePreview imageKey={field.value} alt="תצוגה מקדימה של תמונת רקע" />
                       </FormItem>
                    )}
                  />
                  <FormField name="hero.heroImageBrightness" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>בהירות תמונת רקע ({field.value ?? 100}%)</FormLabel>
                      <FormControl><Slider value={[field.value ?? 100]} min={0} max={100} step={5} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="about">
                <AccordionTrigger className="font-headline text-xl">אודות</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="about.short" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תקציר אודות (לעמוד הבית)</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="about.long" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>טקסט אודות מלא (לעמוד אודות)</FormLabel>
                      <FormControl><Textarea {...field} rows={5} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <Controller
                    control={form.control}
                    name="about.image"
                    render={({ field }) => (
                       <FormItem>
                         <FormLabel>תמונת אודות</FormLabel>
                           <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileChange(e, 'about.image')}
                            />
                           </FormControl>
                         <FormMessage />
                         <ImagePreview imageKey={field.value} alt="תצוגה מקדימה של תמונת אודות" />
                       </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="menu">
                <AccordionTrigger className="font-headline text-xl">עמוד תפריט</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <Controller
                    control={form.control}
                    name="menu.mainImage"
                    render={({ field }) => (
                       <FormItem>
                         <FormLabel>תמונת באנר ראשית</FormLabel>
                           <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileChange(e, 'menu.mainImage')}
                            />
                           </FormControl>
                         <FormMessage />
                         <ImagePreview imageKey={field.value} alt="תצוגה מקדימה של באנר תפריט" />
                       </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact">
                <AccordionTrigger className="font-headline text-xl">פרטי התקשרות</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="contact.address" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כתובת</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="contact.phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>טלפון</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="contact.whatsapp" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>מספר וואטסאפ (כולל קידומת בינלאומית)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="contact.email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>אימייל</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="contact.instagram" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כתובת עמוד אינסטגרם</FormLabel>
                      <FormControl><Input type="url" placeholder="https://instagram.com/your-page" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField name="contact.hours" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>שעות פתיחה</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="cart">
                <AccordionTrigger className="font-headline text-xl">סל קניות</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="cart.deliveryMethodTitle" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת לבחירת משלוח</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="cart.pickupLabel" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>תווית לאיסוף עצמי</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="cart.deliveryLabel" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>תווית למשלוח</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField name="cart.freeDeliveryThreshold" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>סכום מינימום למשלוח חינם (₪)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="cart.freeDeliveryText" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>הודעה על משלוח חינם</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <p className="text-xs text-muted-foreground pt-1">השתמש ב-`{amount}` כדי להציג את הסכום שהוגדר.</p>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="newsletter">
                <AccordionTrigger className="font-headline text-xl">מועדון לקוחות (ניוזלטר)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="newsletter.headline" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת ראשית</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="newsletter.subheadline" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת משנה</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="testimonials">
                <AccordionTrigger className="font-headline text-xl">אזור המלצות</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="testimonials.headline" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת ראשית</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="footer">
                <AccordionTrigger className="font-headline text-xl">תחתית העמוד (Footer)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                   <FormField name="footer.tagline" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>שורת תיאור (מתחת ללוגו)</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="footer.contactTitle" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת עמודת "יצירת קשר"</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="footer.hoursTitle" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת עמודת "שעות פתיחה"</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField name="footer.hoursContent" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תוכן עמודת "שעות פתיחה"</FormLabel>
                      <FormControl><Textarea {...field} value={field.value ?? ''} rows={4} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="footer.copyright" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>שורת זכויות יוצרים</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>שמור שינויים</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
