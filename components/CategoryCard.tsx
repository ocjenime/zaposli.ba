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
      className="group flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/80 p-3 hover:border-brand-orange/30 hover:bg-ink-800 transition-all duration-200"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors">
        <Icon className="w-5 h-5 text-brand-orange group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white group-hover:text-brand-orange transition-colors truncate">
          {category.name}
        </h3>
        <p className="text-xs text-white/60 truncate">{category.description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}
