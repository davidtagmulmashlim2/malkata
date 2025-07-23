
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApp } from '@/context/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Testimonial } from '@/lib/types'

const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'שם הוא שדה חובה'),
  quote: z.string().min(1, 'ציטוט הוא שדה חובה'),
})

export default function TestimonialsManager() {
  const { state, dispatch } = useApp()
  const { testimonials } = state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const form = useForm<z.infer<typeof testimonialSchema>>({ resolver: zodResolver(testimonialSchema) })

  const openDialog = (testimonial: Testimonial | null = null) => {
    setEditingTestimonial(testimonial)
    form.reset(testimonial || { name: '', quote: '' })
    setIsDialogOpen(true)
  }

  const handleSubmit = (values: z.infer<typeof testimonialSchema>) => {
    if (editingTestimonial) {
      dispatch({ type: 'UPDATE_TESTIMONIAL', payload: { ...editingTestimonial, ...values } })
      toast({ title: 'המלצה עודכנה בהצלחה' })
    } else {
      dispatch({ type: 'ADD_TESTIMONIAL', payload: { ...values, id: Date.now().toString() } })
      toast({ title: 'המלצה נוספה בהצלחה' })
    }
    setIsDialogOpen(false)
  }

  const deleteTestimonial = (id: string) => {
    dispatch({ type: 'DELETE_TESTIMONIAL', payload: id })
    toast({ title: 'המלצה נמחקה' })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>ניהול המלצות</CardTitle>
            <CardDescription>הוסף, ערוך ומחק המלצות לקוחות.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" /> הוסף המלצה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTestimonial ? 'עריכת המלצה' : 'הוספת המלצה חדשה'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם הממליצ/ה</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="quote" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>תוכן ההמלצה</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
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
              <TableHead>המלצה</TableHead>
              <TableHead className="text-left">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map(testimonial => (
              <TableRow key={testimonial.id}>
                <TableCell>{testimonial.name}</TableCell>
                <TableCell className="max-w-sm truncate">{testimonial.quote}</TableCell>
                <TableCell className="text-left">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(testimonial)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle><AlertDialogDescription>פעולה זו תמחק את ההמלצה לצמיתות.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ביטול</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteTestimonial(testimonial.id)}>מחק</AlertDialogAction>
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
  )
}
