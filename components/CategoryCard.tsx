'use client';

import Link from 'next/link';
import { getCategory } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;
  const Icon = category.icon;

  return (
    <Link
      href={`/kategorije/${category.slug}/`}
      className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:border-brand-orange/30 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors">
        <Icon className="w-5 h-5 text-brand-orange group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-orange transition-colors truncate">
          {category.name}
        </h3>
        <p className="text-xs text-steel truncate">{category.description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}
