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
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min && job.budget_max)
    return `${job.budget_min.toLocaleString('bs')} - ${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Budžet po dogovoru';
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
  const firmUser = isFirmRole(role);
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
    if (!user) return 'Pošalji ponudu';
    if (!isFirmRole(role)) return 'Moj dashboard';
    return 'Pošalji ponudu';
  }, [user, role]);

  function handleOfferClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onSendOffer) {
      onSendOffer(job);
    } else {
      // Fallback navigation for static contexts
      if (typeof window !== 'undefined') {
        window.location.href = ctaHref;
      }
    }
  }

  return (
    <Link
      href={href}
      className={`group flex flex-col sm:flex-row bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <div className="relative w-full sm:w-52 md:w-60 lg:w-72 shrink-0 aspect-[16/10] sm:aspect-square bg-gray-100 dark:bg-ink-950 overflow-hidden">
        {imageUrl ? (
          <NextImage
            src={imageUrl}
            alt={job.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 280px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-ink-950 dark:to-ink-900">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-ink-800 shadow-sm flex items-center justify-center">
              {category?.icon ? (
                <category.icon className="w-7 h-7 text-brand-orange" />
              ) : (
                <Tag className="w-7 h-7 text-brand-orange" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row flex-1 p-4 sm:p-5 md:p-6 gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
            {job.title}
          </h3>

          {job.description && (
            <p className="text-sm text-steel dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
              {job.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-500/10 text-brand-orange border border-orange-100 dark:border-orange-500/20">
              {category?.icon && <category.icon className="w-3.5 h-3.5" />}
              {category?.name || job.category_slug}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-steel dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.city}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {relativeTime(job.created_at)}
            </span>
          </div>
        </div>

        {/* Right meta column */}
        <div className="sm:w-44 md:w-52 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-ink-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20">
              Otvoreno
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLiked((v) => !v);
              }}
              aria-label={liked ? 'Ukloni iz spašenih' : 'Sačuvaj oglas'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                liked
                  ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-500/15 dark:border-red-500/30'
                  : 'bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 dark:bg-ink-800 dark:border-ink-700 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="text-right">
            <div className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
              {formatBudget(job)}
            </div>
            <div className="text-xs text-steel dark:text-gray-400 mt-0.5">
              {job.bids_count} {plural(job.bids_count || 0, ['ponuda', 'ponude', 'ponuda'])}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOfferClick}
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors active:scale-95"
          >
            <Send className="w-4 h-4" />
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function ProjectListCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden animate-pulse">
      <div className="w-full sm:w-52 md:w-60 lg:w-72 shrink-0 aspect-[16/10] sm:aspect-square bg-gray-200 dark:bg-ink-950" />
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-3">
        <div className="w-2/3 h-5 bg-gray-200 dark:bg-ink-800 rounded" />
        <div className="w-full h-4 bg-gray-200 dark:bg-ink-800 rounded" />
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-ink-800 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="w-24 h-4 bg-gray-200 dark:bg-ink-800 rounded" />
          <div className="w-20 h-4 bg-gray-200 dark:bg-ink-800 rounded" />
        </div>
      </div>
    </div>
  );
}
