'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Clock, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { categories } from '@/lib/data';
import { plural } from '@/lib/plural';

interface JobImage {
  image_url: string;
}

interface LatestJob {
  id: string;
  title: string;
  category_slug: string;
  city: string;
  created_at: string;
  job_images: JobImage[] | null;
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
  if (diffHours < 24) return `Prije ${diffHours} ${plural(diffHours, ['sat', 'sata', 'sati'])}`;
  if (diffDays === 1) return 'Prije 1 dan';
  return `Prije ${diffDays} dana`;
}

function LatestAdCard({ job }: { job: LatestJob }) {
  const imageUrl = job.job_images?.[0]?.image_url;
  const category = categories.find((c) => c.slug === job.category_slug);

  return (
    <Link
      href={`/poslovi/?job=${job.id}`}
      className="group flex flex-col rounded-2xl bg-ink-900/60 backdrop-blur-sm border border-ink-800 hover:border-brand-orange/40 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-950">
        {imageUrl ? (
          <NextImage
            src={imageUrl}
            alt={job.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 to-ink-950 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              {category?.icon ? (
                <category.icon className="w-6 h-6 text-brand-orange" />
              ) : (
                <MapPin className="w-6 h-6 text-brand-orange" />
              )}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-brand-orange transition-colors">
          {job.title}
        </h3>

        <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded bg-brand-orange/10 text-orange-200 border border-brand-orange/20 mb-3">
          {category?.name || 'Usluge'}
        </span>

        <div className="mt-auto flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(job.created_at)}
            </span>
          </div>
          <span className="w-8 h-8 rounded-full bg-ink-800 text-white/60 group-hover:bg-brand-orange group-hover:text-white transition-colors flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-ink-900/40 border border-ink-800 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-ink-950" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-ink-800 rounded w-3/4" />
        <div className="h-4 bg-ink-800 rounded w-1/3" />
        <div className="h-4 bg-ink-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function LatestAdsSection() {
  const [jobs, setJobs] = useState<LatestJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, category_slug, city, created_at, job_images(image_url)')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        setJobs((data || []) as unknown as LatestJob[]);
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
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Najnoviji projekti koje klijenti objavljuju</h2>
          </div>
          <Link
            href="/poslovi/"
            className="text-xs md:text-sm font-semibold text-white/60 hover:text-brand-orange transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Pogledaj sve <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {jobs.map((job) => (
              <LatestAdCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
