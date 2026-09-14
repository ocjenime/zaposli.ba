'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Megaphone, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import PromotedAdCard from './PromotedAdCard';

const HOMEPAGE_AD_LIMIT = 8;
const CARD_WIDTH = 340; // px

function AdCardSkeleton() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-[300px] md:w-[340px] rounded-2xl bg-ink-900/40 border border-ink-800 overflow-hidden animate-pulse"
        >
          <div className="aspect-[3/1] bg-ink-950" />
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-ink-800 -mt-7 border-2 border-ink-800" />
              <div className="flex-1 pt-0.5">
                <div className="h-4 bg-ink-800 rounded w-32 mb-1" />
                <div className="h-3 bg-ink-800 rounded w-20" />
              </div>
            </div>
            <div className="h-5 bg-ink-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-ink-800 rounded w-full mb-1" />
            <div className="h-4 bg-ink-800 rounded w-2/3" />
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
            'id,title,description,image_url,banner_url,cta_url,ad_type,ends_at,created_at,firms(name,slug,city,logo_url,verified)'
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[14rem] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

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
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          {loading ? (
            <AdCardSkeleton />
          ) : (
            ads.map((ad) => (
              <div key={ad.id} className="shrink-0 w-[300px] md:w-[340px]">
                <PromotedAdCard ad={ad} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
