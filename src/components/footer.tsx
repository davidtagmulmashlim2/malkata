'use client';

import { useApp } from "@/context/app-context";
import Link from "next/link";
import { UtensilsCrossed, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
    const { state } = useApp();
    const { contact } = state.siteContent;

    return (
        <footer className="bg-card text-card-foreground border-t">
            <div className="container py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary">
                            <UtensilsCrossed className="h-7 w-7" />
                            מלכתא
                        </Link>
                        <p className="text-muted-foreground text-sm">אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">יצירת קשר</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                <span>{contact.address}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.phone}</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">שעות פתיחה</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{contact.hours}</p>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} מלכתא. כל הזכויות שמורות.</p>
                </div>
            </div>
        </footer>
    );
}
