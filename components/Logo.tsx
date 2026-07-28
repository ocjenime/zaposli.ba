interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Pin */}
      <path
        d="M24 3C14.6 3 7 10.6 7 20c0 12.2 17 25 17 25s17-12.8 17-25C41 10.6 33.4 3 24 3Z"
        fill="#F97316"
      />
      {/* Hammer */}
      <g transform="rotate(-45 24 20)">
        <rect x="22.2" y="11" width="3.6" height="18" rx="1.8" fill="#fff" />
        <rect x="14.5" y="8" width="19" height="7.2" rx="2.6" fill="#fff" />
      </g>
      {/* Base shadow */}
      <ellipse cx="24" cy="45.5" rx="7" ry="1.8" fill="#021117" opacity="0.18" />
    </svg>
  );
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="w-9 h-9 md:w-10 md:h-10 shrink-0" />
      <span className={`text-xl md:text-2xl font-extrabold tracking-tight ${textColor}`}>
        zaposli<span className="text-brand-orange">.ba</span>
      </span>
    </span>
  );
}
