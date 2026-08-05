import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stranica nije pronađena | Zaposli.ba',
  description: 'Tražena stranica ne postoji. Pronađite majstore ili objavite posao na Zaposli.ba.',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-10 h-10 text-brand-orange" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">404</h1>
          <p className="text-xl font-semibold text-gray-900 mb-2">Stranica nije pronađena</p>
          <p className="text-steel mb-8">
            Izgleda da stranica koju tražite ne postoji ili je premještena.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazad na početnu
            </Link>
            <Link
              href="/poslovi/"
              className="inline-flex items-center gap-2 bg-white text-brand-orange border-2 border-brand-orange px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all"
            >
              Pogledaj poslove
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
