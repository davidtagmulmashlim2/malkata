'use client';
import { useApp } from '@/context/app-context';
import { DishCard } from '@/components/dish-card';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage({ params }: { params: { category: string } }) {
    const { state, animationClass } = useApp();
    const isClient = useIsClient();

    const category = state.categories.find(c => c.slug === params.category);
    
    if (isClient && !category) {
        notFound();
    }

    const categoryDishes = state.dishes.filter(d => d.categoryId === category?.id);

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
        // This will be caught by notFound() on the client, but keeps TS happy.
        return null; 
    }

    return (
        <div className={cn(animationClass)}>
            <div className="relative h-64 w-full">
                <Image
                    src={category.image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                    data-ai-hint="food category"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-5xl font-headline font-bold text-white drop-shadow-lg">
                        {category.name}
                    </h1>
                    <p className="text-lg text-white mt-2 max-w-2xl">{category.description}</p>
                </div>
            </div>
            <div className="container py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
