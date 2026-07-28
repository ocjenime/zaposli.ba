import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VerifiedBadge({ size = 'md', className = '' }: VerifiedBadgeProps) {
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };
  const iconSizes = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4.5 h-4.5' };

  return (
    <span
      className={`inline-flex items-center rounded-lg bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-semibold shadow-sm ${sizes[size]} ${className}`}
    >
      <BadgeCheck className={iconSizes[size]} />
      Provjerena firma
    </span>
  );
}
