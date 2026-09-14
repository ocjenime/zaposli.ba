'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import PromotedAdCard from './PromotedAdCard';

const HOMEPAGE_AD_LIMIT = 6;

function PromotedAdsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-full rounded-2xl bg-ink-900/40 border border-ink-800 overflow-hidden animate-pulse"
        >
          <div className="aspect-[16/10] bg-ink-950" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-ink-800 rounded w-3/4" />
            <div className="h-4 bg-ink-800 rounded w-full" />
            <div className="h-4 bg-ink-800 rounded w-2/3" />
            <div className="pt-4 border-t border-white/10 flex justify-between">
              <div className="h-3 bg-ink-800 rounded w-16" />
              <div className="h-3 bg-ink-800 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PromotedAdsSection() {
  const [ads, setAds] = useState<PublicPromotedAd[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!loading && ads.length === 0) return null;

  return (
    <section className="relative py-16 md:py-20 bg-cloud overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange mb-2">
              <Megaphone className="w-4 h-4" />
              Premium promocije
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Izdvojeni oglasi
            </h2>
            <p className="mt-2 text-white/60 max-w-xl">
              Provjerene firme i majstori koji aktivno traže posao ili žele istaći svoje usluge.
            </p>
          </div>
          <Link
            href="/izdvojeni-oglasi/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-amber-300 transition-colors shrink-0"
          >
            Pogledaj sve
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <PromotedAdsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ads.map((ad) => (
              <PromotedAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
