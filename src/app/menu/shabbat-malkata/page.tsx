
'use client';
import { useApp } from '@/context/app-context';
import { DishCard } from '@/components/dish-card';
import { notFound } from 'next/navigation';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';
import { AsyncImage } from '@/components/async-image';
import { cn } from '@/lib/utils';
import React from 'react';

export default function ShabbatMalkataPage() {
    const { state, isLoading } = useApp();
    const isClient = useIsClient();
    
    const category = state.categories.find(c => c.slug === 'shabbat-malkata');
    
    if (isClient && !category) {
        notFound();
    }

    const categoryDishes = state.dishes.filter(d => d.categoryIds?.includes(category?.id || ''));
    const { shabbatNotice } = state.siteContent;

    const textSizeClasses: { [key: string]: string } = {
        'text-xs': 'text-xs', 'text-sm': 'text-sm', 'text-base': 'text-base', 'text-lg': 'text-lg', 'text-xl': 'text-xl', 
        'text-2xl': 'text-2xl', 'text-3xl': 'text-3xl', 'text-4xl': 'text-4xl', 'text-5xl': 'text-5xl', 
        'text-6xl': 'text-6xl', 'text-7xl': 'text-7xl', 'text-8xl': 'text-8xl', 'text-9xl': 'text-9xl',
    };

    if (!isClient) {
        return (
            <div>
                <Skeleton className="h-64 w-full" />
                <div className="container py-12 md:py-20">
                    <Skeleton className="h-10 w-1/3 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                    </div>
                </div>
            </div>
        );
    }
    
    if (!category) {
        return null;
    }

    return (
        <div>
            <div className="relative h-64 w-full">
                <AsyncImage
                    imageKey={category.image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                    data-ai-hint="shabbat table food"
                    skeletonClassName="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-5xl font-headline font-bold text-white drop-shadow-lg">
                        {category.name}
                    </h1>
                    <p className="text-lg text-white mt-2 max-w-2xl">{category.description}</p>
                </div>
            </div>
            <div className="container py-12 md:py-20">
                {shabbatNotice?.enabled && shabbatNotice.text && (
                    <div className="text-center mb-12">
                         <h2 className="text-2xl font-headline font-semibold">הזמנות לשבת:</h2>
                         <p 
                            className={cn(
                                "mt-2",
                                textSizeClasses[shabbatNotice.fontSize ?? 'base'],
                                shabbatNotice.isBold && "font-bold"
                            )}
                            style={{ color: shabbatNotice.color }}
                         >
                            {shabbatNotice.text}
                        </p>
                    </div>
                )}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryDishes.length > 0 ? (
                        categoryDishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} />
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full text-center">אין כרגע מנות זמינות לשבת. נעדכן בקרוב!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
