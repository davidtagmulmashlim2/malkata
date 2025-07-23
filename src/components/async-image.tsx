
'use client';
import NextImage, { ImageProps } from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface AsyncImageProps extends Omit<ImageProps, 'src'> {
  imageKey: string | undefined | null; // This will be a URL
  placeholder?: string;
  skeletonClassName?: string;
}

function isValidHttpUrl(string: string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https протокол:';
  } catch (_) {
    return false;  
  }
}


export function AsyncImage({ imageKey, alt, placeholder = "https://placehold.co/600x400", skeletonClassName, className, ...props }: AsyncImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const src = imageKey && isValidHttpUrl(imageKey) ? imageKey : placeholder;
  
  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  if (error || !imageKey || !isValidHttpUrl(imageKey)) {
      return (
         <div className={cn("w-full h-full bg-muted flex items-center justify-center text-muted-foreground", skeletonClassName)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-off h-8 w-8"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><path d="M13.5 13.5L21 21"/><path d="M12 21H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1"/><path d="M21 16.5V13a2 2 0 0 0-2-2h-1.5"/></svg>
         </div>
      );
  }

  return (
    <>
      {isLoading && <Skeleton className={cn("w-full h-full", skeletonClassName)} />}
      <NextImage 
        src={src} 
        alt={alt} 
        className={cn(className, isLoading ? 'opacity-0' : 'opacity-100', "transition-opacity")} 
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props} 
      />
    </>
  );
}
