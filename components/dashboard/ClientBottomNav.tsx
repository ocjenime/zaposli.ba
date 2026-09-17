'use client';

import Link from 'next/link';
import { Home, FolderOpen, Send, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface ClientBottomNavProps {
  bidsCount?: number;
  unreadMessages?: number;
  onMoreClick?: () => void;
}

export default function ClientBottomNav({ bidsCount = 0, unreadMessages = 0, onMoreClick }: ClientBottomNavProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'home';

  const items = [
    { href: '/dashboard/', label: 'Početna', icon: Home, key: 'home' },
    { href: '/dashboard/?tab=jobs', label: 'Poslovi', icon: FolderOpen, key: 'jobs' },
    { href: '/dashboard/?tab=bids', label: 'Ponude', icon: Send, key: 'bids', badge: bidsCount },
    { href: '/dashboard/razgovor/', label: 'Poruke', icon: MessageSquare, key: 'messages', badge: unreadMessages },
  ];

  const moreActive = tab === 'more';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-ink-950 border-t border-gray-100 dark:border-ink-800 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = tab === item.key || (tab === null && item.key === 'home');
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-xl transition-colors ${
                active ? 'text-brand-orange' : 'text-gray-400 dark:text-white/50'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && <span className="absolute -bottom-0.5 w-8 h-0.5 rounded-full bg-brand-orange" />}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMoreClick}
          className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-xl transition-colors ${
            moreActive ? 'text-brand-orange' : 'text-gray-400 dark:text-white/50'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">Više</span>
          {moreActive && <span className="absolute -bottom-0.5 w-8 h-0.5 rounded-full bg-brand-orange" />}
        </button>
      </div>
    </nav>
  );
}
