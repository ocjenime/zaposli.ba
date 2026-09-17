'use client';

import { FolderOpen, Send, MessageSquare, User, Settings } from 'lucide-react';

type TabKey = 'jobs' | 'bids' | 'messages' | 'profile' | 'settings';
type ActiveTab = TabKey | 'home';

interface ClientIconMenuProps {
  activeTab?: ActiveTab;
  onTabChange?: (tab: TabKey) => void;
  bidsCount?: number;
  unreadMessages?: number;
}

const menuItems = [
  { key: 'jobs' as TabKey, label: 'Moji poslovi', icon: FolderOpen, badge: 0 },
  { key: 'bids' as TabKey, label: 'Ponude', icon: Send, badgeKey: 'bidsCount' as const },
  { key: 'messages' as TabKey, label: 'Poruke', icon: MessageSquare, badgeKey: 'unreadMessages' as const },
  { key: 'profile' as TabKey, label: 'Profil', icon: User, badge: 0 },
  { key: 'settings' as TabKey, label: 'Postavke', icon: Settings, badge: 0 },
];

export default function ClientIconMenu({
  activeTab = 'home',
  onTabChange,
  bidsCount = 0,
  unreadMessages = 0,
}: ClientIconMenuProps) {
  const badgeMap = { bidsCount, unreadMessages };

  return (
    <div className="grid grid-cols-5 gap-2">
      {menuItems.map((item) => {
        const badge = item.badgeKey ? badgeMap[item.badgeKey] : item.badge;
        const active = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onTabChange?.(item.key)}
            className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
              active
                ? 'bg-white border-brand-orange text-brand-orange shadow-sm'
                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {badge ? (
                <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {badge > 99 ? '99+' : badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium text-center leading-none">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
