

'use client';

import { useApp } from "@/context/app-context";
import Link from "next/link";
import { UtensilsCrossed, Phone, Mail, MapPin, Crown as Crown1, Gem, Star, Shield } from 'lucide-react';
import React from "react";
import { WhatsappIcon } from "./icons/whatsapp-icon";
import { InstagramIcon } from "./icons/instagram-icon";
import { FacebookIcon } from "./icons/facebook-icon";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const Crown2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
    </svg>
);

const Crown3 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C9.2 2 7 4.2 7 7c0 1.5.6 2.8 1.5 3.7L3 14h18l-5.5-3.3c.9-.9 1.5-2.2 1.5-3.7C17 4.2 14.8 2 12 2zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
    </svg>
);

const Crown4 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" {...props}>
        <path d="M12 2L9.5 7h-6L6 11.5 3.5 17h6l2.5-5 2.5 5h6l-2.5-5.5L18 7h-6z"/>
    </svg>
);


const iconMap: { [key: string]: React.ElementType | null } = {
  default: UtensilsCrossed,
  crown: Crown1,
  crown2: Crown2,
  crown3: Crown3,
  crown4: Crown4,
  gem: Gem,
  star: Star,
  shield: Shield,
  none: null,
};


export function Footer() {
    const { state, isLoading } = useApp();
    const { siteContent, design } = state;
    const { contact, footer } = siteContent;
    
    const IconComponent = iconMap[design.logoIcon] || UtensilsCrossed;
    const logoStyle = design.logoColor ? { color: design.logoColor } : {};

    const textSizeClasses: { [key: string]: string } = {
      'xs': 'text-xs', 'sm': 'text-sm', 'base': 'text-base', 'lg': 'text-lg', 'xl': 'text-xl', 
      '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl', 
      '6xl': 'text-6xl', '7xl': 'text-7xl', '8xl': 'text-8xl', '9xl': 'text-9xl',
    };

    return (
        <footer className="bg-card text-card-foreground border-t">
            <div className="container py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary" style={logoStyle}>
                            {IconComponent && <IconComponent className="h-7 w-7" />}
                            מלכתא
                        </Link>
                        {footer?.tagline && <p className="text-muted-foreground text-sm">{footer.tagline}</p>}
                        <div className="flex gap-4">
                           <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                                <WhatsappIcon className="h-7 w-7 text-green-500 transition-opacity hover:opacity-80" />
                            </a>
                            {contact.showInstagram && contact.instagram && (
                                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram">
                                    <InstagramIcon className="h-7 w-7 text-pink-600 transition-opacity hover:opacity-80" />
                                </a>
                            )}
                             {contact.showFacebook && contact.facebook && (
                                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook">
                                    <FacebookIcon className="h-7 w-7 text-blue-600 transition-opacity hover:opacity-80" />
                                </a>
                            )}
                        </div>
                    </div>
                    
                    {(footer?.contactTitle || contact?.address || contact?.phone) && (
                        <div className="space-y-4">
                             {footer?.contactTitle && <h3 className="text-lg font-semibold">{footer.contactTitle}</h3>}
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {contact?.address && (
                                    <li className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                        <span>{contact.address}</span>
                                    </li>
                                )}
                                 {contact?.phone && (
                                    <li className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.phone}</a>
                                    </li>
                                 )}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-4">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-6 w-32"/>
                                <Skeleton className="h-4 w-48"/>
                                <Skeleton className="h-4 w-40"/>
                            </>
                        ) : (
                            <>
                                {footer?.hoursTitle && <h3 className="text-lg font-semibold">{footer.hoursTitle}</h3>}
                                {footer?.hoursContent && (
                                    <div 
                                        className={cn(
                                            "text-muted-foreground whitespace-pre-line",
                                            footer.hoursContentFontSize ? textSizeClasses[footer.hoursContentFontSize] : "text-sm",
                                            footer.hoursContentIsBold && "font-bold"
                                        )}
                                        style={{ color: footer.hoursContentColor || undefined }}
                                    >
                                        {footer.hoursContent}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                </div>
                {footer?.copyright && (
                    <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} {footer.copyright}</p>
                    </div>
                )}
            </div>
        </footer>
    );
}
