'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Crown, ArrowRight, Sparkles, Users,
  Building2, Wrench, Hammer, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import ShareIconButton from '@/components/ShareIconButton';

function FeaturedAdCard({ ad, rank }: { ad: PublicPromotedAd; rank: number }) {
  const isWorkerSearch = ad.ad_type === 'worker_search';
  const bannerUrl = ad.banner_url || ad.image_url;

  return (
    <Link
      href={`/izdvojeni-oglasi/${ad.id}/`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 hover:border-brand-orange/30 dark:hover:border-brand-orange/40 hover:shadow-xl transition-all duration-300 overflow-hidden snap-start min-w-[280px] sm:min-w-0"
    >
      {/* Rank badge */}
      <div className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-gradient-to-br from-brand-orange to-amber-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-brand-orange/20">
        {rank}
      </div>

      {/* Sponsored badge */}
      <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
        <Crown className="w-3 h-3" /> Sponzorirano
      </div>

      {/* Share overlay */}
      <div className="absolute bottom-3 right-3 z-20">
        <ShareIconButton title={ad.title} path={`/izdvojeni-oglasi/${ad.id}/`} />
      </div>

      {/* Banner - kvadrat, slika preko cijelog kadra */}
      {bannerUrl ? (
        <div className="relative aspect-square overflow-hidden bg-ink-950">
          <NextImage
            src={bannerUrl}
            alt={ad.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 20vw"
          />
        </div>
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-ink-950">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-ink-950 dark:to-ink-900">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-ink-800 shadow-sm flex items-center justify-center">
              {isWorkerSearch ? (
                <Users className="w-6 h-6 text-brand-orange" />
              ) : (
                <Sparkles className="w-6 h-6 text-brand-orange" />
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content - samo skriveni naslov za SEO/čitače ekrana */}
      <span className="sr-only">{ad.title}</span>
    </Link>
  );
}

const demoAds = [
  {
    rank: 1,
    title: 'Reklamirajte svoju firmu',
    type: 'promotion' as const,
    gradient: 'bg-gradient-to-br from-ink-950 via-orange-950/70 to-ink-950',
    icon: Building2,
    firm: 'Vaša firma d.o.o.',
    city: 'Sarajevo',
    rating: 4.9,
    reviews: 41,
  },
  {
    rank: 2,
    title: 'Tražimo iskusne majstore',
    type: 'worker_search' as const,
    gradient: 'bg-gradient-to-br from-ink-950 via-blue-950/70 to-ink-950',
    icon: Users,
    firm: 'Gradnja Plus',
    city: 'Bihać',
    rating: 4.6,
    reviews: 18,
  },
  {
    rank: 3,
    title: 'Hitne intervencije 24/7',
    type: 'promotion' as const,
    gradient: 'bg-gradient-to-br from-ink-950 via-red-950/70 to-ink-950',
    icon: Wrench,
    firm: 'VodaMajstor',
    city: 'Tuzla',
    rating: 4.9,
    reviews: 41,
  },
  {
    rank: 4,
    title: 'Izrada i sanacija krovova',
    type: 'promotion' as const,
    gradient: 'bg-gradient-to-br from-ink-950 via-emerald-950/70 to-ink-950',
    icon: Hammer,
    firm: 'Krov Expert',
    city: 'Zenica',
    rating: 4.7,
    reviews: 32,
  },
  {
    rank: 5,
    title: 'Elektro instalacije za stanove',
    type: 'promotion' as const,
    gradient: 'bg-gradient-to-br from-ink-950 via-amber-950/70 to-ink-950',
    icon: Zap,
    firm: 'Elektron d.o.o.',
    city: 'Mostar',
    rating: 4.5,
    reviews: 17,
  },
];

function DemoFeaturedAdCard({
  demo,
}: {
  demo: (typeof demoAds)[number];
}) {
  const isWorkerSearch = demo.type === 'worker_search';
  const Icon = demo.icon;

  return (
    <Link
      href="/za-firme/#reklame"
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 hover:border-brand-orange/30 dark:hover:border-brand-orange/40 hover:shadow-xl transition-all duration-300 overflow-hidden snap-start min-w-[280px] sm:min-w-0"
    >
      {/* Rank badge */}
      <div className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-gradient-to-br from-brand-orange to-amber-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-brand-orange/20">
        {demo.rank}
      </div>

      {/* Sponsored badge */}
      <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
        <Crown className="w-3 h-3" /> Sponzorirano
      </div>

      {/* Demo banner */}
      <div className={`relative aspect-square overflow-hidden ${demo.gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-white/90 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3 h-3 text-brand-orange" /> Ovo može biti vaš oglas
          </span>
        </div>
      </div>

      {/* Content - samo skriveni naslov za SEO/čitače ekrana */}
      <span className="sr-only">{demo.title}</span>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 overflow-hidden snap-start min-w-[280px] sm:min-w-0 animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 dark:bg-ink-950" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-ink-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-ink-800 rounded w-1/3" />
        <div className="h-9 bg-gray-200 dark:bg-ink-800 rounded w-9 self-end" />
      </div>
    </div>
  );
}

export default function FeaturedAdsSection() {
  const [ads, setAds] = useState<PublicPromotedAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAds() {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('promoted_ads')
          .select(
            'id,title,description,image_url,banner_url,cta_url,ad_type,destination,ends_at,created_at,homepage_position,firms(name,slug,city,logo_url,verified,average_rating,review_count)'
          )
          .eq('status', 'active')
          .gt('ends_at', now)
          .order('homepage_position', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const typedAds = ((data || []) as unknown as PublicPromotedAd[]).filter(
          (ad) =>
            !ad.firms?.slug?.startsWith('test-') &&
            ad.destination !== 'listing' &&
            ad.destination !== 'homepage_banner'
        );
        const sorted = typedAds.sort((a, b) => {
          const aPos = a.homepage_position || 99;
          const bPos = b.homepage_position || 99;
          if (aPos !== bPos) return aPos - bPos;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setAds(sorted.slice(0, 5));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load featured ads:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAds();
  }, []);

  const hasRealAds = !loading && ads.length > 0;
  // Pravi oglasi prvi (rank 1, 2, ...), ostatak do 5 mjesta popune demo kartice.
  const demoFill = hasRealAds
    ? demoAds.slice(0, Math.max(0, 5 - ads.length))
    : demoAds;

  return (
    <section className="relative py-6 md:py-8 bg-cloud px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-brand-orange uppercase">
              <Crown className="w-3.5 h-3.5" />
              Sponzorirani oglasi
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-[#ffffff] mt-1">
              Premium oglasi firmi i majstora
            </h2>
            <p className="text-sm text-gray-600 dark:text-[#ffffff]/70 mt-1">
              {hasRealAds
                ? 'Premium oglasi firmi, potražnja za radnicima i najatraktivniji projekti.'
                : 'Reklamirajte svoju firmu ili pronađite radnike na vrhunskom mjestu.'}
            </p>
          </div>
          <Link
            href="/izdvojeni-oglasi/"
            className="text-xs md:text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Svi oglasi
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x no-scrollbar">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : hasRealAds
            ? <>
                {ads.map((ad, i) => <FeaturedAdCard key={ad.id} ad={ad} rank={i + 1} />)}
                {demoFill.map((demo, j) => (
                  <DemoFeaturedAdCard key={`demo-${demo.rank}`} demo={{ ...demo, rank: ads.length + j + 1 }} />
                ))}
              </>
            : demoAds.map((demo) => <DemoFeaturedAdCard key={demo.rank} demo={demo} />)}
        </div>
      </div>
    </section>
  );
}
