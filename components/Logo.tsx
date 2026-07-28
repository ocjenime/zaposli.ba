interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[26%] bg-gradient-to-br from-brand-orange to-brand-orange-dark shadow-md shadow-brand-orange/20 ${className}`}
    >
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[74%] h-[74%]" aria-hidden="true">
        {/* Pin */}
        <path
          d="M24 3C14.6 3 7 10.6 7 20c0 12.2 17 25 17 25s17-12.8 17-25C41 10.6 33.4 3 24 3Z"
          fill="#fff"
        />
        {/* Hammer */}
        <g transform="rotate(-45 24 20)">
          <rect x="22.1" y="10.5" width="3.8" height="18.5" rx="1.9" fill="#EA580C" />
          <rect x="14" y="7.5" width="20" height="7.6" rx="2.8" fill="#EA580C" />
        </g>
      </svg>
    </span>
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
