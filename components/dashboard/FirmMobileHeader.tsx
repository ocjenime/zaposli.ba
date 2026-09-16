'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Briefcase, Building2, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import NotificationBell from '@/components/NotificationBell';

interface FirmMobileHeaderProps {
  firmName?: string | null;
  role?: string | null;
}

export default function FirmMobileHeader({ firmName, role }: FirmMobileHeaderProps) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName = firmName || user?.email?.split('@')[0] || 'Korisnik';
  const roleLabel = role === 'majstor' ? 'Majstor' : 'Firma';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navLinks = [
    { href: '/dashboard/firma/', label: 'Početna', icon: Building2 },
    { href: '/dashboard/firma/?tab=ads', label: 'Oglasi', icon: Briefcase },
    { href: '/dashboard/firma/?tab=bids', label: 'Ponude', icon: User },
    { href: '/dashboard/razgovor/', label: 'Poruke', icon: Bell },
    { href: '/dashboard/firma/profil/', label: 'Profil firme', icon: User },
  ];

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-ink-950/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-white/90"
            aria-label="Otvori izbornik"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo-mark.png" alt="Zaposli.ba" width={28} height={28} className="rounded" />
            <span className="font-bold text-white tracking-tight">ZAPOSLI.BA</span>
          </Link>

          <div className="flex items-center gap-1">
            <NotificationBell />
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-1.5 pl-1 pr-1 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                {initials || 'F'}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Profile dropdown */}
        {profileOpen && (
          <div className="absolute right-2 top-14 w-56 bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-ink-800 p-2 animate-fade-in">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-ink-800 mb-1">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-white/60">{roleLabel}</p>
            </div>
            <Link
              href="/dashboard/firma/profil/"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
            >
              <User className="w-4 h-4" /> Profil firme
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Odjavi se
            </button>
          </div>
        )}
      </header>

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-ink-950 shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-ink-800">
              <span className="font-bold text-gray-900 dark:text-white">Meni</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-white/80"
                aria-label="Zatvori izbornik"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-900 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-brand-orange" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
