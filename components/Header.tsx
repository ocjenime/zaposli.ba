'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Shield,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Home,
  Search,
  MapPin,
  Briefcase,
  HardHat,
  Heart,
  Globe,
  ArrowRight,
  Apple,
  Play,
  ClipboardList,
} from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';

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

const mobilePrimaryLinks = [
  { href: '/', label: 'Početna', icon: Home },
  { href: '/kategorije/', label: 'Kategorije', icon: Search },
  { href: '/gradovi/', label: 'Gradovi', icon: MapPin },
  { href: '/poslovi/', label: 'Poslovi', icon: ClipboardList },
  { href: '/objavi-projekat/', label: 'Objavi posao', icon: Briefcase, badge: 'Besplatno' },
  { href: '/top-firme/', label: 'Pronađi majstora', icon: HardHat },
  { href: '/oglasi/', label: 'Oglasi', icon: Megaphone },
];

const mobileSecondaryLinks = [
  { href: '/kako-funkcionise/', label: 'Kako funkcioniše', icon: HelpCircle },
  { href: '/za-firme/', label: 'Za firme', icon: Building2 },
  { href: '/kontakt/', label: 'Kontakt', icon: Mail },
];

function MobileMenuRow({
  href,
  icon: Icon,
  label,
  badge,
  active,
  onNavigate,
}: {
  href: string;
  icon: typeof Home;
  label: string;
  badge?: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-2.5 py-[7px] rounded-xl transition-colors active:scale-[0.99] ${
        active ? 'bg-orange-50 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        className={`w-5 h-5 shrink-0 ${active ? 'text-brand-orange' : 'text-gray-900 dark:text-[#ffffff]'}`}
        strokeWidth={1.8}
      />
      <span
        className={`flex-1 text-[15px] leading-snug ${
          active ? 'text-brand-orange font-semibold' : 'text-gray-900 dark:text-[#ffffff] font-medium'
        }`}
      >
        {label}
      </span>
      {badge && (
        <span className="text-xs font-semibold text-brand-orange bg-orange-100/80 dark:bg-brand-orange/15 px-2 py-0.5 rounded-full shrink-0">
          {badge}
        </span>
      )}
      <ChevronRight
        className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-brand-orange' : 'text-gray-400 dark:text-white/40'}`}
      />
    </Link>
  );
}

export default function Header({ dark = false }: { dark?: boolean }) {
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${
          dark
            ? 'bg-ink-950/95 border-white/5'
            : 'bg-white/90 dark:bg-ink-900/90 border-gray-100/80 dark:border-ink-800/80'
        } ${scrolled ? 'shadow-sm dark:shadow-ink-900/50' : ''}`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[auto_1fr_auto] lg:flex h-12 md:h-16 items-center lg:justify-between">
            <button
              ref={mobileButtonRef}
              type="button"
              className={`lg:hidden col-start-1 justify-self-start p-2 rounded-xl transition-colors touch-manipulation cursor-pointer ${
                dark
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-[#ffffff] dark:hover:bg-ink-800'
              }`}
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
              <Logo variant={dark ? 'light' : 'dark'} />
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
                    className={`flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full transition-colors ${
                      dark
                        ? 'bg-white/10 hover:bg-white/15'
                        : 'bg-gray-100/80 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                      {initials || 'K'}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 ${dark ? 'text-white/70' : 'text-gray-500 dark:text-white/60'} transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className={`absolute right-0 top-11 w-56 rounded-2xl shadow-2xl border p-2 animate-fade-in z-50 ${dark ? 'bg-ink-900 border-ink-800' : 'bg-white dark:bg-ink-900 border-gray-100 dark:border-ink-800'}`}>
                      <div className={`px-3 py-2 border-b mb-1 ${dark ? 'border-ink-800' : 'border-gray-100 dark:border-ink-800'}`}>
                        <p className={`font-semibold truncate ${dark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{displayName}</p>
                        <p className={`text-xs ${dark ? 'text-white/60' : 'text-gray-500 dark:text-white/60'}`}>{roleLabel}</p>
                      </div>
                      <Link
                        href={dashboardHref}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          dark
                            ? 'text-white/90 hover:bg-ink-800'
                            : 'text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-ink-800'
                        }`}
                      >
                        <Building2 className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href={profileHref}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          dark
                            ? 'text-white/90 hover:bg-ink-800'
                            : 'text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-ink-800'
                        }`}
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    dark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:text-white'
                  }`}
                >
                  Prijava
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu - premium drawer matching the design mockup */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Mobilni meni">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="absolute left-0 top-0 bottom-0 w-[88%] max-w-[340px] bg-white dark:bg-ink-900 shadow-2xl overflow-y-auto overscroll-contain animate-slide-in"
          >
            <div className="px-4 pt-2.5 pb-3 space-y-3">
              {/* Top bar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Zatvori meni"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-900 dark:text-white shrink-0"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
                <div className="flex-1 flex flex-col items-center min-w-0">
                  <Logo />
                  <span className="text-[10px] text-gray-400 dark:text-white/50 mt-0.5">Ljudi. Poslovi. Povjerenje.</span>
                </div>
                <div className="w-9 shrink-0" aria-hidden="true" />
              </div>

              {/* Account */}
              {user ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-0"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-orange text-white text-base font-bold flex items-center justify-center shrink-0">
                    {initials || 'K'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-white/60">{roleLabel} - Idi na dashboard</p>
                  </div>
                  <ChevronRight className="w-[18px] h-[18px] text-gray-400 dark:text-white/40 shrink-0" />
                </Link>
              ) : (
                <Link
                  href="/prijava/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-0"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-gray-600 dark:text-white/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 dark:text-white">Prijavi se</p>
                    <p className="text-xs text-gray-500 dark:text-white/60">Brže do svojih projekata</p>
                  </div>
                  <ChevronRight className="w-[18px] h-[18px] text-gray-400 dark:text-white/40 shrink-0" />
                </Link>
              )}

              {/* Primary nav */}
              <nav className="space-y-0.5" aria-label="Glavna navigacija">
                {mobilePrimaryLinks.map((link) => (
                  <MobileMenuRow
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    badge={'badge' in link ? link.badge : undefined}
                    active={isActive(pathname, link.href)}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}
              </nav>

              <div className="h-px bg-gray-100 dark:bg-white/10" />

              {/* Secondary nav */}
              <nav className="space-y-0.5" aria-label="Informacije">
                {mobileSecondaryLinks.map((link) => (
                  <MobileMenuRow
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    active={isActive(pathname, link.href)}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}
                {user && isAdmin && (
                  <MobileMenuRow
                    href="/admin/"
                    icon={Shield}
                    label="Admin panel"
                    active={isActive(pathname, '/admin/')}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                )}
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-[7px] rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.99]"
                  >
                    <LogOut className="w-5 h-5 shrink-0 text-gray-900 dark:text-[#ffffff]" strokeWidth={1.8} />
                    <span className="flex-1 text-left text-[15px] font-medium text-gray-900 dark:text-[#ffffff]">
                      Odjavi se
                    </span>
                    <ChevronRight className="w-[18px] h-[18px] shrink-0 text-gray-400 dark:text-white/40" />
                  </button>
                )}
              </nav>

              {/* Promo card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#FFF3E8] dark:bg-ink-800">
                <div className="relative z-10 p-3 pr-[44%]">
                  <p className="text-[9px] font-bold tracking-[0.14em] text-brand-orange mb-1">
                    REALNI LJUDI. STVARNI REZULTATI.
                  </p>
                  <p className="text-base leading-[1.15] font-extrabold text-gray-900 dark:text-white">
                    Tvoj sljedeći majstor je ovdje.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5 mb-2">
                    Brzo, jednostavno i sigurno.
                  </p>
                  <Link
                    href="/objavi-projekat/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold px-3.5 py-2 rounded-xl shadow-lg shadow-brand-orange/30 transition-colors"
                  >
                    Objavi posao
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="absolute inset-y-0 right-0 w-[46%]">
                  <Image
                    src="/images/majstor-cekic.webp"
                    alt="Majstor na poslu"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3E8] via-[#FFF3E8]/20 to-transparent dark:from-ink-800 dark:via-ink-800/20 dark:to-transparent" />
                </div>
                <p className="absolute z-20 bottom-2 right-2 max-w-[42%] font-serif italic text-[11px] leading-tight text-gray-900 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
                  Majstori koje <span className="border-b-2 border-brand-orange">preporučuješ</span>.
                </p>
              </div>

              {/* App badges */}
              <div>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 dark:text-white/50 mb-0.5">
                  USKORO DOSTUPNO
                </p>
                <p className="text-[15px] font-extrabold text-gray-900 dark:text-white">Zaposli.ba aplikacija</p>
                <p className="text-xs text-gray-500 dark:text-white/60 mb-1.5">Još brže do majstora, bilo gdje.</p>
                <div className="flex gap-2">
                  <div
                    className="flex-1 flex items-center gap-2 bg-black text-white rounded-xl px-2.5 py-1.5"
                    title="Uskoro dostupno"
                    aria-label="App Store - uskoro dostupno"
                  >
                    <Apple className="w-5 h-5 shrink-0" />
                    <span className="leading-tight">
                      <span className="block text-[8px] uppercase opacity-80">Preuzmi na</span>
                      <span className="block text-[13px] font-semibold">App Store</span>
                    </span>
                  </div>
                  <div
                    className="flex-1 flex items-center gap-2 bg-black text-white rounded-xl px-2.5 py-1.5"
                    title="Uskoro dostupno"
                    aria-label="Google Play - uskoro dostupno"
                  >
                    <Play className="w-5 h-5 shrink-0 fill-current" />
                    <span className="leading-tight">
                      <span className="block text-[8px] uppercase opacity-80">Dostupno na</span>
                      <span className="block text-[13px] font-semibold">Google Play</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-gray-100 dark:border-white/10 space-y-2">
                <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60">
                  <Heart className="w-3.5 h-3.5 text-brand-orange fill-current shrink-0" />
                  Podržavamo lokalne majstore.
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/60">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    BA
                  </span>
                  <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60">
                    Tema
                    <ThemeToggle simple />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
