

'use client';
import { useApp } from '@/context/app-context';
import { DishCard } from '@/components/dish-card';
import { notFound, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AsyncImage } from '@/components/async-image';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function CategoryPage() {
    const { state, isLoading } = useApp();
    const params = useParams();
    const categorySlug = typeof params.category === 'string' ? params.category : '';

    const category = isLoading ? undefined : state.categories.find(c => c.slug === categorySlug);
    
    // Defer the notFound call until after the client has loaded and we can be sure the category doesn't exist.
    if (!isLoading && categorySlug && !category) {
        notFound();
    }

    const categoryDishes = isLoading || !category ? [] : state.dishes.filter(d => d.category_ids && d.category_ids.includes(category.id!));

    const textSizeClasses: { [key: string]: string } = {
      'xs': 'text-xs', 'sm': 'text-sm', 'base': 'text-base', 'lg': 'text-lg', 'xl': 'text-xl', 
      '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl', 
      '6xl': 'text-6xl', '7xl': 'text-7xl', '8xl': 'text-8xl', '9xl': 'text-9xl',
    };

    // This is the loading state, shown on server and initial client render
    if (isLoading || !category) {
        return (
            <div>
                <Skeleton className="h-64 w-full" />
                <div className="container py-12 md:py-20">
                    <Skeleton className="h-10 w-1/3 mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                    </div>
                </div>
            </div>
        );
    }
    
    const titleFont = category.title_font && !category.title_font.startsWith('icon-') ? `var(--font-${category.title_font})` : 'var(--font-headline-family)';

    // This is the final state, rendered only on the client after isLoading is false
    return (
        <div>
            <div className="relative h-64 w-full">
                <AsyncImage
                    imageKey={category.image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    style={{ filter: `brightness(${category.image_brightness ?? 50}%)` }}
                    data-ai-hint="food category"
                    skeletonClassName="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 
                        className={cn(
                            "font-bold text-white drop-shadow-lg",
                            textSizeClasses[category.title_font_size ?? '5xl']
                        )}
                        style={{
                            color: category.title_color ?? '#FFFFFF',
                            opacity: category.title_opacity ?? 1,
                            fontFamily: titleFont,
                        } as React.CSSProperties}
                    >
                        {category.name}
                    </h1>
                    {(category.show_description ?? true) && (
                        <p className="text-lg text-white mt-2 max-w-2xl">{category.description}</p>
                    )}
                </div>
            </div>
            <div className="px-2 md:container py-12 md:py-20">
                {category.show_description_below_banner && (
                    <div className="mb-12 text-right">
                        <h2 className="text-2xl font-headline font-semibold border-r-4 border-primary pr-4">{category.name}</h2>
                        <p className="text-muted-foreground mt-2 pr-4">{category.description}</p>
                    </div>
                 )}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
                    {categoryDishes.length > 0 ? (
                        categoryDishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} />
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full text-center">אין כרגע מנות בקטגוריה זו.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

    
