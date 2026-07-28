'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown, Shield, Star, CheckCircle, ArrowRight, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

const cities = [
  'Sarajevo', 'Banja Luka', 'Tuzla', 'Mostar', 'Zenica',
  'Bihać', 'Brčko', 'Doboj', 'Bijeljina', 'Travnik'
];

function WorkerIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft background shapes */}
      <circle cx="250" cy="250" r="215" fill="#F0FAFC" />
      <circle cx="250" cy="250" r="215" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 8" fill="none" />
      <circle cx="250" cy="250" r="170" fill="#fff" />

      {/* House structure */}
      <rect x="140" y="220" width="220" height="180" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />
      <polygon points="128,222 250,128 372,222" fill="#f97316" stroke="#ea580c" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="220" y="310" width="60" height="90" rx="4" fill="#021117" />
      <circle cx="268" cy="360" r="5" fill="#f97316" />
      <rect x="165" y="260" width="50" height="40" rx="4" fill="#dbeff5" stroke="#9fcfdd" strokeWidth="2" />
      <rect x="285" y="260" width="50" height="40" rx="4" fill="#dbeff5" stroke="#9fcfdd" strokeWidth="2" />
      <line x1="190" y1="260" x2="190" y2="300" stroke="#9fcfdd" strokeWidth="1.5" />
      <line x1="165" y1="280" x2="215" y2="280" stroke="#9fcfdd" strokeWidth="1.5" />
      <line x1="310" y1="260" x2="310" y2="300" stroke="#9fcfdd" strokeWidth="1.5" />
      <line x1="285" y1="280" x2="335" y2="280" stroke="#9fcfdd" strokeWidth="1.5" />

      {/* Worker */}
      <g transform="translate(385, 255)">
        <rect x="-15" y="20" width="30" height="50" rx="6" fill="#f97316" />
        <rect x="-35" y="25" width="22" height="12" rx="6" fill="#f97316" transform="rotate(-30 -35 25)" />
        <rect x="13" y="25" width="35" height="12" rx="6" fill="#f97316" transform="rotate(20 13 25)" />
        <circle cx="-52" cy="12" r="6" fill="#d4a574" />
        <circle cx="52" cy="20" r="6" fill="#d4a574" />
        <rect x="46" y="-5" width="4" height="30" rx="2" fill="#78716c" transform="rotate(20 48 10)" />
        <rect x="40" y="-12" width="16" height="10" rx="2" fill="#44403c" transform="rotate(20 48 -7)" />
        <rect x="-12" y="70" width="10" height="40" rx="4" fill="#021117" />
        <rect x="2" y="70" width="10" height="40" rx="4" fill="#021117" />
        <rect x="-14" y="105" width="14" height="8" rx="3" fill="#78350f" />
        <rect x="0" y="105" width="14" height="8" rx="3" fill="#78350f" />
        <circle cx="0" cy="8" r="16" fill="#d4a574" />
        <ellipse cx="0" cy="-2" rx="20" ry="8" fill="#f59e0b" />
        <rect x="-22" y="-4" width="44" height="6" rx="3" fill="#f59e0b" />
        <circle cx="-5" cy="6" r="2" fill="#021117" />
        <circle cx="5" cy="6" r="2" fill="#021117" />
        <path d="M-4 14 Q0 18 4 14" stroke="#021117" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Floating decorative elements */}
      <g opacity="0.9">
        <circle cx="105" cy="165" r="10" fill="#fbbf24" opacity="0.5" />
        <g transform="translate(425, 175) rotate(30)">
          <rect x="-2" y="-15" width="4" height="25" rx="2" fill="#94a3b8" opacity="0.5" />
          <circle cx="0" cy="-18" r="6" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.5" />
        </g>
        <polygon points="95,365 98,374 108,374 100,380 103,389 95,384 87,389 90,380 82,374 92,374" fill="#f97316" opacity="0.35" />
        <circle cx="435" cy="355" r="14" stroke="#f97316" strokeWidth="2.5" fill="none" opacity="0.25" />
      </g>
    </svg>
  );
}

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Lijevo: sadržaj */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              <span className="text-ink/80 text-sm font-medium">Više od 2,800+ verificiranih firmi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-ink mb-6 leading-[1.08] tracking-tight">
              Pronađite majstora
              <br />
              <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                za vaš projekat
              </span>
            </h1>

            <p className="text-lg md:text-xl text-steel mb-10 leading-relaxed">
              Besplatno objavite svoj projekat i primite ponude od provjerenih građevinskih firmi i zanatlija širom Bosne i Hercegovine.
            </p>

            <div className="bg-white rounded-2xl shadow-float border border-gray-100 p-3 mb-8">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <input
                    type="text"
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
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steel pointer-events-none" />
                </div>
                <Link
                  href="/objavi-projekat/"
                  className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold text-sm whitespace-nowrap hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  Objavi besplatno
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-steel">
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

          {/* Desno: ilustracija + plivajuće trust kartice */}
          <div className="hidden lg:block relative">
            <div className="relative w-[460px] h-[460px] mx-auto">
              <WorkerIllustration />

              {/* Kartica: ocjena */}
              <div className="absolute -top-2 right-2 bg-white rounded-2xl shadow-float border border-gray-100 px-5 py-4 flex items-center gap-3 animate-float">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-md shadow-brand-orange/25">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-ink leading-none">4.8</div>
                  <div className="text-xs text-steel mt-1 font-medium">Prosječna ocjena</div>
                </div>
              </div>

              {/* Kartica: projekat/ponude */}
              <div className="absolute -left-8 top-1/3 bg-white rounded-2xl shadow-float border border-gray-100 px-5 py-4 animate-float" style={{ animationDelay: '1.2s' }}>
                <div className="text-xs text-steel mb-1">Adaptacija kupatila</div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-ink">8 ponuda</span>
                  <span className="text-xs font-semibold text-brand-orange">2,000 – 3,500 KM</span>
                </div>
              </div>

              {/* Kartica: verifikacija */}
              <div className="absolute -bottom-4 left-10 bg-white rounded-2xl shadow-float border border-gray-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '2.4s' }}>
                <VerifiedBadge size="sm" />
                <span className="text-xs text-steel font-medium">identitet i poslovanje<br />provjereni</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
