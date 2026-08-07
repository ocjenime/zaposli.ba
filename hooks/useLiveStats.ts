'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LiveStats {
  clientsCount: number | null;
  firmsCount: number | null;
  completedJobsCount: number | null;
  averageRating: number | null;
  openJobsCount: number | null;
  loading: boolean;
  error: boolean;
}

export function useLiveStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>({
    clientsCount: null,
    firmsCount: null,
    completedJobsCount: null,
    averageRating: null,
    openJobsCount: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const [
          { count: clientsCount },
          { count: firmsCount },
          { count: completedJobsCount },
          { count: openJobsCount },
          { data: reviews },
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
          supabase.from('firms').select('*', { count: 'exact', head: true }).not('slug', 'like', 'test-%'),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('reviews').select('rating'),
        ]);

        const averageRating = reviews?.length
          ? parseFloat((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1))
          : null;

        setStats({
          clientsCount,
          firmsCount,
          completedJobsCount,
          openJobsCount,
          averageRating,
          loading: false,
          error: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false, error: true }));
      }
    }

    load();
  }, []);

  return stats;
}

export function formatCount(value: number | null, fallback: string): string {
  if (value === null || value === undefined || value < 0) return fallback;
  return value.toLocaleString('bs') + '+';
}

export function formatRating(value: number | null, fallback: string): string {
  if (value === null || value === undefined) return fallback;
  return value.toFixed(1);
}

export function formatPercentage(value: number | null, fallback: string): string {
  if (value === null || value === undefined || value < 0) return fallback;
  return `${Math.round(value)}%`;
}
