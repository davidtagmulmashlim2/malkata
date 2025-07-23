'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useApp } from '@/context/app-context';
import { toast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, { message: "שם חייב להכיל לפחות 2 תווים." }),
  email: z.string().email({ message: "כתובת אימייל לא חוקית." }),
  message: z.string().min(10, { message: "הודעה חייבת להכיל לפחות 10 תווים." }),
});

export default function ContactPage() {
    const { state, animationClass } = useApp();
    const { contact } = state.siteContent;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", message: "" },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: "הודעה נשלחה!",
            description: `תודה ${values.name}, חזר אליך בהקדם.`,
        });
        form.reset();
    }
    
    return (
        <div className={cn("container py-12 md:py-20", animationClass)}>
             <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12 text-primary">
                צרו איתנו קשר
            </h1>
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-card p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold font-headline mb-6">טופס יצירת קשר</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>שם מלא</FormLabel>
                                        <FormControl><Input placeholder="שם מלא" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>אימייל</FormLabel>
                                        <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>הודעה</FormLabel>
                                        <FormControl><Textarea placeholder="כתבו לנו..." {...field} rows={5} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">שליחה</Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold font-headline mb-6">פרטי התקשרות</h2>
                    <div className="space-y-4 text-lg">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">כתובת</h3>
                                <p className="text-muted-foreground">{contact.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">טלפון</h3>
                                <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-primary">{contact.phone}</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">אימייל</h3>
                                <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-primary">{contact.email}</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Clock className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">שעות פתיחה</h3>
                                <p className="text-muted-foreground whitespace-pre-line">{contact.hours}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
