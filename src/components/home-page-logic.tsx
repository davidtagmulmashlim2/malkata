
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
import { useEffect, useMemo, useState, useRef } from 'react';
import type { Testimonial, Feature, OptionalFeature, Category } from '@/lib/types';
import { AsyncImage } from '@/components/async-image';
import { ChevronLeft, ChevronRight, ChefHat, Carrot, Bike, PartyPopper, Leaf, Rocket, Send, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


const subscriberSchema = z.object({
    name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים."),
    phone: z.string().min(9, "מספר טלפון לא חוקי."),
});

const iconMap: { [key: string]: React.ElementType } = {
  ChefHat,
  Carrot,
  Bike,
  PartyPopper,
  Leaf,
  Rocket,
  Send,
  Smartphone
};

const CategoryGridSection = () => {
  const { state, isLoading } = useApp();
  const { categories } = state;
  const categoriesToShow = useMemo(() => categories.slice(0, 12), [categories]);

  if (isLoading) {
    return (
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if(categoriesToShow.length === 0) return null;
  
  const getSquareImageKey = (category: Category) => {
      const tag = category.tags?.find(t => t.startsWith('sq-img-'));
      return tag ? tag.replace('sq-img-', '') : category.image;
  };

  return (
    <section className="container py-16 md:py-24">
       <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">הקטגוריות שלנו</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoriesToShow.map((category) => (
          <Link href={`/menu/${category.slug}`} key={category.id} className="group">
            <Card className="overflow-hidden aspect-square">
              <div className="relative w-full h-full">
                <AsyncImage
                  imageKey={getSquareImageKey(category)}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint="food category plate"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center p-4">
                  <h3 className="text-white text-lg font-bold text-center drop-shadow-md">{category.name}</h3>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};


const FeaturesSection = () => {
  const { state, isLoading } = useApp();

  const features = useMemo(() => {
    if (isLoading) return [];

    const { feature1, feature2, feature3, feature4 } = state.siteContent.features;
    const list: (Feature | OptionalFeature)[] = [feature1, feature2, feature3];
    if (feature4?.enabled) {
      list.push(feature4);
    }
    return list;

  }, [isLoading, state.siteContent.features]);

  if (isLoading) {
    return (
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {Array(4).fill(0).map((_, index) => (
                 <div key={index} className="flex flex-col items-center">
                    <Skeleton className="h-20 w-20 mb-4 rounded-full" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-12 w-48" />
                </div>
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16 md:py-24">
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-12 text-center",
            features.length === 3 ? "lg:grid-cols-3 justify-center" : "lg:grid-cols-4"
        )}>
            {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Leaf;
                return (
                    <div key={index} className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-20 w-20 mb-4 rounded-full bg-primary/10 text-primary">
                            <IconComponent className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-headline font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                )
            })}
        </div>
    </section>
)};

const ThickChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" fill="currentColor"/>
  </svg>
);

const ThickChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z" fill="currentColor"/>
  </svg>
);


export default function HomePageClient() {
  const { state, dispatch, isLoading } = useApp();
  const { siteContent, dishes, testimonials } = state;
  const { hero, newsletter } = siteContent;
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const backPressCount = useRef(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();


  const form = useForm<z.infer<typeof subscriberSchema>>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const isDishModalOpen = searchParams.has('dish');

      if (window.innerWidth < 768 && pathname === '/' && !isDishModalOpen) {
        if (backPressCount.current === 0) {
          backPressCount.current = 1;
          toast({ description: "לחץ שוב כדי לצאת" });
          history.pushState(null, '', location.href);

          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
        } else {
          backPressCount.current = 0;
          history.back();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, searchParams]);

  const onSubscriberSubmit = (values: z.infer<typeof subscriberSchema>) => {
    dispatch({
        type: 'ADD_SUBSCRIBER',
        payload: {
            name: values.name,
            phone: values.phone,
            date: new Date().toISOString(),
        }
    });
    toast({ title: "נרשמת בהצלחה!", description: "נעדכן אותך בקרוב." });
    form.reset();
  };

  useEffect(() => {
    if (!isLoading && hero?.animation_interval > 0) {
      const interval = setInterval(() => {
        setTypewriterKey(prevKey => prevKey + 1);
      }, hero.animation_interval * 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, hero?.animation_interval]);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    if (testimonials.length > 1) {
        const interval = setInterval(() => {
            nextTestimonial();
        }, 5000); // Change testimonial every 5 seconds
        return () => clearInterval(interval);
    }
  }, [testimonials.length, currentTestimonialIndex]);

  const recommendedDishes = useMemo(() => {
    if (isLoading) return [];
    return dishes.filter(d => d.is_recommended);
  }, [dishes, isLoading]);

  const textSizeClasses: { [key: string]: string } = {
      'xs': 'text-xs md:text-sm', 'sm': 'text-sm md:text-lg', 'base': 'text-base md:text-xl', 'lg': 'text-lg md:text-2xl', 'xl': 'text-xl md:text-3xl', 
      '2xl': 'text-2xl md:text-4xl', '3xl': 'text-3xl md:text-5xl', '4xl': 'text-4xl md:text-6xl', '5xl': 'text-5xl md:text-7xl', 
      '6xl': 'text-6xl md:text-8xl', '7xl': 'text-7xl md:text-9xl', '8xl': 'text-8xl md:text-9xl', '9xl': 'text-9xl',
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

  if (isLoading) {
    return (
        <div className="text-right">
             <section className="relative w-full text-white overflow-hidden" style={{ height: '80vh' }}>
                 <Skeleton className="w-full h-full" />
             </section>
             <section className="container py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">המומלצים שלנו</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Array(4).fill(null).map((dish, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
              </section>
        </div>
    )
  }

  return (
    <div className="text-right">
      {/* Hero Section */}
      <section className="relative w-full text-white overflow-hidden" style={{ height: `${hero.hero_height}vh` }}>
        <>
            <AsyncImage
              imageKey={siteContent.hero.image}
              alt="רקע של אוכל ביתי"
              layout="fill"
              objectFit="cover"
              className="z-0 animation-slow-zoom-in"
              style={{ filter: `brightness(${siteContent.hero.image_brightness}%)` }}
              priority
              data-ai-hint="warm food"
              skeletonClassName="w-full h-full"
            />
            <div className={cn(
                "absolute inset-0 z-10 p-4 flex flex-col",
                verticalAlignClasses[hero.vertical_align],
                horizontalAlignClasses[hero.horizontal_align]
            )}>
              <div className={cn("w-full", textAlignClasses[hero.text_align])}>
                {(siteContent.hero.title_first_word || siteContent.hero.title_rest) && (
                    <h1 className="font-headline font-bold drop-shadow-lg">
                      <Typewriter
                          key={typewriterKey}
                          textParts={[
                              { text: siteContent.hero.title_first_word, style: { color: siteContent.hero.title_first_word_color, opacity: siteContent.hero.title_first_word_opacity }, className: textSizeClasses[siteContent.hero.title_first_word_font_size] },
                              { text: ` ${siteContent.hero.title_rest}`, style: { color: siteContent.hero.title_rest_color, opacity: siteContent.hero.title_rest_opacity }, className: textSizeClasses[siteContent.hero.title_rest_font_size] },
                          ]}
                      />
                    </h1>
                )}
                
                {siteContent.hero.subtitle && (
                  <div className={cn("mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md", horizontalAlignClasses[hero.horizontal_align] === 'justify-center' ? 'mx-auto' : '')} style={{ opacity: siteContent.hero.subtitle_opacity }}>
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
        </>
      </section>

      {/* Recommended Dishes Section */}
      <section className="py-16 md:py-24">
        <div className="container">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">המומלצים שלנו</h2>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-48">
            {recommendedDishes.length > 0 && (
                 <Carousel
                    opts={{
                        align: "start",
                        loop: recommendedDishes.length > 4,
                        direction: 'rtl',
                    }}
                    className="w-full"
                    dir="rtl"
                >
                    <CarouselContent className="-mr-1">
                        {recommendedDishes.map((dish, i) => (
                            <CarouselItem key={dish ? dish.id : i} className="basis-full sm:basis-1/2 lg:basis-1/4 pl-1 pr-3">
                                 <div className="p-1 h-full">
                                    {dish ? <DishCard dish={dish} /> : <Skeleton className="h-96 w-full" />}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
        </div>
      </section>

      {/* Category Grid Section */}
      <CategoryGridSection />

      {/* About Us Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">הסיפור שלנו</h2>
            <div className="text-muted-foreground mb-6">
              {isLoading ? <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-11/12" /><Skeleton className="h-4 w-3/4" /></div> : <p>{siteContent.about.short}</p>}
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
      
      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <section className="container py-8 overflow-hidden">
        <div className="max-w-xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">{isLoading ? <Skeleton className="h-9 w-48" /> : siteContent.testimonials.headline}</h2>
            {isLoading ? (
                <div className="p-1">
                    <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40">
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/4" />
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
                    <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 right-[-1rem] md:right-[-4rem]" onClick={prevTestimonial}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 left-[-1rem] md:left-[-4rem]" onClick={nextTestimonial}>
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
      <section className={cn("relative py-16 md:py-24 text-primary-foreground", !newsletter.image && "bg-primary")}>
        {newsletter.image && (
          <>
            <AsyncImage
              imageKey={newsletter.image}
              alt="רקע מועדון לקוחות"
              layout="fill"
              objectFit="cover"
              className="z-0"
              style={{ filter: `brightness(${(newsletter.image_brightness ?? 50) / 100})` }}
              data-ai-hint="community people"
            />
            <div className="absolute inset-0 bg-black/50 z-0"></div>
          </>
        )}
        <div className="container relative z-10 text-right max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">{isLoading ? <Skeleton className="h-10 w-3/4 mx-auto bg-white/20" /> : newsletter.headline}</h2>
            <div className="mb-6 opacity-90">{isLoading ? <div className="space-y-2"><Skeleton className="h-4 w-full max-w-lg mx-auto bg-white/20" /><Skeleton className="h-4 w-2/3 max-w-md mx-auto bg-white/20" /></div> : newsletter.subheadline}</div>
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
