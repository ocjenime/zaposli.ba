'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategory, getCategoryShortName } from '@/lib/data';
import { getCategoryHeadline } from '@/lib/profession-plural';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

interface CityCategoriesGridProps {
  slugs: string[];
  citySlug: string;
}

export default function CityCategoriesGrid({ slugs, citySlug }: CityCategoriesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {slugs.map((slug) => {
        const cat = getCategory(slug);
        if (!cat) return null;
        const Icon = cat.icon;
        return (
          <Link
            key={cat.slug}
            href={`/usluge/${cat.seoSlug}-${citySlug}/`}
            className="group flex items-center gap-2.5 bg-cloud rounded-xl px-3 py-2.5 border border-transparent hover:border-brand-orange/30 hover:bg-white hover:shadow-md transition-all"
          >
            <span className="w-9 h-9 rounded-lg bg-white group-hover:bg-orange-50 border border-gray-100 flex items-center justify-center shrink-0 transition-colors">
              <Icon className="w-[18px] h-[18px] text-brand-orange" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-gray-900 text-[13px] leading-tight truncate group-hover:text-brand-orange transition-colors">
                {getCategoryHeadline(cat.slug, cat.profession)}
              </span>
              <span className="block text-[11px] text-steel leading-tight truncate">
                {getCategoryShortName(cat)} · <LiveCategoryCount slug={cat.slug} />
              </span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-orange ml-auto shrink-0 transition-colors" />
          </Link>
        );
      })}
    </div>
  );
}
