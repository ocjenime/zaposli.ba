'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Siren, ArrowRight } from 'lucide-react';

interface EmergencyBottomBarProps {
  href?: string;
  showOnScroll?: boolean;
  scrollThreshold?: number;
  position?: 'bottom' | 'corner';
}

export default function EmergencyBottomBar({
  href = '/objavi-projekat/?service=Hitne%20intervencije',
  showOnScroll = false,
  scrollThreshold = 60,
  position = 'bottom',
}: EmergencyBottomBarProps) {
  const [visible, setVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      setVisible(window.scrollY > scrollThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll, scrollThreshold]);

  if (position === 'corner') {
    return (
      <>
        {/* Desktop: compact top-right sticker */}
        <Link
          href={href}
          className="fixed top-20 right-4 z-30 hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white pl-3 pr-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(220,38,38,0.35)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.45)] hover:scale-105 transition-all duration-300 group"
        >
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Siren className="w-4 h-4" />
          </span>
          <span className="text-sm font-bold">Hitna intervencija?</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Mobile: keep the bottom bar */}
        <MobileBottomBar href={href} visible={visible} />
      </>
    );
  }

  return (
    <>
      {/* Flow spacer so footer content never hides behind the fixed bar */}
      {visible && <div className="h-16" />}

      <div
        className={`
          fixed bottom-0 left-0 right-0 z-40
          bg-gradient-to-r from-red-600 to-red-700
          text-white
          shadow-[0_-4px_20px_rgba(0,0,0,0.15)]
          pb-[env(safe-area-inset-bottom)]
          transition-transform duration-300 ease-out
          ${visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}
        `}
      >
        <div {...(!visible && { inert: true })} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">Hitna intervencija?</p>
                <p className="text-xs text-white/80 truncate">Majstori su dostupni 24/7 - objavite odmah.</p>
              </div>
            </div>
            <Link
              href={href}
              className="shrink-0 inline-flex items-center gap-1.5 bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors active:scale-95"
            >
              Objavi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileBottomBar({ href, visible }: { href: string; visible: boolean }) {
  return (
    <>
      {visible && <div className="h-16 md:hidden" />}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-40 md:hidden
          bg-gradient-to-r from-red-600 to-red-700
          text-white
          shadow-[0_-4px_20px_rgba(0,0,0,0.15)]
          pb-[env(safe-area-inset-bottom)]
          transition-transform duration-300 ease-out
          ${visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}
        `}
      >
        <div {...(!visible && { inert: true })} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">Hitna intervencija?</p>
                <p className="text-xs text-white/80 truncate">Majstori su dostupni 24/7.</p>
              </div>
            </div>
            <Link
              href={href}
              className="shrink-0 inline-flex items-center gap-1.5 bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors active:scale-95"
            >
              Objavi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
