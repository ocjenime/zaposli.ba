import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Objavi posao besplatno | Zaposli.ba',
  description:
    'Objavite svoj građevinski ili uslužni posao besplatno na Zaposli.ba. Primi ponude od provjerenih firmi i majstora u roku od 24 sata.',
  keywords: ['objavi posao', 'besplatno', 'građevinski posao', 'majstor', 'firma', 'ponude', 'BiH'],
  alternates: {
    canonical: 'https://zaposli.ba/objavi-projekat/',
  },
  openGraph: {
    title: 'Objavi posao besplatno | Zaposli.ba',
    description:
      'Objavite svoj građevinski ili uslužni posao besplatno na Zaposli.ba. Primi ponude od provjerenih firmi i majstora u roku od 24 sata.',
    url: 'https://zaposli.ba/objavi-projekat/',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: 'https://zaposli.ba/images/og-cover.webp', width: 1200, height: 630, alt: 'Zaposli.ba - Objavi posao' }],
  },
};

export default function ObjaviProjekatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
