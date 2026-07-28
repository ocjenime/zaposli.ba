'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

const navigation = [
  { name: 'Početna', href: '/' },
  { name: 'Kategorije', href: '/kategorije/' },
  { name: 'Kako radi', href: '/kako-radi/' },
  { name: 'Za firme', href: '/za-firme/' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Samo početna ima tamni hero — na ostalim stranicama header je odmah "solid"
  const solid = scrolled || pathname !== '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Logo variant={solid ? 'dark' : 'light'} />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  solid
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/prijava/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                solid
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Prijava
            </Link>
            <Link
              href="/registracija/"
              className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all duration-200 active:scale-95"
            >
              Registracija
            </Link>
          </div>

          <button
            type="button"
            className={`md:hidden p-2 rounded-lg transition-colors ${solid ? 'text-gray-900' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 p-4 mb-4 border border-gray-100">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-brand-orange font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
              <Link href="/prijava/" className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Prijava
              </Link>
              <Link href="/registracija/" className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-semibold" onClick={() => setMobileMenuOpen(false)}>
                Registracija
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}