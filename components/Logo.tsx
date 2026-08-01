interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function LogoMark({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/zaposli.ba/images/logo-mark.svg"
      alt=""
      className={className}
      aria-hidden="true"
    />
  );
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-[#ffffff]' : 'text-gray-900';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 md:h-9 w-auto shrink-0" />
      <span className={`text-lg md:text-xl font-extrabold tracking-tight uppercase leading-none ${textColor}`}>
        zaposli<span className="text-brand-orange">.ba</span>
      </span>
    </span>
  );
}
