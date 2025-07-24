
'use client';
import { useApp } from '@/context/app-context';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestimonialsPage() {
    const { state, isLoading } = useApp();
    const { testimonials } = state;
    
    return (
        <div className="container py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12 text-primary">
                לקוחות ממליצים
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(isLoading ? Array(6).fill(null) : testimonials).map((testimonial, index) => (
                    <Card key={isLoading ? index : testimonial.id} className="text-center">
                         <CardContent className="p-6">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-11/12" />
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-lg italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                                    <p className="font-bold text-primary">- {testimonial.name}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
             { !isLoading && testimonials.length === 0 && (
                <div className="text-center text-muted-foreground">
                    <p>עדיין אין המלצות. בואו להיות הראשונים!</p>
                </div>
            )}
        </div>
    );
}
