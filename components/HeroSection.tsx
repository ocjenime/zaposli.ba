'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, ArrowRight, Siren, X, CheckCircle2 } from 'lucide-react';
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
    <section className="relative bg-white overflow-hidden">
      {/* Emergency banner */}
      {mounted && emergencyBannerVisible && (
        <div className="relative z-20 bg-[#111] text-white">
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

      {/* Subtle warm background wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-gradient-radial from-orange-50/80 via-white to-white opacity-70" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-18 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text & form — first on mobile, second on desktop */}
          <div className="lg:col-span-6 order-1 lg:order-2 animate-fade-in">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-brand-orange tracking-wide uppercase mb-5 sm:mb-6">
                Marketplace za usluge u BiH
              </span>

              <h1 className="text-[2.1rem] sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] xl:text-[3.75rem] font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-5 sm:mb-6 max-w-3xl">
                Pronađite majstora
                <br />
                <span className="text-brand-orange">za vaš posao</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-7 sm:mb-9 max-w-2xl">
                Besplatno objavite svoj projekt i primite ponude od provjerenih građevinskih firmi i majstora širom Bosne i Hercegovine.
              </p>

              {/* Search form */}
              <form
                onSubmit={handleSearch}
                className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-2 sm:p-3"
              >
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Šta vam je potrebno?"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 rounded-xl sm:rounded-2xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                    />
                  </div>
                  <div className="relative sm:w-44 min-w-0">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-12 pr-8 py-3.5 sm:py-4 bg-gray-50 rounded-xl sm:rounded-2xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 appearance-none text-sm transition-all cursor-pointer"
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
                    className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/25 hover:shadow-xl hover:shadow-brand-orange/30"
                  >
                    Objavi besplatno
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Trust signal — real feature, not fake stats */}
              <div className="mt-5 sm:mt-6 flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                <span>Provjereni majstori s ocjenama i recenzijama klijenata</span>
              </div>
            </div>
          </div>

          {/* Hero image — first on desktop, second on mobile */}
          <div className="lg:col-span-6 order-2 lg:order-1 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Decorative brand shape behind image */}
              <div className="absolute -inset-3 sm:-inset-4 lg:-inset-5 bg-gradient-to-br from-brand-orange/10 via-brand-orange/5 to-transparent rounded-[2rem] sm:rounded-[3rem] rotate-2" />
              <div className="absolute -inset-3 sm:-inset-4 lg:-inset-5 bg-gradient-to-tr from-orange-100/50 to-transparent rounded-[2rem] sm:rounded-[3rem] -rotate-1" />

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gray-100 shadow-2xl shadow-gray-200/70">
                <Image
                  src="/zaposli.ba/images/majstor-hero.webp"
                  alt="Profesionalni i ugledan majstor rješava kuhinjsku instalaciju"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
                {/* Subtle gradient overlay for cohesion */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Floating "free to post" pill */}
              <div className="absolute -bottom-4 left-4 sm:left-6 bg-white rounded-full shadow-xl shadow-gray-200/60 px-4 py-2.5 border border-gray-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-gray-900">Besplatno objavljivanje</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
