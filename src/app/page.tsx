
'use client';
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const HomePageClient = dynamic(
  () => import('@/components/home-page-logic'),
  { 
    ssr: false,
    loading: () => (
       <div className="text-right">
             <section className="relative w-full text-white overflow-hidden" style={{ height: '80vh' }}>
                 <Skeleton className="w-full h-full" />
             </section>
             <section className="container py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-right mb-10">
                  <Skeleton className="h-9 w-48" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array(3).fill(null).map((dish, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
              </section>
        </div>
    )
  }
)

export default function Home() {
  return <HomePageClient />
}
