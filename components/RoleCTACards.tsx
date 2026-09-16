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
    <section className="relative py-2.5 md:py-6 pb-0 md:pb-6 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 md:gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-5 rounded-xl md:rounded-2xl bg-ink-900/60 backdrop-blur-sm border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 p-2.5 md:p-6 overflow-hidden"
            >
              {/* Mobile: icon + arrow in one row to save vertical space */}
              <div className="flex md:hidden items-center justify-between w-full">
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    card.theme === 'orange'
                      ? 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                      : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
                  }`}
                >
                  <card.icon className="w-4 h-4" />
                </div>
                <span className="shrink-0 w-6 h-6 rounded-full bg-ink-800 text-white/60 group-hover:bg-brand-orange group-hover:text-white transition-colors flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Desktop: original icon */}
              <div
                className={`hidden md:flex shrink-0 w-16 h-16 rounded-2xl items-center justify-center transition-colors ${
                  card.theme === 'orange'
                    ? 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                    : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
                }`}
              >
                <card.icon className="w-8 h-8" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-xl font-bold text-white">{card.title}</h3>
                <p className="hidden md:block text-sm text-white/60">{card.description}</p>
                <p className="md:hidden text-[10px] leading-snug text-white/60">{card.description}</p>
              </div>

              {/* Desktop arrow */}
              <span className="hidden md:flex shrink-0 w-10 h-10 rounded-full bg-ink-800 text-white/60 group-hover:bg-brand-orange group-hover:text-white transition-colors items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
