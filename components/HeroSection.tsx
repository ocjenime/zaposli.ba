'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const cities = [
  'Sarajevo', 'Banja Luka', 'Tuzla', 'Mostar', 'Zenica',
  'Bihać', 'Brčko', 'Doboj', 'Bijeljina', 'Travnik'
];

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

      <div className="absolute top-16 left-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-orange/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-ink-600/20 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Više od 2,800+ verificiranih firmi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
              Pronađite majstora
              <br />
              <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                za vaš projekat
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
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
                  <item.icon className="w-4 h-4 text-brand-orange" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right photo */}
          <div className="hidden lg:block relative">
            {/* Orange accent corner */}
            <div className="absolute -top-5 -right-5 w-28 h-28 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-3xl" />
            <div className="absolute -bottom-5 -right-5 w-28 h-28 border-2 border-brand-orange/30 rounded-3xl" />

            <div className="relative rounded-3xl overflow-hidden shadow-float ring-1 ring-white/10">
              <Image
                src="/zaposli.ba/images/majstor-hero.jpg"
                alt="Majstor na poslu"
                width={1600}
                height={1067}
                priority
                className="object-cover w-full h-[520px] -scale-x-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            </div>

            {/* Floating rating card */}
            <div className="absolute -bottom-7 -left-7 bg-white rounded-2xl shadow-float px-5 py-4 flex items-center gap-3.5 animate-float">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-md shadow-brand-orange/25">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink leading-none">4.8</div>
                <div className="text-xs text-steel mt-1 font-medium">Prosječna ocjena</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}