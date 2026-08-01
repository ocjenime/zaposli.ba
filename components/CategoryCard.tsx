'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategory } from '@/lib/data';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

export default function CategoryCard({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;
  const Icon = category.icon;

  return (
    <Link
      href={`/kategorije/${category.slug}/`}
      className="group relative flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-card-hover md:p-6"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-300 group-hover:bg-brand-orange/10 md:h-14 md:w-14">
        <Icon className="h-6 w-6 text-brand-orange transition-transform duration-300 group-hover:scale-110 md:h-7 md:w-7" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900 transition-colors duration-300 group-hover:text-brand-orange md:text-lg">
            {category.name}
          </h3>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-steel">{category.description}</p>
        <p className="mt-2 text-sm font-medium text-brand-orange">
          <LiveCategoryCount slug={category.slug} fallback={category.count} />
        </p>
      </div>

      <ArrowRight className="h-5 w-5 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange" />
    </Link>
  );
}
