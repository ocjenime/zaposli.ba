'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Megaphone, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getPromotedAdHref, getAdTypeLabel } from '@/lib/promoted-ads';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

const HOMEPAGE_AD_LIMIT = 10;
const CARD_WIDTH = 320; // px

function CompactAdCard({ ad }: { ad: PublicPromotedAd }) {
  const href = getPromotedAdHref(ad);
  const isWorkerSearch = ad.ad_type === 'worker_search';

  return (
    <Link
      href={href}
      target={ad.cta_url ? '_blank' : undefined}
      rel={ad.cta_url ? 'noopener noreferrer' : undefined}
      className="group relative shrink-0 w-[280px] md:w-[320px] snap-start rounded-xl bg-ink-900/60 backdrop-blur-sm border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 p-3 flex gap-3 overflow-hidden"
    >
      {/* subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Thumbnail */}
      <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-ink-950 border border-white/5">
        {ad.image_url ? (
          <NextImage
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900">
            {isWorkerSearch ? (
              <Users className="w-6 h-6 text-brand-orange/70" />
            ) : (
              <Sparkles className="w-6 h-6 text-brand-orange/70" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 py-0.5">
        <span
          className={`self-start text-[10px] font-bold px-1.5 py-0.5 rounded border mb-1.5 ${
            isWorkerSearch
              ? 'bg-blue-500/10 text-blue-200 border-blue-400/20'
              : 'bg-brand-orange/10 text-orange-200 border-brand-orange/20'
          }`}
        >
          {getAdTypeLabel(ad.ad_type)}
        </span>
        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-brand-orange transition-colors">
          {ad.title}
        </h3>
        <div className="mt-auto pt-1.5 flex items-center justify-between">
          <span className="text-xs text-white/50 truncate max-w-[120px]">
            {ad.firms?.name || 'Firma'}
          </span>
          <span className="text-xs font-semibold text-brand-orange inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Pogledaj <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CompactSkeleton() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-[280px] md:w-[320px] rounded-xl bg-ink-900/40 border border-ink-800 p-3 flex gap-3 animate-pulse"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-ink-800" />
          <div className="flex flex-col flex-1 py-0.5">
            <div className="h-4 bg-ink-800 rounded w-16 mb-2" />
            <div className="h-4 bg-ink-800 rounded w-full mb-1" />
            <div className="h-4 bg-ink-800 rounded w-3/4 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PromotedAdsSection() {
  const [ads, setAds] = useState<PublicPromotedAd[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAds() {
      try {
        const { data, error } = await supabase
          .from('promoted_ads')
          .select(
            'id,title,description,image_url,cta_url,ad_type,ends_at,created_at,firms(name,slug,city,verified)'
          )
          .eq('status', 'active')
          .gt('ends_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(HOMEPAGE_AD_LIMIT);

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to load promoted ads:', error);
          return;
        }

        setAds((data || []) as unknown as PublicPromotedAd[]);
      } finally {
        setLoading(false);
      }
    }

    loadAds();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -CARD_WIDTH : CARD_WIDTH;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  if (!loading && ads.length === 0) return null;

  return (
    <section className="relative py-8 md:py-10 bg-cloud border-y border-white/5 overflow-hidden">
      {/* subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[12rem] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-brand-orange uppercase">
              <Megaphone className="w-3.5 h-3.5" />
              Sponzorirano
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white mt-1">Izdvojeni oglasi</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Prethodni oglas"
                className="w-8 h-8 rounded-full bg-ink-900 border border-ink-800 text-white/70 hover:text-white hover:border-brand-orange/40 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Sljedeći oglas"
                className="w-8 h-8 rounded-full bg-ink-900 border border-ink-800 text-white/70 hover:text-white hover:border-brand-orange/40 transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="/izdvojeni-oglasi/"
              className="text-xs md:text-sm font-semibold text-white/60 hover:text-brand-orange transition-colors inline-flex items-center gap-1"
            >
              Sve <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Strip */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-cloud to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-cloud to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          {loading ? (
            <CompactSkeleton />
          ) : (
            ads.map((ad) => <CompactAdCard key={ad.id} ad={ad} />)
          )}
        </div>
      </div>
    </section>
  );
}
