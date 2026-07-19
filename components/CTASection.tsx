import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle, Sparkles, Wrench } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#ctaGrid)" />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-brand-amber" />
              <span className="text-sm font-medium text-white/90">Započnite danas</span>
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              Tražite majstora?
            </h2>
            <p className="text-lg text-blue-100/80 mb-8 leading-relaxed">
              Objavite svoj projekat besplatno i primite ponude od provjerenih firmi u roku od 24 sata.
            </p>

            <ul className="space-y-4 mb-10">
              {['Potpuno besplatno', 'Više ponuda za usporedbu', 'Ocjene i recenzije drugih kupaca'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-emerald flex-shrink-0" />
                  <span className="text-blue-50">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Objavi projekat besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-amber to-brand-orange" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Za firme i majstore</h3>
                <p className="text-sm text-gray-500">Pridružite se našoj platformi</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {['Pristup hiljadama projekata', 'Izgradite reputaciju kroz recenzije', 'Besplatna registracija'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/registracija/"
              className="block w-full text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 active:scale-95"
            >
              Registrujte firmu besplatno
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}