'use client';

import { Sparkles } from 'lucide-react';

interface FeaturedBadgeProps {
  className?: string;
  label?: string;
}

export default function FeaturedBadge({ className = '', label = 'Istaknuto' }: FeaturedBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1',
        'px-2 py-0.5 rounded-md',
        'bg-amber-50 text-amber-700',
        'border border-amber-100',
        'text-xs font-semibold',
        'shadow-sm',
        className,
      ].join(' ')}
    >
      <Sparkles className="w-3 h-3 text-amber-500" />
      {label}
    </span>
  );
}
