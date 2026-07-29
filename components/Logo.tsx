interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/zaposli.ba/images/logo-mark.png"
      alt=""
      className={className}
      aria-hidden="true"
    />
  );
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink';
  const sloganColor = variant === 'light' ? 'text-white/70' : 'text-steel';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 md:h-9 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`text-lg md:text-xl font-extrabold tracking-tight uppercase ${textColor}`}>
          zaposli<span className="text-brand-orange">.ba</span>
        </span>
        <span className={`text-[10px] md:text-xs font-medium tracking-wide ${sloganColor} mt-0.5`}>
          Prava odluka za svaki posao.
        </span>
      </span>
    </span>
  );
}
