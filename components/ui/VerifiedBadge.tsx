interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VerifiedBadge({ size = 'md', className = '' }: VerifiedBadgeProps) {
  const sizes = {
    sm: 'text-[11px] px-2 py-1 gap-1.5',
    md: 'text-xs px-2.5 py-1.5 gap-2',
    lg: 'text-sm px-3.5 py-2 gap-2.5',
  };
  const circle = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const check = { sm: 'w-2.5 h-2.5', md: 'w-3 h-3', lg: 'w-3.5 h-3.5' };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-white border border-gray-100 shadow-sm font-semibold text-ink ${sizes[size]} ${className}`}
    >
      <span className={`${circle[size]} rounded-full bg-brand-emerald flex items-center justify-center shrink-0`}>
        <svg className={check[size]} viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      Provjerena firma
    </span>
  );
}
