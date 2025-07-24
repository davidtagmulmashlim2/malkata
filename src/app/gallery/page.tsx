
'use client';
import { useApp } from '@/context/app-context';
import { AsyncImage } from '@/components/async-image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
    const { state, isLoading } = useApp();
    const { gallery } = state;
    
    return (
        <div className="container py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12 text-primary">
                גלריית תמונות
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(isLoading ? Array(8).fill(null) : gallery).map((image, index) => (
                    <Card key={isLoading ? index : image.id} className="overflow-hidden group aspect-square">
                        {isLoading ? (
                            <Skeleton className="w-full h-full"/>
                        ) : (
                            <div className="relative w-full h-full">
                                <AsyncImage
                                    imageKey={image.src}
                                    alt={image.alt}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 group-hover:scale-110"
                                    data-ai-hint="food restaurant"
                                />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
