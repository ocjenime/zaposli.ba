import Image from 'next/image';
import { getInitials } from '@/lib/initials';

interface LogoDisplayProps {
  name: string;
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const sizeClasses: Record<string, string> = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-xl',
  lg: 'w-24 h-24 text-3xl',
  xl: 'w-32 h-32 text-4xl',
};

const sizePixels: Record<string, string> = {
  sm: '40px',
  md: '64px',
  lg: '96px',
  xl: '128px',
};

const roundedClasses: Record<string, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[1.25rem]',
  full: 'rounded-full',
};

export function LogoDisplay({
  name,
  src,
  alt,
  size = 'md',
  className = '',
  rounded = 'lg',
}: LogoDisplayProps) {
  const containerClasses = `relative overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-sm ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`;

  if (src) {
    return (
      <div className={containerClasses}>
        <Image
          src={src}
          alt={alt || name}
          fill
          sizes={sizePixels[size]}
          className="object-contain p-1.5"
          loading="lazy"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`${containerClasses} bg-gradient-to-br from-ink-800 to-ink text-brand-orange font-extrabold`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

export default LogoDisplay;
