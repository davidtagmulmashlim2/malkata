'use client';
import { useApp } from '@/context/app-context';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
    const { state } = useApp();
    const { gallery } = state;
    const isClient = useIsClient();
    
    return (
        <div className="container py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12 text-primary">
                גלריית תמונות
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(isClient ? gallery : Array(8).fill(null)).map((image, index) => (
                    <Card key={isClient ? image.id : index} className="overflow-hidden group aspect-square">
                        {isClient ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 group-hover:scale-110"
                                    data-ai-hint="food restaurant"
                                />
                            </div>
                        ) : <Skeleton className="w-full h-full"/>}
                    </Card>
                ))}
            </div>
        </div>
    );
}
