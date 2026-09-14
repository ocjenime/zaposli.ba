'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Crown, ArrowRight, Sparkles, Users, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getAdTypeLabel } from '@/lib/promoted-ads';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

function FeaturedAdCard({ ad, rank }: { ad: PublicPromotedAd; rank: number }) {
  const isWorkerSearch = ad.ad_type === 'worker_search';
  const bannerUrl = ad.banner_url || ad.image_url;
  const firm = ad.firms;

  return (
    <Link
      href={`/izdvojeni-oglasi/${ad.id}/`}
      className="group relative flex flex-col rounded-2xl bg-ink-900/60 backdrop-blur-sm border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 overflow-hidden"
    >
      {/* Rank badge */}
      <div className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-gradient-to-br from-brand-orange to-amber-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-brand-orange/20">
        {rank}
      </div>

      {/* Sponsored badge */}
      <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
        <Crown className="w-3 h-3" /> Sponzorirano
      </div>

      {/* Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-950">
        {bannerUrl ? (
          <NextImage
            src={bannerUrl}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-900 to-ink-950">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              {isWorkerSearch ? (
                <Users className="w-6 h-6 text-brand-orange" />
              ) : (
                <Sparkles className="w-6 h-6 text-brand-orange" />
              )}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-brand-orange transition-colors">
          {ad.title}
        </h3>

        <span
          className={`self-start text-[10px] font-bold px-2 py-0.5 rounded border mb-3 ${
            isWorkerSearch
              ? 'bg-blue-500/10 text-blue-200 border-blue-400/20'
              : 'bg-brand-orange/10 text-orange-200 border-brand-orange/20'
          }`}
        >
          {getAdTypeLabel(ad.ad_type)}
        </span>

        <div className="flex items-center gap-2 mb-3">
          <div className="shrink-0">
            <LogoDisplay
              name={firm?.name || 'Firma'}
              src={firm?.logo_url}
              alt={firm?.name || 'Firma'}
              size="sm"
              rounded="lg"
              className="border border-ink-700"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-white truncate">{firm?.name || 'Firma'}</p>
              {firm?.verified && <VerifiedBadge size="sm" className="border-white/10 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              {firm?.city && <span>{firm.city}</span>}
              <span className="inline-flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {(firm?.average_rating || 0).toFixed(1)} ({firm?.review_count || 0})
              </span>
            </div>
          </div>
        </div>

        <span className="mt-auto inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink-800 text-white/60 group-hover:bg-brand-orange group-hover:text-white transition-colors self-end">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-ink-900/40 border border-ink-800 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-ink-950" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-ink-800 rounded w-3/4" />
        <div className="h-4 bg-ink-800 rounded w-1/3" />
        <div className="h-9 bg-ink-800 rounded w-9 self-end" />
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
            'id,title,description,image_url,banner_url,cta_url,ad_type,ends_at,created_at,homepage_position,firms(name,slug,city,logo_url,verified,average_rating,review_count)'
          )
          .eq('status', 'active')
          .gt('ends_at', now)
          .order('homepage_position', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const typedAds = ((data || []) as unknown as PublicPromotedAd[]).filter(
          (ad) => !ad.firms?.slug?.startsWith('test-')
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

  if (!loading && ads.length === 0) return null;

  return (
    <section className="relative py-10 md:py-14 bg-cloud px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-brand-orange uppercase">
              <Crown className="w-3.5 h-3.5" />
              Istaknuti oglasi
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Premium oglasi i projekti</h2>
            <p className="text-sm text-white/60 mt-1">
              Premium oglasi firmi, potražnja za radnicima i najatraktivniji projekti.
            </p>
          </div>
          <Link
            href="/izdvojeni-oglasi/"
            className="text-xs md:text-sm font-semibold text-white/60 hover:text-brand-orange transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Pogledaj sve <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {ads.map((ad, i) => (
              <FeaturedAdCard key={ad.id} ad={ad} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
