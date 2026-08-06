import type { Metadata } from 'next';
import TopFirmeContent from './TopFirmeContent';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Top firme i majstori u BiH - provjerene ocjene klijenata | Zaposli.ba',
  description:
    'Pronađite najbolje ocijenjene građevinske firme i majstore u Bosni i Hercegovini. Vodoinstalateri, električari, keramičari, molerski radnici i druge struke - sortirano prema stvarnim recenzijama klijenata.',
  keywords: [
    'top firme BiH',
    'najbolji majstori',
    'provjerene firme',
    'vodoinstalater',
    'električar',
    'keramičar',
    'moler',
    'ocjene majstora',
    'recenzije firmi',
    'Sarajevo',
    'Banja Luka',
    'Mostar',
  ],
  alternates: {
    canonical: `${site.url}/top-firme/`,
  },
  openGraph: {
    title: 'Top firme i majstori u BiH - provjerene ocjene klijenata',
    description:
      'Pronađite najbolje ocijenjene građevinske firme i majstore u Bosni i Hercegovini. Sortirano prema stvarnim recenzijama klijenata.',
    url: `${site.url}/top-firme/`,
    siteName: site.name,
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function TopFirmePage() {
  return <TopFirmeContent />;
}
