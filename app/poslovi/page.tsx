import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsPageClient from './ProjectsPageClient';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Poslovi i projekti u BiH - ponude majstora i firmi | Zaposli.ba',
  description:
    'Aktuelni građevinski poslovi, majstorski poslovi i projekti u Bosni i Hercegovini. Filtrirajte po gradu, kategoriji i budžetu. Pošaljite ponudu kao provjerena firma ili majstor - besplatna registracija.',
  keywords: [
    'poslovi BiH',
    'građevinski poslovi',
    'majstorski poslovi',
    'projekti BiH',
    'ponude majstora',
    'posao majstor',
    'građevinske firme',
    'Sarajevo',
    'Banja Luka',
    'Mostar',
  ],
  alternates: {
    canonical: `${site.url}/poslovi/`,
  },
  openGraph: {
    title: 'Poslovi i projekti u BiH - ponude majstora i firmi',
    description:
      'Aktuelni građevinski poslovi i majstorski projekti širom Bosne i Hercegovine. Filtrirajte po gradu, kategoriji i budžetu.',
    url: `${site.url}/poslovi/`,
    siteName: site.name,
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
