import Link from 'next/link';
import { Siren, ArrowRight, ChevronRight, Zap, BellRing, Clock } from 'lucide-react';
import { categories } from '@/lib/data';

export default function EmergencySection() {
  const cat = categories.find((c) => c.slug === 'hitne-intervencije');
  if (!cat) return null;

  const steps = [
    { icon: Zap, title: 'Opišite kvar', text: '30 sekundi: šta se desilo i gdje se nalazite.' },
    { icon: BellRing, title: 'Prioritetna notifikacija', text: 'Firme za hitne intervencije javljaju se odmah.' },
    { icon: Clock, title: 'Majstor dolazi', text: 'Prve ponude u roku od sat vremena, često dolazak isti dan.' },
  ];

  return (
    <section className="relative bg-ink overflow-hidden">
      {/* Diskretan crveni sjaj */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Šta je + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 rounded-full px-3.5 py-1.5 mb-4">
              <Siren className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Hitne intervencije 24/7</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2.5 tracking-tight">
              Kvar ne čeka. Majstor dolazi odmah.
            </h2>
            <p className="text-white/55 text-sm md:text-base mb-4 max-w-xl leading-relaxed">
              Pukla cijev, zaključana vrata ili kvar grijanja u nedjelju navečer.
              Objavite hitan posao i firme iz vašeg grada se javljaju u roku od sat vremena.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cat.services.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white/70">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-red-600/25 transition-all active:scale-95"
            >
              Objavi hitan posao
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/kategorije/${cat.slug}/`}
              className="inline-flex items-center justify-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors px-6 py-2"
            >
              Kako funkcioniše
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Kako funkcioniše: jedan red */}
        <div className="mt-7 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:gap-2">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-3 sm:flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600/15 border border-red-500/25 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-red-400" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-bold">
                  <span className="text-red-400 mr-1.5">{i + 1}.</span>{step.title}
                </div>
                <div className="text-white/45 text-xs mt-0.5 leading-relaxed">{step.text}</div>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden sm:block w-4 h-4 text-white/15 shrink-0 self-center mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
