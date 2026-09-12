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
  ArrowRight,
} from 'lucide-react';
import Counter from '@/components/ui/Counter';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
        if (firmsDisplay) nextStats.push({ icon: Building2, value: firmsDisplay, label: 'Prijavljenih firmi' });
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

  const featuredStat = stats[0];
  const extraStats = stats.slice(1);

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

        {/* main bento */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* featured stat / value prop */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 backdrop-blur-sm lg:col-span-5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-orange/10 blur-[60px]" />

            {featuredStat ? (
              <>
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange ring-1 ring-inset ring-brand-orange/20">
                  <featuredStat.icon className="h-8 w-8" />
                </div>
                <div className="mb-2 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                  {loading ? (
                    <span className="inline-block h-14 w-32 animate-pulse rounded-lg bg-white/10" />
                  ) : (
                    <Counter value={featuredStat.value} />
                  )}
                </div>
                <div className="mb-6 text-lg font-semibold text-brand-orange">{featuredStat.label}</div>
              </>
            ) : (
              <>
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange ring-1 ring-inset ring-brand-orange/20">
                  <Users className="h-8 w-8" />
                </div>
                <div className="mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  Pridružite se
                </div>
                <div className="mb-6 text-lg font-semibold text-brand-orange">Rastućoj zajednici</div>
              </>
            )}

            <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/60">
              Od objave posla do završetka projekta - pratite ponude, komunicirajte i ocjenjujte firme, sve na jednom mjestu.
            </p>

            <Link
              href="/objavi-projekat"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:shadow-brand-orange/30 active:scale-95"
            >
              Objavite posao besplatno
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* trust cards grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
            {trustCards.map((card, idx) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-orange ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-brand-orange/10 group-hover:ring-brand-orange/20">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* extra stats row */}
        {extraStats.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {extraStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              >
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-brand-orange ring-1 ring-inset ring-white/10">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {loading ? (
                      <span className="inline-block h-6 w-16 animate-pulse rounded bg-white/10" />
                    ) : (
                      <Counter value={stat.value} />
                    )}
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
