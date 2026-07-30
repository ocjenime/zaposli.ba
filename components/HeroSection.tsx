'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, Shield, Star, CheckCircle, ArrowRight, BadgeCheck, Siren, X } from 'lucide-react';
import Link from 'next/link';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
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
    <section className="relative md:min-h-[92vh] flex flex-col overflow-hidden bg-white pt-16 md:pt-20">
      {mounted && emergencyBannerVisible && (
        <div className="relative z-10 bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-[#ffffff] shadow-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
            <Link
              href="/kategorije/hitne-intervencije/"
              className="flex items-center gap-2 text-sm font-semibold hover:opacity-90 transition-opacity min-w-0"
            >
              <Siren className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">Hitne intervencija 24/7</span>
              <span className="hidden sm:inline truncate">Hitne intervencije 24/7 — majstori dostupni odmah</span>
              <ArrowRight className="w-4 h-4 shrink-0 hidden sm:block" />
            </Link>
            <button
              type="button"
              onClick={dismissEmergencyBanner}
              className="p-1 hover:bg-[#ffffff]/10 rounded-lg transition-colors shrink-0"
              aria-label="Zatvori"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Svijetla dekoracija */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cloud rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-50 rounded-full -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-[0.35]">
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="heroDots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#E5E7EB" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#heroDots)" />
        </svg>
      </div>

      <div className="relative flex-grow flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Lijevo: sadržaj */}
          <div className="max-w-xl">
            <h1 className="text-[2rem] sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-[1.1] tracking-tight">
              Pronađite majstora
              <br />
              <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                za vaš posao
              </span>
            </h1>

            <p className="text-base md:text-xl text-steel mb-7 md:mb-10 leading-relaxed">
              Besplatno objavite svoj posao i primite ponude od provjerenih građevinskih firmi i majstora širom Bosne i Hercegovine.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-float border border-gray-100 p-3 mb-6 md:mb-8">
              {/* Mobilna fotografija: cijela scena */}
              <div className="lg:hidden relative mb-3 mt-1">
                <div className="absolute inset-0 rounded-2xl border-2 border-brand-orange/25 translate-x-2.5 translate-y-2.5" aria-hidden="true" />
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-ink/5 shadow-float">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/zaposli.ba/images/majstor-hero.jpg"
                    alt="Provjereni majstor u renoviranom domu"
                    className="w-full h-48 object-cover object-[62%_35%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Šta vam je potrebno?"
                    className="w-full pl-12 pr-4 py-4 bg-cloud rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-gray-900 placeholder:text-steel/70 text-sm"
                  />
                </div>
                <div className="relative md:w-44">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-8 py-4 bg-cloud rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-gray-900 appearance-none text-sm"
                  >
                    <option value="">Svi gradovi</option>
                    {cities.map((city) => (
                      <option key={city.slug} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steel pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold text-sm whitespace-nowrap hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  Objavi besplatno
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-steel">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-orange" />
                <span>Verificirane firme</span>
              </div>
              <span className="hidden sm:block w-1 h-1 bg-mist rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-orange" />
                <span>Besplatno za klijente</span>
              </div>
              <span className="hidden sm:block w-1 h-1 bg-mist rounded-full" />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-orange" />
                <span>Stvarne recenzije</span>
              </div>
            </div>

          </div>

          {/* Desno: fotografija: cijela scena (majstor + dom) */}
          <div className="hidden lg:block relative">
            {/* Offset prsten */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-brand-orange/25 translate-x-4 translate-y-4" aria-hidden="true" />

            {/* Fotografija */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-float ring-1 ring-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zaposli.ba/images/majstor-hero.jpg"
                alt="Provjereni majstor u renoviranom domu"
                className="object-cover w-full h-[430px] object-[58%_40%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
