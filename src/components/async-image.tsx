
'use client';
import NextImage, { ImageProps } from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getImage } from '@/lib/image-store';

interface AsyncImageProps extends Omit<ImageProps, 'src'> {
  imageKey: string | undefined | null;
  skeletonClassName?: string;
}

export function AsyncImage({ imageKey, alt, skeletonClassName, className, ...props }: AsyncImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchImage = () => {
      if (!imageKey) {
        if(isMounted) setSrc("https://placehold.co/600x400.png");
        setIsLoading(false);
        return;
      }
      
      const imageUrl = getImage(imageKey);
      
      if (isMounted) {
        if (imageUrl) {
            setSrc(imageUrl);
        } else {
            setError(true);
            setSrc("https://placehold.co/600x400.png");
        }
        setIsLoading(false);
      }
    };

    fetchImage();
    
    return () => { isMounted = false; };
  }, [imageKey]);

  if (isLoading) {
    return <Skeleton className={cn("w-full h-full", skeletonClassName)} />;
  }

  if (error || !src) {
      return (
         <div className={cn("w-full h-full bg-muted flex items-center justify-center text-muted-foreground", skeletonClassName)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-off h-8 w-8"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><path d="M13.5 13.5L21 21"/><path d="M12 21H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1"/><path d="M21 16.5V13a2 2 0 0 0-2-2h-1.5"/></svg>
         </div>
      );
  }

  return (
      <NextImage 
        src={src} 
        alt={alt} 
        className={cn(className)}
        {...props} 
      />
  );
}
