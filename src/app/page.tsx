
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/app-context';
import { Typewriter } from '@/components/typewriter';
import { DishCard } from '@/components/dish-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import type { Testimonial } from '@/lib/types';
import { AsyncImage } from '@/components/async-image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


const subscriberSchema = z.object({
    name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים."),
    phone: z.string().min(9, "מספר טלפון לא חוקי."),
});


export default function Home() {
  const { state, dispatch, isLoading } = useApp();
  const { siteContent, dishes, testimonials } = state;
  const { hero, newsletter } = siteContent;
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const form = useForm<z.infer<typeof subscriberSchema>>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubscriberSubmit = (values: z.infer<typeof subscriberSchema>) => {
    dispatch({
        type: 'ADD_SUBSCRIBER',
        payload: {
            id: Date.now().toString(),
            name: values.name,
            phone: values.phone,
            date: new Date().toISOString(),
        }
    });
    toast({ title: "נרשמת בהצלחה!", description: "נעדכן אותך בקרוב." });
    form.reset();
  };

  useEffect(() => {
    if (!isLoading && siteContent.hero.animationInterval > 0) {
      const interval = setInterval(() => {
        setTypewriterKey(prevKey => prevKey + 1);
      }, siteContent.hero.animationInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, siteContent.hero.animationInterval]);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const recommendedDishes = useMemo(() => {
    if (isLoading) return Array(3).fill(null);
    const recommended = dishes.filter(d => d.isRecommended);
    return recommended.length > 0 ? recommended : dishes.slice(0, 3);
  }, [dishes, isLoading]);

  const textSizeClasses: { [key: string]: string } = {
      'xs': 'text-xs', 'sm': 'text-sm', 'base': 'text-base', 'lg': 'text-lg', 'xl': 'text-xl', 
      '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl', 
      '6xl': 'text-6xl', '7xl': 'text-7xl', '8xl': 'text-8xl', '9xl': 'text-9xl',
  };

  const verticalAlignClasses: { [key: string]: string } = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  };

  const horizontalAlignClasses: { [key: string]: string } = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const textAlignClasses: { [key: string]: string } = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="space-y-16 md:space-y-24 text-right">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full text-white overflow-hidden">
        <AsyncImage
          imageKey={siteContent.hero.image}
          alt="רקע של אוכל ביתי"
          layout="fill"
          objectFit="cover"
          className="z-0 animation-slow-zoom-in"
          style={{ filter: `brightness(${siteContent.hero.heroImageBrightness}%)` }}
          priority
          data-ai-hint="warm food"
          skeletonClassName="w-full h-full"
        />
        <div className={cn(
            "absolute inset-0 flex p-4 z-10",
            verticalAlignClasses[hero.verticalAlign],
            horizontalAlignClasses[hero.horizontalAlign],
            textAlignClasses[hero.textAlign]
        )}>
          <div>
            {isLoading ? <Skeleton className="h-16 w-[80vw] max-w-4xl" /> : (siteContent.hero.titleFirstWord || siteContent.hero.titleRest) && (
                <h1 className="font-headline font-bold drop-shadow-lg">
                  <Typewriter
                      key={typewriterKey}
                      textParts={[
                          { text: siteContent.hero.titleFirstWord, style: { color: siteContent.hero.titleFirstWordColor, opacity: siteContent.hero.titleFirstWordOpacity }, className: textSizeClasses[siteContent.hero.titleFirstWordFontSize] },
                          { text: ` ${siteContent.hero.titleRest}`, style: { color: siteContent.hero.titleRestColor, opacity: siteContent.hero.titleRestOpacity }, className: textSizeClasses[siteContent.hero.titleRestFontSize] },
                      ]}
                  />
                </h1>
            )}
            
            {isLoading ? <Skeleton className="h-8 w-96 mt-2" /> : siteContent.hero.subtitle && (
              <div className={cn("mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md", horizontalAlignClasses[hero.horizontalAlign] === 'justify-center' ? 'mx-auto' : '')} style={{ opacity: siteContent.hero.subtitleOpacity }}>
                {siteContent.hero.subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center gap-4 px-4">
           <Button asChild size="lg" className="font-bold">
              <Link href="/menu">צפה בתפריט</Link>
           </Button>
           <Button asChild size="lg" variant="outline" className="font-bold border-2 border-white text-white bg-transparent hover:bg-white hover:text-black">
               <Link href="/menu">הזמן משלוח</Link>
           </Button>
        </div>
      </section>

      {/* Recommended Dishes Section */}
      <section className="container">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">מנות מומלצות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedDishes.map((dish, i) => dish ? <DishCard key={dish.id} dish={dish} /> : <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">הסיפור שלנו</h2>
            <div className="text-muted-foreground mb-6">
              {isLoading ? <Skeleton className="h-20 w-full" /> : <p>{siteContent.about.short}</p>}
            </div>
            <Button asChild variant="outline">
              <Link href="/about">קראו עוד</Link>
            </Button>
          </div>
          <div className="w-full h-80 relative rounded-lg overflow-hidden shadow-xl">
             <AsyncImage
                imageKey={siteContent.about.image}
                alt="אודות מסעדת מלכתא"
                layout="fill"
                objectFit="cover"
                data-ai-hint="cozy restaurant"
             />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
       <section className="container">
        <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">{siteContent.testimonials.headline}</h2>
            {isLoading ? (
                <div className="p-1">
                    <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40">
                        <p>טוען...</p>
                    </CardContent>
                    </Card>
                </div>
            ) : testimonials?.length > 0 ? (
                <div className="relative w-full">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40 relative">
                    {testimonials.map((testimonial, index) => (
                        <div 
                            key={testimonial.id}
                            className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300",
                            index === currentTestimonialIndex ? "opacity-100" : "opacity-0"
                            )}
                            style={{transitionDelay: index === currentTestimonialIndex ? '150ms' : '0ms' }}
                        >
                            <p className="text-lg italic mb-4 flex-grow">"{testimonial.quote}"</p>
                            <p className="font-bold text-primary">- {testimonial.name}</p>
                        </div>
                        ))}
                    </CardContent>
                </Card>
                {testimonials.length > 1 && (
                    <>
                    <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 right-[-2rem] md:right-[-4rem]" onClick={prevTestimonial}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 left-[-2rem] md:left-[-4rem]" onClick={nextTestimonial}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    </>
                )}
                </div>
            ) : (
                <div className="p-1">
                    <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40">
                        <p>עדיין אין המלצות.</p>
                    </CardContent>
                    </Card>
                </div>
            )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-right max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">{isLoading ? <Skeleton className="h-10 w-3/4 mx-auto" /> : newsletter.headline}</h2>
            <div className="mb-6 opacity-90">{isLoading ? <div className="animate-pulse rounded-md bg-muted/50 h-6 w-full max-w-lg mx-auto" /> : newsletter.subheadline}</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubscriberSubmit)} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input placeholder="השם שלך" className="text-foreground" {...field} />
                                </FormControl>
                                <FormMessage className="text-secondary" />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input type="tel" placeholder="הטלפון שלך" className="text-foreground" {...field} />
                                </FormControl>
                                <FormMessage className="text-secondary" />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="secondary" disabled={form.formState.isSubmitting}>הרשמה</Button>
                </form>
            </Form>
        </div>
      </section>

    </div>
  );
}
