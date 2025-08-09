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
import { storeImage, deleteImage } from '@/lib/image-store.client';
import { AsyncImage } from '@/components/async-image';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

const designSchema = z.object({
  theme: z.string(),
  headline_font: z.string(),
  body_font: z.string(),
  logo_icon: z.string(),
  logo_color: z.string().optional(),
  logo_image: z.string().optional(),
  logo_image_mobile: z.string().optional(),
  logo_width: z.coerce.number().min(50).max(300).optional(),
  featured_category_id: z.string().optional().nullable(),
  favicon: z.string().optional(),
});

type DesignFormValues = z.infer<typeof designSchema>;

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ImagePreview = ({ imageKey, alt, onRemove, width, height, className }: { imageKey: string | undefined, alt: string, onRemove?: () => void, width?: number, height?: number, className?: string }) => {
    if (!imageKey) return null;
    // Show a preview if it's a data URL, otherwise use AsyncImage for stored keys
    const isDataUrl = imageKey?.startsWith('data:');
    return (
        <div className="mt-2 relative w-fit">
            {isDataUrl ? (
                 <img 
                    src={imageKey} 
                    alt={alt} 
                    height={height || 40} 
                    width={width || 112} 
                    className={cn("object-contain border p-1 rounded-md", className)} 
                    style={{width: `${width || 112}px`, height: `${height || 40}px`}} 
                />
            ) : (
                <AsyncImage 
                    imageKey={imageKey} 
                    alt={alt} 
                    height={height || 40} 
                    width={width || 112} 
                    className={cn("object-contain border p-1 rounded-md", className)} 
                    style={{width: `${width || 112}px`, height: `${height || 40}px`}} 
                />
            )}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalValues, setOriginalValues] = useState<DesignFormValues>();

  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designSchema),
    defaultValues: design,
  });
  
  const logoImagePreview = form.watch('logo_image');
  const logoImageMobilePreview = form.watch('logo_image_mobile');
  const logoWidthPreview = form.watch('logo_width');
  const faviconPreview = form.watch('favicon');


  useEffect(() => {
    if (design) {
      const currentDesign = {
          ...design,
          featured_category_id: design.featured_category_id || 'none'
      };
      form.reset(currentDesign);
      setOriginalValues(currentDesign);
    }
  }, [design, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_image' | 'logo_image_mobile' | 'favicon') => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
          const dataUrl = await fileToDataUrl(file);
          // Set value to the data URL to show a preview and mark the form as dirty
          form.setValue(fieldName, dataUrl, { shouldValidate: true, shouldDirty: true });
      } catch (error: any) {
          toast({ 
              title: 'שגיאה בקריאת הקובץ', 
              description: error.message || 'An unknown error occurred.',
              variant: 'destructive' 
          });
      }
  };

  const handleRemoveImage = (fieldName: 'logo_image' | 'logo_image_mobile' | 'favicon') => {
    form.setValue(fieldName, '', { shouldValidate: true, shouldDirty: true });
  }

  const onSubmit = async (values: DesignFormValues) => {
    setIsSubmitting(true);
    try {
        let finalValues = { ...values };
        const oldValues = originalValues;

        // Handle main logo image upload
        if (values.logo_image && values.logo_image.startsWith('data:')) {
            const newKey = await storeImage(values.logo_image);
            finalValues.logo_image = newKey;
            if (oldValues?.logo_image) {
                await deleteImage(oldValues.logo_image);
            }
        } else if (!values.logo_image && oldValues?.logo_image) {
             await deleteImage(oldValues.logo_image);
        }

        // Handle mobile logo image upload
        if (values.logo_image_mobile && values.logo_image_mobile.startsWith('data:')) {
            const newKey = await storeImage(values.logo_image_mobile);
            finalValues.logo_image_mobile = newKey;
            if (oldValues?.logo_image_mobile) {
                await deleteImage(oldValues.logo_image_mobile);
            }
        } else if (!values.logo_image_mobile && oldValues?.logo_image_mobile) {
             await deleteImage(oldValues.logo_image_mobile);
        }

        // Handle favicon upload
        if (values.favicon && values.favicon.startsWith('data:')) {
            const newKey = await storeImage(values.favicon);
            finalValues.favicon = newKey;
            if (oldValues?.favicon) {
                await deleteImage(oldValues.favicon);
            }
        } else if (!values.favicon && oldValues?.favicon) {
            await deleteImage(oldValues.favicon);
        }

        const payload = {
            ...finalValues,
            featured_category_id: finalValues.featured_category_id === 'none' ? null : finalValues.featured_category_id
        }

        dispatch({ type: 'UPDATE_DESIGN', payload });
        toast({ title: 'הגדרות עיצוב עודכנו!' });
        form.reset(payload); // Reset form with the new values from state
        setOriginalValues(payload);

    } catch (error: any) {
        toast({ title: 'שגיאה בשמירת שינויים', description: error.message, variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
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
                        <Input type="color" {...field} className="p-1 h-10 w-full" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Separator />
            
             <Controller
                control={form.control}
                name="logo_image"
                render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-lg font-headline">לוגו ראשי (דסקטופ)</FormLabel>
                      <p className="text-sm text-muted-foreground">העלאת תמונה תחליף את האייקון שבחרת ואת שם האתר.</p>
                      <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileChange(e, 'logo_image')}
                        />
                      </FormControl>
                     <FormMessage />
                     <ImagePreview imageKey={logoImagePreview} alt="תצוגה מקדימה של לוגו" onRemove={() => handleRemoveImage('logo_image')} width={logoWidthPreview} />
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

             <Controller
                control={form.control}
                name="logo_image_mobile"
                render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-lg font-headline">לוגו לתפריט מובייל (אופציונלי)</FormLabel>
                      <p className="text-sm text-muted-foreground">אם לא תועלה תמונה, יוצג הלוגו הראשי.</p>
                      <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileChange(e, 'logo_image_mobile')}
                        />
                      </FormControl>
                     <FormMessage />
                     <ImagePreview imageKey={logoImageMobilePreview} alt="תצוגה מקדימה של לוגו מובייל" onRemove={() => handleRemoveImage('logo_image_mobile')} width={150} height={50} />
                   </FormItem>
                )}
              />

              <Separator />

               <Controller
                control={form.control}
                name="favicon"
                render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-lg font-headline">פביקון (Favicon)</FormLabel>
                      <p className="text-sm text-muted-foreground">הסמל שמופיע בלשונית הדפדפן. מומלץ להעלות תמונת ריבועית (למשל 32x32px).</p>
                      <FormControl>
                        <Input 
                            type="file" 
                            accept="image/png, image/x-icon, image/svg+xml, image/vnd.microsoft.icon" 
                            onChange={(e) => handleFileChange(e, 'favicon')}
                        />
                      </FormControl>
                     <FormMessage />
                     <ImagePreview 
                        imageKey={faviconPreview} 
                        alt="תצוגה מקדימה של פביקון" 
                        onRemove={() => handleRemoveImage('favicon')} 
                        width={32} 
                        height={32} 
                        className="h-8 w-8"
                     />
                   </FormItem>
                )}
              />
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
            
            <Button type="submit" className="w-full" disabled={!form.formState.isDirty || isSubmitting}>
                {isSubmitting ? 'שומר...' : 'שמור שינויי עיצוב'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    

    