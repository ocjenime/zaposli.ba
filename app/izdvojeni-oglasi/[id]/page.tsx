import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Megaphone, Sparkles, Users, MapPin, ArrowRight, Calendar } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { fetchActivePromotedAds, getAdTypeLabel } from '@/lib/promoted-ads';
import { site } from '@/lib/site';

export const revalidate = 60;

interface AdDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const ads = await fetchActivePromotedAds();
  const ad = ads.find((a) => a.id === id);

  if (!ad) {
    return { title: 'Oglas nije pronađen | Zaposli.ba' };
  }

  const title = `${ad.title} | Zaposli.ba`;
  const description = ad.description.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/izdvojeni-oglasi/${id}/` },
    openGraph: {
      title,
      description,
      url: `${site.url}/izdvojeni-oglasi/${id}/`,
      images: ad.banner_url || ad.image_url ? [{ url: ad.banner_url || ad.image_url! }] : undefined,
    },
  };
}

export default async function AdDetailPage({ params }: AdDetailPageProps) {
  const { id } = await params;
  const ads = await fetchActivePromotedAds();
  const ad = ads.find((a) => a.id === id);

  if (!ad) notFound();

  const isWorkerSearch = ad.ad_type === 'worker_search';
  const firm = ad.firms;
  const bannerUrl = ad.banner_url || ad.image_url;
  const ctaHref = ad.cta_url || (firm?.slug ? `/firma-profil/${firm.slug}/` : '/');
  const ctaLabel = ad.cta_url ? 'Posjeti' : 'Pogledaj profil firme';

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <Breadcrumbs
        items={[
          { name: 'Izdvojeni oglasi', href: '/izdvojeni-oglasi/' },
          { name: ad.title },
        ]}
      />
      <main className="flex-grow">
        {/* Banner hero */}
        <section className="relative h-48 md:h-72 overflow-hidden">
          {bannerUrl ? (
            <NextImage
              src={bannerUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900 to-ink-950 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                {isWorkerSearch ? (
                  <Users className="w-10 h-10 text-brand-orange" />
                ) : (
                  <Sparkles className="w-10 h-10 text-brand-orange" />
                )}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cloud via-cloud/60 to-transparent" />
          <div className="absolute inset-0 bg-ink-950/30" />
        </section>

        {/* Content */}
        <section className="relative -mt-16 md:-mt-24 pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl bg-ink-900/80 backdrop-blur-md border border-ink-800 p-6 md:p-8 shadow-2xl shadow-black/40">
              {/* Type badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border mb-4 ${
                  isWorkerSearch
                    ? 'bg-blue-500/10 text-blue-200 border-blue-400/20'
                    : 'bg-brand-orange/10 text-orange-200 border-brand-orange/20'
                }`}
              >
                {isWorkerSearch ? <Users className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {getAdTypeLabel(ad.ad_type)}
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{ad.title}</h1>

              {/* Firm row */}
              {firm && (
                <div className="flex items-start gap-4 mb-6 p-4 rounded-xl bg-ink-950/60 border border-ink-800">
                  <LogoDisplay
                    name={firm.name || 'Firma'}
                    src={firm.logo_url}
                    alt={firm.name || 'Firma'}
                    size="md"
                    rounded="2xl"
                    className="border-2 border-ink-800 shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-white">{firm.name}</h2>
                      {firm.verified && <VerifiedBadge size="sm" className="border-white/10" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                      {firm.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {firm.city}
                        </span>
                      )}
                      {ad.ends_at && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Aktivan do {new Date(ad.ends_at).toLocaleDateString('bs-BA')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-white/80 leading-relaxed whitespace-pre-line">{ad.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={ctaHref}
                  target={ad.cta_url ? '_blank' : undefined}
                  rel={ad.cta_url ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                >
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/izdvojeni-oglasi/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ink-800 text-white font-medium hover:bg-ink-700 transition-colors"
                >
                  <Megaphone className="w-4 h-4" />
                  Svi oglasi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
