import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsPageClient from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Poslovi | Zaposli.ba',
  description:
    'Pronađite aktuelne građevinske i uslužne poslove širom Bosne i Hercegovine. Filtrirajte po gradu, kategoriji i budžetu. Pošaljite ponudu kao provjerena firma ili majstor.',
  keywords: ['poslovi', 'građevinski poslovi', 'majstor', 'firma', 'ponude', 'Bosna i Hercegovina'],
  alternates: {
    canonical: 'https://zaposli.ba/poslovi/',
  },
  openGraph: {
    title: 'Poslovi | Zaposli.ba',
    description:
      'Pronađite aktuelne građevinske i uslužne poslove širom Bosne i Hercegovine. Filtrirajte po gradu, kategoriji i budžetu.',
    url: 'https://zaposli.ba/poslovi/',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function PosloviPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </main>
          <Footer />
        </div>
      }
    >
      <ProjectsPageClient />
    </Suspense>
  );
}
