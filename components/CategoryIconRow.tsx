'use client';

import Link from 'next/link';
import { CATEGORY_GROUPS } from '@/lib/category-groups';

export default function CategoryIconRow() {
  return (
    <section className="relative -mt-3 md:mt-4 md:pb-4 z-30 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-xl shadow-black/5 p-2 sm:p-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-0.5 lg:justify-center">
            {CATEGORY_GROUPS.map((group) => {
              const Icon = group.Icon;
              return (
                <Link
                  key={group.slug}
                  href={`/kategorije/#grupa-${group.slug}`}
                  className="group flex flex-col items-center gap-1.5 text-center min-w-0 shrink-0 snap-start basis-[calc(25%-9px)] sm:basis-auto sm:min-w-[92px]"
                >
                  <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 dark:bg-ink-800 border border-gray-100 dark:border-ink-700 flex items-center justify-center text-gray-700 dark:text-[#ffffff]/90 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <span className="block text-center text-[10px] sm:text-xs font-medium text-gray-700 dark:text-[#ffffff]/85 group-hover:text-brand-orange transition-colors leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {group.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
