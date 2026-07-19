'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const cities = [
  'Sarajevo', 'Banja Luka', 'Tuzla', 'Mostar', 'Zenica',
  'Bihać', 'Brčko', 'Doboj', 'Bijeljina', 'Travnik'
];

function WorkerIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background circle */}
      <circle cx="250" cy="250" r="220" fill="url(#heroBg)" opacity="0.15" />
      <circle cx="250" cy="250" r="180" fill="url(#heroBg2)" opacity="0.1" />

      {/* House structure */}
      <rect x="140" y="220" width="220" height="180" rx="4" fill="#f0f4f8" stroke="#cbd5e1" strokeWidth="2" />
      <polygon points="130,220 250,130 370,220" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
      <rect x="220" y="310" width="60" height="90" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="268" cy="360" r="5" fill="#f59e0b" />
      <rect x="165" y="260" width="50" height="40" rx="3" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1.5" />
      <rect x="285" y="260" width="50" height="40" rx="3" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1.5" />
      <line x1="190" y1="260" x2="190" y2="300" stroke="#60a5fa" strokeWidth="1" />
      <line x1="165" y1="280" x2="215" y2="280" stroke="#60a5fa" strokeWidth="1" />
      <line x1="310" y1="260" x2="310" y2="300" stroke="#60a5fa" strokeWidth="1" />
      <line x1="285" y1="280" x2="335" y2="280" stroke="#60a5fa" strokeWidth="1" />

      {/* Worker */}
      <g transform="translate(380, 250)">
        {/* Body */}
        <rect x="-15" y="20" width="30" height="50" rx="5" fill="#f97316" />
        {/* Arms */}
        <rect x="-35" y="25" width="22" height="12" rx="6" fill="#f97316" transform="rotate(-30 -35 25)" />
        <rect x="13" y="25" width="35" height="12" rx="6" fill="#f97316" transform="rotate(20 13 25)" />
        {/* Hands */}
        <circle cx="-52" cy="12" r="6" fill="#d4a574" />
        <circle cx="52" cy="20" r="6" fill="#d4a574" />
        {/* Tool - Hammer */}
        <rect x="46" y="-5" width="4" height="30" rx="2" fill="#78716c" transform="rotate(20 48 10)" />
        <rect x="40" y="-12" width="16" height="10" rx="2" fill="#44403c" transform="rotate(20 48 -7)" />
        {/* Legs */}
        <rect x="-12" y="70" width="10" height="40" rx="4" fill="#1e293b" />
        <rect x="2" y="70" width="10" height="40" rx="4" fill="#1e293b" />
        {/* Boots */}
        <rect x="-14" y="105" width="14" height="8" rx="3" fill="#78350f" />
        <rect x="0" y="105" width="14" height="8" rx="3" fill="#78350f" />
        {/* Head */}
        <circle cx="0" cy="8" r="16" fill="#d4a574" />
        {/* Hard hat */}
        <ellipse cx="0" cy="-2" rx="20" ry="8" fill="#f59e0b" />
        <rect x="-22" y="-4" width="44" height="6" rx="3" fill="#f59e0b" />
        {/* Face */}
        <circle cx="-5" cy="6" r="2" fill="#1e293b" />
        <circle cx="5" cy="6" r="2" fill="#1e293b" />
        <path d="M-4 14 Q0 18 4 14" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Floating elements */}
      <g opacity="0.8">
        {/* Hard hat icon */}
        <circle cx="100" cy="160" r="12" fill="#f59e0b" opacity="0.3" />
        <rect x="88" y="156" width="24" height="4" rx="2" fill="#f59e0b" opacity="0.3" />

        {/* Wrench */}
        <g transform="translate(430, 170) rotate(30)">
          <rect x="-2" y="-15" width="4" height="25" rx="2" fill="#94a3b8" opacity="0.3" />
          <circle cx="0" cy="-18" r="6" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.3" />
        </g>

        {/* Star */}
        <polygon points="90,370 93,380 104,380 95,387 98,397 90,391 82,397 85,387 76,380 87,380" fill="#fbbf24" opacity="0.2" />

        {/* Gear */}
        <circle cx="440" cy="360" r="15" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.15" />
        <circle cx="440" cy="360" r="8" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.15" />
      </g>

      <defs>
        <linearGradient id="heroBg" x1="30" y1="30" x2="470" y2="470">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="heroBg2" x1="70" y1="70" x2="430" y2="430">
          <stop offset="0%" stopColor="#0070f3" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="absolute inset-0 opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-16 left-0 w-[500px] h-[500px] bg-brand-orange/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-400/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-brand-emerald/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-brand-emerald rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Više od 2,800+ verificiranih firmi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
              Pronađite majstora
              <br />
              <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-red bg-clip-text text-transparent">
                za vaš projekat
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/70 mb-10 leading-relaxed">
              Besplatno objavite svoj projekat i primite ponude od provjerenih građevinskih firmi i zanatlija širom Bosne i Hercegovine.
            </p>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-float p-3 mb-10">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Šta vam je potrebno?"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                  />
                </div>
                <div className="relative md:w-44">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-8 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-gray-900 appearance-none text-sm"
                  >
                    <option value="">Svi gradovi</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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

            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              {[
                { icon: CheckCircle, text: 'Besplatno za kupce' },
                { icon: Shield, text: 'Verificirane firme' },
                { icon: Star, text: 'Ocjene i recenzije' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-brand-emerald" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-[420px] h-[420px] animate-float">
              <WorkerIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}