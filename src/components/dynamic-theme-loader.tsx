
'use client';

import { useApp } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function DynamicThemeLoader({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const { design } = state;

  useEffect(() => {
    // Remove all theme classes
    document.body.className = document.body.className.replace(/theme-\S+/g, '');
    
    // Add the current theme class
    document.body.classList.add(`theme-${design.theme}`);
    
    // Set font variables
    document.body.style.setProperty('--font-headline-family', `var(--font-${design.headline_font})`);
    document.body.style.setProperty('--font-sans-family', `var(--font-${design.body_font})`);
  }, [design]);

  return (
    <div className={cn('min-h-screen flex flex-col', `theme-${design.theme}`)} style={{
        '--font-headline-family': `var(--font-${design.headline_font})`,
        '--font-sans-family': `var(--font-${design.body_font})`,
      } as React.CSSProperties}>
        {children}
    </div>
  );
}
