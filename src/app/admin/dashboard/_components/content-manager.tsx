

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
import { Leaf, ChefHat, Bike, PartyPopper, Carrot, Rocket, Send, Smartphone } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';


const featureIcons = [
    { name: 'עלה', value: 'Leaf', icon: Leaf },
    { name: 'כובע שף', value: 'ChefHat', icon: ChefHat },
    { name: 'אופניים', value: 'Bike', icon: Bike },
    { name: 'קונפטי', value: 'PartyPopper', icon: PartyPopper },
    { name: 'גזר', value: 'Carrot', icon: Carrot },
    { name: 'טיל', value: 'Rocket', icon: Rocket },
    { name: 'שליחה', value: 'Send', icon: Send },
    { name: 'סמארטפון', value: 'Smartphone', icon: Smartphone },
];

const FeatureIconSelect = ({ onValueChange, value }: { onValueChange: (value: string) => void; value: string; }) => (
    <Select onValueChange={onValueChange} value={value}>
        <FormControl>
            <SelectTrigger>
                <SelectValue placeholder="בחר אייקון" />
            </SelectTrigger>
        </FormControl>
        <SelectContent>
            {featureIcons.map(icon => (
                <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                        <icon.icon className="h-4 w-4" />
                        <span>{icon.name}</span>
                    </div>
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);


const contentSchema = z.object({
  hero: z.object({
    title_first_word: z.string(),
    title_rest: z.string(),
    subtitle: z.string(),
    image: z.string().min(1, 'חובה'),
    title_first_word_color: z.string(),
    title_first_word_font_size: z.string(),
    title_first_word_opacity: z.number().min(0).max(1),
    title_rest_color: z.string(),
    title_rest_font_size: z.string(),
    title_rest_opacity: z.number().min(0).max(1),
    subtitle_opacity: z.number().min(0).max(1),
    animation_interval: z.coerce.number().min(0, 'חייב להיות מספר חיובי'),
    hero_image_brightness: z.coerce.number().min(0).max(100),
    hero_height: z.coerce.number().min(40).max(100),
    vertical_align: z.enum(['top', 'center', 'bottom']),
    horizontal_align: z.enum(['left', 'center', 'right']),
    text_align: z.enum(['left', 'center', 'right']),
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
    facebook: z.string().url('כתובת אינטרנט לא חוקית').optional().or(z.literal('')),
    show_address: z.boolean().optional(),
    show_phone: z.boolean().optional(),
    show_whatsapp: z.boolean().optional(),
    show_email: z.boolean().optional(),
    show_instagram: z.boolean().optional(),
    show_facebook: z.boolean().optional(),
    show_hours: z.boolean().optional(),
  }),
  menu: z.object({
      main_image: z.string().min(1, 'חובה'),
  }),
  newsletter: z.object({
      headline: z.string().min(1, 'חובה'),
      subheadline: z.string().min(1, 'חובה'),
  }),
  testimonials: z.object({
    headline: z.string().min(1, 'חובה'),
  }),
  features: z.object({
      feature1: z.object({ icon: z.string(), title: z.string().min(1, 'חובה'), description: z.string().min(1, 'חובה') }),
      feature2: z.object({ icon: z.string(), title: z.string().min(1, 'חובה'), description: z.string().min(1, 'חובה') }),
      feature3: z.object({ icon: z.string(), title: z.string().min(1, 'חובה'), description: z.string().min(1, 'חובה') }),
      feature4: z.object({ enabled: z.boolean(), icon: z.string(), title: z.string(), description: z.string() }),
  }),
  footer: z.object({
    tagline: z.string().optional(),
    contact_title: z.string().optional(),
    hours_title: z.string().optional(),
    copyright: z.string().optional(),
    hours_content: z.string().optional(),
    hours_content_color: z.string().optional(),
    hours_content_font_size: z.string().optional(),
    hours_content_is_bold: z.boolean().optional(),
  }),
  cart: z.object({
    delivery_method_title: z.string().min(1, 'חובה'),
    pickup_label: z.string().min(1, 'חובה'),
    delivery_label: z.string().min(1, 'חובה'),
    free_delivery_threshold: z.coerce.number().min(0),
    free_delivery_text: z.string().min(1, 'חובה'),
    order_notes_placeholder: z.string().optional(),
  }),
  shabbat_notice: z.object({
      enabled: z.boolean().optional(),
      text: z.string().optional(),
      color: z.string().optional(),
      font_size: z.string().optional(),
      is_bold: z.boolean().optional(),
  }).optional(),
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
  const menuImage = form.watch('menu.main_image');

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
          
      } catch (error: any) {
          console.error("Error uploading image:", error);
          toast({ 
              title: 'שגיאה בהעלאת תמונה', 
              description: error.message || 'An unknown error occurred.',
              variant: 'destructive' 
          });
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
            <Accordion type="multiple" defaultValue={['hero', 'about', 'contact', 'menu', 'shabbat-notice', 'newsletter', 'testimonials', 'features', 'cart', 'footer']} className="w-full">
              <AccordionItem value="hero">
                <AccordionTrigger className="font-headline text-xl">עמוד הבית (אזור עליון)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="hero.title_first_word" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>כותרת - מילה ראשונה</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField name="hero.title_rest" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>כותרת - שאר המשפט</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                      <FormField name="hero.title_first_word_color" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>צבע מילה ראשונה</FormLabel>
                          <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.title_first_word_font_size" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>גודל מילה ראשונה</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>{fontSizes.map(s => <SelectItem key={s} value={s}>text-{s}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.title_rest_color" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>צבע שאר המשפט</FormLabel>
                          <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.title_rest_font_size" control={form.control} render={({ field }) => (
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
                     <FormField name="hero.title_first_word_opacity" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>שקיפות מילה ראשונה ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                          <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField name="hero.title_rest_opacity" control={form.control} render={({ field }) => (
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
                  <FormField name="hero.subtitle_opacity" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>שקיפות כותרת משנה ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                        <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                        <FormMessage />
                    </FormItem>
                  )} />
                   <FormField name="hero.animation_interval" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>מרווח הנפשה חוזרת (בשניות, 0 להפעלה חד-פעמית)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField name="hero.vertical_align" control={form.control} render={({ field }) => (
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
                      <FormField name="hero.horizontal_align" control={form.control} render={({ field }) => (
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
                      <FormField name="hero.text_align" control={form.control} render={({ field }) => (
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
                  <FormField name="hero.hero_image_brightness" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>בהירות תמונת רקע ({field.value ?? 100}%)</FormLabel>
                      <FormControl><Slider value={[field.value ?? 100]} min={0} max={100} step={5} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField name="hero.hero_height" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>גובה תמונת רקע (400-1000px)</FormLabel>
                      <FormControl><Slider value={[field.value ?? 80]} min={40} max={100} step={5} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
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
                    name="menu.main_image"
                    render={({ field }) => (
                       <FormItem>
                         <FormLabel>תמונת באנר ראשית</FormLabel>
                           <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileChange(e, 'menu.main_image')}
                            />
                           </FormControl>
                         <FormMessage />
                         <ImagePreview imageKey={field.value} alt="תצוגה מקדימה של באנר תפריט" />
                       </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shabbat-notice">
                <AccordionTrigger className="font-headline text-xl">הודעת שבת</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <FormField
                        control={form.control}
                        name="shabbat_notice.enabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>הצג הודעה בעמוד הזמנות לשבת</FormLabel>
                                </div>
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField name="shabbat_notice.text" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>תוכן ההודעה</FormLabel>
                            <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField name="shabbat_notice.color" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>צבע</FormLabel>
                                <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="shabbat_notice.font_size" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>גודל גופן</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>{fontSizes.map(s => <SelectItem key={s} value={`text-${s}`}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="shabbat_notice.is_bold" control={form.control} render={({ field }) => (
                           <FormItem className="flex flex-row items-center justify-start rounded-lg border p-3 shadow-sm h-full mt-auto">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="mr-2">הדגשה (Bold)</FormLabel>
                           </FormItem>
                        )} />
                    </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features">
                <AccordionTrigger className="font-headline text-xl">מדור יתרונות (עמוד הבית)</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                    <div className="p-4 border rounded-md space-y-4">
                        <h4 className='font-medium text-md'>יתרון 1</h4>
                        <FormField name="features.feature1.icon" control={form.control} render={({ field }) => ( <FormItem><FormLabel>אייקון</FormLabel><FeatureIconSelect onValueChange={field.onChange} value={field.value} /><FormMessage /></FormItem> )} />
                        <FormField name="features.feature1.title" control={form.control} render={({ field }) => ( <FormItem><FormLabel>כותרת</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField name="features.feature1.description" control={form.control} render={({ field }) => ( <FormItem><FormLabel>תיאור</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                     <div className="p-4 border rounded-md space-y-4">
                        <h4 className='font-medium text-md'>יתרון 2</h4>
                        <FormField name="features.feature2.icon" control={form.control} render={({ field }) => ( <FormItem><FormLabel>אייקון</FormLabel><FeatureIconSelect onValueChange={field.onChange} value={field.value} /><FormMessage /></FormItem> )} />
                        <FormField name="features.feature2.title" control={form.control} render={({ field }) => ( <FormItem><FormLabel>כותרת</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField name="features.feature2.description" control={form.control} render={({ field }) => ( <FormItem><FormLabel>תיאור</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                     <div className="p-4 border rounded-md space-y-4">
                        <h4 className='font-medium text-md'>יתרון 3</h4>
                        <FormField name="features.feature3.icon" control={form.control} render={({ field }) => ( <FormItem><FormLabel>אייקון</FormLabel><FeatureIconSelect onValueChange={field.onChange} value={field.value} /><FormMessage /></FormItem> )} />
                        <FormField name="features.feature3.title" control={form.control} render={({ field }) => ( <FormItem><FormLabel>כותרת</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField name="features.feature3.description" control={form.control} render={({ field }) => ( <FormItem><FormLabel>תיאור</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                     <div className="p-4 border rounded-md space-y-4">
                        <FormField
                            control={form.control}
                            name="features.feature4.enabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>יתרון 4 (אופציונלי)</FormLabel>
                                        <p className="text-xs text-muted-foreground">הפעל כדי להציג את היתרון הרביעי בעמוד הבית.</p>
                                    </div>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField name="features.feature4.icon" control={form.control} render={({ field }) => ( <FormItem><FormLabel>אייקון</FormLabel><FeatureIconSelect onValueChange={field.onChange} value={field.value} /><FormMessage /></FormItem> )} />
                        <FormField name="features.feature4.title" control={form.control} render={({ field }) => ( <FormItem><FormLabel>כותרת</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField name="features.feature4.description" control={form.control} render={({ field }) => ( <FormItem><FormLabel>תיאור</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
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
                  <FormField name="contact.facebook" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כתובת עמוד פייסבוק</FormLabel>
                      <FormControl><Input type="url" placeholder="https://facebook.com/your-page" {...field} value={field.value ?? ''} /></FormControl>
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

                  <Separator />

                  <div className="space-y-4">
                    <FormLabel className="font-medium">הצגת פרטים בעמוד</FormLabel>
                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                      <FormField control={form.control} name="contact.show_address" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>כתובת</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="contact.show_phone" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>טלפון</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="contact.show_whatsapp" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>וואטסאפ</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="contact.show_email" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>אימייל</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="contact.show_instagram" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>אינסטגרם</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="contact.show_facebook" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>פייסבוק</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="contact.show_hours" render={({ field }) => ( <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>שעות פתיחה</FormLabel></FormItem> )} />
                    </div>
                  </div>

                </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="cart">
                <AccordionTrigger className="font-headline text-xl">סל קניות</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="cart.delivery_method_title" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת לבחירת משלוח</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="cart.pickup_label" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>תווית לאיסוף עצמי</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="cart.delivery_label" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>תווית למשלוח</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField name="cart.free_delivery_threshold" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>סכום מינימום למשלוח חינם (₪)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="cart.free_delivery_text" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>הודעה על משלוח חינם</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <p className="text-xs text-muted-foreground pt-1">{'השתמש ב `{amount}` כדי להציג את הסכום שהוגדר.'}</p>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="cart.order_notes_placeholder" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>טקסט לדוגמה (Placeholder) לשדה ההערות</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
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
                  <FormField name="footer.contact_title" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת עמודת "יצירת קשר"</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="footer.hours_title" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת עמודת "שעות פתיחה"</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField name="footer.hours_content" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תוכן עמודת "שעות פתיחה"</FormLabel>
                      <FormControl><Textarea {...field} value={field.value ?? ''} rows={4} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                        <FormField name="footer.hours_content_color" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>צבע התוכן</FormLabel>
                                <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="footer.hours_content_font_size" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>גודל גופן</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>{fontSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="footer.hours_content_is_bold" control={form.control} render={({ field }) => (
                           <FormItem className="flex flex-row items-center justify-start rounded-lg border p-3 shadow-sm h-full mt-auto">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="mr-2">הדגשה (Bold)</FormLabel>
                           </FormItem>
                        )} />
                    </div>
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
