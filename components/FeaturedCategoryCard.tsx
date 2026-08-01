'use client';

import Link from 'next/link';
import { Siren, ArrowRight } from 'lucide-react';
import { getCategory } from '@/lib/data';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

export default function FeaturedCategoryCard({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;

  return (
    <section className="pt-10 md:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/kategorije/${category.slug}/`}
          className="group block rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 via-white to-white p-6 md:p-8 hover:border-red-400 hover:shadow-xl hover:shadow-red-100 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/25 group-hover:scale-110 transition-transform">
                <Siren className="w-7 h-7 text-[#ffffff]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-red-700 transition-colors">{category.name}</h2>
                  <span className="inline-flex items-center gap-1 bg-red-600 text-[#ffffff] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    24/7
                  </span>
                </div>
                <p className="text-sm text-steel">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm shrink-0">
              <LiveCategoryCount slug={category.slug} fallback={category.count} />
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5 md:pl-[4.5rem]">
            {category.services.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-medium text-gray-900/80">
                {s}
              </span>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
