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
            className="group bg-ink-900/60 rounded-2xl p-5 border border-ink-800 hover:border-brand-orange/40 hover:shadow-lg hover:shadow-brand-orange/5 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Icon className="w-[22px] h-[22px] text-brand-orange" />
            </div>
            <h3 className="font-semibold text-white text-sm group-hover:text-brand-orange transition-colors mb-0.5">
              {cat.profession}
            </h3>
            <p className="text-xs text-white/60">
              <LiveCategoryCount slug={cat.slug} />
            </p>
          </Link>
        );
      })}
    </div>
  );
}
