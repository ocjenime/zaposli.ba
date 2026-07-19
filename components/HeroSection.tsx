'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const cities = [
  'Sarajevo', 'Banja Luka', 'Tuzla', 'Mostar', 'Zenica',
  'Bihać', 'Brčko', 'Doboj', 'Bijeljina', 'Travnik'
];

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="absolute inset-0 opacity-[0.07]">
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-brand-emerald rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Više od 2,800+ verificiranih firmi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Pronađite majstora
            <br />
            <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-red bg-clip-text text-transparent">
              za vaš projekat
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed">
            Besplatno objavite svoj projekat i primite ponude od provjerenih građevinskih firmi i zanatlija širom Bosne i Hercegovine.
          </p>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-float p-3 md:p-4 mb-10">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Šta vam je potrebno? (npr. adaptacija kupatila)"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-brand-orange/30 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                />
              </div>
              <div className="relative md:w-48">
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

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
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
      </div>
    </section>
  );
}