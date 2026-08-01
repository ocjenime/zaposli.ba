'use client';

import { useCategoryCount } from '@/hooks/useCategoryCounts';

interface LiveCategoryCountProps {
  slug: string;
  fallback: number;
  suffix?: string;
  className?: string;
}

export default function LiveCategoryCount({
  slug,
  fallback,
  suffix = 'firmi',
  className = '',
}: LiveCategoryCountProps) {
  const count = useCategoryCount(slug);
  const display = count ?? fallback;
  return (
    <span className={className}>
      {display} {suffix}
    </span>
  );
}
