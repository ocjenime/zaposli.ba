import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* For Customers */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tražite majstora?
            </h2>
            <p className="text-lg text-blue-100 mb-6">
              Objavite svoj projekat besplatno i primite ponude od provjerenih firmi u roku od 24 sata.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Potpuno besplatno</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Više ponuda za usporedbu</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ocjene i recenzije drugih kupaca</span>
              </li>
            </ul>
            <Link href="/objavi-projekat" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Objavi projekat besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* For Professionals */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Za firme i majstore</h3>
                <p className="text-sm text-gray-500">Pridružite se našoj platformi</p>
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Pristup hiljadama projekata</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Izgradite reputaciju kroz recenzije</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Besplatna registracija</span>
              </li>
            </ul>
            
            <Link href="/registracija-firme" className="block w-full text-center btn-primary">
              Registrujte firmu besplatno
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}