'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProjectListCard, { ProjectListCardSkeleton, ProjectListCardJob } from '@/components/ProjectListCard';

export default function LatestAdsSection() {
  const [jobs, setJobs] = useState<ProjectListCardJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(
            'id, title, description, category_slug, city, created_at, budget_mode, budget_min, budget_max, bids_count, job_images(image_url)'
          )
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        setJobs((data || []) as unknown as ProjectListCardJob[]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load latest ads:', err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (!loading && jobs.length === 0) return null;

  return (
    <section className="relative py-10 md:py-14 bg-cloud px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-brand-orange uppercase">
              <Clock className="w-3.5 h-3.5" />
              Najnoviji oglasi
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              Najnoviji projekti koje klijenti objavljuju
            </h2>
          </div>
          <Link
            href="/poslovi/"
            className="text-xs md:text-sm font-semibold text-gray-600 dark:text-white/60 hover:text-brand-orange transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Pogledaj sve <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProjectListCardSkeleton key={i} />)
            : jobs.map((job) => <ProjectListCard key={job.id} job={job} />)}
        </div>
      </div>
    </section>
  );
}
