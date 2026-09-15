'use client';

import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { categories } from '@/lib/categories';

const FEATURED_SLUGS = [
  'adaptacije',
  'keramicarski-radovi',
  'elektroinstalacije',
  'vodoinstalacije',
  'stolarija',
  'krovopokrivanje',
  'molerski-radovi',
  'gipsarski-radovi',
];

export default function CategoryIconRow() {
  const featured = FEATURED_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(Boolean);

  return (
    <section className="relative -mt-3 md:-mt-8 z-30 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-xl shadow-black/5 p-3 sm:p-5">
          <div className="flex items-center justify-start gap-3 overflow-x-auto no-scrollbar pb-1">
            {featured.map((category) => {
              const Icon = category!.icon;
              return (
                <Link
                  key={category!.slug}
                  href={`/kategorije/${category!.slug}/`}
                  className="group flex flex-col items-center gap-2 min-w-[100px] sm:min-w-[92px] text-center"
                >
                  <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gray-50 dark:bg-ink-800 border border-gray-100 dark:border-ink-700 flex items-center justify-center text-gray-700 dark:text-white/80 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-white/80 group-hover:text-brand-orange transition-colors leading-tight px-1">
                    {category!.name}
                  </span>
                </Link>
              );
            })}
            <Link
              href="/kategorije/"
              className="group flex flex-col items-center gap-2 min-w-[100px] sm:min-w-[92px] text-center"
            >
              <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gray-50 dark:bg-ink-800 border border-gray-100 dark:border-ink-700 flex items-center justify-center text-gray-700 dark:text-white/80 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-all duration-300">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-white/80 group-hover:text-brand-orange transition-colors leading-tight px-1">
                Sve kategorije
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
