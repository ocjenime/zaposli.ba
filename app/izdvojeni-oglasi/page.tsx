import type { Metadata } from 'next';
import PromotedAdsListing from '@/components/PromotedAdsListing';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Izdvojeni oglasi | Zaposli.ba',
  description:
    'Pregledajte premium izdvojene oglase provjerenih firmi i majstora. Pronađite promocije usluga ili ponude posla širom Bosne i Hercegovine.',
  alternates: { canonical: `${site.url}/izdvojeni-oglasi/` },
  openGraph: {
    title: 'Izdvojeni oglasi | Zaposli.ba',
    description:
      'Pregledajte premium izdvojene oglase provjerenih firmi i majstora širom Bosne i Hercegovine.',
    url: `${site.url}/izdvojeni-oglasi/`,
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Izdvojeni oglasi' }],
  },
};

export const revalidate = 60;

export default function PromotedAdsPage() {
  return <PromotedAdsListing breadcrumbLabel="Izdvojeni oglasi" />;
}
