'use client';

import { FolderOpen, Send, CheckCircle, MessageSquare, ChevronRight } from 'lucide-react';

type TabKey = 'jobs' | 'bids' | 'messages';

interface ClientQuickStatsProps {
  activeJobs?: number;
  totalBids?: number;
  completedJobs?: number;
  unreadMessages?: number;
  onTabChange?: (tab: TabKey) => void;
}

const items = [
  { key: 'jobs' as TabKey, value: 'activeJobs', label: 'Aktivnih poslova', icon: FolderOpen, color: 'bg-orange-50 text-brand-orange' },
  { key: 'bids' as TabKey, value: 'totalBids', label: 'Primljenih ponuda', icon: Send, color: 'bg-blue-50 text-blue-500' },
  { key: 'messages' as TabKey, value: 'unreadMessages', label: 'Neproročnih poruka', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-500' },
  { key: 'jobs' as TabKey, value: 'completedJobs', label: 'Završenih poslova', icon: CheckCircle, color: 'bg-pink-50 text-pink-500' },
] as const;

export default function ClientQuickStats({
  activeJobs = 0,
  totalBids = 0,
  completedJobs = 0,
  unreadMessages = 0,
  onTabChange,
}: ClientQuickStatsProps) {
  const values: Record<string, string> = {
    activeJobs: String(activeJobs),
    totalBids: String(totalBids),
    unreadMessages: String(unreadMessages),
    completedJobs: String(completedJobs),
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          <p className="text-2xl font-bold text-gray-900 dark:text-[#ffffff]">{values[item.value]}</p>
          <p className="text-xs text-gray-500 dark:text-[#ffffff]/60 mt-0.5 leading-tight">{item.label}</p>
        </button>
      ))}
    </div>
  );
}
