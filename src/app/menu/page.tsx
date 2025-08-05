

'use client';
import { useApp } from '@/context/app-context';
import { DishCard } from '@/components/dish-card';
import { cn } from '@/lib/utils';
import { AsyncImage } from '@/components/async-image';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuPage() {
    const { state, isLoading } = useApp();
    const { dishes, categories, siteContent } = state;

    return (
        <div>
            <div className="relative h-64 w-full">
                <AsyncImage
                    imageKey={isLoading ? undefined : siteContent.menu.main_image}
                    alt="תפריט"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                    data-ai-hint="food arrangement"
                    skeletonClassName="w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl font-headline font-bold text-white drop-shadow-lg">
                        התפריט שלנו
                    </h1>
                </div>
            </div>
            <div className="container py-12 md:py-20">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                         <div key={i} className="mb-16">
                            <Skeleton className="h-10 w-1/3 mb-8" />
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {Array(3).fill(0).map((_, j) => <Skeleton key={j} className="h-96 w-full" />)}
                            </div>
                        </div>
                    ))
                ) : (
                    categories.map(category => {
                        const categoryDishes = dishes.filter(d => d.category_ids && d.category_ids.includes(category.id!));
                        if (categoryDishes.length === 0) return null;

                        return (
                            <div key={category.id} className="mb-16">
                                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-8 border-b border-border pb-2">
                                    {category.name}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                    {categoryDishes.map(dish => (
                                        <DishCard key={dish.id} dish={dish} />
                                    ))}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
