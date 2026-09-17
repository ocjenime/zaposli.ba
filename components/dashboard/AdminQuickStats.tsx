'use client';

import { Users, Building2, Briefcase, TrendingUp, Star, DollarSign, ChevronRight } from 'lucide-react';

type TabKey = 'users' | 'firms' | 'jobs' | 'bids' | 'reviews' | 'payments';

interface AdminQuickStatsProps {
  users?: number;
  firms?: number;
  jobs?: number;
  bids?: number;
  reviews?: number;
  revenue?: number;
  onTabChange?: (tab: TabKey) => void;
}

const items = [
  { key: 'users' as TabKey, value: 'users', label: 'Korisnici', icon: Users, color: 'bg-orange-50 text-brand-orange' },
  { key: 'firms' as TabKey, value: 'firms', label: 'Firme i majstori', icon: Building2, color: 'bg-blue-50 text-blue-500' },
  { key: 'jobs' as TabKey, value: 'jobs', label: 'Poslovi', icon: Briefcase, color: 'bg-emerald-50 text-emerald-500' },
  { key: 'bids' as TabKey, value: 'bids', label: 'Ponude', icon: TrendingUp, color: 'bg-pink-50 text-pink-500' },
  { key: 'reviews' as TabKey, value: 'reviews', label: 'Recenzije', icon: Star, color: 'bg-amber-50 text-amber-500' },
  { key: 'payments' as TabKey, value: 'revenue', label: 'Prihod (KM)', icon: DollarSign, color: 'bg-purple-50 text-purple-500' },
] as const;

export default function AdminQuickStats({
  users = 0,
  firms = 0,
  jobs = 0,
  bids = 0,
  reviews = 0,
  revenue = 0,
  onTabChange,
}: AdminQuickStatsProps) {
  const values: Record<string, string> = {
    users: users.toLocaleString('bs-BA'),
    firms: firms.toLocaleString('bs-BA'),
    jobs: jobs.toLocaleString('bs-BA'),
    bids: bids.toLocaleString('bs-BA'),
    reviews: reviews.toLocaleString('bs-BA'),
    revenue: `${revenue.toLocaleString('bs-BA')} KM`,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onTabChange?.(item.key)}
          className="group relative bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm hover:shadow-md transition-all text-left dark:text-[#ffffff]"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20 group-hover:text-brand-orange transition-colors" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#ffffff] leading-tight">{values[item.value]}</p>
          <p className="text-xs text-gray-500 dark:text-[#ffffff]/60 mt-0.5 leading-tight">{item.label}</p>
        </button>
      ))}
    </div>
  );
}