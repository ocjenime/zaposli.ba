'use client';

import Link from 'next/link';
import { Crown, ArrowRight, Loader2 } from 'lucide-react';

interface FirmPlanCardProps {
  planName: string;
  planFeatured?: boolean;
  planActiveDate?: string | null;
  loadingPlan?: boolean;
}

export default function FirmPlanCard({
  planName,
  planFeatured,
  planActiveDate,
  loadingPlan,
}: FirmPlanCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-brand-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 dark:text-white">{planName} paket</h3>
              {planFeatured && (
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                  Aktivan
                </span>
              )}
            </div>
            {loadingPlan ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Učitavanje paketa...
              </div>
            ) : planActiveDate ? (
              <p className="text-xs text-gray-500 mt-0.5">Vaš paket je aktivan do {planActiveDate}.</p>
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">Aktivirajte plaćeni paket za više mogućnosti.</p>
            )}
          </div>
        </div>
        <Link
          href="/dashboard/firma/pretplata/"
          className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold transition-colors"
        >
          Upravljaj <ArrowRight className="w-3.5 h-3.5 hidden sm:block" />
        </Link>
      </div>
    </div>
  );
}
