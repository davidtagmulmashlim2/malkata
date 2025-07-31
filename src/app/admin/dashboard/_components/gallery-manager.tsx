
'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';
import { storeImage } from '@/lib/image-store';
import { AsyncImage } from '@/components/async-image';


const gallerySchema = z.object({
  src: z.string().min(1, 'חובה להעלות תמונה'),
  alt: z.string().optional(),
});


const GalleryImagePreview = ({ imageKey, alt }: { imageKey: string, alt: string | undefined }) => {
    if (!imageKey) return null;
    return <AsyncImage imageKey={imageKey} alt={alt || "תמונת גלריה"} width={200} height={200} className="rounded-md object-cover aspect-square" />;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export default function GalleryManager() {
  const { state, dispatch } = useApp();
  const { gallery } = state;

  const form = useForm<z.infer<typeof gallerySchema>>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { src: '', alt: '' },
  });
  
  const imagePreviewKey = form.watch('src');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
          const dataUrl = await fileToDataUrl(file);
          const imageKey = await storeImage(dataUrl);
          form.setValue('src', imageKey, { shouldValidate: true });
      } catch (error: any) {
          console.error("Error uploading image:", error);
          toast({ 
              title: 'שגיאה בהעלאת תמונה', 
              description: error.message || 'An unknown error occurred.',
              variant: 'destructive' 
          });
      }
  };


  const onSubmit = (values: z.infer<typeof gallerySchema>) => {
    dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { ...values, id: Date.now().toString() } });
    toast({ title: 'תמונה נוספה לגלריה!' });
    form.reset();
  };

  const deleteImage = (id: string) => {
    // TODO: also delete from image-store
    dispatch({ type: 'DELETE_GALLERY_IMAGE', payload: id });
    toast({ title: 'התמונה נמחקה מהגלריה.' });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>תמונות בגלריה</CardTitle>
            <CardDescription>נהל את התמונות המוצגות בעמוד הגלריה.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((image: GalleryImage) => (
                <div key={image.id} className="relative group">
                  <GalleryImagePreview imageKey={image.src} alt={image.alt} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle><AlertDialogDescription>פעולה זו תמחק את התמונה לצמיתות.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteImage(image.id)}>מחק</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>הוספת תמונה חדשה</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="src"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>קובץ תמונה</FormLabel>
                      <FormControl>
                        <Input 
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                      </FormControl>
                      <FormMessage />
                      {imagePreviewKey && <GalleryImagePreview imageKey={imagePreviewKey} alt="Preview" />}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תיאור תמונה (אופציונלי)</FormLabel>
                      <FormControl><Input placeholder="תיאור קצר של התמונה" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">הוסף תמונה</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
