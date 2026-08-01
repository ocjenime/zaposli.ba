'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CategoryCount {
  category_slug: string;
  count: number;
}

export function useCategoryCounts(): {
  counts: Record<string, number>;
  loading: boolean;
  error: boolean;
} {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('firm_categories')
          .select('category_slug');

        if (error || !data) {
          setError(true);
          setLoading(false);
          return;
        }

        const map: Record<string, number> = {};
        (data as { category_slug: string }[]).forEach((row) => {
          map[row.category_slug] = (map[row.category_slug] || 0) + 1;
        });
        setCounts(map);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { counts, loading, error };
}

export function useCategoryCount(slug: string): number | null {
  const { counts, loading, error } = useCategoryCounts();
  if (loading || error) return null;
  return counts[slug] ?? null;
}
