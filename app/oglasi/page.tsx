import type { Metadata } from 'next';
import PromotedAdsPageClient from './PromotedAdsPageClient';
import { fetchActivePromotedAds } from '@/lib/promoted-ads';
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

export default async function OglasiPage() {
  let ads: Awaited<ReturnType<typeof fetchActivePromotedAds>> = [];
  try {
    ads = await fetchActivePromotedAds();
  } catch {
    ads = [];
  }

  return (
    <PromotedAdsPageClient
      ads={ads}
      breadcrumbLabel="Oglasi"
      eyebrow="Premium oglasi"
      title="Premium oglasi i reklame"
      subtitle="Pregledajte promocije provjerenih firmi i majstora ili pronađite radnike spremne za posao. Sve na jednom mjestu."
    />
  );
}
