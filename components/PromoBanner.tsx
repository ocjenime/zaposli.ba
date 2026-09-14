'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import NextImage from 'next/image';
import Logo from '@/components/Logo';

const benefits = [
  'Veća vidljivost',
  'Više upita',
  'Gradite svoj brend',
];

export default function PromoBanner() {
  return (
    <section className="relative py-8 md:py-10 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl rounded-3xl overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <NextImage
            src="/images/kontakt-hero.png"
            alt="Reklamirajte svoju firmu na Zaposli.ba"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-ink-950/60" />
          <div className="absolute inset-0 bg-ink-950/40" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-8 items-center p-6 md:p-10 lg:p-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Ovo može biti{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                vaša reklama.
              </span>
            </h2>
            <p className="text-white/70 mb-6 max-w-md">
              Dosegnite hiljade klijenata na Zaposli.ba. Istaknite svoju firmu, privucite nove kupce i budite prvi izbor za projekte u vašem gradu.
            </p>
            <Link
              href="/za-firme/"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40"
            >
              Saznaj više
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 max-w-sm">
              <div className="mb-4">
                <Logo variant="light" className="h-8" />
              </div>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white/90">
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
    </section>
  );
}
