'use client';

import Image from 'next/image';

export default function AdminDashboardWelcome() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink-900 text-white shadow-lg">
      <div className="absolute inset-0">
        <Image
          src="/images/majstor-hero.webp"
          alt="Majstor na poslu"
          fill
          className="object-cover object-[60%_center] opacity-60"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
      </div>

      <div className="relative z-10 p-5 sm:p-6 min-h-[200px] flex flex-col justify-end">
        <p className="text-sm text-white/70 mb-1">Dobro došli,</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">Administrator</h1>
        <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed drop-shadow">
          Pregled platforme, korisnika, verifikacija i prihoda - sve na jednom mjestu.
        </p>
      </div>
    </section>
  );
}