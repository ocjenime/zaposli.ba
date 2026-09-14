'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProjectListCard from '@/components/ProjectListCard';

interface Job {
  id: string;
  title: string;
  category_slug: string;
  description: string;
  city: string;
  deadline: string | null;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  bids_count: number;
  created_at: string;
  is_featured: boolean | null;
  featured_until: string | null;
  job_images: { image_url: string }[] | null;
}

function isActiveFeatured(job: Job) {
  if (!job.is_featured || !job.featured_until) return false;
  return new Date(job.featured_until).getTime() > Date.now();
}

interface FeaturedJobsSectionProps {
  categorySlug?: string;
  city?: string;
  limit?: number;
}

export default function FeaturedJobsSection({ categorySlug, city, limit = 4 }: FeaturedJobsSectionProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const now = new Date().toISOString();
      let query = supabase
        .from('jobs')
        .select('id, title, category_slug, description, city, deadline, budget_mode, budget_min, budget_max, bids_count, created_at, is_featured, featured_until, job_images(image_url)')
        .eq('status', 'open')
        .eq('is_featured', true)
        .gt('featured_until', now)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (categorySlug) query = query.eq('category_slug', categorySlug);
      if (city) query = query.eq('city', city);

      const { data, error } = await query;
      if (!error && data) {
        setJobs((data as Job[]).filter(isActiveFeatured));
      }
      setLoading(false);
    }

    load();
  }, [categorySlug, city, limit]);

  if (loading) return null;
  if (jobs.length === 0) return null;

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Istaknuti poslovi</h2>
          </div>
          <Link
            href={categorySlug ? `/poslovi/?category=${categorySlug}` : '/poslovi/'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
          >
            Svi istaknuti poslovi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          {jobs.map((job) => (
            <ProjectListCard
              key={job.id}
              job={job as unknown as import('@/components/ProjectListCard').ProjectListCardJob}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
