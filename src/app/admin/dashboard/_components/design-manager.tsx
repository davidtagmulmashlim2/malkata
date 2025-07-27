
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';

const designSchema = z.object({
  theme: z.string(),
  headlineFont: z.string(),
  bodyFont: z.string(),
  logoIcon: z.string(),
  logoColor: z.string().optional(),
  featuredCategoryId: z.string().optional(),
});

const themes = [
    { name: 'ברירת מחדל (חם)', value: 'default' },
    { name: 'רטרו', value: 'retro' },
    { name: 'אורבני', value: 'urban' },
    { name: 'טרמינל', value: 'terminal' },
    { name: 'אוקיינוס', value: 'ocean' },
    { name: 'יער', value: 'forest' },
    { name: 'זריחה', value: 'sunrise' },
    { name: 'יוקרתי', value: 'luxury' },
    { name: 'טבעי', value: 'natural' },
    { name: 'מינימליסטי', value: 'minimal' },
    { name: 'מקראי', value: 'biblical' },
];

const fonts = [
    { name: 'Playfair Display (ברירת מחדל כותרות)', value: 'playfair' },
    { name: 'PT Sans (ברירת מחדל גוף)', value: 'pt-sans' },
    { name: 'Roboto Mono', value: 'roboto-mono' },
    { name: 'Chakra Petch', value: 'chakra-petch' },
    { name: 'Cormorant Garamond', value: 'cormorant-garamond' },
    { name: 'Lato', value: 'lato' },
    { name: 'Montserrat', value: 'montserrat' },
    { name: 'Open Sans', value: 'open-sans' },
    { name: 'Frank Ruhl Libre', value: 'frank-ruhl-libre' },
    { name: 'גברת לוין (כתב)', value: 'gveret-levin' },
    { name: 'קרנטינה (כתב)', value: 'karantina' },
];

const logoIcons = [
    { name: 'ברירת מחדל (סכו״ם)', value: 'default' },
    { name: 'כתר (עיצוב 1)', value: 'crown' },
    { name: 'כתר (עיצוב 2)', value: 'crown2' },
    { name: 'כתר (עיצוב 3)', value: 'crown3' },
    { name: 'כתר (עיצוב 4)', value: 'crown4' },
    { name: 'יהלום', value: 'gem' },
    { name: 'כוכב', value: 'star' },
    { name: 'מגן', value: 'shield' },
    { name: 'ללא', value: 'none' },
];

export default function DesignManager() {
  const { state, dispatch } = useApp();
  const { design, categories } = state;

  const form = useForm<z.infer<typeof designSchema>>({
    resolver: zodResolver(designSchema),
    defaultValues: design,
  });

  useEffect(() => {
    if (design) {
      form.reset(design);
    }
  }, [design, form]);

  const onSubmit = (values: z.infer<typeof designSchema>) => {
    const payload = {
        ...values,
        featuredCategoryId: values.featuredCategoryId === 'none' ? undefined : values.featuredCategoryId
    }
    dispatch({ type: 'UPDATE_DESIGN', payload });
    toast({ title: 'הגדרות עיצוב עודכנו!' });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ניהול עיצוב</CardTitle>
        <CardDescription>התאם את המראה והתחושה של האתר.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-headline">ערכת נושא</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר ערכת נושא" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {themes.map(theme => (
                            <SelectItem key={theme.value} value={theme.value}>{theme.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="logoIcon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-headline">סמל לוגו</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סמל" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {logoIcons.map(icon => (
                            <SelectItem key={icon.value} value={icon.value}>{icon.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="logoColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-headline">צבע הלוגו</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} className="p-1 h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="headlineFont"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-headline">פונט לכותרות (Headline)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר פונט" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fonts.map(font => (
                            <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bodyFont"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-headline">פונט לטקסט רץ (Body)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר פונט" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fonts.map(font => (
                            <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <FormField
              control={form.control}
              name="featuredCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-headline">קטגוריה מומלצת (להצגה בתפריט ראשי)</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value ?? 'none'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה להדגשה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">ללא</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>שמור שינויי עיצוב</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
