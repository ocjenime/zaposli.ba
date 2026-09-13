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
  const router = useRouter();

  useEffect(() => {
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
    <section className="relative min-h-[760px] lg:min-h-[820px] flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/herozaposli.png"
          alt="Profesionalni majstor na gradilištu u Bosni i Hercegovini"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        {/* Cinematic overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-ink-950/35" />
      </div>

      {/* Emergency banner */}
      <div
        className={`relative z-30 mt-14 md:mt-16 bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg shadow-red-900/20 transition-all duration-300 ${
          emergencyBannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          <Link
            href="/kategorije/hitne-intervencije/"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity min-w-0"
          >
            <span className="inline-flex items-center gap-1 bg-white text-red-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
              <Siren className="w-2.5 h-2.5" />
              24/7
            </span>
            <span className="truncate">Hitne intervencije - majstori dostupni odmah</span>
            <ArrowRight className="w-4 h-4 shrink-0 hidden sm:block" />
          </Link>
          <button
            type="button"
            onClick={dismissEmergencyBanner}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0"
            aria-label="Zatvori"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-white/90 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              Marketplace za usluge u BiH
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in">
              Pronađite majstora
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                za vaš posao
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl animate-fade-in">
              Besplatno objavite svoj projekt i primite ponude od provjerenih građevinskih firmi i majstora širom Bosne i Hercegovine.
            </p>

            {/* Search form - glass */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl shadow-black/30 animate-fade-in"
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Šta vam treba? (npr. keramičar, moler...)"
                    aria-label="Šta vam treba? Pretraga usluga"
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white/10 rounded-xl sm:rounded-2xl border border-white/10 focus:bg-white/20 focus:ring-2 focus:ring-brand-orange/40 outline-none text-white placeholder:text-white/50 text-sm transition-all"
                  />
                </div>
                <div className="relative sm:w-44 min-w-0">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Odaberite grad"
                    className="w-full pl-12 pr-8 py-3.5 sm:py-4 bg-white/10 rounded-xl sm:rounded-2xl border border-white/10 focus:bg-white/20 focus:ring-2 focus:ring-brand-orange/40 outline-none text-white appearance-none text-sm transition-all cursor-pointer"
                  >
                    <option value="" className="text-gray-900">Svi gradovi</option>
                    {cities.map((city) => (
                      <option key={city.slug} value={city.name} className="text-gray-900">{city.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40"
                >
                  Objavi besplatno
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick stats */}
            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl animate-fade-in">
              {[
                { value: '50+', label: 'Kategorija' },
                { value: '45+', label: 'Gradova' },
                { value: '0 KM', label: 'Objava posla' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating app sticker - Higgsfield style (desktop only) */}
      <div className="pointer-events-none absolute z-20 right-2 sm:right-4 lg:right-2 xl:right-6 bottom-16 sm:bottom-auto sm:top-56 md:top-60 lg:top-64 xl:top-72 w-44 sm:w-56 md:w-80 lg:w-[520px] anim-float-soft drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)] drop-shadow-[0_0_40px_rgba(249,115,22,0.25)] hidden sm:block">
        <Image
          src="/images/hero-sticker.png"
          alt="Uskoro i mobilna aplikacija Zaposli.ba"
          width={560}
          height={420}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cloud to-transparent z-10" />
    </section>
  );
}
