'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, ArrowRight, Shield, Star, CheckCircle, Siren, X } from 'lucide-react';
import Link from 'next/link';
import { cities } from '@/lib/data';

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('');
  const [query, setQuery] = useState('');
  const [emergencyBannerVisible, setEmergencyBannerVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
    <section className="relative min-h-[auto] lg:min-h-[92vh] flex flex-col overflow-hidden bg-[#FAFAFA]">
      {/* Ambient gradient orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-br from-orange-100/40 to-rose-50/30 blur-[100px] lg:blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-tr from-blue-50/30 to-orange-50/20 blur-[80px] lg:blur-[100px]" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-brand-orange/5 rounded-full blur-[80px] lg:blur-[120px]" />

      {/* Fine dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.12] lg:opacity-[0.18]">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <pattern id="heroDots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="#9CA3AF" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#heroDots)" />
        </svg>
      </div>

      {mounted && emergencyBannerVisible && (
        <div className="relative z-20 bg-[#1a1a1a] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 lg:py-3 flex items-center justify-between gap-3">
            <Link
              href="/kategorije/hitne-intervencije/"
              className="flex items-center gap-2 text-xs lg:text-sm font-medium hover:opacity-90 transition-opacity min-w-0"
            >
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] lg:text-xs font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full">
                <Siren className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
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

      <div className="relative z-10 flex-grow flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-14 lg:py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left content */}
            <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-[11px] lg:text-xs font-medium text-gray-600 mb-4 lg:mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Preko 3.000 završenih poslova
              </div>

              <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-gray-900 mb-4 lg:mb-6 leading-[1.1] tracking-tight">
                Pronađite majstora
                <br />
                <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                  za vaš posao
                </span>
              </h1>

              <p className="text-base lg:text-lg xl:text-xl text-gray-500 mb-6 lg:mb-8 leading-relaxed max-w-lg">
                Besplatno objavite svoj posao i primite ponude od provjerenih građevinskih firmi i majstora širom Bosne i Hercegovine.
              </p>

              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg lg:shadow-xl shadow-gray-200/50 border border-gray-100 p-2 mb-6 lg:mb-8">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Šta vam je potrebno?"
                      className="w-full pl-12 pr-4 py-3.5 lg:py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                  <div className="relative md:w-44">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-12 pr-8 py-3.5 lg:py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 appearance-none text-sm"
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
                    className="bg-[#1a1a1a] text-white px-6 lg:px-8 py-3.5 lg:py-4 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-gray-900 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Objavi besplatno
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center gap-x-4 lg:gap-x-6 gap-y-2.5 text-xs lg:text-sm text-gray-500">
                {[
                  { icon: Shield, text: 'Verificirane firme' },
                  { icon: CheckCircle, text: 'Besplatno za klijente' },
                  { icon: Star, text: 'Stvarne recenzije' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5 lg:gap-2">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      <item.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-brand-orange" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image composition */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 relative">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                {/* Decorative frame - hidden on small mobile */}
                <div className="hidden sm:block absolute -inset-3 md:-inset-6 rounded-[2rem] md:rounded-[2.5rem] border border-gray-200/60" />
                <div className="hidden sm:block absolute -inset-6 md:-inset-12 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100/80" />

                {/* Main image */}
                <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl lg:shadow-2xl shadow-gray-300/30 bg-white">
                  <img
                    src="/zaposli.ba/images/majstor-hero.jpg"
                    alt="Provjereni majstor u modernom domu"
                    className={`w-full h-[260px] sm:h-[360px] md:h-[420px] lg:h-[500px] xl:h-[560px] object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-4 md:-left-8 bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl shadow-gray-200/50 border border-gray-50 p-3 lg:p-5">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white">
                      <CheckCircle className="w-4 h-4 lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">4.9</p>
                      <p className="text-[10px] lg:text-xs text-gray-500">Prosječna ocjena</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-4 -right-2 sm:top-6 sm:-right-4 md:-right-8 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-50 px-3 py-2 lg:px-4 lg:py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 lg:-space-x-2">
                      {['bg-blue-500', 'bg-green-500', 'bg-orange-500'].map((c, i) => (
                        <div key={i} className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] lg:text-xs font-bold`}>
                          {['E', 'V', 'M'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm font-bold text-gray-900">2.400+</p>
                      <p className="text-[9px] lg:text-xs text-gray-500">Aktivnih majstora</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
