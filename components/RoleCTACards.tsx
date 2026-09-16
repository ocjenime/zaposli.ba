'use client';

import Link from 'next/link';
import { Home, Briefcase, ArrowRight } from 'lucide-react';

const cards = [
  {
    href: '/objavi-projekat/',
    icon: Home,
    title: 'Tražim majstora',
    description: 'Opiši šta ti treba i primi ponude od provjerenih majstora.',
    cta: 'Objavi posao',
    theme: 'orange',
  },
  {
    href: '/za-firme/',
    icon: Briefcase,
    title: 'Za firme',
    description: 'Reklamirajte svoju firmu, tražite radnike i ostvarite veću vidljivost.',
    cta: 'Saznaj više',
    theme: 'blue',
  },
];

export default function RoleCTACards() {
  return (
    <section className="relative py-2 md:py-4 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-2.5 md:gap-5">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex items-center gap-2.5 md:gap-4 rounded-xl md:rounded-2xl bg-ink-900/60 backdrop-blur-sm border border-ink-800 hover:border-brand-orange/40 hover:-translate-y-0.5 transition-all duration-300 p-2.5 md:p-4 overflow-hidden"
            >
              <div
                className={`shrink-0 w-9 h-9 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center transition-colors ${
                  card.theme === 'orange'
                    ? 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                    : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
                }`}
              >
                <card.icon className="w-4 h-4 md:w-7 md:h-7" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-lg font-bold text-white leading-tight">{card.title}</h3>
                <p className="text-[9px] md:text-sm text-white/60 leading-tight md:leading-snug line-clamp-1 md:line-clamp-2">
                  {card.description}
                </p>
              </div>

              <span className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-ink-800 text-white/60 group-hover:bg-brand-orange group-hover:text-white transition-colors flex items-center justify-center">
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
