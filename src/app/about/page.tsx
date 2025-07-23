
'use client';
import { useApp } from '@/context/app-context';
import { AsyncImage } from '@/components/async-image';
import { cn } from '@/lib/utils';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPage() {
    const { state } = useApp();
    const { about } = state.siteContent;
    const isClient = useIsClient();

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-8 text-primary">
                    {isClient ? "הסיפור של מלכתא" : <Skeleton className="h-12 w-80 mx-auto" />}
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
                    {isClient ? 
                        <p>{about.long}</p> : 
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-11/12" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
