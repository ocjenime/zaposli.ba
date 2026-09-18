'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  Star,
  CheckCircle,
  Shield,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';
import Counter from '@/components/ui/Counter';
import { supabase } from '@/lib/supabase';

interface StatData {
  value: string;
  label: string;
  icon: typeof Users;
}

const trustCards = [
  {
    icon: Shield,
    title: 'Verificirane firme',
    description: 'Svaka firma prolazi provjeru identiteta i poslovanja prije odobravanja profila.',
  },
  {
    icon: CreditCard,
    title: 'Besplatno za klijente',
    description: 'Objavljivanje poslova i primanje ponuda je potpuno besplatno, bez skrivenih troškova.',
  },
  {
    icon: MessageSquare,
    title: 'Ocjene i recenzije',
    description: 'Pročitajte iskustva drugih klijenata prije nego što odaberete firmu.',
  },
  {
    icon: TrendingUp,
    title: 'Više ponuda',
    description: 'Uporedite cijene, rokove i reference - birajte najbolju ponudu za svoj projekat.',
  },
  {
    icon: Clock,
    title: 'Brze ponude',
    description: 'Većina poslova dobije prve ponude u roku od 24 sata, hitni poslovi i brže.',
  },
  {
    icon: MapPin,
    title: 'Dostupni širom BiH',
    description: 'Povezujemo klijente i firme u svim većim gradovima Bosne i Hercegovine.',
  },
];

export default function StatsSection() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          { count: clientsCount },
          { count: firmsCount },
          { data: reviewData },
          { count: completedJobsCount },
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
          supabase.from('firms').select('*', { count: 'exact', head: true }).not('slug', 'like', 'test-%'),
          supabase.from('reviews').select('rating'),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        ]);

        const hasAnyData =
          (clientsCount ?? 0) > 0 ||
          (firmsCount ?? 0) > 0 ||
          (reviewData?.length ?? 0) > 0 ||
          (completedJobsCount ?? 0) > 0;

        if (!hasAnyData) {
          setLoading(false);
          return;
        }

        const avgRating = reviewData?.length
          ? (reviewData.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewData.length).toFixed(1)
          : undefined;

        const formatCount = (count: number | null | undefined) => {
          if (count === null || count === undefined || count < 1) return null;
          return count.toLocaleString('bs');
        };

        const nextStats: StatData[] = [];
        const clientDisplay = formatCount(clientsCount);
        const firmsDisplay = formatCount(firmsCount);
        const jobsDisplay = formatCount(completedJobsCount);

        if (clientDisplay) nextStats.push({ icon: Users, value: clientDisplay, label: 'Zadovoljnih klijenata' });
        if (firmsDisplay) nextStats.push({ icon: Building2, value: firmsDisplay, label: 'Prijavljenih firmi i majstora' });
        if (avgRating) nextStats.push({ icon: Star, value: avgRating, label: 'Prosječna ocjena' });
        if (jobsDisplay) nextStats.push({ icon: CheckCircle, value: jobsDisplay, label: 'Završenih poslova' });

        setStats(nextStats);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const visibleStats = stats.slice(0, 3);
  const visibleTrust = trustCards.slice(0, Math.max(0, 6 - visibleStats.length));

  return (
    <section className="relative overflow-hidden bg-ink-950 py-10 md:py-14">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-orange/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-amber/5 blur-[90px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <span className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-orange backdrop-blur-sm">
            Zašto baš mi?
          </span>
          <h2 className="mb-2.5 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Zašto Zaposli.ba?
          </h2>
          <p className="text-sm text-white/60 md:text-base">
            Platforma koja povezuje klijente sa provjerenim firmama širom Bosne i Hercegovine
          </p>
        </div>

        {/* stats strip */}
        {(loading || stats.length > 0) && (
          <div className="mb-3 flex flex-col divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm sm:flex-row sm:divide-x sm:divide-y-0 md:mb-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-1 items-center gap-3 p-3.5 md:p-4">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/10" />
                    <div className="flex-1">
                      <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
                      <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                ))
              : stats.slice(0, 4).map((stat) => (
                  <div key={stat.label} className="flex flex-1 items-center gap-3 p-3.5 md:p-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange ring-1 ring-inset ring-brand-orange/20">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
                        <Counter value={stat.value} />
                      </div>
                      <div className="text-[11px] font-semibold leading-tight text-brand-orange md:text-xs">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* trust grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {visibleTrust.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] dark:border-ink-700 dark:bg-ink-800 dark:hover:border-ink-600 dark:hover:bg-ink-700 md:p-5"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-brand-orange ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-brand-orange/10 group-hover:ring-brand-orange/20 dark:bg-ink-700 dark:ring-ink-600">
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-0.5 text-base font-bold text-[#ffffff]">{card.title}</h3>
                  <p className="text-[13px] leading-snug text-[#ffffff]/70">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
