
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';


const gallerySchema = z.object({
  src: z.string().url('חובה להזין כתובת URL חוקית').min(1, 'חובה להזין כתובת URL'),
  alt: z.string().min(1, 'תיאור הוא שדה חובה'),
});


const GalleryImagePreview = ({ src, alt }: { src: string, alt: string }) => {
    if (!src) return null;
    return <Image src={src} alt={alt} width={200} height={200} className="rounded-md object-cover aspect-square" />;
}


export default function GalleryManager() {
  const { state, dispatch } = useApp();
  const { gallery } = state;

  const form = useForm<z.infer<typeof gallerySchema>>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { src: '', alt: '' },
  });
  
  const imagePreviewSrc = form.watch('src');

  const onSubmit = (values: z.infer<typeof gallerySchema>) => {
    dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { ...values, id: Date.now().toString() } });
    toast({ title: 'תמונה נוספה לגלריה!' });
    form.reset();
  };

  const deleteImage = (id: string) => {
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
                  <GalleryImagePreview src={image.src} alt={image.alt} />
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
                      <FormLabel>כתובת URL של התמונה</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="https://example.com/image.png"
                            {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {imagePreviewSrc && <GalleryImagePreview src={imagePreviewSrc} alt="Preview" />}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תיאור תמונה (טקסט חלופי)</FormLabel>
                      <FormControl><Input placeholder="תיאור קצר של התמונה" {...field} /></FormControl>
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
