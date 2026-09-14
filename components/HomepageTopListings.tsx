'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Crown, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface OrganicFirm {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  description: string | null;
  plan_priority: number | null;
}

interface ListingItem {
  rank: number;
  type: 'sticky' | 'organic';
  id: string;
  title?: string;
  description?: string;
  firm: {
    name: string | null;
    slug: string | null;
    city: string | null;
    logo_url: string | null;
    verified: boolean | null;
    average_rating: number | null;
    review_count: number | null;
  };
  href: string;
}

function firmScore(f: OrganicFirm | ListingItem['firm']) {
  const avg = f.average_rating || 0;
  const verifiedBoost = f.verified ? 0.5 : 0;
  const priority = (f as OrganicFirm).plan_priority || 0;
  return avg + verifiedBoost + priority;
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

function ListingRow({ item }: { item: ListingItem }) {
  const isSticky = item.type === 'sticky';
  const firmName = item.firm.name || 'Firma';

  return (
    <Link
      href={item.href}
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
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <h3 className="text-sm md:text-base font-bold text-white truncate group-hover:text-brand-orange transition-colors">
            {firmName}
          </h3>
          {item.firm.verified && <VerifiedBadge size="sm" className="border-white/10" />}
        </div>
        {isSticky && item.title && (
          <p className="text-xs text-brand-orange font-medium truncate mb-0.5">{item.title}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
          {item.firm.city && <span>{item.firm.city}</span>}
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
        <div className="h-4 bg-ink-800 rounded w-1/3 mb-2" />
        <div className="h-3 bg-ink-800 rounded w-1/4" />
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

        const { data: stickyData, error: stickyError } = await supabase
          .from('promoted_ads')
          .select(
            'id,title,description,homepage_position,firms(name,slug,city,logo_url,verified,average_rating,review_count)'
          )
          .eq('status', 'active')
          .not('homepage_position', 'is', null)
          .gt('homepage_sticky_until', now)
          .order('homepage_position', { ascending: true })
          .limit(5);

        if (stickyError) throw stickyError;

        const stickyAds = ((stickyData || []) as unknown as PublicPromotedAd[])
          .filter((ad) => ad.homepage_position && ad.homepage_position >= 1 && ad.homepage_position <= 5)
          .map((ad) => ({
            rank: ad.homepage_position!,
            type: 'sticky' as const,
            id: ad.id,
            title: ad.title,
            description: ad.description,
            firm: ad.firms || {
              name: null,
              slug: null,
              city: null,
              logo_url: null,
              verified: null,
              average_rating: null,
              review_count: null,
            },
            href: `/izdvojeni-oglasi/${ad.id}/`,
          }));

        const neededOrganic = 10 - stickyAds.length;
        let organic: ListingItem[] = [];

        if (neededOrganic > 0) {
          const { data: firmsData, error: firmsError } = await supabase
            .from('firms')
            .select(
              'id, name, slug, city, logo_url, verified, average_rating, review_count, description, plan_priority'
            )
            .not('slug', 'like', 'test-%')
            .limit(50);

          if (firmsError) throw firmsError;

          const typedFirms = ((firmsData || []) as OrganicFirm[]).sort(
            (a, b) => firmScore(b) - firmScore(a)
          );

          const usedSlugs = new Set(stickyAds.map((s) => s.firm.slug).filter(Boolean));

          organic = typedFirms
            .filter((f) => !usedSlugs.has(f.slug))
            .slice(0, neededOrganic)
            .map((f, i) => ({
              rank: stickyAds.length + i + 1,
              type: 'organic' as const,
              id: f.id,
              firm: {
                name: f.name,
                slug: f.slug,
                city: f.city,
                logo_url: f.logo_url,
                verified: f.verified,
                average_rating: f.average_rating,
                review_count: f.review_count,
              },
              href: `/firma-profil/${f.slug}/`,
            }));
        }

        const merged = [...stickyAds, ...organic].sort((a, b) => a.rank - b.rank);
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
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Najbolje firme i majstori</h2>
            <p className="text-sm text-white/60 mt-1">
              Prvih 5 pozicija su premium reklame. Ostale se rangiraju prema ocjenama i verifikaciji.
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
            items.map((item) => <ListingRow key={`${item.type}-${item.id}`} item={item} />)
          )}
        </div>
      </div>
    </section>
  );
}
