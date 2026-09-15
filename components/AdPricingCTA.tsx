'use client';

import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';

interface AdPricingCTAProps {
  destination: 'homepage' | 'homepage_banner' | 'listing';
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export default function AdPricingCTA({
  destination,
  variant = 'primary',
  children,
  className = '',
}: AdPricingCTAProps) {
  const { loading, role } = useAuth();

  const href = isFirmRole(role)
    ? `/kupi-oglas/?destination=${destination}`
    : '/pretplata-auth/';

  if (loading) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm opacity-60 ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Učitavanje...
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
        variant === 'primary'
          ? 'bg-brand-orange hover:bg-brand-orange-dark text-white'
          : 'bg-white hover:bg-white/90 text-gray-900'
      } ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
