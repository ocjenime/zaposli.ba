'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Megaphone } from 'lucide-react';
import NextImage from 'next/image';
import Logo from '@/components/Logo';

const benefits = [
  'Veća vidljivost',
  'Više upita',
  'Gradite svoj brend',
];

export default function PromoBanner() {
  return (
    <section className="relative py-6 lg:py-10 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl rounded-2xl lg:rounded-3xl overflow-hidden">
        {/* Desktop / tablet full banner */}
        <div className="hidden lg:block relative shadow-2xl shadow-black/10">
          {/* Background image */}
          <div className="absolute inset-0">
            <NextImage
              src="/images/kontakt-hero.png"
              alt="Reklamirajte svoju firmu na Zaposli.ba"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                Ovo može biti{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  vaša reklama.
                </span>
              </h2>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                Dosegnite hiljade klijenata na Zaposli.ba. Istaknite svoju firmu, privucite nove kupce i budite prvi izbor za projekte u vašem gradu.
              </p>
              <Link
                href="/za-firme/#reklame"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40"
              >
                Saznaj više
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col items-start lg:items-end">
              <div className="bg-ink-900/80 dark:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 w-full max-w-sm">
                <div className="mb-5">
                  <Logo variant="light" className="h-8" />
                </div>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-white/90 text-sm md:text-base">
                      <span className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile compact horizontal banner */}
        <div className="block lg:hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.15),_transparent_50%)]" />

          <div className="relative flex items-center gap-4 p-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-orange/15 border border-brand-orange/25 flex items-center justify-center backdrop-blur-sm">
              <Megaphone className="w-6 h-6 text-brand-orange" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white leading-tight truncate">
                Ovo može biti <span className="text-brand-orange">vaša reklama</span>
              </h2>
              <p className="text-xs text-white/60 truncate">
                Reklamirajte firmu ili tražite radnike.
              </p>
            </div>

            <Link
              href="/za-firme/#reklame"
              className="shrink-0 inline-flex items-center gap-1 bg-brand-orange hover:bg-brand-orange-dark text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-brand-orange/25"
            >
              Saznaj više
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
