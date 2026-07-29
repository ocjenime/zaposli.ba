'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardHref = role === 'firm' ? '/dashboard/firma/' : '/dashboard/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 ${scrolled ? 'shadow-sm' : ''}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center group hover:opacity-80 transition-opacity duration-200">
            <Logo variant="dark" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/za-firme/"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-ink hover:bg-gray-50/80 transition-all duration-200"
            >
              Za majstore
            </Link>
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-brand-orange bg-orange-50/60 hover:bg-orange-50 hover:text-brand-orange-dark transition-all duration-200"
                >
                  Moj profil
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-ink hover:bg-gray-50/80 transition-all duration-200"
                  >
                    Admin
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
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-ink hover:bg-gray-50/80 transition-all duration-200"
              >
                Prijava
              </Link>
            )}
            <Link
              href="/objavi-projekat/"
              className="ml-3 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-lg hover:shadow-brand-orange/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:translate-y-0"
            >
              Objavi posao
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 rounded-xl transition-colors text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Meni"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl mt-2 p-4 mb-4 border border-gray-100">
            <Link
              href="/objavi-projekat/"
              className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-semibold mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Objavi posao
            </Link>
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="block text-center px-4 py-3 rounded-xl bg-orange-50 text-brand-orange font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Moj profil
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/"
                    className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut(); }}
                  className="block w-full text-center px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
                >
                  Odjavi se
                </button>
              </>
            ) : (
              <Link
                href="/prijava/"
                className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prijava
              </Link>
            )}
            <Link
              href="/za-firme/"
              className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Za majstore
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
