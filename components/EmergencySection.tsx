import Link from 'next/link';
import { Siren, ArrowRight, Zap, BellRing, Clock } from 'lucide-react';
import { categories } from '@/lib/data';

export default function EmergencySection() {
  const cat = categories.find((c) => c.slug === 'hitne-intervencije');
  if (!cat) return null;

  const steps = [
    { icon: Zap, title: 'Opišite kvar', text: '30 sekundi — šta se desilo i gdje se nalazite.' },
    { icon: BellRing, title: 'Prioritetna notifikacija', text: 'Firme za hitne intervencije u vašem gradu se javljaju odmah.' },
    { icon: Clock, title: 'Majstor dolazi', text: 'Prve ponude u roku od sat vremena — često dolazak isti dan.' },
  ];

  return (
    <section className="relative py-14 md:py-20 bg-ink overflow-hidden">
      {/* Crveni sjaj — urgency */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Lijevo: sadržaj */}
          <div>
            <span className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
              <Siren className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Hitne intervencije — 24/7</span>
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
              Kvar ne čeka.
              <br />
              <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                Majstor dolazi odmah.
              </span>
            </h2>

            <p className="text-lg text-white/60 mb-7 leading-relaxed max-w-xl">
              Pukla cijev, zaključana vrata ili kvar grijanja u nedjelju navečer — objavite hitan projekat
              i firme iz vašeg grada se javljaju u roku od sat vremena.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {cat.services.map((s) => (
                <span key={s} className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/objavi-projekat/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-red-600/25 transition-all active:scale-95"
              >
                Objavi hitan projekat
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/kategorije/${cat.slug}/`}
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Sve hitne usluge
              </Link>
            </div>
          </div>

          {/* Desno: koraci */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/25">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-white font-bold">{step.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
