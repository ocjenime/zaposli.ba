'use client';

import { useCategoryCount } from '@/hooks/useCategoryCounts';

interface LiveCategoryCountProps {
  slug: string;
  suffix?: string;
  className?: string;
}

export default function LiveCategoryCount({
  slug,
  suffix = 'firmi',
  className = '',
}: LiveCategoryCountProps) {
  const count = useCategoryCount(slug);
  if (count === null) return <span className={className}>...</span>;
  return (
    <span className={className}>
      {count} {suffix}
    </span>
  );
}
