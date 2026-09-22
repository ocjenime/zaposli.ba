import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsPageClient from './ProjectsPageClient';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Posao u BiH - aktuelni poslovi i projekti, ponude majstora | Zaposli.ba',
  description:
    'Posao u Sarajevu, Banjoj Luci, Mostaru, Tuzli i cijeloj BiH: aktuelni građevinski i majstorski poslovi i projekti. Filtrirajte po gradu, kategoriji i budžetu. Firme i majstori šalju ponude besplatno nakon registracije.',
  keywords: [
    'posao BiH',
    'posao Sarajevo',
    'posao Banja Luka',
    'posao Mostar',
    'posao Tuzla',
    'posao Zenica',
    'poslovi BiH',
    'građevinski poslovi',
    'majstorski poslovi',
    'projekti BiH',
    'ponude majstora',
    'posao majstor',
    'građevinske firme',
  ],
  alternates: {
    canonical: `${site.url}/poslovi/`,
  },
  openGraph: {
    title: 'Posao u BiH - aktuelni poslovi i projekti',
    description:
      'Posao u Sarajevu, Banjoj Luci, Mostaru i cijeloj BiH: aktuelni građevinski i majstorski poslovi. Filtrirajte po gradu, kategoriji i budžetu.',
    url: `${site.url}/poslovi/`,
    siteName: site.name,
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Poslovi i projekti' }],
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
