'use client';

import Link from 'next/link';
import { Siren, ArrowRight } from 'lucide-react';
import { getCategory } from '@/lib/data';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

export default function FeaturedCategoryCard({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/kategorije/${category.slug}/`}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:border-brand-orange/30 hover:shadow-card-hover md:flex-row"
        >
          {/* Subtle accent bar */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark md:h-full md:w-1.5" />

          <div className="flex flex-1 flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            {/* Icon */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark shadow-lg shadow-brand-orange/25 md:h-20 md:w-20">
              <Siren className="h-8 w-8 text-white" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand-orange md:text-2xl">
                  {category.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  24/7
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-steel md:text-base">{category.description}</p>
            </div>

            {/* Count + CTA */}
            <div className="flex shrink-0 flex-row items-center gap-3 text-brand-orange md:flex-col md:items-end md:gap-2">
              <div className="text-sm font-semibold md:text-right">
                <LiveCategoryCount slug={category.slug} fallback={category.count} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-brand-orange">
                Pogledaj
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Service pills */}
          <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-4 md:px-8">
            <div className="flex flex-wrap gap-2">
              {category.services.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
