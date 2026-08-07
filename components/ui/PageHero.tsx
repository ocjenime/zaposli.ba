import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  image?: string;
  icon?: LucideIcon;
  overlay?: boolean;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center';
}

export default function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
  image = '/images/herozaposli.png',
  icon: Icon,
  overlay = true,
  gradient,
  size = 'md',
  align = 'left',
}: PageHeroProps) {
  const height = {
    sm: 'py-16 md:py-20',
    md: 'py-20 md:py-28',
    lg: 'py-24 md:py-36 min-h-[420px] md:min-h-[520px]',
  }[size];

  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';
  const gradientClass = gradient || 'bg-gradient-to-br from-ink via-slate-900 to-slate-800';

  return (
    <section className={`relative overflow-hidden ${height} flex items-center`}>
      {image ? (
        <>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {overlay && <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />}
          {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />}
        </>
      ) : (
        <>
          <div className={`absolute inset-0 ${gradientClass}`} />
          {/* Abstract noise / mesh pattern */}
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.3),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
        </>
      )}

      <div className={`relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 ${alignClass} flex flex-col`}>
        {Icon && (
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-5 shadow-lg">
            <Icon className="w-7 h-7 text-brand-orange" />
          </div>
        )}

        {eyebrow && (
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-5">
            {eyebrow}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight max-w-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8 w-full">{children}</div>}
      </div>

      {/* Bottom fade for cohesion with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cloud to-transparent z-10" />
    </section>
  );
}
