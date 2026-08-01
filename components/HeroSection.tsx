'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, ArrowRight, Siren, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cities } from '@/lib/data';


export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('');
  const [query, setQuery] = useState('');
  const [emergencyBannerVisible, setEmergencyBannerVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('emergencyBannerDismissed') === 'true') {
        setEmergencyBannerVisible(false);
      }
    } catch {}
  }, []);

  const dismissEmergencyBanner = () => {
    setEmergencyBannerVisible(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('emergencyBannerDismissed', 'true');
      }
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('service', query.trim());
    if (selectedCity) params.set('city', selectedCity);
    router.push(`/objavi-projekat/?${params.toString()}`);
  };

  return (
    <section className="relative bg-white">
      {mounted && emergencyBannerVisible && (
        <div className="bg-[#1a1a1a] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
            <Link
              href="/kategorije/hitne-intervencije/"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity min-w-0"
            >
              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                <Siren className="w-2.5 h-2.5" />
                24/7
              </span>
              <span className="truncate">Hitne intervencije — majstori dostupni odmah</span>
              <ArrowRight className="w-4 h-4 shrink-0 hidden sm:block" />
            </Link>
            <button
              type="button"
              onClick={dismissEmergencyBanner}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0"
              aria-label="Zatvori"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-3xl mx-auto lg:mx-0 order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold text-gray-900 mb-4 sm:mb-5 leading-[1.1] tracking-tight text-center lg:text-left">
              Pronađite majstora
              <br className="hidden sm:block" />
              <span className="text-brand-orange">za vaš posao</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-500 mb-6 sm:mb-8 leading-relaxed text-center lg:text-left max-w-2xl">
              Besplatno objavite svoj posao i primite ponude od provjerenih građevinskih firmi i majstora širom Bosne i Hercegovine.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-2 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Šta vam je potrebno?"
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 rounded-lg sm:rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                  />
                </div>
                <div className="relative sm:w-44">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-8 py-3.5 sm:py-4 bg-gray-50 rounded-lg sm:rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 appearance-none text-sm"
                  >
                    <option value="">Svi gradovi</option>
                    {cities.map((city) => (
                      <option key={city.slug} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm whitespace-nowrap transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                  Objavi besplatno
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 shadow-xl shadow-gray-200/50">
              <Image
                src="/zaposli.ba/images/majstor-hero.jpg"
                alt="Profesionalni majstor rješava kuhinjsku instalaciju"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 sm:-bottom-5 left-4 sm:left-6 bg-white rounded-xl shadow-lg shadow-gray-200/60 px-4 py-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Provjereni majstori</p>
                  <p className="text-xs text-gray-500">ocjene i recenzije klijenata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
