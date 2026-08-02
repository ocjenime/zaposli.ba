import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/site';
import AuthWrapper from '@/components/AuthWrapper';
import ThemeProvider from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ToastProvider';
import { JsonLd, websiteSchema, organizationSchema } from '@/lib/jsonld';

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Zaposli.ba — Pronađite majstore za vaš posao',
    template: '%s | Zaposli.ba',
  },
  description: site.description,
  keywords: ['građevinarstvo', 'majstori', 'majstore', 'Bosna', 'Hercegovina', 'renoviranje', 'gradnja', 'ponude', 'zaposli', 'vodoinstalater', 'električar', 'keramičar', 'adaptacija', 'fasada', 'adaptacije'],
  applicationName: 'Zaposli.ba',
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: site.url },
  openGraph: {
    title: 'Zaposli.ba — Pronađite majstore za vaš posao',
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: 'images/og-cover.webp', width: 1200, height: 630, alt: 'Zaposli.ba — Pronađite majstora za vaš posao' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zaposli.ba — Pronađite majstore za vaš posao',
    description: site.description,
    images: ['images/og-cover.webp'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  other: {
    'msapplication-TileColor': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs" suppressHydrationWarning>
      <body className="min-h-screen">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange={false}>
          <ToastProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
