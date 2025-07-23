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
  const [displayedParts, setDisplayedParts] = useState<TextPart[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        setDisplayedParts([]); // Reset on text change
        let partIndex = 0;
        let charIndex = 0;

        const intervalId = setInterval(() => {
            if (partIndex >= textParts.length) {
                clearInterval(intervalId);
                return;
            }

            const currentPart = textParts[partIndex];
            const currentText = currentPart.text;

            setDisplayedParts(prev => {
                const newParts = [...prev];
                if (!newParts[partIndex]) {
                    newParts[partIndex] = { ...currentPart, text: '' };
                }
                newParts[partIndex].text += currentText[charIndex];
                return newParts;
            });

            charIndex++;
            if (charIndex >= currentText.length) {
                charIndex = 0;
                partIndex++;
            }
        }, speed);

        return () => clearInterval(intervalId);
    }
  }, [textParts, speed, isClient]);

  // Render the full text for SEO and if JS is disabled
  if (!isClient) {
    return (
        <>
            {textParts.map((part, index) => (
                <span key={index} style={part.style} className={part.className}>
                    {part.text}
                </span>
            ))}
        </>
    );
  }

  return (
    <>
      {displayedParts.map((part, index) => (
        <span key={index} style={part.style} className={cn(part.className)}>
          {part.text}
        </span>
      ))}
      <span className="animate-ping">|</span>
    </>
  );
}
