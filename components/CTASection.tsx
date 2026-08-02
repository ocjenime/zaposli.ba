import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle, Sparkles, Wrench } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-8 md:py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#ctaGrid)" />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-ink-600/30 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-[#ffffff]">
            <span className="inline-flex items-center gap-2 bg-[#ffffff]/10 backdrop-blur-sm border border-[#ffffff]/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-[#ffffff]/90">Započnite danas</span>
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              Tražite majstora?
            </h2>
            <p className="text-lg text-[#ffffff]/60 mb-8 leading-relaxed">
              Objavite svoj posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.
            </p>

            <ul className="space-y-4 mb-10">
              {['Potpuno besplatno', 'Više ponuda za usporedbu', 'Ocjene i recenzije drugih klijenata'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span className="text-[#ffffff]/80">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all duration-200 active:scale-95"
            >
              Objavi posao besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-ink-800 rounded-3xl p-8 shadow-2xl dark:shadow-[0_0_40px_rgba(249,115,22,0.12)] relative overflow-hidden border border-gray-100 dark:border-[#ffffff]/10">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-amber to-brand-orange" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="w-7 h-7 text-[#ffffff]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Za firme i majstore</h3>
                <p className="text-sm text-gray-500">Pridružite se našoj platformi</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {['Novi poslovi svaki dan', 'Izgradite reputaciju kroz recenzije', 'Besplatna registracija'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/registracija/"
              className="block w-full text-center bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all duration-200 active:scale-95"
            >
              Registrujte firmu besplatno
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}