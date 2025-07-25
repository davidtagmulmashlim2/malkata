
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Edit, Image as ImageIcon, Palette, Users, Star } from 'lucide-react';
import MenuManager from './_components/menu-manager';
import ContentManager from './_components/content-manager';
import GalleryManager from './_components/gallery-manager';
import DesignManager from './_components/design-manager';
import SubscribersManager from './_components/subscribers-manager';
import TestimonialsManager from './_components/testimonials-manager';


export default function DashboardPage() {
    return (
        <div className="container py-10">
            <Tabs defaultValue="menu" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="menu"><Utensils className="ms-2 h-4 w-4" /> ניהול תפריט</TabsTrigger>
                    <TabsTrigger value="content"><Edit className="ms-2 h-4 w-4" /> ניהול תוכן</TabsTrigger>
                    <TabsTrigger value="gallery"><ImageIcon className="ms-2 h-4 w-4" /> ניהול גלריה</TabsTrigger>
                    <TabsTrigger value="design"><Palette className="ms-2 h-4 w-4" /> ניהול עיצוב</TabsTrigger>
                    <TabsTrigger value="subscribers"><Users className="ms-2 h-4 w-4" /> מועדון לקוחות</TabsTrigger>
                    <TabsTrigger value="testimonials"><Star className="ms-2 h-4 w-4" /> ניהול המלצות</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="mt-6">
                    <MenuManager />
                </TabsContent>
                <TabsContent value="content" className="mt-6">
                    <ContentManager />
                </TabsContent>
                <TabsContent value="gallery" className="mt-6">
                    <GalleryManager />
                </TabsContent>
                 <TabsContent value="design" className="mt-6">
                    <DesignManager />
                </TabsContent>
                <TabsContent value="subscribers" className="mt-6">
                    <SubscribersManager />
                </TabsContent>
                 <TabsContent value="testimonials" className="mt-6">
                    <TestimonialsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}
