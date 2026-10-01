'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Crown } from 'lucide-react';

interface AdGalleryProps {
  images: string[];
  title: string;
  adType: 'promotion' | 'worker_search';
}

/** Galerija oglasa: kadar se sam prilagođava dimenzijama slike pa je
 *  uvijek 100% vidljiva (kvadrat, landscape ili portrait) - bez rezanja. */
export default function AdGallery({ images, title, adType }: AdGalleryProps) {
  const [active, setActive] = useState(0);
  const [ratio, setRatio] = useState<string | null>(null);
  const total = images.length;
  const current = images[Math.min(active, total - 1)];

  // Reset omjera kad se promijeni slika - nova slika javlja svoje dimenzije kroz onLoad.
  useEffect(() => {
    setRatio(null);
  }, [current]);

  return (
    <div>
      <div className="relative overflow-hidden bg-ink-950 rounded-2xl">
        <div
          className="relative w-full aspect-[4/3]"
          style={ratio ? { aspectRatio: ratio } : undefined}
        >
          {current ? (
            <NextImage
              key={current}
              src={current}
              alt={title}
              fill
              unoptimized
              priority
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  setRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
                }
              }}
              className="object-cover"
              sizes="100vw"
            />
          ) : null}
        </div>

        <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white shadow-lg">
          <Crown className="w-3.5 h-3.5" />
          {adType === 'worker_search' ? 'Tražim radnike' : 'Promocija'}
        </div>

        {total > 0 && (
          <div className="absolute bottom-3 right-3 z-20 text-xs font-bold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-sm">
            {Math.min(active, total - 1) + 1}/{total}
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Fotografija ${i + 1}`}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? 'border-brand-orange shadow-md shadow-brand-orange/20'
                  : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <NextImage
                src={src}
                alt={`${title} - ${i + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="20vw"
              />
              {i === total - 1 && total > 5 ? (
                <span className="absolute inset-0 bg-black/60 text-white text-lg font-extrabold flex items-center justify-center">
                  +{total - 5}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
