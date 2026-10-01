import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Megaphone, Sparkles, Users, MapPin, ArrowRight, Phone, Clock, Crown, Star } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import CopyTextButton from '@/components/CopyTextButton';
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
  const related = ads.filter((a) => a.id !== id).slice(0, 3);
  const daysLeft = ad.ends_at
    ? Math.max(0, Math.ceil((new Date(ad.ends_at).getTime() - Date.now()) / 86400000))
    : null;
  const firmRating = firm?.average_rating || 0;
  const firmReviews = firm?.review_count || 0;

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
        {/* Banner hero - 4:3 pun ekran, bez sjena i preklapanja */}
        <section className="relative overflow-hidden">
          {bannerUrl ? (
            <div className="relative aspect-[4/3] md:aspect-[21/9] md:max-h-[75vh] md:w-full overflow-hidden bg-ink-950">
              <NextImage
                src={bannerUrl}
                alt={ad.title}
                fill
                unoptimized
                className="object-cover object-bottom"
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <div className="h-56 md:h-80 bg-gradient-to-br from-ink-900 to-ink-950 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                {isWorkerSearch ? (
                  <Users className="w-10 h-10 text-brand-orange" />
                ) : (
                  <Sparkles className="w-10 h-10 text-brand-orange" />
                )}
              </div>
            </div>
          )}
        </section>

        {/* Content - ispod slike */}
        <section className="relative pt-6 md:pt-8 pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-ink-900/80 backdrop-blur-md border border-ink-800 p-6 md:p-8 shadow-2xl shadow-black/40 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
              {/* Badge red */}
              <div className="relative flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-lg shadow-brand-orange/25">
                  <Crown className="w-3.5 h-3.5" /> Sponzorirano
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${
                    isWorkerSearch
                      ? 'bg-blue-500/10 text-blue-200 border-blue-400/20'
                      : 'bg-brand-orange/10 text-orange-200 border-brand-orange/20'
                  }`}
                >
                  {isWorkerSearch ? <Users className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {getAdTypeLabel(ad.ad_type)}
                </span>
                {daysLeft !== null && daysLeft > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/5 text-white/70 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    Aktivan još {daysLeft === 1 ? '1 dan' : `${daysLeft} dana`}
                  </span>
                )}
              </div>

              <h1 className="relative text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-5">{ad.title}</h1>

              {/* Firm row */}
              {firm && (
                <div className="relative flex items-start gap-4 mb-6 p-4 rounded-2xl bg-ink-950/60 border border-ink-800">
                  <LogoDisplay
                    name={firm.name || 'Firma'}
                    src={firm.logo_url}
                    alt={firm.name || 'Firma'}
                    size="md"
                    rounded="2xl"
                    className="border-2 border-ink-800 shadow-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-white">{firm.name}</h2>
                      {firm.verified && <VerifiedBadge size="sm" className="border-white/10" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                      {firm.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {firm.city}
                        </span>
                      )}
                      {firmReviews > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <strong className="text-white">{firmRating.toFixed(1)}</strong>
                          <span>({firmReviews} {firmReviews === 1 ? 'recenzija' : 'recenzija'})</span>
                        </span>
                      )}
                    </div>
                    {firm.phone && (
                      <a
                        href={`tel:${firm.phone.replace(/\s/g, '')}`}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/15 border border-green-400/20 text-green-300 text-sm font-bold hover:bg-green-500/25 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {firm.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="relative prose prose-invert max-w-none mb-8">
                <p className="text-white/80 leading-relaxed whitespace-pre-line">{ad.description}</p>
              </div>

              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={ctaHref}
                  target={ad.cta_url ? '_blank' : undefined}
                  rel={ad.cta_url ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95 min-h-[52px]"
                >
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {firm?.phone ? (
                  <a
                    href={`tel:${firm.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold hover:bg-white/20 transition-colors min-h-[52px]"
                  >
                    <Phone className="w-4 h-4" />
                    Pozovi odmah
                  </a>
                ) : (
                  <Link
                    href="/izdvojeni-oglasi/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold hover:bg-white/20 transition-colors min-h-[52px]"
                  >
                    <Megaphone className="w-4 h-4" />
                    Svi oglasi
                  </Link>
                )}
              </div>
              <div className="relative flex justify-center sm:justify-start mt-4">
                <ShareButtons title={ad.title} path={`/izdvojeni-oglasi/${ad.id}/`} />
              </div>
              <div className="relative mt-3">
                <CopyTextButton
                  className="w-full"
                  text={`🔥 ${ad.title}\n🏢 ${firm?.name || 'Zaposli.ba'}${firm?.city ? ` | 📍 ${firm.city}` : ''}\n\n👉 Pogledaj oglas:\n${site.url}/izdvojeni-oglasi/${ad.id}/`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ostali oglasi */}
        {related.length > 0 && (
          <section className="relative pb-16 md:pb-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white">
                  Ostali oglasi
                </h2>
                <Link
                  href="/izdvojeni-oglasi/"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline"
                >
                  Svi oglasi
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {related.map((r) => {
                  const rBanner = r.banner_url || r.image_url;
                  return (
                    <Link
                      key={r.id}
                      href={`/izdvojeni-oglasi/${r.id}/`}
                      className="group rounded-2xl overflow-hidden border border-gray-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-orange/40 hover:shadow-lg transition-all"
                    >
                      {rBanner ? (
                        <div className="relative aspect-[4/3] overflow-hidden bg-ink-950">
                          <NextImage
                            src={rBanner}
                            alt={r.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gradient-to-br from-ink-900 to-ink-950 flex items-center justify-center">
                          <Megaphone className="w-8 h-8 text-brand-orange" />
                        </div>
                      )}
                      <p className="p-3 text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-orange transition-colors">
                        {r.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      {/* Sticky CTA - mobitel */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-xl border-t border-gray-100 dark:border-ink-800 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-2">
          {firm?.phone ? (
            <a
              href={`tel:${firm.phone.replace(/\s/g, '')}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white text-sm font-bold active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" />
              Pozovi
            </a>
          ) : null}
          <Link
            href={ctaHref}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-sm font-bold active:scale-95 transition-transform"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
