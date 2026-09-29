'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Siren, ArrowRight, X } from 'lucide-react';

const DISMISS_KEY = 'emergencyStickerDismissed';

/**
 * Diskretan premium sticker za hitne intervencije (samo desktop).
 * Plutajući glass pill u donjem desnom uglu, ne prekriva sadržaj,
 * može se trajno zatvoriti.
 */
export default function EmergencySticker() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === 'true') return;
    } catch {
      return;
    }
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, 'true');
    } catch {}
  }

  if (!visible) return null;

  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-40 animate-fade-in">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Zatvori"
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
      <Link
        href="/kategorije/hitne-intervencije/"
        className="group flex items-center gap-3 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border border-gray-100 dark:border-ink-700 shadow-xl shadow-black/10 rounded-2xl pl-3 pr-4 py-2.5 hover:shadow-2xl hover:border-red-200 transition-all"
      >
        <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shrink-0">
          <Siren className="w-4 h-4 text-white" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white" />
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-extrabold text-gray-900 dark:text-white leading-tight">
            Hitne intervencije
          </span>
          <span className="block text-[11px] text-steel dark:text-white/60 leading-tight">
            Majstor dostupan odmah · 24/7
          </span>
        </span>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </div>
  );
}
