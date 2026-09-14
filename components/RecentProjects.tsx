'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProjectListCard, { ProjectListCardSkeleton, ProjectListCardJob } from '@/components/ProjectListCard';

export default function RecentProjects() {
  const [projects, setProjects] = useState<ProjectListCardJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(
            'id, title, description, category_slug, city, created_at, budget_mode, budget_min, budget_max, bids_count, job_images(image_url)'
          )
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error || !data || data.length === 0) return;
        setProjects(data as unknown as ProjectListCardJob[]);
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-cloud relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-orange-500/10 text-brand-orange rounded-full text-xs font-bold uppercase tracking-wide mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Najnoviji poslovi
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Nedavno objavljeni poslovi
            </h2>
          </div>
          <Link
            href="/poslovi/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors group whitespace-nowrap"
          >
            Svi poslovi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProjectListCardSkeleton key={i} />)
            : projects.map((project) => <ProjectListCard key={project.id} job={project} />)}
        </div>
      </div>
    </section>
  );
}
