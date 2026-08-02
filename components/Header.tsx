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
  HelpCircle,
  Building2,
  FilePlus,
  Mail,
  Info,
  Phone,
  Bell,
  Sun,
  Shield,
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
  { href: '/projekti/', label: 'Poslovi', icon: FolderOpen },
  { href: '/kako-radi/', label: 'Kako radi', icon: HelpCircle },
  { href: '/za-firme/', label: 'Za firme', icon: Building2 },
  { href: '/kontakt/', label: 'Kontakt', icon: Mail },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border-b border-gray-100/80 dark:border-ink-800/80 ${
          scrolled ? 'shadow-sm dark:shadow-ink-900/50' : ''
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <Link href="/" className="flex items-center group hover:opacity-80 transition-opacity duration-200">
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
            <div className="flex items-center lg:hidden">
              <button
                ref={mobileButtonRef}
                type="button"
                className="p-2 rounded-xl transition-colors text-gray-900 hover:bg-gray-50 dark:text-[#ffffff] dark:hover:bg-ink-800 touch-manipulation cursor-pointer"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen((v) => !v);
                }}
                aria-label={mobileMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu — rendered outside fixed header to avoid iOS Safari stacking issues */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 z-[60] bg-white dark:bg-ink overflow-y-auto shadow-2xl"
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
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Navigacija</p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(pathname, link.href)
                        ? 'text-brand-orange bg-orange-50'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-ink-800'
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
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Račun</p>
              {user ? (
                <>
                  {user && !isAdmin && !isFirmRole(role) && (
                    <Link
                      href={profileHref}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-ink-800"
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
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/60 transition-colors"
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
                      ? 'text-brand-orange bg-orange-50'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-ink-800'
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
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Postavke</p>
                <div className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors">
                  <span className="flex items-center gap-3">
                    <Bell className="w-5 h-5 shrink-0" />
                    Obavještenja
                  </span>
                  <NotificationBell />
                </div>
                <div className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors">
                  <span className="flex items-center gap-3">
                    <Sun className="w-5 h-5 shrink-0" />
                    Tema
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="pt-4 border-t border-gray-100 dark:border-ink-700 space-y-3">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Kontakt</p>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <Mail className="w-4 h-4 shrink-0 text-brand-orange" />
                {site.email}
              </a>
              {site.phone && (
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <Phone className="w-4 h-4 shrink-0 text-brand-orange" />
                  {site.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
