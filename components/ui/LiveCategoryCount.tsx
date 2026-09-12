'use client';

import { useCategoryCount } from '@/hooks/useCategoryCounts';
import { plural } from '@/lib/plural';

interface LiveCategoryCountProps {
  slug: string;
  suffix?: string;
  className?: string;
}

export default function LiveCategoryCount({
  slug,
  className = '',
}: LiveCategoryCountProps) {
  const count = useCategoryCount(slug);
  if (count === null) return <span className={className}>...</span>;
  return (
    <span className={className}>
      {count} {plural(count, ['firma', 'firme', 'firmi'])}
    </span>
  );
}
