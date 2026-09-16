'use client';

import Link from 'next/link';
import {
  Send,
  Star,
  Eye,
  CheckCircle,
  Crown,
  Settings,
  ArrowRight,
  Timer,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { remainingBidsText, getResetCountdownText } from '@/lib/subscriptions';
import type { LucideIcon } from 'lucide-react';

interface Bid {
  status: 'pending' | 'accepted' | 'rejected';
}

interface FirmDashboardHeroProps {
  firmName: string | null;
  city: string | null;
  planName: string;
  planFeatured: boolean;
  planActiveDate: string | null;
  bidsUsed: number;
  bidsLimit: number;
  canBid: boolean;
  nextReset: Date | null;
  averageRating: number | null;
  reviewCount: number | null;
  profileViews: number;
  myBids: Bid[];
  loadingPlan: boolean;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'neutral',
  isLoading,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tone?: 'neutral' | 'orange' | 'red' | 'green';
  isLoading?: boolean;
}) {
  const toneStyles = {
    neutral: 'bg-white/10 text-white/80',
    orange: 'bg-brand-orange/20 text-brand-orange',
    red: 'bg-red-500/20 text-red-400',
    green: 'bg-emerald-500/20 text-emerald-400',
  };

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 hover:bg-white/10 transition-all duration-200">
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${toneStyles[tone]}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-brand-orange animate-spin" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-white truncate">
          {isLoading ? 'Učitavanje...' : value}
        </p>
        {sub && <p className="text-xs text-white/50 truncate">{sub}</p>}
      </div>
    </div>
  );
}

export default function FirmDashboardHero({
  firmName,
  city,
  planName,
  planFeatured,
  planActiveDate,
  bidsUsed,
  bidsLimit,
  canBid,
  nextReset,
  averageRating,
  reviewCount,
  profileViews,
  myBids,
  loadingPlan,
}: FirmDashboardHeroProps) {
  const acceptedBids = myBids.filter((b) => b.status === 'accepted').length;
  const decidedBids = myBids.filter((b) => b.status !== 'pending').length;
  const acceptanceRate =
    decidedBids > 0 ? Math.round((acceptedBids / decidedBids) * 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-900 to-ink-800 p-6 md:p-8 shadow-2xl shadow-black/30">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-[24rem] h-[24rem] bg-brand-orange/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[18rem] h-[18rem] bg-brand-amber/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_40%)]" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              Panel firme
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dobro došli,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                {firmName || 'majstore'}
              </span>
            </h1>
            <p className="text-white/70 mt-3 text-base md:text-lg max-w-xl">
              {city
                ? `Vaš profil je aktivan u ${city}. `
                : 'Vaš profil je aktivan. '}
              Pratite ponude, ocjene i preglede profila – sve na jednom mjestu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/dashboard/firma/profil/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/15 text-white bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              Uredi profil
            </Link>
            <Link
              href="/dashboard/firma/pretplata/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white shadow-lg shadow-brand-orange/25 hover:shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:translate-y-0"
            >
              <Crown className="w-4 h-4" />
              Pretplata
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="Preostale ponude"
            value={loadingPlan ? '-' : remainingBidsText(bidsUsed, bidsLimit)}
            sub={loadingPlan ? '' : canBid ? 'Možete slati nove ponude' : 'Dostignuto ograničenje'}
            icon={Send}
            tone={canBid ? 'green' : 'red'}
            isLoading={loadingPlan}
          />
          <StatCard
            label="Stopa uspjeha"
            value={loadingPlan ? '-' : `${acceptanceRate}%`}
            sub={loadingPlan ? '' : `${acceptedBids} od ${decidedBids} odlučenih ponuda`}
            icon={TrendingUp}
            tone="orange"
            isLoading={loadingPlan}
          />
          <StatCard
            label="Prosječna ocjena"
            value={
              averageRating && averageRating > 0
                ? `${averageRating.toFixed(1)} / 5`
                : 'Nema ocjena'
            }
            sub={reviewCount && reviewCount > 0 ? `Na osnovu ${reviewCount} recenzija` : 'Pozovite klijente na ocjenu'}
            icon={Star}
            tone="orange"
            isLoading={loadingPlan}
          />
          <StatCard
            label="Pregledi profila"
            value={profileViews > 0 ? profileViews.toLocaleString('bs-BA') : '0'}
            sub="Ukupno pregleda vašeg profila"
            icon={Eye}
            tone="neutral"
            isLoading={loadingPlan}
          />
        </div>

        {/* Plan status strip */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-white/80">
            <Briefcase className="w-4 h-4 text-brand-orange" />
            <span>
              Trenutni paket: <span className="font-semibold text-white">{planName}</span>
              {planFeatured && <span className="ml-2 text-brand-orange">· Istaknut profil</span>}
              {planActiveDate && <span className="ml-2 text-white/60">· Aktivan do {planActiveDate}</span>}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Timer className="w-4 h-4" />
            <span>{loadingPlan ? 'Učitavanje...' : getResetCountdownText(nextReset)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
