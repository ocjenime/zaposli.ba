import NextImage from 'next/image';

interface AdBannerImageProps {
  src: string;
  alt: string;
  aspectClass?: string;
  sizes?: string;
  priority?: boolean;
  roundedClass?: string;
}

/**
 * Prikazuje CIJELU sliku oglasa bez rezanja (bilo koji omjer: kvadrat,
 * landscape, portrait). Pozadina je zamućena verzija iste slike,
 * preko nje cijela oštra slika (object-contain).
 */
export default function AdBannerImage({
  src,
  alt,
  aspectClass = 'aspect-[16/10]',
  sizes = '100vw',
  priority = false,
  roundedClass = '',
}: AdBannerImageProps) {
  return (
    <div className={`relative ${aspectClass} overflow-hidden bg-ink-950 ${roundedClass}`}>
      {/* Zatamnjena zasićena pozadina popunjava kadar */}
      <NextImage
        src={src}
        alt=""
        aria-hidden="true"
        fill
        unoptimized
        sizes={sizes}
        className="object-cover blur-2xl scale-125 opacity-70 brightness-[0.45] saturate-150"
      />
      {/* Cijela slika, bez rezanja */}
      <NextImage
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
