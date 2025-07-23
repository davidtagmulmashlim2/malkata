'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

export function Typewriter({ text, speed = 100, className }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setDisplayedText(''); // Reset on text change
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text, speed, isClient]);

  // Render the full text for SEO and if JS is disabled
  if (!isClient) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn(className)}>
      {displayedText}
      <span className="animate-ping">|</span>
    </span>
  );
}
