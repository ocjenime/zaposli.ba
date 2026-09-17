import Link from 'next/link';
import { useId } from 'react';
import { ArrowRight, Building2, CheckCircle, Sparkles, Wrench } from 'lucide-react';

export default function CTASection() {
  const patternId = `ctaGrid-${useId().replace(/:/g, '')}`;
  return (
    <section className="py-6 md:py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-ink-600/30 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="text-[#ffffff]">
            <span className="inline-flex items-center gap-1.5 bg-[#ffffff]/10 backdrop-blur-sm border border-[#ffffff]/20 rounded-full px-3 py-1 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-xs font-medium text-[#ffffff]/90">Započnite danas</span>
            </span>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-2.5 leading-tight tracking-tight">
              Tražite majstora?
            </h2>
            <p className="text-sm md:text-base text-[#ffffff]/60 mb-5 leading-relaxed">
              Objavite svoj posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.
            </p>

            <ul className="space-y-2.5 mb-6 text-sm md:text-base">
              {['Potpuno besplatno', 'Više ponuda za usporedbu', 'Ocjene i recenzije drugih klijenata'].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span className="text-[#ffffff]/80">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all duration-200 active:scale-95"
            >
              Objavi posao besplatno
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 md:p-6 shadow-2xl dark:shadow-[0_0_40px_rgba(249,115,22,0.12)] relative overflow-hidden border border-gray-100 dark:border-[#ffffff]/10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-brand-amber to-brand-orange" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Wrench className="w-5 h-5 text-[#ffffff]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Za firme i majstore</h3>
                <p className="text-xs text-gray-500">Pridružite se našoj platformi</p>
              </div>
            </div>

            <ul className="space-y-2.5 mb-5 text-sm">
              {['Novi poslovi svaki dan', 'Izgradite reputaciju kroz recenzije', 'Besplatna registracija'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/registracija/"
              className="block w-full text-center bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all duration-200 active:scale-95"
            >
              Registrujte firmu besplatno
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}