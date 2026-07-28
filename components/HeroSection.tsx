'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, Shield, Star, CheckCircle, ArrowRight, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { cities } from '@/lib/data';

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('');
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/objavi-projekat/');
  };

  return (
    <section className="relative md:min-h-[92vh] flex items-center overflow-hidden bg-white">
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-14 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Lijevo: sadržaj */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 mb-6 md:mb-8">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              <span className="text-ink/80 text-sm font-medium">Više od 2,800+ verificiranih firmi i zanatlija</span>
            </div>

            <h1 className="text-[2rem] sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-ink mb-4 md:mb-6 leading-[1.1] tracking-tight">
              Pronađite majstora
              <br />
              <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                za vaš projekat
              </span>
            </h1>

            <p className="text-base md:text-xl text-steel mb-7 md:mb-10 leading-relaxed">
              Besplatno objavite svoj projekat i primite ponude od provjerenih građevinskih firmi i zanatlija širom Bosne i Hercegovine.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-float border border-gray-100 p-3 mb-6 md:mb-8">
              {/* Mobilna fotografija — arched tretman kao desktop */}
              <div className="lg:hidden relative mb-3 mt-1">
                <div className="absolute inset-0 rounded-t-full rounded-b-2xl border-2 border-brand-orange/25 translate-x-2.5 translate-y-2.5" aria-hidden="true" />
                <div className="relative rounded-t-full rounded-b-2xl overflow-hidden ring-1 ring-ink/5 shadow-float">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/zaposli.ba/images/majstor-hero.jpg"
                    alt="Provjereni majstor u renoviranom domu"
                    className="w-full h-52 object-cover object-[62%_15%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
                </div>
                <div className="absolute top-10 -right-2 bg-white rounded-2xl shadow-float border border-gray-100 px-3 py-2 flex items-center gap-2 animate-float">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-md shadow-brand-orange/25">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-ink leading-none">4.8</div>
                    <div className="text-[9px] text-steel mt-0.5 font-medium">prosječna ocjena</div>
                  </div>
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
                    className="w-full pl-12 pr-4 py-4 bg-cloud rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-ink placeholder:text-steel/70 text-sm"
                  />
                </div>
                <div className="relative md:w-44">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-8 py-4 bg-cloud rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-ink appearance-none text-sm"
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
                  className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold text-sm whitespace-nowrap hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  Objavi besplatno
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-steel">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <span className="font-bold text-ink ml-1">4.8</span>
                <span>prosječna ocjena</span>
              </div>
              <span className="hidden sm:block w-1 h-1 bg-mist rounded-full" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-orange" />
                <span>Verificirane firme</span>
              </div>
              <span className="hidden sm:block w-1 h-1 bg-mist rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-orange" />
                <span>Besplatno za kupce</span>
              </div>
            </div>

          </div>

          {/* Desno: arched fotografija (Collins tretman) */}
          <div className="hidden lg:block relative mx-auto max-w-[440px] w-full">
            {/* Offset prsten */}
            <div className="absolute inset-0 rounded-t-full rounded-b-[2.5rem] border-2 border-brand-orange/25 translate-x-5 translate-y-5" aria-hidden="true" />

            {/* Arched fotografija */}
            <div className="relative rounded-t-full rounded-b-[2.5rem] overflow-hidden shadow-float ring-1 ring-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zaposli.ba/images/majstor-hero.jpg"
                alt="Provjereni majstor u renoviranom domu"
                className="object-cover w-full h-[560px] object-[62%_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </div>

            {/* Kartica: ocjena */}
            <div className="absolute top-12 -right-5 bg-white rounded-2xl shadow-float border border-gray-100 px-4 py-3 flex items-center gap-2.5 animate-float">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-md shadow-brand-orange/25">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-ink leading-none">4.8</div>
                <div className="text-[10px] text-steel mt-0.5 font-medium">prosječna ocjena</div>
              </div>
            </div>

            {/* Kartica: projekat/ponude */}
            <div className="absolute bottom-24 -left-8 bg-white rounded-2xl shadow-float border border-gray-100 px-4 py-3 animate-float" style={{ animationDelay: '1.2s' }}>
              <div className="text-[10px] text-steel mb-0.5">Adaptacija kupatila</div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-ink text-sm">8 ponuda</span>
                <span className="text-[11px] font-semibold text-brand-orange">2,000–3,500 KM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
