
'use client';

import { useApp } from "@/context/app-context";
import Link from "next/link";
import { UtensilsCrossed, Phone, Mail, MapPin, Crown as Crown1, Gem, Star, Shield } from 'lucide-react';
import React from "react";
import { WhatsappIcon } from "./icons/whatsapp-icon";

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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.55 3.1a.5.5 0 0 0-.25-.44.5.5 0 0 0-.58.1L8.35 6.08a.5.5 0 0 0-.16.53l.9 3.5a.5.5 0 0 0 .49.38h4.84a.5.5 0 0 0 .49-.38l.9-3.5a.5.5 0 0 0-.16-.53L12.55 3.1Z"/>
      <path d="M18 10h.5a.5.5 0 0 0 .4-.8l-2.2-3.4a.5.5 0 0 0-.8-.1l-2 1.2a.5.5 0 0 0-.2.4v5.6a.5.5 0 0 0 .5.5h3.5a.5.5 0 0 0 .5-.5V14a.5.5 0 0 0-1 0v1.5h-2.5v-5l1.6-.9L18 10Z"/>
      <path d="M6 10h-.5a.5.5 0 0 0-.4.8l2.2 3.4a.5.5 0 0 0 .8.1l2-1.2a.5.5 0 0 0 .2-.4V7a.5.5 0 0 0-.5-.5H6.5a.5.5 0 0 0-.5.5V9a.5.5 0 0 0 1 0V7.5h2.5v5l-1.6.9L6 10Z"/>
      <path d="M12 11.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" fill="currentColor" stroke="none" />
      <path d="M12 11.5a2 2 0 1 0-4 0 2 2 0 1 0 4 0Z" fill="currentColor" stroke="none"/>
      <path d="M15 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0Z" fill="currentColor" stroke="none"/>
      <path d="M9 17.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 1 0 5 0Z" fill="currentColor" stroke="none"/>
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
    const { state } = useApp();
    const { siteContent, design } = state;
    const { contact, footer } = siteContent;
    
    const IconComponent = iconMap[design.logoIcon] || UtensilsCrossed;
    const logoStyle = design.logoColor ? { color: design.logoColor } : {};


    return (
        <footer className="bg-card text-card-foreground border-t">
            <div className="container py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary" style={logoStyle}>
                            {IconComponent && <IconComponent className="h-7 w-7" />}
                            מלכתא
                        </Link>
                        <p className="text-muted-foreground text-sm">{footer?.tagline}</p>
                        <div className="flex gap-2">
                           <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                                <WhatsappIcon className="h-8 w-8 text-green-500 transition-opacity hover:opacity-80" />
                            </a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{footer?.contactTitle}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                <span>{contact?.address}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${contact?.phone}`} className="hover:text-primary">{contact?.phone}</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${contact?.email}`} className="hover:text-primary">{contact?.email}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{footer?.hoursTitle}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{contact.hours}</p>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {footer?.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
