'use client';

import NextImage from 'next/image';

export default function PromoBanner() {
  return (
    <section className="relative py-5 md:py-6 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="https://www.arilux.ba"
          target="_blank"
          rel="sponsored noopener noreferrer"
          aria-label="Arilux - luksuzno uređenje dvorišta i eksterijera, građevinska limarija"
          className="group relative block w-full sm:max-w-md lg:max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[#000000]/15 border border-gray-100"
        >
          <div className="relative aspect-[2/3] bg-ink-950">
            <NextImage
              src="/images/arilux-reklama.jpg"
              alt="Arilux - luksuzno uređenje dvorišta i eksterijera, građevinska limarija. Telefon 061 770 707"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width: 640px) 100vw, 512px"
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
