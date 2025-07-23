
'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApp } from '@/context/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PlusCircle, Edit, Trash2, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Dish, Category } from '@/lib/types'
import { storeImage, getImage, deleteImage as deleteImageFromStore, getImageSync } from '@/lib/image-store'
import Image from 'next/image';

const slugify = (text: string) => text.toLowerCase().replace(/[\s\W-]+/g, '-')

const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const dishSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'שם המנה הוא שדה חובה'),
  shortDescription: z.string().min(1, 'תיאור קצר הוא שדה חובה'),
  fullDescription: z.string().min(1, 'תיאור מלא הוא שדה חובה'),
  price: z.coerce.number().min(0, 'המחיר חייב להיות חיובי'),
  mainImage: z.string().min(1, "חובה להעלות תמונה ראשית"),
  galleryImages: z.array(z.string()),
  categoryId: z.string().min(1, 'חובה לבחור קטגוריה'),
  isAvailable: z.boolean(),
  isRecommended: z.boolean().optional(),
  tags: z.array(z.string()),
})

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'שם הקטגוריה הוא שדה חובה'),
  description: z.string().min(1, 'תיאור הוא שדה חובה'),
  image: z.string().min(1, 'חובה להעלות תמונה'),
})


const ImagePreview = ({ imageKey, alt }: { imageKey: string, alt: string }) => {
    const [src, setSrc] = useState(() => getImageSync(imageKey) || 'https://placehold.co/96x96');

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            if (imageKey) {
                const imageSrc = await getImage(imageKey);
                if (isMounted && imageSrc) {
                    setSrc(imageSrc);
                }
            }
        };
        if (!src.startsWith('data:image')) {
            fetchImage();
        }
        return () => { isMounted = false; };
    }, [imageKey, src]);

    if (!src) return <div className="h-24 w-24 rounded-md bg-muted animate-pulse" />;
    return <Image src={src} alt={alt} width={96} height={96} className="h-24 w-24 rounded-md object-cover" />;
};


