interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Pin */}
      <path
        d="M24 3C14.6 3 7 10.6 7 20c0 12.2 17 25 17 25s17-12.8 17-25C41 10.6 33.4 3 24 3Z"
        fill="#F97316"
      />
      {/* Claw hammer */}
      <g transform="rotate(-45 24 20)">
        {/* Handle */}
        <rect x="22" y="11" width="4" height="19" rx="2" fill="#fff" />
        {/* Poll (striking block) */}
        <rect x="24" y="5.5" width="8.5" height="9" rx="2.4" fill="#fff" />
        {/* Claw */}
        <path d="M24 5.5h-4.2c-3.6 0-6.8 2.4-7.8 5.8l-.5 1.7c-.2.8.6 1.5 1.4 1.2l11.1-4.2V5.5Z" fill="#fff" />
      </g>
      {/* Ground shadow */}
      <ellipse cx="24" cy="49.5" rx="7.5" ry="2" fill="#021117" opacity="0.18" />
    </svg>
  );
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-8 md:h-10 md:w-9 shrink-0" />
      <span className={`text-xl md:text-2xl font-extrabold tracking-tight ${textColor}`}>
        zaposli<span className="text-brand-orange">.ba</span>
      </span>
    </span>
  );
}
