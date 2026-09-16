'use client';

import Link from 'next/link';
import { MapPin, Clock, Send, Tag, ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';
import { normalizeCityName } from '@/lib/city-utils';
import { plural } from '@/lib/plural';

interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  category_slug: string;
  created_at: string;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
}

interface Bid {
  job_id: string;
}

interface FirmRecommendedJobsProps {
  openJobs: Job[];
  myBids: Bid[];
  firmCategories: string[];
  firmCity: string | null;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 5) return 'Upravo sada';
  if (minutes < 60) return `Prije ${minutes} min`;
  if (hours < 24) return `Prije ${hours} ${plural(hours, ['sat', 'sata', 'sati'])}`;
  return `Prije ${days} dana`;
}

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')} - ${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Po dogovoru';
}

export default function FirmRecommendedJobs({
  openJobs,
  myBids,
  firmCategories,
  firmCity,
}: FirmRecommendedJobsProps) {
  const bidJobIds = new Set(myBids.map((b) => b.job_id));

  const recommended = openJobs
    .filter((job) => {
      if (bidJobIds.has(job.id)) return false;
      const categoryMatch = firmCategories.length === 0 || firmCategories.includes(job.category_slug);
      const cityMatch = !firmCity || normalizeCityName(job.city) === normalizeCityName(firmCity);
      return categoryMatch && cityMatch;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (recommended.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Send className="w-4 h-4 text-brand-orange" />
          Preporučeni poslovi za tebe
        </h3>
        <div className="text-center py-8">
          <Send className="w-8 h-8 text-steel/40 mx-auto mb-2" />
          <p className="text-sm text-steel">Trenutno nema novih preporučenih poslova.</p>
          <p className="text-xs text-steel/70 mt-1">Kad klijent objavi posao u vašoj kategoriji i gradu, pojavit će se ovdje.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-brand-orange" />
          Preporučeni poslovi za tebe
        </h3>
        <Link
          href="/dashboard/firma/"
          className="text-xs font-semibold text-brand-orange hover:text-brand-orange-dark inline-flex items-center gap-1"
        >
          Svi poslovi <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {recommended.map((job) => {
          const category = categories.find((c) => c.slug === job.category_slug);
          return (
            <div
              key={job.id}
              className="group flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-ink-800 hover:border-brand-orange/30 dark:hover:border-brand-orange/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
                  {job.title}
                </h4>
                <p className="text-xs text-steel line-clamp-1 mt-0.5">{job.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-steel">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {category?.name || job.category_slug}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {relativeTime(job.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:min-w-[12rem]">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {formatBudget(job)}
                </span>
                <Link
                  href={`/dashboard/firma/?expandJobId=${job.id}`}
                  className="inline-flex items-center justify-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  <Send className="w-3 h-3" />
                  Pošalji ponudu
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
