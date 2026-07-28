interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'w-8 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Pin — uspravan, vrh na sredini */}
      <path
        d="M24 2.5C13.8 2.5 5.7 10.6 5.7 20.8c0 11.8 18.3 25 18.3 25s18.3-13.2 18.3-25c0-10.2-8.1-18.3-18.3-18.3Z"
        fill="#F97316"
      />
      {/* Kandža čekića (negativni prostor) */}
      <path
        d="M30.5 9.3C25.8 5.8 17 6.8 13.8 12.4c-1.2 2.1-1.3 4.6-.3 6.7"
        stroke="#fff"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      {/* Glava čekića */}
      <circle cx="13.2" cy="17.5" r="3.4" fill="#fff" />
      {/* Drška — dijagonala ~25° kroz desnu ivicu */}
      <path
        d="M16.8 16.2 41.5 28.4"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Ground shadow */}
      <ellipse cx="24" cy="49.5" rx="9" ry="2" fill="#021117" opacity="0.15" />
    </svg>
  );
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-7 md:h-9 md:w-8 shrink-0" />
      <span className={`text-xl md:text-2xl font-extrabold tracking-tight ${textColor}`}>
        zaposli<span className="text-brand-orange">.ba</span>
      </span>
    </span>
  );
}
