'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NextImage from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';

export default function PromoBanner() {
  const { role } = useAuth();
  const href = isFirmRole(role) ? '/kupi-oglas/' : '/pretplata-auth/';

  return (
    <section className="relative py-5 md:py-6 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl rounded-3xl overflow-hidden shadow-2xl shadow-[#000000]/10">
        {/* Background image */}
        <div className="absolute inset-0">
          <NextImage
            src="/images/kontakt-hero.png"
            alt="Reklamirajte svoju firmu na Zaposli.ba"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/85 via-[#000000]/60 to-[#000000]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-transparent to-[#000000]/30" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-6 md:p-10 lg:p-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
              Ovo može biti{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                vaša reklama.
              </span>
            </h2>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              Dosegnite hiljade klijenata na Zaposli.ba. Istaknite svoju firmu, privucite nove kupce i budite prvi izbor za projekte u vašem gradu.
            </p>
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40"
            >
              Kreiraj oglas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <a
              href="https://www.arilux.ba"
              target="_blank"
              rel="sponsored noopener noreferrer"
              aria-label="Arilux - luksuzno uređenje dvorišta i limarija"
              className="group relative block w-full max-w-sm rounded-2xl overflow-hidden border border-[#ffffff]/15 shadow-2xl shadow-black/40"
            >
              <div className="relative aspect-[2/3] bg-ink-950">
                <NextImage
                  src="/images/arilux-reklama.jpg"
                  alt="Arilux - luksuzno uređenje dvorišta i eksterijera, građevinska limarija. Telefon 061 770 707"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/20">
                Sponzorirano
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
