'use client';

import { useState, useEffect } from 'react';
import { Crown, ArrowRight, Siren, X, CheckCircle2, Zap, MapPin, Users, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TRUST_BADGES = [
  { icon: CheckCircle2, label: 'Provjerene firme' },
  { icon: Zap, label: 'Brzo i jednostavno' },
  { icon: MapPin, label: 'Cijela BiH' },
];

export default function HeroSection() {
  const [emergencyBannerVisible, setEmergencyBannerVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('emergencyBannerDismissed') === 'true') {
        setEmergencyBannerVisible(false);
      } else {
        setEmergencyBannerVisible(true);
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

  return (
    <section className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex flex-col overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/92 via-ink-950/60 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-ink-950/40" />
      </div>

      {/* Emergency banner */}
      <div
        className={`relative z-30 mt-14 md:mt-16 bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg shadow-red-900/20 transition-all duration-300 ${
          emergencyBannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between gap-3">
          <Link
            href="/kategorije/hitne-intervencije/"
            className="flex items-center gap-2 text-[11px] sm:text-xs font-medium hover:opacity-90 transition-opacity min-w-0"
          >
            <span className="inline-flex items-center gap-1 bg-white text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              <Siren className="w-2 h-2" />
              24/7
            </span>
            <span className="truncate">Hitne intervencije - majstori dostupni odmah</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
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
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-xs sm:text-sm font-bold text-brand-orange uppercase tracking-wider mb-4 sm:mb-5 animate-fade-in">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                Tvoj projekt. Pravi majstori.
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 sm:mb-5 animate-fade-in">
                Vaš posao.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  Pravi majstor.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-lg text-white/80 leading-relaxed mb-5 sm:mb-6 max-w-xl animate-fade-in">
                Besplatno objavite oglas i primite ponude od provjerenih majstora i firmi širom BiH.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-8 animate-fade-in">
                <Link
                  href="/objavi-projekat/"
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-95 shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40"
                >
                  Objavi posao besplatno
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  href="/top-firme/"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-95"
                >
                  Pronađi majstora
                </Link>
              </div>

              {/* Trust badges */}
              <div className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6 animate-fade-in">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                      <badge.icon className="w-4 h-4 text-brand-orange" />
                    </span>
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right social proof card */}
            <div className="hidden lg:flex justify-end animate-fade-in">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl shadow-black/30 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {['bg-brand-orange', 'bg-amber-500', 'bg-blue-500'].map((color, i) => (
                      <div
                        key={i}
                        className={`w-9 h-9 rounded-full ${color} border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold`}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">Već 10.000+ korisnika</p>
                    <p className="text-white/60 text-xs">na Zaposli.ba</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-white/80 text-sm font-semibold">4.8 / 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-side decorative text */}
      <div className="hidden xl:block absolute top-1/2 right-8 -translate-y-1/2 z-20 max-w-[180px]">
        <p className="text-white/80 text-xl font-medium leading-snug italic">
          “Kvalitetni ljudi grade bolje sutra.”
        </p>
        <div className="mt-2 h-0.5 w-16 bg-brand-orange rounded-full" />
      </div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cloud to-transparent z-10" />
    </section>
  );
}
