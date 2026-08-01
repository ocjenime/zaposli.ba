'use client';

import Link from 'next/link';
import { getCategory } from '@/lib/data';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

interface CityCategoriesGridProps {
  slugs: string[];
  citySlug: string;
}

export default function CityCategoriesGrid({ slugs, citySlug }: CityCategoriesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {slugs.map((slug) => {
        const cat = getCategory(slug);
        if (!cat) return null;
        const Icon = cat.icon;
        return (
          <Link
            key={cat.slug}
            href={`/usluge/${cat.seoSlug}-${citySlug}/`}
            className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-orange/40 hover:shadow-lg transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Icon className="w-5.5 h-5.5 text-brand-orange" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand-orange transition-colors mb-0.5">
              {cat.profession}
            </h3>
            <p className="text-xs text-steel">
              <LiveCategoryCount slug={cat.slug} fallback={cat.count} />
            </p>
          </Link>
        );
      })}
    </div>
  );
}
