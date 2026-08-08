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
      className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-300">
          <Icon className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-300" />
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all duration-300" />
      </div>
      <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-orange transition-colors duration-200 mb-1">
        {category.name}
      </h3>
      <p className="text-sm text-steel line-clamp-2">{category.description}</p>
    </Link>
  );
}
