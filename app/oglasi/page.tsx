import type { Metadata } from 'next';
import PromotedAdsListing from '@/components/PromotedAdsListing';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Oglasi | Zaposli.ba',
  description:
    'Pregledajte premium oglase provjerenih firmi i majstora. Pronađite promocije usluga ili ponude posla širom Bosne i Hercegovine.',
  alternates: { canonical: `${site.url}/oglasi/` },
  openGraph: {
    title: 'Oglasi | Zaposli.ba',
    description:
      'Pregledajte premium oglase provjerenih firmi i majstora širom Bosne i Hercegovine.',
    url: `${site.url}/oglasi/`,
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Oglasi' }],
  },
};

export const revalidate = 60;

export default function OglasiPage() {
  return <PromotedAdsListing breadcrumbLabel="Oglasi" />;
}
