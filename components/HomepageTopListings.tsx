'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Crown, Loader2, Sparkles, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getAdTypeLabel } from '@/lib/promoted-ads';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface ListingItem {
  rank: number;
  type: 'sticky' | 'regular';
  id: string;
  title: string;
  description: string;
  ad_type: 'promotion' | 'worker_search';
  firm: {
    name: string | null;
    slug: string | null;
    city: string | null;
    logo_url: string | null;
    verified: boolean | null;
    average_rating: number | null;
    review_count: number | null;
  };
}

function RankBadge({ rank }: { rank: number }) {
  const isTop = rank <= 5;
  return (
    <div
      className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold ${
        isTop
          ? 'bg-gradient-to-br from-brand-orange to-amber-500 text-white shadow-lg shadow-brand-orange/20'
          : 'bg-ink-800 text-white/70 border border-ink-700'
      }`}
    >
      {rank}
    </div>
  );
}

function RatingStars({ rating, count }: { rating: number | null; count: number | null }) {
  const value = Math.round((rating || 0) * 10) / 10;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-white/60">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-white/80">{value.toFixed(1)}</span>
      {count ? <span>({count})</span> : null}
    </span>
  );
}

function TypeBadge({ adType }: { adType: ListingItem['ad_type'] }) {
  const isWorkerSearch = adType === 'worker_search';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
        isWorkerSearch
          ? 'bg-blue-500/10 text-blue-200 border-blue-400/20'
          : 'bg-brand-orange/10 text-orange-200 border-brand-orange/20'
      }`}
    >
      {isWorkerSearch ? <Users className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
      {getAdTypeLabel(adType)}
    </span>
  );
}

function ListingRow({ item }: { item: ListingItem }) {
  const isSticky = item.type === 'sticky';
  const firmName = item.firm.name || 'Firma';

  return (
    <Link
      href={`/izdvojeni-oglasi/${item.id}/`}
      className="group relative flex items-center gap-3 md:gap-4 rounded-xl bg-ink-900/60 backdrop-blur-sm border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 p-3 md:p-4"
    >
      {isSticky && (
        <div className="absolute top-0 right-4 md:right-6 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
          <Crown className="w-3 h-3" /> Sponzorirano
        </div>
      )}

      <RankBadge rank={item.rank} />

      <div className="shrink-0 -ml-0.5">
        <LogoDisplay
          name={firmName}
          src={item.firm.logo_url}
          alt={firmName}
          size="sm"
          rounded="xl"
          className="border-2 border-ink-800 shadow-md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <h3 className="text-sm md:text-base font-bold text-white truncate group-hover:text-brand-orange transition-colors">
            {item.title}
          </h3>
          <TypeBadge adType={item.ad_type} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
          <span className="font-medium text-white/80">{firmName}</span>
          {item.firm.verified && <VerifiedBadge size="sm" className="border-white/10" />}
          {item.firm.city && <span>· {item.firm.city}</span>}
          <RatingStars rating={item.firm.average_rating} count={item.firm.review_count} />
        </div>
      </div>

      <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink-800 text-white/60 group-hover:bg-brand-orange group-hover:text-white transition-colors">
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 md:gap-4 rounded-xl bg-ink-900/40 border border-ink-800 p-3 md:p-4 animate-pulse">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-800" />
      <div className="w-10 h-10 rounded-xl bg-ink-800" />
      <div className="flex-1">
        <div className="h-4 bg-ink-800 rounded w-2/3 mb-2" />
        <div className="h-3 bg-ink-800 rounded w-1/3" />
      </div>
      <div className="w-8 h-8 rounded-full bg-ink-800" />
    </div>
  );
}

export default function HomepageTopListings() {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const now = new Date().toISOString();

        const { data: allAds, error } = await supabase
          .from('promoted_ads')
          .select(
            'id,title,description,ad_type,homepage_position,homepage_sticky_until,firms(name,slug,city,logo_url,verified,average_rating,review_count)'
          )
          .eq('status', 'active')
          .gt('ends_at', now)
          .order('homepage_position', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        const typedAds = (allAds || []) as unknown as PublicPromotedAd[];

        const sticky: ListingItem[] = [];
        const regular: ListingItem[] = [];

        typedAds.forEach((ad) => {
          const firm = ad.firms || {
            name: null,
            slug: null,
            city: null,
            logo_url: null,
            verified: null,
            average_rating: null,
            review_count: null,
          };
          const base = {
            id: ad.id,
            title: ad.title,
            description: ad.description,
            ad_type: ad.ad_type,
            firm,
          };

          if (
            ad.homepage_position &&
            ad.homepage_position >= 1 &&
            ad.homepage_position <= 5 &&
            ad.homepage_sticky_until &&
            new Date(ad.homepage_sticky_until) > new Date()
          ) {
            sticky.push({ ...base, rank: ad.homepage_position, type: 'sticky' });
          } else if (regular.length < 5) {
            regular.push({ ...base, rank: 0, type: 'regular' });
          }
        });

        // Fill missing sticky slots with regular ads so we always have 10 rows if possible
        while (sticky.length < 5 && regular.length > 0) {
          const next = regular.shift();
          if (!next) break;
          sticky.push({ ...next, rank: sticky.length + 1, type: 'sticky' });
        }

        const merged = [...sticky, ...regular]
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 10)
          .map((item, i) => ({ ...item, rank: i + 1 }));

        setItems(merged);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load homepage top listings:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="relative py-10 md:py-14 bg-cloud border-y border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[16rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-brand-orange uppercase">
              <Crown className="w-3.5 h-3.5" />
              Top lista
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Top 10 oglasa</h2>
            <p className="text-sm text-white/60 mt-1">
              Prvih 5 pozicija su premium reklame koje uvijek stoje na vrhu.
            </p>
          </div>
          <Link
            href="/izdvojeni-oglasi/"
            className="text-xs md:text-sm font-semibold text-white/60 hover:text-brand-orange transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Sve <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            items.map((item) => <ListingRow key={item.id} item={item} />)
          )}
        </div>
      </div>
    </section>
  );
}
