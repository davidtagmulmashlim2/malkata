

'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { storeImage, deleteImage } from '@/lib/image-store';
import { AsyncImage } from '@/components/async-image';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

const designSchema = z.object({
  theme: z.string(),
  headline_font: z.string(),
  body_font: z.string(),
  logo_icon: z.string(),
  logo_color: z.string().optional(),
  logo_image: z.string().optional(),
  logo_width: z.coerce.number().min(50).max(300).optional(),
  featured_category_id: z.string().optional().nullable(),
});

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ImagePreview = ({ imageKey, alt, onRemove, width }: { imageKey: string | undefined, alt: string, onRemove?: () => void, width?: number }) => {
    if (!imageKey) return null;
    return (
        <div className="mt-2 relative w-fit">
            <AsyncImage imageKey={imageKey} alt={alt} height={40} width={width || 112} className="h-10 object-contain border p-1 rounded-md" style={{width: `${width || 112}px`}} />
            {onRemove && (
                <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={onRemove}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
};


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
    { name: 'Open Sans (ברירת מחדל גוף)', value: 'open-sans' },
    { name: 'Alef', value: 'alef' },
    { name: 'Amatic SC', value: 'amatic-sc' },
    { name: 'Arimo', value: 'arimo' },
    { name: 'Assistant', value: 'assistant' },
    { name: 'Bellefair', value: 'bellefair' },
    { name: 'David Libre', value: 'david-libre' },
    { name: 'Frank Ruhl Libre', value: 'frank-ruhl-libre' },
    { name: 'Heebo', value: 'heebo' },
    { name: 'M PLUS Rounded 1c', value: 'm-plus-rounded-1c' },
    { name: 'Miriam Libre', value: 'miriam-libre' },
    { name: 'Noto Sans Hebrew', value: 'noto-sans-hebrew' },
    { name: 'Noto Serif Hebrew', value: 'noto-serif-hebrew' },
    { name: 'Rubik', value: 'rubik' },
    { name: 'Secular One', value: 'secular-one' },
    { name: 'Suez One', value: 'suez-one' },
    { name: 'Varela Round', value: 'varela-round' },
    { name: 'Dana', value: 'dana' },
    { name: 'PT Sans (ישן)', value: 'pt-sans' },
    { name: 'Roboto Mono', value: 'roboto-mono' },
    { name: 'Chakra Petch', value: 'chakra-petch' },
    { name: 'Cormorant Garamond', value: 'cormorant-garamond' },
    { name: 'Lato', value: 'lato' },
    { name: 'Montserrat', value: 'montserrat' },
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
  
  const logoImagePreview = form.watch('logo_image');
  const logoWidthPreview = form.watch('logo_width');

  useEffect(() => {
    if (design) {
      form.reset({
          ...design,
          featured_category_id: design.featured_category_id || 'none'
      });
    }
  }, [design, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
          const dataUrl = await fileToDataUrl(file);
          // If there's an old image, delete it from the store first
          const oldImageKey = form.getValues('logo_image');
          if (oldImageKey) {
            await deleteImage(oldImageKey);
          }
          const imageKey = await storeImage(dataUrl);
          form.setValue('logo_image', imageKey, { shouldValidate: true });
          toast({ title: 'תמונת לוגו הועלתה' });
      } catch (error: any) {
          console.error("Error uploading image:", error);
          toast({ 
              title: 'שגיאה בהעלאת תמונה', 
              description: error.message || 'An unknown error occurred.',
              variant: 'destructive' 
          });
      }
  };

  const handleRemoveImage = async () => {
    const imageKey = form.getValues('logo_image');
    if (imageKey) {
        try {
            await deleteImage(imageKey);
            form.setValue('logo_image', '', { shouldValidate: true });
            toast({ title: 'תמונת לוגו הוסרה' });
        } catch (error) {
             console.error("Error deleting image:", error);
             toast({ title: 'שגיאה במחיקת תמונה', variant: 'destructive' });
        }
    }
  }

  const onSubmit = (values: z.infer<typeof designSchema>) => {
    const payload = {
        ...values,
        featured_category_id: values.featured_category_id === 'none' ? null : values.featured_category_id
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo_icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-headline">סמל לוגו (ללא תמונה)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="logo_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-headline">צבע הלוגו (ללא תמונה)</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} className="p-1 h-10 w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Controller
                control={form.control}
                name="logo_image"
                render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-lg font-headline">תמונת לוגו (אופציונלי)</FormLabel>
                      <p className="text-sm text-muted-foreground">העלאת תמונה תחליף את האייקון שבחרת ואת שם האתר.</p>
                      <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                      </FormControl>
                     <FormMessage />
                     <ImagePreview imageKey={logoImagePreview} alt="תצוגה מקדימה של לוגו" onRemove={handleRemoveImage} width={logoWidthPreview} />
                   </FormItem>
                )}
              />
              {logoImagePreview && (
                <FormField name="logo_width" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>רוחב הלוגו ({field.value || 120}px)</FormLabel>
                    <FormControl><Slider value={[field.value || 120]} min={50} max={300} step={5} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="headline_font"
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
                  name="body_font"
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
              name="featured_category_id"
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
                        <SelectItem key={category.id} value={category.id!}>{category.name}</SelectItem>
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

    