import Image from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  image?: string;
  overlay?: boolean;
}

export default function PageHero({ title, subtitle, children, image, overlay = true }: PageHeroProps) {
  return (
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden">
      {image ? (
        <>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {overlay && <div className="absolute inset-0 bg-ink/65" />}
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-cloud" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight ${image ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-lg max-w-2xl mx-auto ${image ? 'text-white/80' : 'text-steel'}`}>{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
