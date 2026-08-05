import type { Metadata } from 'next';
import TopFirmeContent from './TopFirmeContent';

export const metadata: Metadata = {
  title: 'Top firme | Zaposli.ba',
  description:
    'Pronađite najbolje ocijenjene građevinske firme i majstore u Bosni i Hercegovini. Sortirano prema stvarnim recenzijama klijenata.',
  keywords: ['top firme', 'najbolji majstori', 'građevinske firme', 'ocjene', 'recenzije', 'BiH'],
  alternates: {
    canonical: 'https://zaposli.ba/top-firme/',
  },
  openGraph: {
    title: 'Top firme | Zaposli.ba',
    description:
      'Pronađite najbolje ocijenjene građevinske firme i majstore u Bosni i Hercegovini. Sortirano prema stvarnim recenzijama klijenata.',
    url: 'https://zaposli.ba/top-firme/',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function TopFirmePage() {
  return <TopFirmeContent />;
}
