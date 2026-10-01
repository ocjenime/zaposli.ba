import type { Metadata } from 'next';
import type { ElementType } from 'react';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, ArrowRight, Calendar, Star, ShieldCheck, Clock, Map, Phone, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import AdGallery from '@/components/AdGallery';
import AdSaveShare from '@/components/AdSaveShare';
import { fetchActivePromotedAds } from '@/lib/promoted-ads';
import { getCategory, getCategoryShortName } from '@/lib/data';
import { site } from '@/lib/site';
import { formatDate } from '@/lib/date';
import { plural } from '@/lib/plural';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
      siteName: site.name,
      locale: 'bs_BA',
      type: 'article',
      images: ad.banner_url || ad.image_url ? [{ url: ad.banner_url || ad.image_url! }] : undefined,
    },
  };
}

export default async function AdDetailPage({ params }: AdDetailPageProps) {
  const { id } = await params;
  const ads = await fetchActivePromotedAds();
  const ad = ads.find((a) => a.id === id);

  if (!ad) notFound();

  const firm = ad.firms;
  const images = [ad.banner_url, ad.image_url].filter((u): u is string => !!u);
  const rating = firm?.average_rating || 0;
  const reviewCount = firm?.review_count || 0;
  const subtitle =
    ad.description.length > 120 ? `${ad.description.slice(0, 117)}...` : ad.description;

  // Usluge firme za pločice (najviše 6)
  let serviceTiles: { name: string; Icon: ElementType }[] = [];
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: firmRow } = await supabase
      .from('promoted_ads')
      .select('firm_id')
      .eq('id', id)
      .single();
    const fid = (firmRow as { firm_id?: string } | null)?.firm_id;
    if (fid) {
      const { data: catRows } = await supabase
        .from('firm_categories')
        .select('category_slug')
        .eq('firm_id', fid)
        .limit(6);
      serviceTiles = (((catRows || []) as { category_slug: string }[])
        .map((r) => getCategory(r.category_slug))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => ({ name: getCategoryShortName(c), Icon: c.icon })));
    }
  } catch {
    serviceTiles = [];
  }

  const profileHref = firm?.slug ? `/firma-profil/${firm.slug}/` : '/top-firme/';
  const phoneHref = firm?.phone ? `tel:${firm.phone.replace(/\s/g, '')}` : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pb-28 md:pb-10">
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Izdvojeni oglasi', url: '/izdvojeni-oglasi/' },
            { name: ad.title },
          ])}
        />
        <Breadcrumbs
          items={[
            { name: 'Izdvojeni oglasi', href: '/izdvojeni-oglasi/' },
            { name: ad.title },
          ]}
        />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AdGallery
            images={images}
            title={ad.title}
            adType={ad.ad_type}
          />

          <h1 className="text-[26px] sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mt-4">
            {ad.title}
          </h1>
          <p className="text-[15px] text-steel leading-snug mt-1.5">{subtitle}</p>

          {/* Firma */}
          {firm && (
            <div className="flex items-center gap-3 bg-cloud rounded-2xl p-3.5 mt-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-ink-950 shrink-0 flex items-center justify-center text-lg font-extrabold text-brand-orange">
                {firm.logo_url ? (
                  <NextImage
                    src={firm.logo_url}
                    alt={firm.name || 'Firma'}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  firm.name?.charAt(0).toUpperCase() || 'F'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-extrabold text-gray-900 text-[17px] leading-tight">{firm.name}</p>
                  {firm.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange bg-orange-50 border border-orange-100 rounded-full px-2.5 py-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Provjereno
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5">
                  {firm.city && (
                    <p className="flex items-center gap-1.5 text-[13px] text-steel">
                      <MapPin className="w-3.5 h-3.5" />
                      {firm.city}
                    </p>
                  )}
                  {ad.ends_at && (
                    <p className="flex items-center gap-1.5 text-[13px] text-steel">
                      <Calendar className="w-3.5 h-3.5" />
                      Aktivan do {formatDate(ad.ends_at)}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={profileHref}
                className="shrink-0 text-right group"
                aria-label="Pogledaj profil firme"
              >
                <p className="flex items-center justify-end gap-1">
                  <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <strong className="text-xl font-extrabold text-gray-900">{rating.toFixed(1)}</strong>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
                </p>
                <p className="text-xs text-steel mt-0.5">
                  {reviewCount} {plural(reviewCount, ['ocjena', 'ocjene', 'ocjena'])}
                </p>
              </Link>
            </div>
          )}

          <div className="mt-4">
            <AdSaveShare adId={ad.id} title={ad.title} />
          </div>

          {/* Opis */}
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-7 mb-2">Opis oglasa</h2>
          <p className="text-[15px] text-steel leading-relaxed whitespace-pre-line">{ad.description}</p>

          {/* Usluge */}
          {serviceTiles.length > 0 && (
            <>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-7 mb-3">Usluge</h2>
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {serviceTiles.map((s) => (
                  <div
                    key={s.name}
                    className="bg-cloud rounded-xl px-1 py-3 flex flex-col items-center justify-center gap-1.5 text-center min-h-[86px]"
                  >
                    <s.Icon className="w-6 h-6 text-brand-orange shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-800 leading-tight break-words">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Info red */}
          <div className="grid grid-cols-3 gap-2 mt-7 pt-5 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-gray-900">Lokacija</p>
                <p className="text-xs text-steel leading-snug">{firm?.city || 'BiH'} i šira regija</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:border-l sm:border-gray-100 sm:pl-3">
              <Map className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-gray-900">Oblast rada</p>
                <p className="text-xs text-steel leading-snug">Stambeni i poslovni objekti</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:border-l sm:border-gray-100 sm:pl-3">
              <Clock className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-gray-900">Iskustvo</p>
                <p className="text-xs text-steel leading-snug">Višegodišnje iskustvo</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-3xl grid grid-cols-2 gap-2.5">
          {phoneHref ? (
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-extrabold transition-colors active:scale-[0.99] min-h-[56px]"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span className="text-left leading-tight">
                <span className="block text-[15px]">Pozovi</span>
                <span className="block text-xs font-semibold opacity-90">{firm?.phone}</span>
              </span>
            </a>
          ) : null}
          <Link
            href={profileHref}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-extrabold transition-all hover:shadow-xl hover:shadow-brand-orange/25 active:scale-[0.99] min-h-[56px] ${phoneHref ? '' : 'col-span-2'}`}
          >
            <Building2 className="w-5 h-5 shrink-0" />
            <span className="text-[15px]">Pogledaj profil firme</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
