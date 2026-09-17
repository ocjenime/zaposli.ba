'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Briefcase, ArrowRight } from 'lucide-react';

const cards = [
  {
    href: '/objavi-projekat/',
    icon: Home,
    image: '/images/renovacija-enterijer.webp',
    imageAlt: 'Adaptacija enterijera stana',
    title: 'Tražim majstora',
    description: 'Opiši šta ti treba i primi ponude od provjerenih majstora.',
    iconColor: 'text-brand-orange',
  },
  {
    href: '/za-firme/',
    icon: Briefcase,
    image: '/images/majstor-hero.webp',
    imageAlt: 'Majstor na terenu',
    title: 'Za firme',
    description: 'Reklamirajte svoju firmu, tražite radnike i ostvarite veću vidljivost.',
    iconColor: 'text-blue-400',
  },
];

export default function RoleCTACards() {
  return (
    <section className="relative py-2.5 md:py-6 pb-0 md:pb-6 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-2.5 md:gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col justify-between min-h-[200px] sm:min-h-[220px] md:min-h-[260px] rounded-xl md:rounded-2xl overflow-hidden border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 p-3 md:p-6"
            >
              {/* Photo background */}
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/10" />

              {/* Top row */}
              <div className="relative z-10 flex items-start justify-between w-full">
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0">
                  <card.icon className={`w-5 h-5 md:w-6 md:h-6 ${card.iconColor}`} />
                </span>
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </span>
              </div>

              {/* Text */}
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white leading-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm leading-snug text-white/75">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
