'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center text-right min-h-[calc(100vh-16rem)]">
      <FileQuestion className="h-32 w-32 text-primary mb-4" />
      <h1 className="text-5xl font-bold font-headline mb-2">404 - עמוד לא נמצא</h1>
      <p className="text-lg text-muted-foreground mb-6">מצטערים, לא מצאנו את העמוד שחיפשתם.</p>
      <Button asChild>
        <Link href="/">חזרה לעמוד הבית</Link>
      </Button>
    </div>
  );
}
