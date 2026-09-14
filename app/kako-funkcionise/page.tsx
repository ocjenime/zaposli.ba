import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorksContent from './HowItWorksContent';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kako funkcioniše Zaposli.ba | Zaposli.ba',
  description:
    'Jednostavan proces u 3 koraka: objavite posao besplatno, primite ponude od provjerenih firmi i odaberite najboljeg majstora u BiH.',
  alternates: { canonical: `${site.url}/kako-funkcionise/` },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HowItWorksContent />
      <Footer />
    </div>
  );
}