export default function MenuManager() {
  const { state, dispatch } = useApp()
  const { dishes, categories } = state
  const [isDishDialogOpen, setIsDishDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const dishForm = useForm<z.infer<typeof dishSchema>>({ 
    resolver: zodResolver(dishSchema),
    defaultValues: {
        name: '', shortDescription: '', fullDescription: '', price: 0, categoryId: '',
        isAvailable: true, isRecommended: false, tags: [], mainImage: '', galleryImages: []
    }
  })
  const categoryForm = useForm<z.infer<typeof categorySchema>>({ resolver: zodResolver(categorySchema) })

  useEffect(() => {
    if (isDishDialogOpen) {
      if (editingDish) {
        dishForm.reset({
          ...editingDish,
          price: editingDish.price || 0,
          galleryImages: editingDish.galleryImages || []
        });
      } else {
        dishForm.reset({
          name: '', shortDescription: '', fullDescription: '', price: 0, categoryId: '',
          isAvailable: true, isRecommended: false, tags: [], mainImage: '', galleryImages: []
        });
      }
    }
  }, [isDishDialogOpen, editingDish, dishForm]);
  
  const openDishDialog = (dish: Dish | null = null) => {
    setEditingDish(dish)
    setIsDishDialogOpen(true)
  }

  const openCategoryDialog = (category: Category | null = null) => {
    setEditingCategory(category)
    categoryForm.reset(category || { name: '', description: '', image: '' })
    setIsCategoryDialogOpen(true)
  }

  const handleDishSubmit = (values: z.infer<typeof dishSchema>) => {
    if (editingDish) {
      dispatch({ type: 'UPDATE_DISH', payload: { ...editingDish, ...values } })
      toast({ title: 'מנה עודכנה בהצלחה' })
    } else {
      dispatch({ type: 'ADD_DISH', payload: { ...values, id: Date.now().toString() } })
      toast({ title: 'מנה נוספה בהצלחה' })
    }
    setIsDishDialogOpen(false)
    setEditingDish(null);
  }

  const handleCategorySubmit = (values: z.infer<typeof categorySchema>) => {
    if (editingCategory) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: { ...editingCategory, ...values } })
      toast({ title: 'קטגוריה עודכנה בהצלחה' })
    } else {
      const newCategory = { ...values, id: Date.now().toString(), slug: slugify(values.name) }
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory })
      toast({ title: 'קטגוריה נוספה בהצלחה' })
    }
    setIsCategoryDialogOpen(false)
  }

  const deleteDish = (id: string) => {
    const dishToDelete = dishes.find(d => d.id === id);
    if (dishToDelete) {
        if(dishToDelete.mainImage) deleteImageFromStore(dishToDelete.mainImage);
        dishToDelete.galleryImages?.forEach(key => deleteImageFromStore(key));
    }
    dispatch({ type: 'DELETE_DISH', payload: id })
    toast({ title: 'מנה נמחקה' })
  }

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (categoryToDelete && categoryToDelete.image) {
        deleteImageFromStore(categoryToDelete.image);
    }
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
    toast({ title: 'קטגוריה נמחקה' })
  }

  const handleDishImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        const imageKey = await storeImage(dataUrl);
        dishForm.setValue('mainImage', imageKey, { shouldValidate: true });
      } catch (error) {
        console.error("Error reading file:", error);
        toast({ title: "שגיאה בקריאת הקובץ", variant: "destructive" });
      }
    }
  };
  
   const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const currentImages = dishForm.getValues('galleryImages') || [];
            try {
                const dataUrls = await Promise.all(Array.from(files).map(file => readFileAsDataURL(file)));
                const imageKeys = await Promise.all(dataUrls.map(url => storeImage(url)));
                dishForm.setValue('galleryImages', [...currentImages, ...imageKeys], { shouldValidate: true });
            } catch (error) {
                console.error("Error reading files:", error);
                toast({ title: "שגיאה בקריאת הקבצים", variant: "destructive" });
            }
        }
    };
    
    const removeGalleryImage = (index: number) => {
        const currentImages = dishForm.getValues('galleryImages') || [];
        const imageKeyToRemove = currentImages[index];
        deleteImageFromStore(imageKeyToRemove);
        const newImages = [...currentImages];
        newImages.splice(index, 1);
        dishForm.setValue('galleryImages', newImages, { shouldValidate: true });
    };

    const handleCategoryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const dataUrl = await readFileAsDataURL(file);
          const imageKey = await storeImage(dataUrl);
          categoryForm.setValue('image', imageKey, { shouldValidate: true });
        } catch (error) {
          console.error("Error reading file:", error);
          toast({ title: "שגיאה בקריאת הקובץ", variant: "destructive" });
        }
      }
    };

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
                    <FormField name="price" control={dishForm.control} render={({ field }) => (
                       <FormItem>
                        <FormLabel>מחיר (₪)</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField name="mainImage" control={dishForm.control} render={({ field }) => (
                       <FormItem>
                        <FormLabel>תמונה ראשית</FormLabel>
                         <FormControl><Input type="file" accept="image/*" onChange={handleDishImageChange} /></FormControl>
                        <FormMessage />
                        {field.value && <ImagePreview imageKey={field.value} alt="תמונה ראשית" />}
                       </FormItem>
                    )} />
                    <FormField name="galleryImages" control={dishForm.control} render={() => (
                      <FormItem>
                        <FormLabel>תמונות נוספות (גלריה)</FormLabel>
                        <FormControl><Input type="file" accept="image/*" multiple onChange={handleMultiFileChange} /></FormControl>
                        <FormMessage />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {dishForm.watch('galleryImages')?.map((imgKey, i) => (
                                <div key={imgKey} className="relative group">
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
                    )} />
                    <FormField name="categoryId" control={dishForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>קטגוריה</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="tags" control={dishForm.control} render={() => (
                      <FormItem>
                        <FormLabel>תגים</FormLabel>
                        <div className="flex gap-4">
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
                <TableHead>קטגוריה</TableHead>
                <TableHead>מחיר</TableHead>
                <TableHead>זמינות</TableHead>
                <TableHead>מומלצת</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.map(dish => (
                <TableRow key={dish.id}>
                  <TableCell>{dish.name}</TableCell>
                  <TableCell>{categories.find(c => c.id === dish.categoryId)?.name}</TableCell>
                  <TableCell>{dish.price} ₪</TableCell>
                  <TableCell>{dish.isAvailable ? 'כן' : 'לא'}</TableCell>
                  <TableCell>{dish.isRecommended ? 'כן' : 'לא'}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
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
              <DialogContent>
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
                    <FormField name="image" control={categoryForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>תמונת באנר</FormLabel>
                         <FormControl><Input type="file" accept="image/*" onChange={handleCategoryImageChange} /></FormControl>
                        <FormMessage />
                         {field.value && <ImagePreview imageKey={field.value} alt="תמונת קטגוריה" />}
                      </FormItem>
                    )} />
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
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-left">
                     <div className="flex gap-2">
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
