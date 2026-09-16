'use client';

import Link from 'next/link';
import { Home, Megaphone, Send, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface FirmBottomNavProps {
  unreadMessages?: number;
  bidsCount?: number;
}

export default function FirmBottomNav({ unreadMessages = 0, bidsCount = 0 }: FirmBottomNavProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'home';

  const items = [
    { href: '/dashboard/firma/', label: 'Početna', icon: Home, key: 'home' },
    { href: '/dashboard/firma/?tab=ads', label: 'Oglasi', icon: Megaphone, key: 'ads' },
    { href: '/dashboard/firma/?tab=bids', label: 'Ponude', icon: Send, key: 'bids', badge: bidsCount },
    { href: '/dashboard/razgovor/', label: 'Poruke', icon: MessageSquare, key: 'messages', badge: unreadMessages },
    { href: '/dashboard/firma/?tab=more', label: 'Više', icon: MoreHorizontal, key: 'more' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink-950 border-t border-white/5 px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = tab === item.key || (tab === null && item.key === 'home');
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-xl transition-colors ${
                active ? 'text-brand-orange' : 'text-white/60'
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
      </div>
    </nav>
  );
}
