'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import FeaturedBadge from './FeaturedBadge';

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
}

function isActiveFeatured(job: Job) {
  if (!job.is_featured || !job.featured_until) return false;
  return new Date(job.featured_until).getTime() > Date.now();
}

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')}-${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Budžet po dogovoru';
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
        .select('id, title, category_slug, description, city, deadline, budget_mode, budget_min, budget_max, bids_count, created_at, is_featured, featured_until')
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

        <div className="grid md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/poslovi/?expandId=${job.id}`}
              className="bg-cloud rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 group cursor-pointer block"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white text-brand-orange border border-gray-100">
                    {getCategory(job.category_slug)?.name || job.category_slug}
                  </span>
                  <FeaturedBadge />
                </div>
                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                  {new Date(job.created_at).toLocaleDateString('bs')}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
                {job.title}
              </h3>

              <p className="text-steel text-sm mb-4 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.city}</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Do {new Date(job.deadline).toLocaleDateString('bs')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="font-bold text-brand-orange text-sm">{formatBudget(job)}</div>
                <div className="flex items-center gap-1.5 text-xs text-steel bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                  <span>{job.bids_count} ponuda</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
