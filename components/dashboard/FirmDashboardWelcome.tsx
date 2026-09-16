'use client';

import Image from 'next/image';

interface FirmDashboardWelcomeProps {
  firmName?: string | null;
}

export default function FirmDashboardWelcome({ firmName }: FirmDashboardWelcomeProps) {
  const name = firmName || 'Firma';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink-900 text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/majstor-hero.webp"
          alt="Majstor na poslu"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 p-5 sm:p-6 min-h-[200px] flex flex-col justify-end">
        <p className="text-sm text-white/70 mb-1">Dobro došli,</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">{name}</h1>
        <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed">
          Upravljajte oglasima, pronađite nove poslove i gradite svoju reputaciju.
        </p>
        <p className="mt-3 text-xs text-white/50 italic">&ldquo;Pravi ljudi za velike projekte.&rdquo;</p>
      </div>
    </section>
  );
}
