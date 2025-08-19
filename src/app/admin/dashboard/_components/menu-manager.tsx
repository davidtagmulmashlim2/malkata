

'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApp } from '@/context/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { PlusCircle, Edit, Trash2, X, ChevronsUpDown, Check, Eye, CakeSlice, Salad, Fish, Soup, Beef, GlassWater, Wheat, Carrot, Utensils, Crown, UtensilsCrossed, Pizza } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Dish, Category } from '@/lib/types'
import { storeImage, deleteImage } from '@/lib/image-store.client';
import { AsyncImage } from '@/components/async-image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

const slugify = (text: string): string => {
  if (!text) return '';

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrssssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  let slug = text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

  if (slug === '') {
    return `category-${Date.now()}`;
  }

  return slug;
}

const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
const fontSizesWithDefault = [{ name: 'ברירת מחדל', value: 'default' }, ...fontSizes.map(s => ({ name: s, value: s }))];
const fonts = [
    { name: 'ברירת מחדל של האתר', value: 'default' },
    { name: 'Playfair Display', value: 'playfair' },
    { name: 'Open Sans', value: 'open-sans' },
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
];

const mobileCategoryIcons = [
    { name: 'כתר', value: 'icon-Crown', icon: Crown },
    { name: 'סכו״ם מוצלב', value: 'icon-UtensilsCrossed', icon: UtensilsCrossed },
    { name: 'סכו״ם', value: 'icon-Utensils', icon: Utensils },
    { name: 'פיצה', value: 'icon-Pizza', icon: Pizza },
    { name: 'עוגה', value: 'icon-CakeSlice', icon: CakeSlice },
    { name: 'סלט', value: 'icon-Salad', icon: Salad },
    { name: 'דג', value: 'icon-Fish', icon: Fish },
    { name: 'מרק', value: 'icon-Soup', icon: Soup },
    { name: 'בשר', value: 'icon-Beef', icon: Beef },
    { name: 'שתיה', value: 'icon-GlassWater', icon: GlassWater },
    { name: 'חיטה', value: 'icon-Wheat', icon: Wheat },
    { name: 'גזר', value: 'icon-Carrot', icon: Carrot },
];


const dishSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'שם המנה הוא שדה חובה'),
  short_description: z.string().min(1, 'תיאור קצר הוא שדה חובה'),
  full_description: z.string().min(1, 'תיאור מלא הוא שדה חובה'),
  price: z.coerce.number().min(0, 'המחיר חייב להיות חיובי'),
  price_subtitle: z.string().optional(),
  main_image: z.string().min(1, "חובה להעלות תמונה ראשית"),
  gallery_images: z.array(z.string()).optional(),
  category_ids: z.array(z.string().uuid()).min(1, 'חובה לבחור לפחות קטגוריה אחת'),
  is_available: z.boolean(),
  is_recommended: z.boolean().optional(),
  tags: z.array(z.string()),
  // These are not real DB columns anymore, just for form state
  name_font_size: z.string().optional(),
  description_font_size: z.string().optional(),
})

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'שם הקטגוריה הוא שדה חובה'),
  description: z.string().min(1, 'תיאור הוא שדה חובה'),
  image: z.string().min(1, 'חובה להעלות תמונת באנר'),
  slug: z.string().optional(), // Slug is generated, so optional in form
  title_color: z.string().optional(),
  title_font_size: z.string().optional(),
  title_font: z.string().optional(),
  title_opacity: z.number().min(0).max(1).optional(),
  image_brightness: z.coerce.number().min(0).max(100).optional(),
  show_description: z.boolean().optional(),
  show_description_below_banner: z.boolean().optional(),
})

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ImagePreview = ({ imageKey, alt, onRemove }: { imageKey?: string | null, alt: string, onRemove?: () => void }) => {
    if (!imageKey) return null;
    return (
        <div className="mt-2 relative w-fit">
            <AsyncImage imageKey={imageKey} alt={alt} width={96} height={96} className="h-24 w-24 rounded-md object-cover" />
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


export default function MenuManager() {
  const { state, dispatch } = useApp()
  const { dishes, categories } = state
  const [isDishDialogOpen, setIsDishDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const dishForm = useForm<z.infer<typeof dishSchema>>({ 
    resolver: zodResolver(dishSchema),
    defaultValues: {
        name: '', short_description: '', full_description: '', price: 0, category_ids: [],
        is_available: true, is_recommended: false, tags: [], main_image: '', gallery_images: [],
        price_subtitle: '', name_font_size: 'default', description_font_size: 'default',
    }
  })
  const categoryForm = useForm<z.infer<typeof categorySchema>>({ 
      resolver: zodResolver(categorySchema),
      defaultValues: { 
          name: '', description: '', image: '',
          title_color: '#FFFFFF', title_font_size: '5xl', title_font: 'default', 
          title_opacity: 1, 
          image_brightness: 50, show_description: true, show_description_below_banner: false,
      } 
    })

  useEffect(() => {
    if (!isDishDialogOpen) {
        setEditingDish(null);
        dishForm.reset({
            name: '', short_description: '', full_description: '', price: 0, category_ids: [],
            is_available: true, is_recommended: false, tags: [], main_image: '', gallery_images: [],
            price_subtitle: '', name_font_size: 'default', description_font_size: 'default',
        });
    } else if (editingDish) {
        const tags = editingDish.tags || [];
        const nameSizeTag = tags.find(t => t.startsWith('n-fs-'))
        const descSizeTag = tags.find(t => t.startsWith('d-fs-'))

        dishForm.reset({
          ...editingDish,
          category_ids: editingDish.category_ids || [],
          price: editingDish.price || 0,
          price_subtitle: editingDish.price_subtitle || '',
          tags: tags,
          gallery_images: editingDish.gallery_images || [],
          name_font_size: nameSizeTag ? nameSizeTag.replace('n-fs-', '') : 'default',
          description_font_size: descSizeTag ? descSizeTag.replace('d-fs-', '') : 'default',
        });
    }
  }, [isDishDialogOpen, editingDish, dishForm]);

  useEffect(() => {
    if (!isCategoryDialogOpen) {
        setEditingCategory(null);
        categoryForm.reset({ 
            name: '', description: '', image: '',
            title_color: '#FFFFFF', title_font_size: '5xl', title_font: 'default',
            title_opacity: 1,
            image_brightness: 50, show_description: true,
            show_description_below_banner: false,
        });
    } else if (editingCategory) {
        categoryForm.reset({
            ...editingCategory,
            title_color: editingCategory.title_color ?? '#FFFFFF',
            title_font_size: editingCategory.title_font_size ?? '5xl',
            title_font: editingCategory.title_font || 'default',
            title_opacity: editingCategory.title_opacity ?? 1,
            image_brightness: editingCategory.image_brightness ?? 50,
            show_description: editingCategory.show_description ?? true,
            show_description_below_banner: editingCategory.show_description_below_banner ?? false,
        });
    }
  }, [isCategoryDialogOpen, editingCategory, categoryForm]);
  
  const openDishDialog = (dish: Dish | null = null) => {
    setEditingDish(dish)
    setIsDishDialogOpen(true)
  }

  const openCategoryDialog = (category: Category | null = null) => {
    setEditingCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDishSubmit = (values: z.infer<typeof dishSchema>) => {
    const { name_font_size, description_font_size, ...dishData } = values;

    // Filter out old font size tags
    let newTags = (dishData.tags || []).filter(tag => !tag.startsWith('n-fs-') && !tag.startsWith('d-fs-'));

    // Add new font size tags if not default
    if (name_font_size && name_font_size !== 'default') {
        newTags.push(`n-fs-${name_font_size}`);
    }
    if (description_font_size && description_font_size !== 'default') {
        newTags.push(`d-fs-${description_font_size}`);
    }
    
    const finalDishData = { ...dishData, tags: newTags };

    if (editingDish) {
      dispatch({ type: 'UPDATE_DISH', payload: { ...finalDishData, id: editingDish.id } as Dish })
      toast({ title: 'מנה עודכנה בהצלחה' })
    } else {
      dispatch({ type: 'ADD_DISH', payload: finalDishData as Dish })
      toast({ title: 'מנה נוספה בהצלחה' })
    }
    setIsDishDialogOpen(false)
  }

  const handleCategorySubmit = (values: z.infer<typeof categorySchema>) => {
    const finalCategoryPayload = {
      ...values,
      slug: slugify(values.name),
    };
    
    if (editingCategory) {
      const updatedCategory = { ...finalCategoryPayload, id: editingCategory.id };
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory as Category });
      toast({ title: 'קטגוריה עודכנה בהצלחה' })
    } else {
      dispatch({ type: 'ADD_CATEGORY', payload: finalCategoryPayload as Category });
      toast({ title: 'קטגוריה נוספה בהצלחה' })
    }
    setIsCategoryDialogOpen(false)
  }
  
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    form: typeof dishForm | typeof categoryForm,
    fieldName: 'main_image' | 'image'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const oldImageKey = form.getValues(fieldName as any);

    try {
        const dataUrl = await fileToDataUrl(file);
        const newImageKey = await storeImage(dataUrl);
        form.setValue(fieldName as any, newImageKey, { shouldValidate: true });

        if (oldImageKey) {
            await deleteImage(oldImageKey);
        }
    } catch (error: any) {
        console.error("Error handling file change:", error);
        toast({
            title: 'שגיאה בהעלאת תמונה',
            description: error.message || 'An unknown error occurred.',
            variant: 'destructive'
        });
    }
  };

  const deleteDish = (id: string) => {
    dispatch({ type: 'DELETE_DISH', payload: id })
    toast({ title: 'מנה נמחקה' })
  }

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
    toast({ title: 'קטגוריה נמחקה' })
  }

  const handleAddGalleryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const dataUrl = await fileToDataUrl(file);
        const imageKey = await storeImage(dataUrl);
        const currentImages = dishForm.getValues('gallery_images') || [];
        dishForm.setValue('gallery_images', [...currentImages, imageKey], { shouldValidate: true });
        toast({title: "תמונה נוספה לגלריה"});
    } catch (error: any) {
        toast({
            title: "שגיאה בהעלאת תמונת גלריה",
            description: error.message || 'An unknown error occurred.',
            variant: "destructive"
        });
    } finally {
        if (galleryImageInputRef.current) {
            galleryImageInputRef.current.value = '';
        }
    }
  };

    const removeGalleryImage = async (index: number) => {
        const currentImages = dishForm.getValues('gallery_images') || [];
        const imageToRemove = currentImages[index];

        const newImages = [...currentImages];
        newImages.splice(index, 1);
        dishForm.setValue('gallery_images', newImages, { shouldValidate: true });
        
        // This relies on the parent form being submitted to persist the change.
        // The image file is deleted optimistically.
        if (imageToRemove) {
            await deleteImage(imageToRemove);
            toast({ title: 'תמונת גלריה הוסרה' });
        }
    };

    
  const dishMainImageValue = dishForm.watch('main_image');
  const dishGalleryImagesValue = dishForm.watch('gallery_images');
  const categoryImageValue = categoryForm.watch('image');

  const { fields, append, remove } = useFieldArray({
      control: dishForm.control,
      name: "category_ids",
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ניהול מנות</CardTitle>
              <CardDescription>הוסף, ערוך ומחק מנות מהתפריט.</CardDescription>
            </div>
            <Dialog open={isDishDialogOpen} onOpenChange={setIsDishDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDishDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> הוסף מנה
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingDish ? 'עריכת מנה' : 'הוספת מנה חדשה'}</DialogTitle>
                </DialogHeader>
                <Form {...dishForm}>
                  <form onSubmit={dishForm.handleSubmit(handleDishSubmit)} className="space-y-4">
                    <FormField name="name" control={dishForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם המנה</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="short_description" control={dishForm.control} render={({ field }) => (
                       <FormItem>
                        <FormLabel>תיאור קצר</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="full_description" control={dishForm.control} render={({ field }) => (
                       <FormItem>
                        <FormLabel>תיאור מלא</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="price" control={dishForm.control} render={({ field }) => (
                           <FormItem>
                            <FormLabel>מחיר (₪)</FormLabel>
                            <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField name="price_subtitle" control={dishForm.control} render={({ field }) => (
                           <FormItem>
                            <FormLabel>כתובית מחיר (אופציונלי)</FormLabel>
                            <FormControl><Input {...field} placeholder="לדוגמה: למנה" value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                    </div>
                     <FormField
                        name="main_image"
                        control={dishForm.control}
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>תמונה ראשית</FormLabel>
                             <FormControl>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, dishForm, 'main_image')}
                                />
                             </FormControl>
                             <FormMessage />
                             {dishMainImageValue && <ImagePreview imageKey={dishMainImageValue} alt="תמונה ראשית" />}
                           </FormItem>
                        )}
                     />

                    <FormItem>
                        <FormLabel>תמונות נוספות (גלריה)</FormLabel>
                        <FormControl>
                            <Input 
                                type="file"
                                accept="image/*"
                                onChange={handleAddGalleryImage}
                                ref={galleryImageInputRef}
                            />
                        </FormControl>
                        <FormMessage />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {dishGalleryImagesValue?.map((imgKey, i) => (
                                <div key={i} className="relative group">
                                    <ImagePreview imageKey={imgKey} alt={`תמונת גלריה ${i + 1}`} />
                                    <Button 
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-0 right-0 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeGalleryImage(i)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </FormItem>
                     <FormField
                        control={dishForm.control}
                        name="category_ids"
                        render={() => (
                            <FormItem>
                                <FormLabel>קטגוריות</FormLabel>
                                 <ScrollArea className="h-40 w-full rounded-md border">
                                    <div className="p-4 space-y-2">
                                        {categories.map((category) => (
                                            <FormField
                                                key={category.id}
                                                control={dishForm.control}
                                                name="category_ids"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(category.id!)}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValue = field.value ? [...field.value] : [];
                                                                        if (checked) {
                                                                            if (!newValue.includes(category.id!)) {
                                                                                newValue.push(category.id!);
                                                                            }
                                                                        } else {
                                                                            const index = newValue.indexOf(category.id!);
                                                                            if (index > -1) {
                                                                                newValue.splice(index, 1);
                                                                            }
                                                                        }
                                                                        field.onChange(newValue);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {category.name}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                                <FormMessage className="pt-2" />
                            </FormItem>
                        )}
                     />

                    <FormField name="tags" control={dishForm.control} render={() => (
                      <FormItem>
                        <FormLabel>תגים</FormLabel>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                           <FormField control={dishForm.control} name="tags" render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                      <Checkbox 
                                          checked={field.value?.includes('new')}
                                          onCheckedChange={(checked) => {
                                              const currentTags = field.value?.filter(t => t !== 'new') || [];
                                              return checked
                                                  ? field.onChange([...currentTags, 'new'])
                                                  : field.onChange(currentTags)
                                          }}
                                      />
                                  </FormControl>
                                  <FormLabel>מנה חדשה</FormLabel>
                              </FormItem>
                          )} />
                          <FormField control={dishForm.control} name="tags" render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                      <Checkbox 
                                          checked={field.value?.includes('vegan')}
                                          onCheckedChange={(checked) => {
                                              const currentTags = field.value?.filter(t => t !== 'vegan') || [];
                                              return checked
                                                  ? field.onChange([...currentTags, 'vegan'])
                                                  : field.onChange(currentTags)
                                          }}
                                      />
                                  </FormControl>
                                  <FormLabel>טבעוני</FormLabel>
                              </FormItem>
                          )} />
                          <FormField control={dishForm.control} name="tags" render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                      <Checkbox
                                          checked={field.value?.includes('spicy')}
                                          onCheckedChange={(checked) => {
                                             const currentTags = field.value?.filter(t => t !== 'spicy') || [];
                                              return checked
                                                  ? field.onChange([...currentTags, 'spicy'])
                                                  : field.onChange(currentTags)
                                          }}
                                      />
                                  </FormControl>
                                  <FormLabel>חריף</FormLabel>
                              </FormItem>
                          )} />
                           <FormField control={dishForm.control} name="tags" render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                      <Checkbox
                                          checked={field.value?.includes('piquant')}
                                          onCheckedChange={(checked) => {
                                              const currentTags = field.value?.filter(t => t !== 'piquant') || [];
                                              return checked
                                                  ? field.onChange([...currentTags, 'piquant'])
                                                  : field.onChange(currentTags)
                                          }}
                                      />
                                  </FormControl>
                                  <FormLabel>פיקנטי</FormLabel>
                              </FormItem>
                          )} />
                           <FormField control={dishForm.control} name="tags" render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                      <Checkbox
                                          checked={field.value?.includes('kids-favorite')}
                                          onCheckedChange={(checked) => {
                                             const currentTags = field.value?.filter(t => t !== 'kids-favorite') || [];
                                              return checked
                                                  ? field.onChange([...currentTags, 'kids-favorite'])
                                                  : field.onChange(currentTags)
                                          }}
                                      />
                                  </FormControl>
                                  <FormLabel>ילדים אוהבים</FormLabel>
                              </FormItem>
                          )} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <div className="border p-4 rounded-md space-y-4">
                        <h3 className="text-lg font-medium">הגדרות עיצוב מנה</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField name="name_font_size" control={dishForm.control} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>גודל גופן (שם המנה)</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value ?? 'default'}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>{fontSizesWithDefault.map(s => <SelectItem key={s.value} value={s.value}>{s.name}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField name="description_font_size" control={dishForm.control} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>גודל גופן (תיאור)</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value ?? 'default'}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>{fontSizesWithDefault.map(s => <SelectItem key={s.value} value={s.value}>{s.name}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                          </div>
                    </div>
                    <div className="flex justify-between">
                      <FormField name="is_available" control={dishForm.control} render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel>זמין במלאי</FormLabel>
                        </FormItem>
                      )} />
                      <FormField name="is_recommended" control={dishForm.control} render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel>מנה מומלצת</FormLabel>
                        </FormItem>
                      )} />
                    </div>
                    <DialogFooter>
                      <Button type="submit">שמור</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>קטגוריות</TableHead>
                <TableHead>מחיר</TableHead>
                <TableHead>זמינות</TableHead>
                <TableHead>מומלצת</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.map(dish => (
                <TableRow key={dish.id}>
                  <TableCell>{dish.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(dish.category_ids || []).map(catId => categories.find(c => c.id === catId)?.name).filter(Boolean).map(name => (
                        <Badge key={name} variant="outline">{name}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{dish.price} ₪</TableCell>
                  <TableCell>{dish.is_available ? 'כן' : 'לא'}</TableCell>
                  <TableCell>{dish.is_recommended ? 'כן' : 'לא'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openDishDialog(dish)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle><AlertDialogDescription>פעולה זו תמחק את המנה לצמיתות.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ביטול</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteDish(dish.id!)}>מחק</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ניהול קטגוריות</CardTitle>
              <CardDescription>הוסף, ערוך ומחק קטגוריות בתפריט.</CardDescription>
            </div>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openCategoryDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> הוסף קטגוריה
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCategory ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}</DialogTitle>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
                    <FormField name="name" control={categoryForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם הקטגוריה</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormItem>
                        <FormLabel>טקסט לקישור מהגלריה</FormLabel>
                        <FormControl>
                            <Input 
                                readOnly 
                                value={`grid:${editingCategory ? editingCategory.slug : slugify(categoryForm.watch('name'))}`} 
                                className="text-muted-foreground"
                            />
                        </FormControl>
                        <FormDescription>
                           העתק את הטקסט המלא והדבק אותו בשדה "תיאור תמונה" בגלריה כדי לקשר אותה לקטגוריה זו.
                        </FormDescription>
                    </FormItem>
                    <FormField name="description" control={categoryForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>תיאור</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField
                        name="image"
                        control={categoryForm.control}
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>תמונת באנר (חובה)</FormLabel>
                              <p className="text-xs text-muted-foreground pb-2">תמונה זו תשמש גם לבאנר בעמוד הקטגוריה וגם לתצוגה הריבועית בעמוד הבית.</p>
                             <FormControl>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, categoryForm, 'image')}
                                />
                             </FormControl>
                             <FormMessage />
                             {categoryImageValue && <ImagePreview imageKey={categoryImageValue} alt="תמונת קטגוריה" />}
                           </FormItem>
                        )}
                     />

                    <div className="border p-4 rounded-md space-y-4">
                        <h3 className="text-lg font-medium">הגדרות עיצוב באנר ונייד</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField name="title_color" control={categoryForm.control} render={({ field }) => (
                              <FormItem>
                                <FormLabel>צבע כותרת</FormLabel>
                                <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                           <FormField name="title_font_size" control={categoryForm.control} render={({ field }) => (
                              <FormItem>
                                <FormLabel>גודל כותרת</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                  <SelectContent>{fontSizes.map(s => <SelectItem key={s} value={s}>text-{s}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                        </div>
                        <FormField name="title_font" control={categoryForm.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>פונט (דסקטופ) / אייקון (מובייל)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? 'default'}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="בחר פונט או אייקון" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>פונטים</SelectLabel>
                                            {fonts.map(font => <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>)}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>אייקונים (למובייל)</SelectLabel>
                                            {mobileCategoryIcons.map(icon => (
                                                <SelectItem key={icon.value} value={icon.value}>
                                                    <div className="flex items-center gap-2">
                                                        <icon.icon className="h-4 w-4" />
                                                        <span>{icon.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="title_opacity" control={categoryForm.control} render={({ field }) => (
                            <FormItem>
                              <FormLabel>שקיפות כותרת ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                              <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        <FormField name="image_brightness" control={categoryForm.control} render={({ field }) => (
                            <FormItem>
                              <FormLabel>בהירות תמונת רקע ({field.value ?? 100}%)</FormLabel>
                              <FormControl><Slider value={[field.value ?? 100]} min={0} max={100} step={5} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="show_description" control={categoryForm.control} render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0 pt-2">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              <FormLabel>הצג תיאור על גבי הבאנר</FormLabel>
                            </FormItem>
                          )} />
                         <FormField name="show_description_below_banner" control={categoryForm.control} render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0 pt-2">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              <FormLabel>הצג תיאור מתחת לבאנר</FormLabel>
                            </FormItem>
                          )} />
                    </div>
                    <DialogFooter>
                      <Button type="submit">שמור</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>מזהה לקישור (Slug)</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{category.slug}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openCategoryDialog(category)}><Edit className="h-4 w-4" /></Button>
                         <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle><AlertDialogDescription>פעולה זו תמחק את הקטגוריה לצמיתות. כל המנות המשויכות יאבדו את שיוכן.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ביטול</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(category.id!)}>מחק</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

    