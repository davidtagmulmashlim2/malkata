'use client';
import { useForm } from 'react-hook-form';
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

const contentSchema = z.object({
  hero: z.object({
    title: z.string().min(1, 'חובה'),
    subtitle: z.string().min(1, 'חובה'),
    image: z.string().min(1, 'חובה'),
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
  }),
  menu: z.object({
      mainImage: z.string().min(1, 'חובה'),
  })
});

// Helper to read file as Data URL
const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export default function ContentManager() {
  const { state, dispatch } = useApp();
  const { siteContent } = state;

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    values: siteContent,
  });

  const onSubmit = (values: z.infer<typeof contentSchema>) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: values });
    toast({ title: 'תוכן האתר עודכן בהצלחה!' });
  };
  
  const handleFileChange = (field: any) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          try {
              const dataUrl = await readFileAsDataURL(file);
              field.onChange(dataUrl);
          } catch (error) {
              console.error("Error reading file:", error);
              toast({ title: "שגיאה בקריאת הקובץ", variant: "destructive" });
          }
      }
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
            <Accordion type="multiple" defaultValue={['hero', 'about', 'contact', 'menu']} className="w-full">
              <AccordionItem value="hero">
                <AccordionTrigger className="font-headline text-xl">עמוד הבית (אזור עליון)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="hero.title" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת ראשית</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="hero.subtitle" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת משנה</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="hero.image" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תמונת רקע</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handleFileChange(field)} />
                      </FormControl>
                      <FormMessage />
                       {field.value && <img src={field.value} alt="Preview" className="mt-2 h-20 rounded-md" />}
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
                   <FormField name="about.image" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תמונה</FormLabel>
                       <FormControl>
                        <Input type="file" accept="image/*" onChange={handleFileChange(field)} />
                      </FormControl>
                      <FormMessage />
                      {field.value && <img src={field.value} alt="Preview" className="mt-2 h-20 rounded-md" />}
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="menu">
                <AccordionTrigger className="font-headline text-xl">עמוד תפריט</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField name="menu.mainImage" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תמונת באנר ראשית</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handleFileChange(field)} />
                      </FormControl>
                      <FormMessage />
                      {field.value && <img src={field.value} alt="Preview" className="mt-2 h-20 rounded-md" />}
                    </FormItem>
                  )} />
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
                   <FormField name="contact.hours" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>שעות פתיחה</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button type="submit" className="w-full">שמור שינויים</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
