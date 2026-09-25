'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Briefcase, ArrowRight } from 'lucide-react';

const cards = [
  {
    href: '/objavi-projekat/',
    icon: Home,
    image: '/images/trazim-majstora-card.jpg',
    imageAlt: 'Adaptacija enterijera stana',
    title: 'Tražim majstora',
    description: 'Opiši šta ti treba i primi ponude od provjerenih majstora.',
    cta: 'Objavi posao',
    theme: 'orange',
  },
  {
    href: '/za-firme/',
    icon: Briefcase,
    image: '/images/za-firme-card.jpg',
    imageAlt: 'Vlasnik firme na gradilištu',
    imagePosition: 'object-[72%_center]',
    title: 'Za profesionalce',
    description: 'Firme, majstori i stručnjaci na jednom mjestu.',
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
              className="group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-5 rounded-xl md:rounded-2xl bg-ink-900 border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 px-2.5 pt-2.5 pb-2 md:px-6 md:pt-6 md:pb-4 overflow-hidden"
            >
              {/* Photo background */}
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                className={`object-cover ${'imagePosition' in card && card.imagePosition ? card.imagePosition : 'object-center'} transition-transform duration-700 group-hover:scale-105`}
                sizes="(max-width: 768px) 50vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/50 to-ink-950/10" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Mobile: icon + arrow in one row to save vertical space */}
              <div className="relative z-10 flex md:hidden items-center justify-between w-full">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center">
                  <card.icon
                    className={`w-4 h-4 ${card.theme === 'orange' ? 'text-brand-orange' : 'text-blue-400'}`}
                  />
                </div>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    card.theme === 'orange'
                      ? 'bg-brand-orange text-white group-hover:bg-brand-orange-dark'
                      : 'bg-ink-950/60 backdrop-blur-md border border-white/15 text-white group-hover:bg-brand-orange group-hover:border-brand-orange'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Desktop: original icon */}
              <div className="relative z-10 hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 items-center justify-center">
                <card.icon
                  className={`w-8 h-8 ${card.theme === 'orange' ? 'text-brand-orange' : 'text-blue-400'}`}
                />
              </div>

              <div className="relative z-10 flex-1 min-w-0">
                <h3 className="text-sm md:text-xl font-bold text-white">{card.title}</h3>
                <p className="hidden md:block text-sm text-white/60">{card.description}</p>
                <p className="md:hidden text-[10px] leading-snug text-white/60">{card.description}</p>
              </div>

              {/* Desktop arrow */}
              <span
                className={`relative z-10 hidden md:flex shrink-0 w-10 h-10 rounded-full items-center justify-center transition-colors ${
                  card.theme === 'orange'
                    ? 'bg-brand-orange text-white group-hover:bg-brand-orange-dark'
                    : 'bg-ink-950/60 backdrop-blur-md border border-white/15 text-white group-hover:bg-brand-orange group-hover:border-brand-orange'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
