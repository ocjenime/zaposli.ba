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
        const [{ data: firmData }, { data: catData, error }] = await Promise.all([
          supabase.from('firms').select('id').not('slug', 'like', 'test-%'),
          supabase.from('firm_categories').select('firm_id, category_slug'),
        ]);

        if (error || !catData) {
          setError(true);
          setLoading(false);
          return;
        }

        const validFirmIds = new Set((firmData || []).map((f) => (f as { id: string }).id));
        const map: Record<string, number> = {};
        (catData as { firm_id: string; category_slug: string }[]).forEach((row) => {
          if (!validFirmIds.has(row.firm_id)) return;
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
