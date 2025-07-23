
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useApp } from '@/context/app-context';
import { Typewriter } from '@/components/typewriter';
import { DishCard } from '@/components/dish-card';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function Home() {
  const { state } = useApp();
  const { siteContent, dishes, testimonials } = state;
  const isClient = useIsClient();
  
  const veganDishes = dishes.filter(d => d.tags.includes('vegan')).slice(0, 3);
  
  const textSizeClasses: { [key: string]: string } = {
      'xs': 'text-xs', 'sm': 'text-sm', 'base': 'text-base', 'lg': 'text-lg', 'xl': 'text-xl', 
      '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl', 
      '6xl': 'text-6xl', '7xl': 'text-7xl', '8xl': 'text-8xl', '9xl': 'text-9xl',
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src={isClient ? siteContent.hero.image : "https://placehold.co/1920x1080"}
          alt="רקע של אוכל ביתי"
          layout="fill"
          objectFit="cover"
          className="z-0 brightness-50"
          priority
          data-ai-hint="warm food"
        />
        <div className="z-10 p-4">
          <h1 className="font-headline font-bold drop-shadow-lg">
            {isClient ? (
                <Typewriter
                    textParts={[
                        { text: siteContent.hero.titleFirstWord, style: { color: siteContent.hero.titleFirstWordColor, opacity: siteContent.hero.titleFirstWordOpacity }, className: textSizeClasses[siteContent.hero.titleFirstWordFontSize] },
                        { text: ` ${siteContent.hero.titleRest}`, style: { color: siteContent.hero.titleRestColor, opacity: siteContent.hero.titleRestOpacity }, className: textSizeClasses[siteContent.hero.titleRestFontSize] },
                    ]}
                />
            ) : <Skeleton className="h-16 w-[80vw] max-w-4xl mx-auto" />}
          </h1>
          <div className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto drop-shadow-md" style={{ opacity: isClient ? siteContent.hero.subtitleOpacity : 1 }}>
            {isClient ? siteContent.hero.subtitle : <Skeleton className="h-8 w-96 mx-auto mt-2" />}
          </div>
          <Button asChild size="lg" className="mt-8 font-bold">
            <Link href="/menu">הזמן עכשיו</Link>
          </Button>
        </div>
      </section>

      {/* Recommended Dishes Section */}
      <section className="container">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">מנות טבעוניות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isClient ? veganDishes.map(dish => <DishCard key={dish.id} dish={dish} />) 
          : Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">הסיפור שלנו</h2>
            <div className="text-muted-foreground mb-6">
              {isClient ? <p>{siteContent.about.short}</p> : <Skeleton className="h-20 w-full" />}
            </div>
            <Button asChild variant="outline">
              <Link href="/about">קראו עוד</Link>
            </Button>
          </div>
          <div className="w-full h-80 relative rounded-lg overflow-hidden shadow-xl">
             <Image
                src={isClient ? siteContent.about.image : "https://placehold.co/600x400"}
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
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">לקוחות ממליצים</h2>
        <Carousel className="w-full max-w-4xl mx-auto" dir="rtl">
          <CarouselContent>
            {(isClient ? testimonials : Array(3).fill({id:'', name:'', quote:''})).map((testimonial, index) => (
              <CarouselItem key={isClient ? testimonial.id : index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      {isClient ? (
                        <>
                          <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                          <p className="font-bold text-primary">- {testimonial.name}</p>
                        </>
                      ) : (
                        <div className="space-y-2 w-full">
                           <Skeleton className="h-6 w-3/4 mx-auto" />
                           <Skeleton className="h-5 w-1/4 mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">הצטרפו למועדון הלקוחות שלנו</h2>
            <p className="mb-6 opacity-90">הישארו מעודכנים במבצעים, מנות חדשות ואירועים מיוחדים!</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input 
                    type="email" 
                    placeholder="האימייל שלכם" 
                    className="text-foreground"
                    aria-label="Email for newsletter"
                />
                <Button type="submit" variant="secondary">הרשמה</Button>
            </form>
        </div>
      </section>

    </div>
  );
}
