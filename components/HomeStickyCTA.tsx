'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';

export default function HomeStickyCTA() {
  const { user, loading, role } = useAuth();

  const isFirm = isFirmRole(role);

  const postHref = user
    ? isFirm
      ? '/dashboard/firma/'
      : '/objavi-projekat/'
    : '/prijava/?redirectTo=/objavi-projekat/';

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-slide-up">
        <div className="mx-auto max-w-md flex gap-3">
          <div className="flex-1 h-12 rounded-xl bg-gray-200 animate-pulse" />
          <div className="flex-1 h-12 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-slide-up">
      <div className="mx-auto max-w-md flex gap-3">
        <Link
          href={postHref}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-orange/25"
        >
          <Briefcase className="w-4 h-4" />
          {isFirm ? 'Moji poslovi' : 'Objavi posao'}
        </Link>
        <Link
          href="/poslovi/"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-[#4b5563] dark:hover:bg-[#374151] text-white px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
        >
          <Search className="w-4 h-4" />
          Pronađi poslove
        </Link>
      </div>
    </div>
  );
}
