'use client';
import { useApp } from '@/context/app-context';
import { DishCard } from '@/components/dish-card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuPage() {
    const { state } = useApp();
    const { dishes, categories } = state;
    const isClient = useIsClient();

    return (
        <div>
            <div className="relative h-64 w-full">
                <Image
                    src="https://placehold.co/1600x400"
                    alt="תפריט"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                    data-ai-hint="food arrangement"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl font-headline font-bold text-white drop-shadow-lg">
                        התפריט שלנו
                    </h1>
                </div>
            </div>
            <div className="container py-12 md:py-20">
                {categories.map(category => (
                    <div key={category.id} className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-8 border-b-2 border-primary pb-2">
                            {category.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {isClient ? 
                                dishes.filter(d => d.categoryId === category.id).map(dish => (
                                    <DishCard key={dish.id} dish={dish} />
                                ))
                                : Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
