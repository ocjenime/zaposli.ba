import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';
import { site } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zatraži ponudu | Zaposli.ba',
  description:
    'Pošaljite privatni zahtjev za ponudu od provjerene firme ili majstora na Zaposli.ba. Bez javnog objavljivanja, bez obaveze, odgovor do 48 sati.',
  alternates: { canonical: `${site.url}/zatrazi-ponodu/` },
};

export default function ZatraziPonuduLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <Breadcrumbs items={[{ name: 'Zatraži ponudu' }]} />
      {children}
      <Footer />
      <JsonLd data={breadcrumbSchema([{ name: 'Zatraži ponudu', url: `${site.url}/zatrazi-ponodu/` }])} />
    </div>
  );
}
