
'use client'
import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PlusCircle, Edit, Trash2, X, ChevronsUpDown, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Dish, Category } from '@/lib/types'
import { storeImage, deleteImage } from '@/lib/image-store';
import { AsyncImage } from '@/components/async-image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
const fonts = [
    { name: 'ברירת מחדל של האתר', value: 'default' },
    { name: 'Playfair Display', value: 'playfair' },
    { name: 'PT Sans', value: 'pt-sans' },
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

const dishSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'שם המנה הוא שדה חובה'),
  shortDescription: z.string().min(1, 'תיאור קצר הוא שדה חובה'),
  fullDescription: z.string().min(1, 'תיאור מלא הוא שדה חובה'),
  price: z.coerce.number().min(0, 'המחיר חייב להיות חיובי'),
  priceSubtitle: z.string().optional(),
  mainImage: z.string().min(1, "חובה להעלות תמונה ראשית"),
  galleryImages: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).min(1, 'חובה לבחור לפחות קטגוריה אחת'),
  isAvailable: z.boolean(),
  isRecommended: z.boolean().optional(),
  tags: z.array(z.string()),
})

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'שם הקטגוריה הוא שדה חובה'),
  description: z.string().min(1, 'תיאור הוא שדה חובה'),
  image: z.string().min(1, 'חובה להעלות תמונה'),
  slug: z.string().optional(), // Slug is generated, so optional in form
  titleColor: z.string().optional(),
  titleFontSize: z.string().optional(),
  titleFont: z.string().optional(),
  titleOpacity: z.number().min(0).max(1).optional(),
  imageBrightness: z.coerce.number().min(0).max(100).optional(),
  showDescription: z.boolean().optional(),
})

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ImagePreview = ({ imageKey, alt }: { imageKey: string, alt: string }) => {
    if (!imageKey) return null;
    return <AsyncImage imageKey={imageKey} alt={alt} width={96} height={96} className="h-24 w-24 rounded-md object-cover" />;
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
        name: '', shortDescription: '', fullDescription: '', price: 0, categoryIds: [],
        isAvailable: true, isRecommended: false, tags: [], mainImage: '', galleryImages: [],
        priceSubtitle: '',
    }
  })
  const categoryForm = useForm<z.infer<typeof categorySchema>>({ 
      resolver: zodResolver(categorySchema),
      defaultValues: { 
          name: '', description: '', image: '',
          titleColor: '#FFFFFF', titleFontSize: '5xl', titleFont: 'default', titleOpacity: 1, 
          imageBrightness: 50, showDescription: true
      } 
    })

  useEffect(() => {
    if (!isDishDialogOpen) {
        setEditingDish(null);
        dishForm.reset({
            name: '', shortDescription: '', fullDescription: '', price: 0, categoryIds: [],
            isAvailable: true, isRecommended: false, tags: [], mainImage: '', galleryImages: [],
            priceSubtitle: '',
        });
    } else if (editingDish) {
        dishForm.reset({
          ...editingDish,
          categoryIds: editingDish.categoryIds || [],
          price: editingDish.price || 0,
          tags: editingDish.tags || [],
          galleryImages: editingDish.galleryImages || [],
          priceSubtitle: editingDish.priceSubtitle || '',
        });
    }
  }, [isDishDialogOpen, editingDish, dishForm]);

  useEffect(() => {
    if (!isCategoryDialogOpen) {
        setEditingCategory(null);
        categoryForm.reset({ 
            name: '', description: '', image: '',
            titleColor: '#FFFFFF', titleFontSize: '5xl', titleFont: 'default', titleOpacity: 1,
            imageBrightness: 50, showDescription: true,
        });
    } else if (editingCategory) {
        categoryForm.reset({
            ...editingCategory,
            titleColor: editingCategory.titleColor ?? '#FFFFFF',
            titleFontSize: editingCategory.titleFontSize ?? '5xl',
            titleFont: editingCategory.titleFont || 'default',
            titleOpacity: editingCategory.titleOpacity ?? 1,
            imageBrightness: editingCategory.imageBrightness ?? 50,
            showDescription: editingCategory.showDescription ?? true,
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
    if (editingDish) {
      dispatch({ type: 'UPDATE_DISH', payload: { ...values, id: editingDish.id } as Dish })
      toast({ title: 'מנה עודכנה בהצלחה' })
    } else {
      dispatch({ type: 'ADD_DISH', payload: { ...values, id: Date.now().toString() } })
      toast({ title: 'מנה נוספה בהצלחה' })
    }
    setIsDishDialogOpen(false)
  }

  const handleCategorySubmit = (values: z.infer<typeof categorySchema>) => {
    const categoryData = {
      ...values,
      slug: slugify(values.name),
      titleFont: values.titleFont === 'default' ? '' : values.titleFont
    };
    
    if (editingCategory) {
      const updatedCategory = { ...categoryData, id: editingCategory.id };
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory as Category });
      toast({ title: 'קטגוריה עודכנה בהצלחה' })
    } else {
      const newCategory = { ...categoryData, id: Date.now().toString() };
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory as Category });
      toast({ title: 'קטגוריה נוספה בהצלחה' })
    }
    setIsCategoryDialogOpen(false)
  }
  
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const dataUrl = await fileToDataUrl(file);
            const imageKey = await storeImage(dataUrl);
            onChange(imageKey);
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({ title: 'שגיאה בהעלאת תמונה', variant: 'destructive' });
        }
    };


  const deleteDish = (id: string) => {
    const dishToDelete = dishes.find(d => d.id === id);
    if(dishToDelete) {
        if (dishToDelete.mainImage) deleteImage(dishToDelete.mainImage);
        if (dishToDelete.galleryImages) {
            dishToDelete.galleryImages.forEach(imgKey => deleteImage(imgKey));
        }
    }
    dispatch({ type: 'DELETE_DISH', payload: id })
    dispatch({ type: 'REMOVE_ITEM_FROM_CART', payload: id });
    toast({ title: 'מנה נמחקה' })
  }

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if(categoryToDelete && categoryToDelete.image) {
        deleteImage(categoryToDelete.image);
    }
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
    toast({ title: 'קטגוריה נמחקה' })
  }

  const handleAddGalleryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const dataUrl = await fileToDataUrl(file);
        const imageKey = await storeImage(dataUrl);
        const currentImages = dishForm.getValues('galleryImages') || [];
        dishForm.setValue('galleryImages', [...currentImages, imageKey], { shouldValidate: true });
        toast({title: "תמונה נוספה לגלריה"});
    } catch (error) {
        toast({title: "שגיאה בהעלאת תמונת גלריה", variant: "destructive"});
    } finally {
        if (galleryImageInputRef.current) {
            galleryImageInputRef.current.value = '';
        }
    }
  };


  const removeGalleryImage = (index: number) => {
      const currentImages = dishForm.getValues('galleryImages') || [];
      const imageToRemove = currentImages[index];
      if (imageToRemove) {
          deleteImage(imageToRemove);
      }
      const newImages = [...currentImages];
      newImages.splice(index, 1);
      dishForm.setValue('galleryImages', newImages, { shouldValidate: true });
  };
    
  const dishMainImageValue = dishForm.watch('mainImage');
  const dishGalleryImagesValue = dishForm.watch('galleryImages');
  const categoryImageValue = categoryForm.watch('image');

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
                    <FormField name="shortDescription" control={dishForm.control} render={({ field }) => (
                       <FormItem>
                        <FormLabel>תיאור קצר</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="fullDescription" control={dishForm.control} render={({ field }) => (
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
                        <FormField name="priceSubtitle" control={dishForm.control} render={({ field }) => (
                           <FormItem>
                            <FormLabel>כתובית מחיר (אופציונלי)</FormLabel>
                            <FormControl><Input {...field} placeholder="לדוגמה: למנה" value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                    </div>
                     <FormField
                        name="mainImage"
                        control={dishForm.control}
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>תמונה ראשית</FormLabel>
                             <FormControl>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, field.onChange)}
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
                        name="categoryIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>קטגוריות</FormLabel>
                            <ScrollArea className="h-40 w-full rounded-md border p-4">
                              <div className="space-y-2">
                                {categories.map((category) => (
                                  <FormField
                                    key={category.id}
                                    control={dishForm.control}
                                    name="categoryIds"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={category.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(category.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), category.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== category.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {category.name}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            </ScrollArea>
                            <FormMessage />
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
                                              return checked
                                                  ? field.onChange([...(field.value || []), 'new'])
                                                  : field.onChange(field.value?.filter(v => v !== 'new'))
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
                                              return checked
                                                  ? field.onChange([...(field.value || []), 'vegan'])
                                                  : field.onChange(field.value?.filter(v => v !== 'vegan'))
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
                                              return checked
                                                  ? field.onChange([...(field.value || []), 'spicy'])
                                                  : field.onChange(field.value?.filter(v => v !== 'spicy'))
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
                                              return checked
                                                  ? field.onChange([...(field.value || []), 'piquant'])
                                                  : field.onChange(field.value?.filter(v => v !== 'piquant'))
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
                                              return checked
                                                  ? field.onChange([...(field.value || []), 'kids-favorite'])
                                                  : field.onChange(field.value?.filter(v => v !== 'kids-favorite'))
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
                    <div className="flex justify-between">
                      <FormField name="isAvailable" control={dishForm.control} render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel>זמין במלאי</FormLabel>
                        </FormItem>
                      )} />
                      <FormField name="isRecommended" control={dishForm.control} render={({ field }) => (
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
                      {(dish.categoryIds || []).map(catId => categories.find(c => c.id === catId)?.name).filter(Boolean).map(name => (
                        <Badge key={name} variant="outline">{name}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{dish.price} ₪</TableCell>
                  <TableCell>{dish.isAvailable ? 'כן' : 'לא'}</TableCell>
                  <TableCell>{dish.isRecommended ? 'כן' : 'לא'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openDishDialog(dish)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle><AlertDialogDescription>פעולה זו תמחק את המנה לצמיתות.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ביטול</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteDish(dish.id)}>מחק</AlertDialogAction>
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
                             <FormLabel>תמונת באנר</FormLabel>
                             <FormControl>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                />
                             </FormControl>
                             <FormMessage />
                             {categoryImageValue && <ImagePreview imageKey={categoryImageValue} alt="תמונת קטגוריה" />}
                           </FormItem>
                        )}
                     />
                    <div className="border p-4 rounded-md space-y-4">
                        <h3 className="text-lg font-medium">הגדרות עיצוב באנר</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField name="titleColor" control={categoryForm.control} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>צבע כותרת</FormLabel>
                                  <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" value={field.value ?? ''} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                             <FormField name="titleFontSize" control={categoryForm.control} render={({ field }) => (
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
                        <FormField name="titleFont" control={categoryForm.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>פונט כותרת</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="ברירת מחדל של האתר" /></SelectTrigger></FormControl>
                                    <SelectContent>{fonts.map(font => <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="titleOpacity" control={categoryForm.control} render={({ field }) => (
                            <FormItem>
                              <FormLabel>שקיפות כותרת ({Math.round((field.value ?? 1) * 100)}%)</FormLabel>
                              <FormControl><Slider value={[field.value ?? 1]} min={0} max={1} step={0.05} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        <FormField name="imageBrightness" control={categoryForm.control} render={({ field }) => (
                            <FormItem>
                              <FormLabel>בהירות תמונת רקע ({field.value ?? 100}%)</FormLabel>
                              <FormControl><Slider value={[field.value ?? 100]} min={0} max={100} step={5} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="showDescription" control={categoryForm.control} render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0 pt-2">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              <FormLabel>הצג תיאור מתחת לכותרת</FormLabel>
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
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                     <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openCategoryDialog(category)}><Edit className="h-4 w-4" /></Button>
                         <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle><AlertDialogDescription>פעולה זו תמחק את הקטגוריה לצמיתות. כל המנות המשויכות יאבדו את שיוכן.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ביטול</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(category.id)}>מחק</AlertDialogAction>
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

    

    
