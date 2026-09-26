'use client';

import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { categories, getCategoryBarLabel } from '@/lib/categories';

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
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-xl shadow-black/5 p-2 sm:p-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-0.5">
            {featured.map((category) => {
              const Icon = category!.icon;
              return (
                <Link
                  key={category!.slug}
                  href={`/kategorije/${category!.slug}/`}
                  className="group flex flex-col items-center gap-1.5 text-center min-w-0 shrink-0 snap-start basis-[calc(25%-9px)] sm:basis-auto sm:min-w-[92px]"
                >
                  <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 dark:bg-ink-800 border border-gray-100 dark:border-ink-700 flex items-center justify-center text-gray-700 dark:text-[#ffffff]/90 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <span className="block text-center text-[10px] sm:text-xs font-medium text-gray-700 dark:text-[#ffffff]/85 group-hover:text-brand-orange transition-colors leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {getCategoryBarLabel(category!)}
                  </span>
                </Link>
              );
            })}
            <Link
              href="/kategorije/"
              className="group flex flex-col items-center gap-1.5 text-center min-w-0 shrink-0 snap-start basis-[calc(25%-9px)] sm:basis-auto sm:min-w-[92px]"
            >
              <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 dark:bg-ink-800 border border-gray-100 dark:border-ink-700 flex items-center justify-center text-gray-700 dark:text-[#ffffff]/90 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-all duration-300">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <span className="block text-center text-[10px] sm:text-xs font-medium text-gray-700 dark:text-[#ffffff]/85 group-hover:text-brand-orange transition-colors leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis">
                Sve kategorije
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
