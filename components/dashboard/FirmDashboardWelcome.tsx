'use client';

import Image from 'next/image';

interface FirmDashboardWelcomeProps {
  firmName?: string | null;
}

export default function FirmDashboardWelcome({ firmName }: FirmDashboardWelcomeProps) {
  const name = firmName || 'Firma';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 shadow-sm">
      <div className="absolute inset-0">
        <Image
          src="/images/herozaposli.png"
          alt="Majstor na poslu"
          fill
          className="object-cover object-[60%_center] opacity-90"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/20" />
      </div>

      <div className="relative z-10 p-5 sm:p-6 min-h-[180px] flex flex-col justify-end">
        <p className="text-sm text-gray-600 mb-1">Dobro došli,</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {name}
        </h1>
        <p className="text-sm sm:text-base text-gray-700 max-w-md leading-relaxed">
          Upravljajte oglasima, pronađite nove poslove i gradite svoju reputaciju.
        </p>
      </div>
    </section>
  );
}
