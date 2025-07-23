
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

interface TextPart {
    text: string;
    style?: React.CSSProperties;
    className?: string;
}

interface TypewriterProps {
  textParts: TextPart[];
  speed?: number;
}

export function Typewriter({ textParts, speed = 100 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        let currentText = '';
        const fullText = textParts.map(p => p.text).join('');
        let charIndex = 0;

        const intervalId = setInterval(() => {
            if (charIndex < fullText.length) {
                currentText += fullText[charIndex];
                setDisplayedText(currentText);
                charIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }
  }, [textParts, speed, isClient]);

  if (!isClient) {
    // Return nothing on the server to prevent hydration mismatch
    return null;
  }
    
  let charCount = 0;
  return (
    <>
      {textParts.map((part, index) => {
          if (!part || !part.text) return null;

          const partStart = charCount;
          const partEnd = charCount + part.text.length;
          const visibleText = displayedText.substring(partStart, Math.min(partEnd, displayedText.length));
          charCount = partEnd;

          return (
              <span key={index} style={part.style} className={cn(part.className)}>
                  {visibleText}
              </span>
          );
      })}
      {displayedText.length < textParts.map(p => p.text).join('').length && <span className="animate-ping">|</span>}
    </>
  );
}
