'use client';

import { useCategoryCount } from '@/hooks/useCategoryCounts';

interface CategoryHeroStatsProps {
  slug: string;
  fallback: number;
}

export default function CategoryHeroStats({ slug, fallback }: CategoryHeroStatsProps) {
  const count = useCategoryCount(slug);
  const display = count ?? fallback;
  return <>{display} provjerenih firmi širom BiH</>;
}
