import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { site } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zatraži ponudu | Zaposli.ba',
  description:
    'Pošaljite privatni zahtjev za ponudu od provjerene firme ili majstora na Zaposli.ba. Bez javnog objavljivanja, bez obaveze, odgovor do 48 sati.',
  alternates: { canonical: `${site.url}/zatrazi-ponodu/` },
  openGraph: {
    title: 'Zatraži ponudu | Zaposli.ba',
    description:
      'Pošaljite privatni zahtjev za ponudu od provjerene firme ili majstora na Zaposli.ba. Bez javnog objavljivanja, bez obaveze.',
    url: `${site.url}/zatrazi-ponodu/`,
    siteName: site.name,
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Zatraži ponudu' }],
  },
};

export default function ZatraziPonuduLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <Breadcrumbs items={[{ name: 'Zatraži ponudu' }]} />
      {children}
      <Footer />
    </div>
  );
}
