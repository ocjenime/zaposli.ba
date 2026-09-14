'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, ArrowRight, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface Firm {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  plan_priority: number | null;
}

function score(f: Firm) {
  return (f.average_rating || 0) + (f.verified ? 0.5 : 0) + (f.plan_priority || 0);
}

function FirmCard({ firm }: { firm: Firm }) {
  return (
    <Link
      href={`/firma-profil/${firm.slug}/`}
      className="group flex items-center gap-3 rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 hover:border-brand-orange/30 dark:hover:border-brand-orange/40 hover:shadow-xl transition-all duration-300 p-4 snap-start min-w-[280px] sm:min-w-0"
    >
      <LogoDisplay
        name={firm.name}
        src={firm.logo_url}
        alt={firm.name}
        size="md"
        rounded="xl"
        className="border border-gray-100 dark:border-ink-700 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-orange transition-colors">
            {firm.name}
          </h3>
          {firm.verified && <VerifiedBadge size="sm" className="shrink-0 border-transparent bg-transparent px-0 py-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-steel dark:text-gray-400">
          <span className="inline-flex items-center gap-0.5 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {(firm.average_rating || 0).toFixed(1)}
          </span>
          <span>({firm.review_count || 0})</span>
          {firm.city && <span className="text-gray-300 dark:text-gray-600">·</span>}
          {firm.city && <span className="truncate">{firm.city}</span>}
        </div>
      </div>
      <span className="shrink-0 w-9 h-9 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white dark:group-hover:bg-brand-orange dark:group-hover:text-white transition-colors">
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 p-4 snap-start min-w-[280px] sm:min-w-0 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-ink-800 shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-ink-800 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-ink-800 rounded w-1/3" />
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-ink-800" />
    </div>
  );
}

export default function RecommendedFirmsSection() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('firms')
          .select('id, name, slug, city, logo_url, verified, average_rating, review_count, plan_priority')
          .not('slug', 'like', 'test-%')
          .limit(30);

        if (error) throw error;

        const typed = ((data || []) as Firm[]).sort((a, b) => score(b) - score(a));
        setFirms(typed.slice(0, 5));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recommended firms:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (!loading && firms.length === 0) return null;

  return (
    <section className="relative py-10 md:py-14 bg-cloud px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[14rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-brand-orange uppercase">
              <Megaphone className="w-3.5 h-3.5" />
              Preporučene firme
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              Provjereni majstori i firme
            </h2>
            <p className="text-sm text-steel dark:text-white/60 mt-1">
              Firme koje pružaju kvalitetne usluge i imaju najbolje ocjene.
            </p>
          </div>
          <Link
            href="/top-firme/"
            className="text-xs md:text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Sve firme <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x no-scrollbar">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : firms.map((firm) => <FirmCard key={firm.id} firm={firm} />)}
        </div>
      </div>
    </section>
  );
}
