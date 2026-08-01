'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, ArrowRight, Shield, Star, CheckCircle, Siren, X, Play } from 'lucide-react';
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
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden bg-[#FAFAFA]">
      {/* Ambient gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-100/40 to-rose-50/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-50/30 to-orange-50/20 blur-[100px]" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px]" />

      {/* Fine dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.18]">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <pattern id="heroDots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="#9CA3AF" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#heroDots)" />
        </svg>
      </div>

      {mounted && emergencyBannerVisible && (
        <div className="relative z-20 bg-[#1a1a1a] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <Link
              href="/kategorije/hitne-intervencije/"
              className="flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity min-w-0"
            >
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Siren className="w-3 h-3" />
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
            {/* Left content */}
            <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-medium text-gray-600 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Preko 3.000 završenih poslova
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-semibold text-gray-900 mb-6 leading-[1.05] tracking-tight">
                Vaš dom,{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-brand-orange via-brand-orange-dark to-amber-600 bg-clip-text text-transparent">
                    savršeno
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8C40 2 100 2 198 8" stroke="url(#underlineGradient)" strokeWidth="4" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="underlineGradient" x1="0" y1="0" x2="200" y2="0">
                        <stop stopColor="#F97316" />
                        <stop offset="1" stopColor="#EA580C" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                odrađen.
              </h1>

              <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
                Povezujemo vas s provjerenim majstorima i građevinskim firmama u Bosni i Hercegovini. Objavite posao besplatno — ponude stižu u roku od 24 sata.
              </p>

              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-2 mb-8">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Šta vam je potrebno?"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                  <div className="relative md:w-48">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-12 pr-8 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 appearance-none text-sm"
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
                    className="bg-[#1a1a1a] text-white px-8 py-4 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-gray-900 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Objavi besplatno
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
                {[
                  { icon: Shield, text: 'Verificirane firme' },
                  { icon: CheckCircle, text: 'Besplatno za klijente' },
                  { icon: Star, text: 'Stvarne recenzije' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      <item.icon className="w-4 h-4 text-brand-orange" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image composition */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 relative">
              <div className="relative mx-auto max-w-2xl lg:max-w-none">
                {/* Decorative frame */}
                <div className="absolute -inset-4 md:-inset-6 rounded-[2.5rem] border border-gray-200/60" />
                <div className="absolute -inset-8 md:-inset-12 rounded-[3rem] border border-gray-100/80" />

                {/* Main image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-300/40 bg-white">
                  <img
                    src="/zaposli.ba/images/majstor-hero.jpg"
                    alt="Provjereni majstor u modernom domu"
                    className={`w-full h-[380px] md:h-[500px] lg:h-[560px] object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Floating video/play card */}
                  <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-64 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5 text-brand-orange fill-brand-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Kako Zaposli.ba radi</p>
                        <p className="text-xs text-gray-500">Pogledajte u 60 sekundi</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-50 p-5 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.9</p>
                      <p className="text-xs text-gray-500">Prosječna ocjena</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-6 -right-4 md:-right-8 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-50 px-4 py-3 hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['bg-blue-500', 'bg-green-500', 'bg-orange-500'].map((c, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                          {['E', 'V', 'M'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">2.400+</p>
                      <p className="text-xs text-gray-500">Aktivnih majstora</p>
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
