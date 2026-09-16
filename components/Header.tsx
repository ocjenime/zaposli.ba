'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutGrid,
  MapPinned,
  FolderOpen,
  Megaphone,
  HelpCircle,
  Building2,
  FilePlus,
  Mail,
  Info,
  Bell,
  Sun,
  Shield,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { site } from '@/lib/site';

const navLinks = [
  { href: '/kategorije/', label: 'Kategorije', icon: LayoutGrid },
  { href: '/gradovi/', label: 'Gradovi', icon: MapPinned },
  { href: '/poslovi/', label: 'Poslovi', icon: FolderOpen },
  { href: '/oglasi/', label: 'Oglasi', icon: Megaphone },
  { href: '/kako-funkcionise/', label: 'Kako funkcioniše', icon: HelpCircle },
  { href: '/za-firme/', label: 'Za firme', icon: Building2 },
  { href: '/kontakt/', label: 'Kontakt', icon: Mail },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown on click outside
  useEffect(() => {
    if (!profileOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [profileOpen]);

  // Close mobile menu on ESC and click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const dashboardHref = isFirmRole(role) ? '/dashboard/firma/' : '/dashboard/';
  const profileHref = isFirmRole(role) ? '/dashboard/firma/profil/' : '/dashboard/profil/';
  const ctaHref = isAdmin ? '/admin/' : isFirmRole(role) ? '/dashboard/firma/' : '/objavi-projekat/';
  const ctaLabel = isAdmin ? 'Admin panel' : isFirmRole(role) ? 'Moja firma' : 'Objavi posao';
  const CtaIcon = isAdmin ? Shield : isFirmRole(role) ? Building2 : FilePlus;

  const displayName = user?.email?.split('@')[0] || 'Korisnik';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const roleLabel = isAdmin ? 'Admin' : isFirmRole(role) ? 'Firma' : 'Klijent';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border-b border-gray-100/80 dark:border-ink-800/80 ${
          scrolled ? 'shadow-sm dark:shadow-ink-900/50' : ''
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[auto_1fr_auto] lg:flex h-12 md:h-16 items-center lg:justify-between">
            <button
              ref={mobileButtonRef}
              type="button"
              className="lg:hidden col-start-1 justify-self-start p-2 rounded-xl transition-colors text-gray-900 hover:bg-gray-100 dark:text-[#ffffff] dark:hover:bg-ink-800 touch-manipulation cursor-pointer"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link
              href="/"
              className="col-start-2 lg:col-start-auto justify-self-center lg:justify-self-auto flex items-center group hover:opacity-80 transition-opacity duration-200 scale-100 md:scale-110"
            >
              <Logo variant="dark" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(pathname, link.href)
                      ? 'text-brand-orange bg-orange-50/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <>
                  <div className="relative">
                    <NotificationBell />
                  </div>
                  {user && !isAdmin && !isFirmRole(role) && (
                    <Link
                      href={profileHref}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive(pathname, profileHref)
                          ? 'text-brand-orange bg-orange-50'
                          : 'text-brand-orange bg-orange-50/60 hover:bg-orange-50 hover:text-brand-orange-dark'
                      }`}
                    >
                      Moj profil
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/60 transition-all duration-200"
                  >
                    Odjavi se
                  </button>
                </>
              ) : (
                <Link
                  href="/prijava/"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(pathname, '/prijava/')
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  Prijava
                </Link>
              )}
              <Link
                href={ctaHref}
                className="ml-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-lg hover:shadow-brand-orange/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:translate-y-0 inline-flex items-center gap-2"
              >
                  <CtaIcon className="w-4 h-4" />
                  {ctaLabel}
                </Link>
                <div className="ml-1">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile actions */}
            <div ref={profileRef} className="flex items-center gap-1.5 lg:hidden col-start-3 justify-self-end">
              <div className="relative">
                <NotificationBell />
              </div>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full bg-gray-100/80 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                      {initials || 'K'}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-11 w-56 bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-ink-800 p-2 animate-fade-in z-50">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-ink-800 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-white/60">{roleLabel}</p>
                      </div>
                      <Link
                        href={dashboardHref}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
                      >
                        <Building2 className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href={profileHref}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
                      >
                        <User className="w-4 h-4" /> Moj profil
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
                </>
              ) : (
                <Link
                  href="/prijava/"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:text-white transition-colors"
                >
                  Prijava
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu - rendered outside fixed header to avoid iOS Safari stacking issues */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-12 md:top-16 bottom-0 z-[60] bg-white dark:bg-ink overflow-y-auto shadow-2xl"
        >
          <div className="px-4 py-6 space-y-6">
            {/* Primary CTA */}
            <Link
              href={ctaHref}
              className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] font-semibold text-base shadow-lg shadow-brand-orange/25"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CtaIcon className="w-5 h-5" />
              {ctaLabel}
            </Link>

            {/* Main navigation */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-steel mb-2">Navigacija</p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(pathname, link.href)
                        ? 'text-brand-orange bg-orange-50 dark:bg-ink-800'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-[#ffffff] dark:hover:bg-ink-800'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth section */}
            <div className="space-y-1 pt-4 border-t border-gray-100 dark:border-ink-700">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-steel mb-2">Račun</p>
              {user ? (
                <>
                  {user && !isAdmin && !isFirmRole(role) && (
                    <Link
                      href={profileHref}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-[#ffffff] dark:hover:bg-ink-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Info className="w-5 h-5 shrink-0" />
                      Moj profil
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/60 transition-colors dark:text-[#ffffff]"
                  >
                    <X className="w-5 h-5 shrink-0" />
                    Odjavi se
                  </button>
                </>
              ) : (
                <Link
                  href="/prijava/"
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(pathname, '/prijava/')
                        ? 'text-brand-orange bg-orange-50 dark:bg-ink-800'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-[#ffffff] dark:hover:bg-ink-800'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="w-5 h-5 shrink-0" />
                  Prijava
                </Link>
              )}
            </div>

            {/* Settings */}
            {user && (
              <div className="space-y-1 pt-4 border-t border-gray-100 dark:border-ink-700">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-steel mb-2">Postavke</p>
                <div className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-[#ffffff] hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors">
                  <span className="flex items-center gap-3">
                    <Bell className="w-5 h-5 shrink-0" />
                    Obavještenja
                  </span>
                  <NotificationBell />
                </div>
                <div className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-[#ffffff] hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors">
                  <span className="flex items-center gap-3">
                    <Sun className="w-5 h-5 shrink-0 fill-current text-gray-700 dark:text-[#ffffff]" />
                    Tema
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="pt-4 border-t border-gray-100 dark:border-ink-700 space-y-3">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-steel">Kontakt</p>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-[#ffffff]"
              >
                <Mail className="w-4 h-4 shrink-0 text-brand-orange" />
                {site.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
