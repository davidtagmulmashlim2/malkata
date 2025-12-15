
'use client';
import { useApp } from '@/context/app-context';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';

export function AnnouncementBar() {
    const { state } = useApp();
    const isClient = useIsClient();
    const { announcement_bar } = state.siteContent;

    if (!isClient || !announcement_bar?.enabled) {
        return null;
    }

    const {
        display_mode = 'static',
        scrolling_text,
        scrolling_font_size,
        button_text,
        button_link,
        text_center,
        text_right,
        bg_color,
        text_color
    } = announcement_bar;

    const hasButton = button_text && button_link;

    if (display_mode === 'scrolling') {
        if (!scrolling_text) return null;
        return (
            <div 
                className="relative z-50 flex overflow-hidden whitespace-nowrap py-2"
                style={{ 
                    backgroundColor: bg_color || '#000000',
                    color: text_color || '#FFFFFF'
                }}
            >
                <div className="animate-marquee-rtl flex min-w-full shrink-0 items-center">
                    <span className={cn("px-6", scrolling_font_size || 'text-sm')}>{scrolling_text}</span>
                </div>
                 <div className="animate-marquee-rtl flex min-w-full shrink-0 items-center" aria-hidden="true">
                    <span className={cn("px-6", scrolling_font_size || 'text-sm')}>{scrolling_text}</span>
                </div>
            </div>
        );
    }
    
    // Static mode
    const hasCenterText = !!text_center;
    const hasRightText = !!text_right;

    if (!hasButton && !hasCenterText && !hasRightText) {
        return null;
    }

    return (
        <div 
            className="relative z-50 flex items-center justify-between gap-x-6 px-4 py-2 text-sm"
            style={{ 
                backgroundColor: bg_color || '#000000',
                color: text_color || '#FFFFFF'
            }}
        >
            {/* Mobile View */}
             <div className="flex flex-1 items-center justify-between sm:hidden">
                <div className="flex-1 text-right">
                    {hasRightText && <p>{text_right}</p>}
                </div>
                {hasButton && (
                     <Link
                        href={button_link!}
                        className="flex-shrink-0 whitespace-nowrap font-semibold underline hover:no-underline ml-4"
                    >
                        {button_text}
                    </Link>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex flex-1 text-right">
                {hasRightText && <p>{text_right}</p>}
            </div>

            <div className="hidden sm:flex flex-1 justify-center text-center">
                 {hasCenterText && <p>{text_center}</p>}
            </div>

            <div className="hidden sm:flex flex-1 justify-end text-left">
                {hasButton && (
                    <Link
                        href={button_link!}
                        className="whitespace-nowrap font-semibold underline hover:no-underline"
                    >
                        {button_text}
                    </Link>
                )}
            </div>
        </div>
    );
}
