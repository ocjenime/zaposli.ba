'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { ArrowRight, Loader2 } from 'lucide-react';

interface PricingCTAProps {
  href?: string;
  popular?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function PricingCTA({ href = '/registracija/', popular = false, children, className = '' }: PricingCTAProps) {
  const { user, loading, role } = useAuth();

  const dashboardHref = isFirmRole(role) ? '/dashboard/firma/pretplata/' : '/dashboard/';
  const targetHref = user ? dashboardHref : href;

  if (loading) {
    return (
      <span className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold opacity-60 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...
      </span>
    );
  }

  return (
    <Link
      href={targetHref}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-200 active:scale-95 ${
        popular
          ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white shadow-md shadow-brand-orange/20 hover:shadow-lg hover:shadow-brand-orange/30'
          : 'border-2 border-gray-200 text-gray-900 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/50'
      } ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
