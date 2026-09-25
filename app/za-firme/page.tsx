import type { Metadata } from 'next';
import ZaFirmeContent from './ZaFirmeContent';

export const metadata: Metadata = {
    title: 'Za profesionalce | Zaposli.ba',
  description:
    'Registrujte svoju građevinsku firmu ili majstorski obrt na Zaposli.ba. Dobijajte redovne upite za posao, šaljite ponude i rastite bez velikih ulaganja.',
  keywords: ['za firme', 'registracija firme', 'majstor', 'građevinske firme', 'upiti za posao', 'BiH'],
  alternates: {
    canonical: 'https://zaposli.ba/za-firme/',
  },
  openGraph: {
  title: 'Za profesionalce | Zaposli.ba',
    description:
      'Registrujte svoju građevinsku firmu ili majstorski obrt na Zaposli.ba. Dobijajte redovne upite za posao, šaljite ponude i rastite.',
    url: 'https://zaposli.ba/za-firme/',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: 'https://zaposli.ba/images/og-cover.webp', width: 1200, height: 630, alt: 'Zaposli.ba - Za profesionalce' }],
  },
};

export default function ZaFirmePage() {
  return <ZaFirmeContent />;
}
