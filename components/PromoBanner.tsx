'use client';

import Link from 'next/link';
import NextImage from 'next/image';

export default function PromoBanner() {
  return (
    <section className="relative py-5 md:py-6 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/firma-profil/arilux-doo/"
          aria-label="Arilux d.o.o. - pogledaj profil firme"
          className="group relative block w-full rounded-3xl overflow-hidden shadow-2xl shadow-[#000000]/15 border border-gray-100 bg-ink-950"
        >
          {/* Mobitel: portret verzija, puna širina */}
          <div className="relative aspect-[2/3] md:hidden">
            <NextImage
              src="/images/arilux-reklama.jpg"
              alt="Arilux - luksuzno uređenje dvorišta i eksterijera, građevinska limarija. Telefon 061 770 707"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {/* Desktop: landscape verzija, visina kao stari okvir, cijela slika vidljiva */}
          <div className="relative hidden md:block h-[380px] lg:h-[440px]">
            <NextImage
              src="/images/arilux-reklama-wide.jpg"
              alt="Arilux - luksuzno uređenje dvorišta i eksterijera, građevinska limarija. Telefon 061 770 707"
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/20">
            Sponzorirano
          </span>
        </a>
      </div>
    </section>
  );
}
