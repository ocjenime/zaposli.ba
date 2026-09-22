'use client';

import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  Heart,
  ArrowRight,
  Send,
  Tag,
  Loader2,
  Lock,
} from 'lucide-react';
import { categories } from '@/lib/data';
import { plural } from '@/lib/plural';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import ShareButtons from '@/components/ShareButtons';
import { useMemo, useState } from 'react';

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

export function formatBudget(job: ProjectListCardJob) {
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
  expanded?: boolean;
  onToggleExpand?: (jobId: string, nextExpanded: boolean) => void;
  className?: string;
}

export default function ProjectListCard({
  job,
  detailHref,
  onSendOffer,
  expanded,
  onToggleExpand,
  className = '',
}: ProjectListCardProps) {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const category = categories.find((c) => c.slug === job.category_slug);
  const imageUrl = job.job_images?.[0]?.image_url;
  const [liked, setLiked] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded = expanded !== undefined ? expanded : internalExpanded;

  const isFirm = useMemo(() => isFirmRole(role), [role]);

  function toggleExpand() {
    const next = !isExpanded;
    if (onToggleExpand) {
      onToggleExpand(job.id, next);
    } else {
      setInternalExpanded(next);
    }
  }

  function handleRowKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  }

  function handleBid(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (authLoading) return;

    if (!user) {
      router.push(`/registracija/?redirectTo=${encodeURIComponent('/poslovi/')}`);
      return;
    }

    if (!isFirm) return;

    if (onSendOffer) {
      onSendOffer(job);
    } else {
      router.push(`/dashboard/firma/?expandJobId=${job.id}`);
    }
  }

  const ctaLabel = useMemo(() => {
    if (authLoading) return 'Učitavanje';
    if (!user) return 'Prijavi se';
    if (!isFirm) return 'Samo firme';
    return 'Pošalji ponudu';
  }, [authLoading, user, isFirm]);

  const ctaDisabled = authLoading || (!!user && !isFirm);

  return (
    <div
      className={`group flex flex-col bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Main row - clickable to expand */}
      <div
        onClick={toggleExpand}
        onKeyDown={handleRowKeyDown}
        tabIndex={0}
        className="flex flex-row cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 p-2.5 sm:p-3 gap-2.5 sm:gap-3"
      >
        {/* Image - fixed square with rounded corners */}
        <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 bg-gray-100 dark:bg-ink-950 overflow-hidden rounded-xl">
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
        <div className="flex-1 min-w-0 py-0.5 sm:py-1 flex flex-col">
          <span className="inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-orange-50 dark:bg-orange-500/10 text-brand-orange border border-orange-100 dark:border-orange-500/20 mb-1">
            {category?.icon && <category.icon className="w-3 h-3" />}
            {category?.name || job.category_slug}
          </span>
          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900 dark:text-[#ffffff] leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 mb-1">
            {job.title}
          </h3>

          {job.description && (
            <p className="hidden sm:block text-xs md:text-sm text-gray-600 dark:text-[#ffffff]/70 leading-relaxed mb-1 line-clamp-1">
              {job.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-gray-500 dark:text-[#ffffff]/60">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.city}
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {relativeTime(job.created_at)}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-[#ffffff] mt-1">
            {formatBudget(job)}
          </p>
        </div>

        {/* Right meta column */}
        <div className="w-[7rem] sm:w-36 md:w-44 shrink-0 flex flex-col border-l border-gray-100 dark:border-ink-800 pl-2.5 sm:pl-4">
          <div className="flex items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
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
              className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-colors ${
                liked
                  ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-500/15 dark:border-red-500/30'
                  : 'bg-white border-gray-100 text-gray-300 hover:text-red-500 dark:bg-ink-800 dark:border-ink-700 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="text-center mt-1 sm:mt-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-[#ffffff] leading-none">
              {job.bids_count || 0}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-[#ffffff]/60">
              {plural(job.bids_count || 0, ['ponuda', 'ponude', 'ponuda'])}
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-auto pt-1 inline-flex items-center justify-center gap-1 px-2 py-2 sm:py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-[11px] sm:text-xs transition-all active:scale-95"
          >
            Pogledaj posao
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Expandable detail panel */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-gray-100 dark:border-ink-800 bg-gray-50/70 dark:bg-ink-950/60">
            <div className="p-3 sm:p-5">
              {job.job_images && job.job_images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {job.job_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-ink-800 bg-gray-100 dark:bg-ink-900"
                    >
                      <NextImage
                        src={img.image_url}
                        alt={`Slika ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-1.5">
                    Detalji posla
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-[#ffffff]/80 leading-relaxed whitespace-pre-line">
                    {job.description || 'Nema dodatnog opisa.'}
                  </p>
                </div>

                <div className="w-full lg:w-72 shrink-0 space-y-3">
                  <div className="bg-white dark:bg-ink-900 rounded-xl border border-gray-100 dark:border-ink-800 p-3.5 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-[#ffffff]/60">Budžet</span>
                      <span className="font-semibold text-gray-900 dark:text-[#ffffff]">
                        {formatBudget(job)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-[#ffffff]/60">Lokacija</span>
                      <span className="font-semibold text-gray-900 dark:text-[#ffffff]">
                        {job.city}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-[#ffffff]/60">Objavljeno</span>
                      <span className="font-semibold text-gray-900 dark:text-[#ffffff]">
                        {relativeTime(job.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-[#ffffff]/60">Ponuda</span>
                      <span className="font-semibold text-gray-900 dark:text-[#ffffff]">
                        {job.bids_count}{' '}
                        {plural(job.bids_count || 0, ['ponuda', 'ponude', 'ponuda'])}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBid}
                    disabled={ctaDisabled}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors active:scale-95 ${
                      ctaDisabled
                        ? 'bg-gray-100 dark:bg-ink-800 text-gray-400 dark:text-[#ffffff]/40 cursor-not-allowed'
                        : 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-md shadow-brand-orange/20'
                    }`}
                  >
                    {authLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : !user ? (
                      <ArrowRight className="w-4 h-4" />
                    ) : !isFirm ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {ctaDisabled && !authLoading && user && !isFirm
                      ? 'Samo firme i majstori mogu slati ponude'
                      : ctaLabel}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand();
                    }}
                    className="w-full text-center text-xs font-medium text-gray-500 dark:text-[#ffffff]/60 hover:text-gray-900 dark:hover:text-[#ffffff] transition-colors py-1"
                  >
                    Zatvori detalje
                  </button>

                  <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1 pt-1">
                    <Link
                      href={`/posao/${job.id}/`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
                    >
                      Otvori stranicu posla
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <ShareButtons compact title={job.title} path={`/posao/${job.id}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
