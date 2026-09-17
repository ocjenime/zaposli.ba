'use client';

import Link from 'next/link';
import {
  X, LayoutDashboard, Users, Building2, ShieldCheck, Star, MessageSquare,
  Briefcase, CreditCard, DollarSign, FileText, Flag, Megaphone, Bell,
  Scale, ArrowLeft, LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AdminMoreMenuProps {
  open: boolean;
  onClose: () => void;
  unreadRequests?: number;
  pendingVerifications?: number;
  pendingReviews?: number;
  openMediations?: number;
}

const menuItems = [
  { href: '/admin/?tab=overview', label: 'Pregled', icon: LayoutDashboard, badgeKey: null },
  { href: '/admin/?tab=users', label: 'Korisnici', icon: Users, badgeKey: null },
  { href: '/admin/?tab=firms', label: 'Firme', icon: Building2, badgeKey: null },
  { href: '/admin/?tab=verifications', label: 'Verifikacije', icon: ShieldCheck, badgeKey: 'pendingVerifications' },
  { href: '/admin/?tab=reviews', label: 'Recenzije', icon: Star, badgeKey: 'pendingReviews' },
  { href: '/admin/?tab=conversations', label: 'Razgovori', icon: MessageSquare, badgeKey: null },
  { href: '/admin/?tab=jobs', label: 'Poslovi', icon: Briefcase, badgeKey: null },
  { href: '/admin/?tab=subscriptions', label: 'Pretplate', icon: CreditCard, badgeKey: null },
  { href: '/admin/?tab=payments', label: 'Plaćanja', icon: DollarSign, badgeKey: null },
  { href: '/admin/?tab=plans', label: 'Paketi', icon: FileText, badgeKey: null },
  { href: '/admin/?tab=reports', label: 'Prijave', icon: Flag, badgeKey: null },
  { href: '/admin/?tab=mediations', label: 'Sporovi', icon: Scale, badgeKey: 'openMediations' },
  { href: '/admin/?tab=promotions', label: 'Oglasi', icon: Megaphone, badgeKey: null },
  { href: '/admin/?tab=requests', label: 'Zahtjevi', icon: Bell, badgeKey: 'unreadRequests' },
] as const;

export default function AdminMoreMenu({
  open,
  onClose,
  unreadRequests = 0,
  pendingVerifications = 0,
  pendingReviews = 0,
  openMediations = 0,
}: AdminMoreMenuProps) {
  const { signOut } = useAuth();

  if (!open) return null;

  const badges: Record<string, number> = {
    unreadRequests,
    pendingVerifications,
    pendingReviews,
    openMediations,
  };

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 bg-white dark:bg-ink-950 rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-ink-800">
          <span className="font-bold text-gray-900 dark:text-white">Sve sekcije</span>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-white/80"
            aria-label="Zatvori"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-3 grid grid-cols-2 gap-1">
          {menuItems.map((item) => {
            const badge = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
              >
                <item.icon className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-sm truncate">{item.label}</span>
                {badge ? (
                  <span className="ml-auto min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {badge > 99 ? '99+' : badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 pt-0 space-y-1">
          <Link
            href="/dashboard/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand-orange" /> Nazad na dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              signOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Odjavi se
          </button>
        </div>
      </div>
    </div>
  );
}