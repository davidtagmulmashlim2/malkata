
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

    if (!isClient || !announcement_bar?.enabled || !announcement_bar.text) {
        return null;
    }

    const hasButton = announcement_bar.button_text && announcement_bar.button_link;

    return (
        <div 
            className="relative z-50 flex items-center justify-center gap-x-6 px-6 py-2 sm:px-3.5"
            style={{ 
                backgroundColor: announcement_bar.bg_color || '#000000',
                color: announcement_bar.text_color || '#FFFFFF'
            }}
        >
            <p className="text-sm leading-6">
                {announcement_bar.text}
                {hasButton && (
                    <Link
                        href={announcement_bar.button_link!}
                        className="whitespace-nowrap font-semibold ml-2 underline"
                    >
                        {announcement_bar.button_text} <span aria-hidden="true">&rarr;</span>
                    </Link>
                )}
            </p>
        </div>
    );
}
