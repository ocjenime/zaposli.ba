'use client';

import { ShieldCheck, Star, CreditCard, MessageSquare, Scale } from 'lucide-react';

type TabKey = 'verifications' | 'reviews' | 'subscriptions' | 'conversations' | 'mediations';

interface AdminIconMenuProps {
  pendingVerifications?: number;
  pendingReviews?: number;
  openMediations?: number;
  onTabChange?: (tab: TabKey) => void;
}

export default function AdminIconMenu({
  pendingVerifications = 0,
  pendingReviews = 0,
  openMediations = 0,
  onTabChange,
}: AdminIconMenuProps) {
  const menuItems = [
    { key: 'verifications' as TabKey, label: 'Verifikacije', icon: ShieldCheck, badge: pendingVerifications },
    { key: 'reviews' as TabKey, label: 'Recenzije', icon: Star, badge: pendingReviews },
    { key: 'subscriptions' as TabKey, label: 'Pretplate', icon: CreditCard, badge: 0 },
    { key: 'conversations' as TabKey, label: 'Razgovori', icon: MessageSquare, badge: 0 },
    { key: 'mediations' as TabKey, label: 'Sporovi', icon: Scale, badge: openMediations },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {menuItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onTabChange?.(item.key)}
          className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50 transition-all active:scale-95 dark:bg-ink-900 dark:border-ink-800 dark:text-white/70"
        >
          <div className="relative">
            <item.icon className="w-5 h-5" />
            {item.badge ? (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-medium text-center leading-none">{item.label}</span>
        </button>
      ))}
    </div>
  );
}