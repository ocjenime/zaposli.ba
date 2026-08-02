'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Star, CheckCircle, Shield, CreditCard, MessageSquare } from 'lucide-react';
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
    description: 'Sve firme prolaze provjeru identiteta i poslovanja prije odobravanja profila.',
  },
  {
    icon: CreditCard,
    title: 'Besplatno za klijente',
    description: 'Objavljivanje poslova i primanje ponuda je potpuno besplatno.',
  },
  {
    icon: MessageSquare,
    title: 'Ocjene i recenzije',
    description: 'Pročitajte iskustva drugih klijenata prije nego što odaberete firmu.',
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
          supabase.from('firms').select('*', { count: 'exact', head: true }),
          supabase.from('reviews').select('rating'),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        ]);

        const hasAnyData =
          (clientsCount ?? 0) > 0 ||
          (firmsCount ?? 0) > 0 ||
          (reviewData?.length ?? 0) > 0 ||
          (completedJobsCount ?? 0) > 0;

        if (!hasAnyData) return;

        const avgRating = reviewData?.length
          ? (reviewData.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewData.length).toFixed(1)
          : undefined;

        const formatCount = (count: number | null | undefined) => {
          if (count === null || count === undefined || count < 10) return null;
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

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setLoading(false);
      return;
    }
    loadStats();
  }, []);

  return (
    <section className="hidden md:block py-10 md:py-14 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
            Zašto baš mi?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Zašto Zaposli.ba?
          </h2>
          <p className="text-lg text-gray-500">
            Platforma koja povezuje klijente sa provjerenim firmama širom Bosne i Hercegovine
          </p>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center p-6 rounded-2xl bg-cloud hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 ${
                  loading ? 'opacity-70' : ''
                }`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-4">
                  <stat.icon className="w-7 h-7 text-brand-orange" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                  {loading && index === 0 ? (
                    <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <Counter value={stat.value} />
                  )}
                </div>
                <div className="text-sm text-steel">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className={`grid md:grid-cols-3 gap-6 ${stats.length > 0 ? 'mt-10' : ''}`}>
          {trustCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-5">
                <card.icon className="w-7 h-7 text-brand-orange" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{card.title}</h3>
              <p className="text-sm text-steel leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
