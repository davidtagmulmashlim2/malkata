
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

    const hasButton = announcement_bar.button_text && announcement_bar.button_link;
    const hasCenterText = !!announcement_bar.text_center;
    const hasRightText = !!announcement_bar.text_right;

    if (!hasButton && !hasCenterText && !hasRightText) {
        return null;
    }

    return (
        <div 
            className="relative z-50 flex items-center justify-between gap-x-6 px-4 py-2 text-sm"
            style={{ 
                backgroundColor: announcement_bar.bg_color || '#000000',
                color: announcement_bar.text_color || '#FFFFFF'
            }}
        >
            {/* Mobile View */}
             <div className="flex flex-1 items-center justify-between sm:hidden">
                <div className="flex-1 text-right">
                    {hasRightText && <p>{announcement_bar.text_right}</p>}
                </div>
                {hasButton && (
                     <Link
                        href={announcement_bar.button_link!}
                        className="flex-shrink-0 whitespace-nowrap font-semibold underline hover:no-underline ml-4"
                    >
                        {announcement_bar.button_text}
                    </Link>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex flex-1 text-right">
                {hasRightText && <p>{announcement_bar.text_right}</p>}
            </div>

            <div className="hidden sm:flex flex-1 justify-center text-center">
                 {hasCenterText && <p>{announcement_bar.text_center}</p>}
            </div>

            <div className="hidden sm:flex flex-1 justify-end text-left">
                {hasButton && (
                    <Link
                        href={announcement_bar.button_link!}
                        className="whitespace-nowrap font-semibold underline hover:no-underline"
                    >
                        {announcement_bar.button_text}
                    </Link>
                )}
            </div>
        </div>
    );
}
