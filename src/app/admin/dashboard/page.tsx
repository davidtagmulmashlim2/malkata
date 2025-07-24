
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Edit, Image as ImageIcon, Palette } from 'lucide-react';
import MenuManager from './_components/menu-manager';
import ContentManager from './_components/content-manager';
import GalleryManager from './_components/gallery-manager';
import DesignManager from './_components/design-manager';


export default function DashboardPage() {
    return (
        <div className="container py-10">
            <Tabs defaultValue="menu" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="menu"><Utensils className="ms-2 h-4 w-4" /> ניהול תפריט</TabsTrigger>
                    <TabsTrigger value="content"><Edit className="ms-2 h-4 w-4" /> ניהול תוכן</TabsTrigger>
                    <TabsTrigger value="gallery"><ImageIcon className="ms-2 h-4 w-4" /> ניהול גלריה</TabsTrigger>
                    <TabsTrigger value="design"><Palette className="ms-2 h-4 w-4" /> ניהול עיצוב</TabsTrigger>
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
            </Tabs>
        </div>
    );
}
