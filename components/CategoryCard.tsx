'use client';

import Link from 'next/link';
import { getCategory } from '@/lib/data';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

export default function CategoryCard({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;
  const Icon = category.icon;

  return (
    <Link
      href={`/kategorije/${category.slug}/`}
      className="rounded-2xl p-6 border-2 bg-white text-gray-900 border-gray-100 hover:border-brand-orange/40 group transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-brand-orange" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-brand-orange transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-steel mb-2">{category.description}</p>
          <p className="text-sm font-medium text-brand-orange">
            <LiveCategoryCount slug={category.slug} fallback={category.count} />
          </p>
        </div>
      </div>
    </Link>
  );
}
