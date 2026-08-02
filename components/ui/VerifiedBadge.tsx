interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VerifiedBadge({ size = 'md', className = '' }: VerifiedBadgeProps) {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  };
  const icon = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const gradId = `verified-shield-${size}`;

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wide border ${sizes[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        borderColor: 'rgba(217, 119, 6, 0.25)',
        color: '#92400e',
        boxShadow: '0 1px 2px rgba(180, 83, 9, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
      title="Ova firma je lično provjerena od strane Zaposli.ba tima"
    >
      <svg
        className={`${icon[size]} flex-shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.25L4.125 5.25v6c0 5.86 3.64 11.13 7.875 12.75 4.235-1.62 7.875-6.89 7.875-12.75v-6L12 2.25z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M12 4.5L6.375 6.75v4.5c0 4.125 2.475 7.875 5.625 9.225 3.15-1.35 5.625-5.1 5.625-9.225v-4.5L12 4.5z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M8.25 12l2.625 2.625L16.5 9"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {size === 'sm' ? 'Provjerena' : 'Provjerena firma'}
    </span>
  );
}
