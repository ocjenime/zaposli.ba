import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zaposli.ba - Pronađite majstore za vaš projekat',
  description: 'Platforma koja spaja kupce sa građevinskim firmama i zanatlijama u Bosni i Hercegovini. Besplatno objavite projekat i primite ponude od provjerenih izvođača.',
  keywords: 'građevinarstvo, majstori, zanatlije, Bosna, Hercegovina, renoviranje, gradnja, ponude, zaposli',
  openGraph: {
    title: 'Zaposli.ba',
    description: 'Pronađite najbolje majstore za vaš građevinski projekat',
    url: 'https://zaposli.ba',
    siteName: 'Zaposli.ba',
    locale: 'bs_BA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}