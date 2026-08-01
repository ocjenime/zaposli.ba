'use client';

import { useCategoryCount } from '@/hooks/useCategoryCounts';

interface CategoryHeroStatsProps {
  slug: string;
}

export default function CategoryHeroStats({ slug }: CategoryHeroStatsProps) {
  const count = useCategoryCount(slug);
  if (count === null) return <>Učitavanje firmi...</>;
  return <>{count} provjerenih firmi širom BiH</>;
}
