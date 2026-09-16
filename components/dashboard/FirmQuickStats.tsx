'use client';

import { FileText, Send, Eye, Star, ChevronRight } from 'lucide-react';

type TabKey = 'ads' | 'bids' | 'stats' | 'profile';

interface FirmQuickStatsProps {
  adsCount?: number;
  bidsCount?: number;
  viewsCount?: number;
  rating?: number | null;
  reviewCount?: number | null;
  onTabChange?: (tab: TabKey) => void;
}

const items = [
  { key: 'ads' as TabKey, label: 'Aktivnih oglasa', icon: FileText, color: 'bg-orange-50 text-brand-orange' },
  { key: 'bids' as TabKey, label: 'Poslatih ponuda', icon: Send, color: 'bg-blue-50 text-blue-500' },
  { key: 'stats' as TabKey, label: 'Pregleda profila', icon: Eye, color: 'bg-emerald-50 text-emerald-500' },
  { key: 'profile' as TabKey, label: 'Ocjena firme', icon: Star, color: 'bg-pink-50 text-pink-500' },
] as const;

export default function FirmQuickStats({
  adsCount = 0,
  bidsCount = 0,
  viewsCount = 0,
  rating,
  reviewCount,
  onTabChange,
}: FirmQuickStatsProps) {
  const values: Record<string, string> = {
    ads: String(adsCount),
    bids: String(bidsCount),
    views: viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}K` : String(viewsCount),
    profile: rating ? rating.toFixed(1) : '0.0',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <button
          key={item.key}
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
          <p className="text-2xl font-bold text-gray-900 dark:text-[#ffffff]">{values[item.key]}</p>
          <p className="text-xs text-gray-500 dark:text-[#ffffff]/60 mt-0.5 leading-tight">
            {item.label}
            {item.key === 'profile' && reviewCount ? ` (${reviewCount})` : ''}
          </p>
        </button>
      ))}
    </div>
  );
}
