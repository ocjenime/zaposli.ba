import type { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';
import { categories } from '@/lib/data';
import { site } from '@/lib/site';

const seoCategories = categories.filter((c) => !c.noSeo);

export const metadata: Metadata = {
  title: `Kategorije usluga u BiH - ${seoCategories.length} struka | Pronađite profesionalca | Zaposli.ba`,
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
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
