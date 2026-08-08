import type { Metadata } from 'next';
import CategoriesContent from './CategoriesContent';
import { categories, cities } from '@/lib/data';
import { site } from '@/lib/site';

const seoCategories = categories.filter((c) => !c.noSeo);

export const metadata: Metadata = {
  title: `Kategorije usluga u BiH - ${seoCategories.length} struka | Pronađite majstora | Zaposli.ba`,
  description: `Pronađite majstore za sve vrste usluga u Bosni i Hercegovini. ${seoCategories.length} kategorija - od građevine, vodoinstalacije i električara do čišćenja, selidbi i hitnih intervencija 24/7.`,
  keywords: [
    'kategorije usluga BiH',
    'majstori kategorije',
    'građevinske usluge',
    'vodoinstalater',
    'električar',
    'keramičar',
    'hitne intervencije',
    'čišćenje',
    'selidbe',
  ],
  alternates: { canonical: `${site.url}/kategorije/` },
  openGraph: {
    title: `Kategorije usluga u BiH - ${seoCategories.length} struka`,
    description: `Pronađite majstore za sve vrste usluga u Bosni i Hercegovini. ${cities.length} gradova, ${seoCategories.length} kategorija.`,
    url: `${site.url}/kategorije/`,
    siteName: site.name,
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}
