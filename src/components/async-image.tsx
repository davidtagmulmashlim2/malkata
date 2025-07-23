'use client';
import { useState, useEffect } from 'react';
import NextImage, { ImageProps } from 'next/image';
import { getImage, getImageSync } from '@/lib/image-store';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AsyncImageProps extends Omit<ImageProps, 'src'> {
  imageKey: string | undefined | null;
  placeholder?: string;
  skeletonClassName?: string;
}

export function AsyncImage({ imageKey, alt, placeholder = "https://placehold.co/600x400", skeletonClassName, className, ...props }: AsyncImageProps) {
  const [src, setSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (imageKey) {
        // Try sync first for immediate render
        const syncSrc = getImageSync(imageKey);
        if (syncSrc) {
            setSrc(syncSrc);
            setIsLoading(false);
            return;
        }

        // Fallback to async
        setIsLoading(true);
        getImage(imageKey).then(imageSrc => {
            if (isMounted && imageSrc) {
                setSrc(imageSrc);
            }
        }).finally(() => {
            if (isMounted) setIsLoading(false);
        });
    } else {
        setSrc(placeholder);
        setIsLoading(false);
    }
    return () => { isMounted = false; };
  }, [imageKey, placeholder]);
  
  if (isLoading) {
      return <Skeleton className={cn("w-full h-full", skeletonClassName)} />;
  }

  return <NextImage src={src} alt={alt} className={className} {...props} />;
}
