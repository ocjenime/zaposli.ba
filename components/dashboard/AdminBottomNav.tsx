'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, Building2, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface AdminBottomNavProps {
  unreadRequests?: number;
  onMoreClick?: () => void;
}

const navKeys = ['overview', 'users', 'firms', 'verifications'];

export default function AdminBottomNav({ unreadRequests = 0, onMoreClick }: AdminBottomNavProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  const items = [
    { href: '/admin/', label: 'Pregled', icon: LayoutDashboard, key: 'overview' },
    { href: '/admin/?tab=users', label: 'Korisnici', icon: Users, key: 'users' },
    { href: '/admin/?tab=firms', label: 'Firme', icon: Building2, key: 'firms' },
    { href: '/admin/?tab=verifications', label: 'Verifikacije', icon: ShieldCheck, key: 'verifications' },
  ];

  const moreActive = !navKeys.includes(tab);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-ink-950 border-t border-gray-100 dark:border-ink-800 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = tab === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-xl transition-colors ${
                active ? 'text-brand-orange' : 'text-gray-400 dark:text-white/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
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
          <div className="relative">
            <MoreHorizontal className="w-5 h-5" />
            {unreadRequests ? (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadRequests > 99 ? '99+' : unreadRequests}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-medium">Više</span>
          {moreActive && <span className="absolute -bottom-0.5 w-8 h-0.5 rounded-full bg-brand-orange" />}
        </button>
      </div>
    </nav>
  );
}