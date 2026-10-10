'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Maximize2, X } from 'lucide-react';

export default function PromoBanner() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <section className="relative py-5 md:py-6 bg-cloud px-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/firma-profil/arilux-doo/"
          aria-label="Arilux d.o.o. - pogledaj profil firme"
          className="group relative block w-full sm:rounded-3xl overflow-hidden sm:shadow-2xl sm:shadow-[#000000]/15 sm:border sm:border-gray-100 bg-ink-950"
        >
          {/* Mobitel: landscape verzija, od ivice do ivice */}
          <div className="relative aspect-[3/2] md:hidden">
            <NextImage
              src="/images/arilux-reklama-wide.jpg"
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFullscreen(true);
            }}
            aria-label="Uvećaj reklamu"
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Fullscreen pregled */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Uvećana reklama"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Zatvori"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-3xl aspect-[3/2]">
            <NextImage
              src="/images/arilux-reklama-wide.jpg"
              alt="Arilux - luksuzno uređenje dvorišta i eksterijera, građevinska limarija. Telefon 061 770 707"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
