'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Siren, ArrowRight } from 'lucide-react';

interface EmergencyBottomBarProps {
  href?: string;
  showOnScroll?: boolean;
  scrollThreshold?: number;
}

export default function EmergencyBottomBar({
  href = '/objavi-projekat/?service=Hitne%20intervencije',
  showOnScroll = false,
  scrollThreshold = 60,
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

  return (
    <>
      {/* Flow spacer so footer content never hides behind the fixed bar */}
      {visible && <div className="h-16" />}

      <div
        className={`
          fixed bottom-0 left-0 right-0 z-[60]
          bg-gradient-to-r from-red-600 to-red-700
          text-white
          shadow-[0_-4px_20px_rgba(0,0,0,0.15)]
          pb-[env(safe-area-inset-bottom)]
          transition-transform duration-300 ease-out
          ${visible ? 'translate-y-0' : 'translate-y-full'}
        `}
        aria-hidden={!visible}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
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
