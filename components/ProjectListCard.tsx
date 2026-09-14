'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { MapPin, Clock, Heart, ArrowRight, Send, Tag } from 'lucide-react';
import { categories } from '@/lib/data';
import { plural } from '@/lib/plural';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { useState, useMemo } from 'react';

interface JobImage {
  image_url: string;
}

export interface ProjectListCardJob {
  id: string;
  title: string;
  description?: string | null;
  category_slug: string;
  city: string;
  created_at: string;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  bids_count: number;
  job_images?: JobImage[] | null;
  is_featured?: boolean | null;
  featured_until?: string | null;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 5) return 'Upravo sada';
  if (minutes < 60) return `Prije ${minutes} min`;
  if (hours < 24) return `Prije ${hours} ${plural(hours, ['sat', 'sata', 'sati'])}`;
  if (days === 1) return 'Prije 1 dan';
  return `Prije ${days} dana`;
}

function formatBudget(job: ProjectListCardJob) {
  if (job.budget_mode === 'open') return 'Majstori predlažu';
  if (job.budget_min && job.budget_max)
    return `${job.budget_min.toLocaleString('bs')} - ${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Po dogovoru';
}

interface ProjectListCardProps {
  job: ProjectListCardJob;
  detailHref?: string;
  onSendOffer?: (job: ProjectListCardJob) => void;
  className?: string;
}

export default function ProjectListCard({
  job,
  detailHref,
  onSendOffer,
  className = '',
}: ProjectListCardProps) {
  const { user, role } = useAuth();
  const category = categories.find((c) => c.slug === job.category_slug);
  const imageUrl = job.job_images?.[0]?.image_url;
  const [liked, setLiked] = useState(false);

  const href = detailHref || `/poslovi/?expandId=${job.id}`;

  const ctaHref = useMemo(() => {
    if (!user) return '/registracija/';
    if (!isFirmRole(role)) return '/dashboard/';
    return `/dashboard/firma/?expandJobId=${job.id}`;
  }, [user, role, job.id]);

  const ctaLabel = useMemo(() => {
    if (!user) return 'Ponuda';
    if (!isFirmRole(role)) return 'Dashboard';
    return 'Pošalji';
  }, [user, role]);

  function handleOfferClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onSendOffer) {
      onSendOffer(job);
    } else if (typeof window !== 'undefined') {
      window.location.href = ctaHref;
    }
  }

  return (
    <Link
      href={href}
      className={`group flex flex-row bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Image - fixed square, compact */}
      <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:aspect-square shrink-0 bg-gray-100 dark:bg-ink-950 overflow-hidden">
        {imageUrl ? (
          <NextImage
            src={imageUrl}
            alt={job.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 96px, (max-width: 768px) 144px, 176px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-ink-950 dark:to-ink-900">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-ink-800 shadow-sm flex items-center justify-center">
              {category?.icon ? (
                <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
              ) : (
                <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Center content */}
      <div className="flex-1 min-w-0 p-2.5 sm:p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-brand-orange transition-colors line-clamp-1 sm:line-clamp-2 mb-1">
            {job.title}
          </h3>

          {job.description && (
            <p className="hidden sm:block text-xs md:text-sm text-steel dark:text-gray-300 leading-relaxed mb-1.5 line-clamp-1 md:line-clamp-2">
              {job.description}
            </p>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-orange-50 dark:bg-orange-500/10 text-brand-orange border border-orange-100 dark:border-orange-500/20">
            {category?.icon && <category.icon className="w-3 h-3" />}
            {category?.name || job.category_slug}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[10px] sm:text-xs text-steel dark:text-gray-400">
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

      {/* Right meta column */}
      <div className="w-[6.5rem] sm:w-36 md:w-44 shrink-0 flex flex-col justify-between items-stretch p-2.5 sm:p-4 border-l border-gray-100 dark:border-ink-800">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            aria-label={liked ? 'Ukloni iz spašenih' : 'Sačuvaj oglas'}
            className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-colors ${
              liked
                ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-500/15 dark:border-red-500/30'
                : 'bg-white border-gray-100 text-gray-300 hover:text-red-500 dark:bg-ink-800 dark:border-ink-700 dark:hover:text-red-400'
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${liked ? 'fill-current' : ''}`} />
          </button>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20">
            Otvoreno
          </span>
        </div>

        <div className="text-right mt-1 sm:mt-2">
          <div className="text-[11px] sm:text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight">
            {formatBudget(job)}
          </div>
          <div className="text-[9px] sm:text-[11px] text-steel dark:text-gray-400">
            {job.bids_count} {plural(job.bids_count || 0, ['ponuda', 'ponude', 'ponuda'])}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOfferClick}
          className="w-full mt-1.5 inline-flex items-center justify-center gap-1 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs transition-colors active:scale-95"
        >
          <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Pošalji ponudu</span>
          <span className="sm:hidden">{ctaLabel}</span>
          <ArrowRight className="w-3 h-3 hidden sm:block" />
        </button>
      </div>
    </Link>
  );
}

export function ProjectListCardSkeleton() {
  return (
    <div className="flex flex-row bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden animate-pulse">
      <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:aspect-square shrink-0 bg-gray-200 dark:bg-ink-950" />
      <div className="flex-1 p-2.5 sm:p-4 space-y-2">
        <div className="w-2/3 h-4 bg-gray-200 dark:bg-ink-800 rounded" />
        <div className="hidden sm:block w-full h-3 bg-gray-200 dark:bg-ink-800 rounded" />
        <div className="w-20 h-3 bg-gray-200 dark:bg-ink-800 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="w-16 h-3 bg-gray-200 dark:bg-ink-800 rounded" />
          <div className="w-14 h-3 bg-gray-200 dark:bg-ink-800 rounded" />
        </div>
      </div>
      <div className="w-24 sm:w-32 md:w-40 shrink-0 border-l border-gray-100 dark:border-ink-800 p-2.5 sm:p-4 space-y-2">
        <div className="w-12 h-3 bg-gray-200 dark:bg-ink-800 rounded self-end" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-ink-800 rounded self-end" />
        <div className="w-full h-7 bg-gray-200 dark:bg-ink-800 rounded" />
      </div>
    </div>
  );
}
