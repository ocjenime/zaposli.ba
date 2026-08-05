import type { Metadata } from 'next';
import ZaFirmeContent from './ZaFirmeContent';

export const metadata: Metadata = {
  title: 'Za firme | Zaposli.ba',
  description:
    'Registrujte svoju građevinsku firmu ili majstorski obrt na Zaposli.ba. Dobijajte redovne upite za posao, šaljite ponude i rastite bez velikih ulaganja.',
  keywords: ['za firme', 'registracija firme', 'majstor', 'građevinske firme', 'upiti za posao', 'BiH'],
  alternates: {
    canonical: 'https://zaposli.ba/za-firme/',
  },
  openGraph: {
    title: 'Za firme | Zaposli.ba',
    description:
      'Registrujte svoju građevinsku firmu ili majstorski obrt na Zaposli.ba. Dobijajte redovne upite za posao, šaljite ponude i rastite.',
    url: 'https://zaposli.ba/za-firme/',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function ZaFirmePage() {
  return <ZaFirmeContent />;
}
