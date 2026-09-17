'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Calendar, Crown, MapPin, Sparkles, Star, Users } from 'lucide-react';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getAdTypeLabel } from '@/lib/promoted-ads';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LogoDisplay from '@/components/ui/LogoDisplay';
import { formatDate } from '@/lib/date';

interface PromotedAdListCardProps {
  ad: PublicPromotedAd;
}

export default function PromotedAdListCard({ ad }: PromotedAdListCardProps) {
  const isWorkerSearch = ad.ad_type === 'worker_search';
  const bannerUrl = ad.banner_url || ad.image_url;
  const firm = ad.firms;
  const rating = firm?.average_rating ?? 0;
  const reviewCount = firm?.review_count ?? 0;

  return (
    <Link
      href={`/izdvojeni-oglasi/${ad.id}/`}
      className="group relative flex flex-col h-full rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-orange/10 hover:border-brand-orange/30"
    >
      {/* Top brand accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange opacity-80 z-10" />

      {/* Banner */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-ink-950">
        {bannerUrl ? (
          <NextImage
            src={bannerUrl}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-900 to-ink-950">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              {isWorkerSearch ? (
                <Users className="w-6 h-6 text-brand-orange" />
              ) : (
                <Sparkles className="w-6 h-6 text-brand-orange" />
              )}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {/* Sponsored badge */}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/55 text-amber-200 backdrop-blur-md border border-white/10">
          <Crown className="w-3 h-3" />
          Sponzorirano
        </span>

        {/* Type badge */}
        <span
          className={`absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
            isWorkerSearch
              ? 'bg-blue-500/25 text-blue-50 border-blue-400/30'
              : 'bg-brand-orange/25 text-orange-50 border-brand-orange/30'
          }`}
        >
          {isWorkerSearch ? <Users className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {getAdTypeLabel(ad.ad_type)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 -mt-8 relative z-10">
            <LogoDisplay
              name={firm?.name || 'Firma'}
              src={firm?.logo_url}
              alt={firm?.name || 'Firma'}
              size="sm"
              rounded="xl"
              className="border-2 border-white dark:border-ink-800 shadow-lg"
            />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {firm?.name || 'Firma'}
              </p>
              {firm?.verified && <VerifiedBadge size="sm" showLabel={false} className="shrink-0" />}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-steel dark:text-white/60">
              {firm?.city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {firm.city}
                </span>
              )}
              {reviewCount > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {ad.title}
        </h3>
        <p className="text-sm text-steel dark:text-white/60 line-clamp-2 mb-4 flex-1">
          {ad.description}
        </p>

        <div className="flex items-center justify-between gap-3 pt-3 mt-auto border-t border-gray-100 dark:border-ink-800">
          {ad.ends_at ? (
            <span className="inline-flex items-center gap-1 text-xs text-steel dark:text-white/50">
              <Calendar className="w-3.5 h-3.5" />
              Aktivan do {formatDate(ad.ends_at)}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange group-hover:gap-2 transition-all whitespace-nowrap">
            Pogledaj oglas
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
