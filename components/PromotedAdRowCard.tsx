'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useState } from 'react';
import {
  MapPin,
  Clock,
  ArrowRight,
  Crown,
  Users,
  Sparkles,
  Star,
  Calendar,
} from 'lucide-react';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getAdTypeLabel } from '@/lib/promoted-ads';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LogoDisplay from '@/components/ui/LogoDisplay';
import { formatDate } from '@/lib/date';
import { plural } from '@/lib/plural';

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

interface PromotedAdRowCardProps {
  ad: PublicPromotedAd;
  expanded?: boolean;
  onToggleExpand?: (adId: string, nextExpanded: boolean) => void;
  className?: string;
}

export default function PromotedAdRowCard({
  ad,
  expanded,
  onToggleExpand,
  className = '',
}: PromotedAdRowCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  const detailHref = `/izdvojeni-oglasi/${ad.id}/`;

  const isWorkerSearch = ad.ad_type === 'worker_search';
  const bannerUrl = ad.banner_url || ad.image_url;
  const firm = ad.firms;
  const rating = firm?.average_rating ?? 0;
  const reviewCount = firm?.review_count ?? 0;

  function toggleExpand() {
    const next = !isExpanded;
    if (onToggleExpand) {
      onToggleExpand(ad.id, next);
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

  return (
    <div
      className={`group flex flex-col bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Main row - clickable to expand */}
      <div
        onClick={toggleExpand}
        onKeyDown={handleRowKeyDown}
        tabIndex={0}
        className="flex flex-row cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
      >
        {/* Image - fixed square, compact */}
        <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:aspect-square shrink-0 bg-gray-100 dark:bg-ink-950 overflow-hidden">
          {bannerUrl ? (
            <NextImage
              src={bannerUrl}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 144px, 176px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-ink-950 dark:to-ink-900">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-ink-800 shadow-sm flex items-center justify-center">
                {isWorkerSearch ? (
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                ) : (
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center content */}
        <div className="flex-1 min-w-0 p-2.5 sm:p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-gray-900 dark:text-[#ffffff] leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 sm:line-clamp-3 md:line-clamp-none mb-1">
              {ad.title}
            </h3>

            <p className="hidden sm:block text-xs md:text-sm text-gray-600 dark:text-[#ffffff]/70 leading-relaxed mb-1.5 line-clamp-1 md:line-clamp-2">
              {ad.description}
            </p>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold border ${
                isWorkerSearch
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20'
                  : 'bg-orange-50 dark:bg-orange-500/10 text-brand-orange border-orange-100 dark:border-orange-500/20'
              }`}
            >
              {isWorkerSearch ? <Users className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              {getAdTypeLabel(ad.ad_type)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[10px] sm:text-xs text-gray-600 dark:text-[#ffffff]/60">
            {firm?.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {firm.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {relativeTime(ad.created_at)}
            </span>
            {reviewCount > 0 && (
              <span className="inline-flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Right meta column */}
        <div className="w-[6.5rem] sm:w-36 md:w-44 shrink-0 flex flex-col justify-between items-stretch p-2.5 sm:p-4 border-l border-gray-100 dark:border-ink-800">
          <div className="flex items-center justify-end">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20">
              <Crown className="w-3 h-3" />
              Sponzorirano
            </span>
          </div>

          <div className="text-right mt-1 sm:mt-2">
            <div className="text-[11px] sm:text-sm font-bold text-gray-900 dark:text-[#ffffff] leading-tight truncate">
              {firm?.name || 'Firma'}
            </div>
            {ad.ends_at && (
              <div className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] text-gray-600 dark:text-[#ffffff]/60">
                <Calendar className="w-3 h-3" />
                do {formatDate(ad.ends_at)}
              </div>
            )}
          </div>

          <Link
            href={detailHref}
            onClick={(e) => e.stopPropagation()}
            className="w-full mt-1.5 inline-flex items-center justify-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs transition-colors active:scale-95 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
          >
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Pogledaj oglas
          </Link>
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
              {bannerUrl && (
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-gray-200 dark:border-ink-800 bg-gray-100 dark:bg-ink-900 mb-4">
                  <NextImage
                    src={bannerUrl}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-1.5">
                    O oglasu
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-[#ffffff]/80 leading-relaxed whitespace-pre-line">
                    {ad.description}
                  </p>
                </div>

                <div className="w-full lg:w-72 shrink-0 space-y-3">
                  {firm && (
                    <div className="bg-white dark:bg-ink-900 rounded-xl border border-gray-100 dark:border-ink-800 p-3.5 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <LogoDisplay
                          name={firm.name || 'Firma'}
                          src={firm.logo_url}
                          alt={firm.name || 'Firma'}
                          size="sm"
                          rounded="xl"
                          className="shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-gray-900 dark:text-[#ffffff] truncate">
                              {firm.name}
                            </p>
                            {firm.verified && <VerifiedBadge size="sm" showLabel={false} className="shrink-0" />}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-600 dark:text-[#ffffff]/60">
                            {firm.city && <span>{firm.city}</span>}
                            {reviewCount > 0 && (
                              <span className="inline-flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {rating.toFixed(1)} ({reviewCount}{' '}
                                {plural(reviewCount, ['recenzija', 'recenzije', 'recenzija'])})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href={detailHref}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors active:scale-95 bg-brand-orange hover:bg-brand-orange-dark text-white shadow-md shadow-brand-orange/20"
                  >
                    Pogledaj oglas
                    <ArrowRight className="w-4 h-4" />
                  </Link>

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
