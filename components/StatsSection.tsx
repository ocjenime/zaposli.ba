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
  const extraStats = stats.slice(3);
  const visibleTrust = trustCards.slice(0, Math.max(0, 6 - visibleStats.length));

  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 md:py-28">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-orange/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-brand-amber/5 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-brand-orange backdrop-blur-sm">
            Zašto baš mi?
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            Zašto Zaposli.ba?
          </h2>
          <p className="text-base text-white/60 md:text-lg">
            Platforma koja povezuje klijente sa provjerenim firmama širom Bosne i Hercegovine
          </p>
        </div>

        {/* 3x2 bento grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleStats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06] dark:border-ink-700 dark:bg-ink-800 dark:hover:border-ink-600 dark:hover:bg-ink-700"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-orange/5 blur-[50px] transition-opacity group-hover:opacity-70" />

              <div className="relative flex items-start gap-5">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange ring-1 ring-inset ring-brand-orange/20 transition-colors group-hover:from-brand-orange/25 group-hover:to-brand-orange/10">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                    {loading && index === 0 ? (
                      <span className="inline-block h-9 w-24 animate-pulse rounded-lg bg-white/10" />
                    ) : (
                      <Counter value={stat.value} />
                    )}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-brand-orange">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}

          {visibleTrust.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] dark:border-ink-700 dark:bg-ink-800 dark:hover:border-ink-600 dark:hover:bg-ink-700"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-orange ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-brand-orange/10 group-hover:ring-brand-orange/20 dark:bg-ink-700 dark:ring-ink-600">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1.5 text-lg font-bold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{card.description}</p>
            </div>
          ))}
        </div>

        {/* extra stats row (if more than 3 stats) */}
        {extraStats.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {extraStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm dark:border-ink-700 dark:bg-ink-800"
              >
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-brand-orange ring-1 ring-inset ring-white/10 dark:bg-ink-700 dark:ring-ink-600">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    <Counter value={stat.value} />
                  </div>
                  <div className="text-sm text-white/55">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
