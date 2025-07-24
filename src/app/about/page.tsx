
'use client';
import { useApp } from '@/context/app-context';
import { AsyncImage } from '@/components/async-image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPage() {
    const { state, isLoading } = useApp();
    const { about } = state.siteContent;

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-right mb-8 text-primary">
                    {isLoading ? <Skeleton className="h-12 w-80" /> : "הסיפור של מלכתא"}
                </h1>
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl mb-12">
                     <AsyncImage
                        imageKey={about.image}
                        alt="אודות מסעדת מלכתא"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="restaurant interior"
                     />
                </div>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed text-right">
                    {isLoading ? 
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-11/12" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                        </div> : 
                        <p>{about.long}</p> 
                    }
                </div>
            </div>
        </div>
    );
}
