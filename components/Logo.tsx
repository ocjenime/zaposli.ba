interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'w-8 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Pin — okrugla glava, vrh prema dolje-lijevo */}
      <path
        d="M27 2.5C16.3 2.5 7.5 11.3 7.5 22c0 4.3 1.5 8.2 4 11.2L6 44.6c-1 1.7.6 3.7 2.4 2.9l12.4-5.1c1.9.4 3.9.6 6.1.6 10.7 0 19.5-8.8 19.5-19.5S37.7 2.5 27 2.5Z"
        fill="#F97316"
      />
      {/* Čekić — negativni prostor: kandža + drška */}
      <path
        d="M13.5 21.5C11.2 14.6 14 8.8 20.3 7.2c3.2-.8 6.6.4 8.4 3"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M18.5 17.5l14 16.5"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Ground shadow */}
      <ellipse cx="24" cy="49.5" rx="8" ry="2" fill="#021117" opacity="0.15" />
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
