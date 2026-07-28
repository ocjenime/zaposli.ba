'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${scrolled ? 'shadow-lg' : 'border-b border-gray-100'}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Logo variant="dark" />
          </Link>

          {/* Desktop: 3 akcije (werkspot obrazac) */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/za-firme/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              Za majstore
            </Link>
            <Link
              href="/prijava/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              Prijava
            </Link>
            <Link
              href="/objavi-projekat/"
              className="ml-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all duration-200 active:scale-95"
            >
              Objavi projekat
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg transition-colors text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Meni"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 p-4 mb-4 border border-gray-100">
            <Link
              href="/objavi-projekat/"
              className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-semibold mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Objavi projekat
            </Link>
            <Link
              href="/prijava/"
              className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Prijava
            </Link>
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
