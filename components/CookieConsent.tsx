'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import GoogleAnalytics from './GoogleAnalytics';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export type CookieConsent = 'unknown' | 'granted' | 'denied';

export default function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>('unknown');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cookieConsent') as CookieConsent | null;
        if (stored) setConsent(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChoice = (choice: CookieConsent) => {
    setConsent(choice);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cookieConsent', choice);
      }
    } catch {
      // ignore
    }
  };

  // If the user already made a choice, load analytics only when granted.
  if (consent === 'granted') return <GoogleAnalytics />;
  if (consent === 'denied' || !GA_ID) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-4xl bg-ink-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/40 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-orange">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Vaša privatnost je važna</p>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Koristimo kolačiće kako bismo poboljšali vaše iskustvo i analizirali posjete putem
                Google Analytics. Možete prihvatiti sve kolačiće ili koristiti samo neophodne.{' '}
                <Link href="/privacy/" className="underline hover:text-brand-orange transition-colors">
                  Saznajte više
                </Link>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleChoice('denied')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Samo neophodne
            </button>
            <button
              type="button"
              onClick={() => handleChoice('granted')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-orange hover:bg-brand-orange-dark transition-colors shadow-lg shadow-brand-orange/20"
            >
              Prihvati sve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
