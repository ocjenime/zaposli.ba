'use client';

import Link from 'next/link';
import { ArrowRight, Megaphone } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';

interface AdCreateCTAProps {
  destination?: 'homepage' | 'homepage_banner' | 'listing';
  variant?: 'banner' | 'button';
}

export default function AdCreateCTA({ destination = 'listing', variant = 'banner' }: AdCreateCTAProps) {
  const { role } = useAuth();
  const isFirm = isFirmRole(role);
  const href = isFirm
    ? `/kupi-oglas/${destination ? `?destination=${destination}` : ''}`
    : '/pretplata-auth/';

  if (variant === 'button') {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold transition-colors"
      >
        Objavi oglas <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-6 mb-8 md:mb-10">
      <Link
        href={href}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-4 shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold">Želite da vaš oglas bude ovdje?</p>
            <p className="text-sm text-white/90">Besplatno za Start/Pro/Premium pakete, ili 5 KM za besplatne profile.</p>
          </div>
        </div>
        <span className="inline-flex items-center justify-center gap-2 self-start sm:self-center bg-white text-brand-orange px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shrink-0">
          Objavi oglas <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </div>
  );
}
