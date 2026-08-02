'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { categories } from '@/lib/data';

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
}

function getCategoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name || slug;
}

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')}-${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Budžet po dogovoru';
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return 'Upravo sada';
  if (diffHours < 1) return `Prije ${diffMins} min`;
  if (diffHours < 24) return `Prije ${diffHours} sati`;
  if (diffDays === 1) return 'Prije 1 dan';
  return `Prije ${diffDays} dana`;
}

export default function RecentProjects() {
  const [projects, setProjects] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, category_slug, description, city, deadline, budget_mode, budget_min, budget_max, bids_count, created_at')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error || !data || data.length === 0) return;
        setProjects(data as Job[]);
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
    <section className="py-8 md:py-14 bg-cloud relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Najnoviji poslovi
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Nedavno objavljeni poslovi
            </h2>
          </div>
          <Link
            href="/projekti/"
            className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors group whitespace-nowrap"
          >
            Svi poslovi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-20 h-5 bg-gray-200 rounded-lg" />
                  <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>
                <div className="w-2/3 h-5 bg-gray-200 rounded mb-2" />
                <div className="w-full h-4 bg-gray-200 rounded mb-1" />
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-4" />
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="w-20 h-4 bg-gray-200 rounded" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="w-20 h-5 bg-gray-200 rounded" />
                  <div className="w-16 h-6 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))
          ) : (
            projects.map((project) => (
            <Link
              key={project.id}
              href={`/projekti/?expandId=${project.id}`}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 group cursor-pointer block"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-brand-orange">
                  {getCategoryName(project.category_slug)}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {timeAgo(project.created_at)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
                {project.title}
              </h3>

              <p className="text-steel text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.city}</span>
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Do {new Date(project.deadline).toLocaleDateString('bs')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="font-bold text-brand-orange text-sm">{formatBudget(project)}</div>
                <div className="flex items-center gap-1.5 text-xs text-steel bg-cloud px-2.5 py-1 rounded-lg">
                  <span>{project.bids_count} ponuda</span>
                </div>
              </div>
            </Link>
          ))
          )}
        </div>
      </div>
    </section>
  );
}
