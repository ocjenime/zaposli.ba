import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/site';
import AuthWrapper from '@/components/AuthWrapper';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Zaposli.ba. Pronađite majstore za vaš posao',
    template: '%s',
  },
  description: site.description,
  keywords: 'građevinarstvo, majstori, majstore, Bosna, Hercegovina, renoviranje, gradnja, ponude, zaposli, vodoinstalater, električar, keramičar',
  authors: [{ name: site.name }],
  alternates: { canonical: site.url },
  openGraph: {
    title: 'Zaposli.ba. Pronađite majstore za vaš posao',
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: 'images/og-cover.png', width: 1200, height: 630, alt: 'Zaposli.ba. Pronađite majstora za vaš posao' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zaposli.ba. Pronađite majstore za vaš posao',
    description: site.description,
    images: ['images/og-cover.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs">
      <body className="min-h-screen">
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
