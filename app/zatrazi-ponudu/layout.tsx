import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zatraži ponudu | Zaposli.ba',
  description:
    'Zatraži ponudu od provjerenih firmi i majstora na Zaposli.ba. Upiši detalje posla i primi ponude u roku od 24 sata.',
  keywords: ['zatraži ponudu', 'ponuda', 'građevinski radovi', 'majstor', 'firma', 'BiH'],
  alternates: {
    canonical: 'https://zaposli.ba/zatrazi-ponudu/',
  },
  openGraph: {
    title: 'Zatraži ponudu | Zaposli.ba',
    description:
      'Zatraži ponudu od provjerenih firmi i majstora na Zaposli.ba. Upiši detalje posla i primi ponude u roku od 24 sata.',
    url: 'https://zaposli.ba/zatrazi-ponudu/',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function ZatraziPonuduLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
