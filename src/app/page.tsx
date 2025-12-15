'use client';
import HomePageClient from '@/components/home-page-logic';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <HomePageClient />
    </Suspense>
  );
}
