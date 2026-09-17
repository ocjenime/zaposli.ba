'use client';

import Link from 'next/link';
import { FolderOpen, ArrowRight, MapPin, Calendar, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { getCategory } from '@/lib/data';

interface Job {
  id: string;
  title: string;
  city: string;
  category_slug: string;
  status: 'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  bids: { id: string }[];
}

const statusLabels: Record<Job['status'], string> = {
  open: 'Otvoren',
  bidding: 'U ponudama',
  in_progress: 'U toku',
  completed: 'Završen',
  cancelled: 'Otkazan',
};

const statusClass: Record<Job['status'], string> = {
  open: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
  bidding: 'bg-orange-50 text-brand-orange border-orange-100 dark:bg-orange-500/15 dark:border-orange-500/20',
  in_progress: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20',
  completed: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400 border-green-100 dark:border-green-500/20',
  cancelled: 'bg-gray-100 text-gray-700 dark:bg-ink-800 dark:text-white/60 border-gray-200 dark:border-ink-700',
};

interface ClientMyJobsListProps {
  jobs: Job[];
  loading?: boolean;
}

export default function ClientMyJobsList({ jobs, loading }: ClientMyJobsListProps) {
  const recent = jobs.slice(0, 3);

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Moji poslovi</h3>
        <Link
          href="/dashboard/?tab=jobs"
          className="text-xs font-semibold text-brand-orange flex items-center gap-0.5 hover:underline"
        >
          Svi poslovi <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-steel" />
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-2">
            <FolderOpen className="w-5 h-5 text-steel" />
          </div>
          <p className="text-sm text-steel">Još nemate objavljenih poslova.</p>
          <Link
            href="/objavi-projekat/"
            className="inline-block mt-2 text-xs font-semibold text-brand-orange hover:underline"
          >
            Objavi prvi posao
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((job) => (
            <Link
              key={job.id}
              href="/dashboard/poslovi/"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-ink-800 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5 text-steel" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{job.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-steel mt-0.5">
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {job.city}
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Calendar className="w-3 h-3" /> {formatDate(job.created_at)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass[job.status]}`}>
                  {statusLabels[job.status]}
                </span>
                <p className="text-[10px] text-steel mt-0.5">{job.bids.length} ponuda</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
