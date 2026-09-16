'use client';

import Link from 'next/link';
import { Plus, User } from 'lucide-react';

export default function FirmQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href="/dashboard/firma/?tab=ads"
        className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-sm shadow-lg shadow-brand-orange/20 transition-all active:scale-95"
      >
        <Plus className="w-5 h-5" />
        Objavi novi oglas
      </Link>
      <Link
        href="/dashboard/firma/?tab=jobs"
        className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-ink-900 hover:bg-ink-800 text-white font-semibold text-sm transition-all active:scale-95"
      >
        <User className="w-5 h-5" />
        Pronađi poslove
      </Link>
    </div>
  );
}
