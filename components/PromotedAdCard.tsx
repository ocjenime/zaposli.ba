'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getPromotedAdHref, getAdTypeLabel } from '@/lib/promoted-ads';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LogoDisplay from '@/components/ui/LogoDisplay';

interface PromotedAdCardProps {
  ad: PublicPromotedAd;
}

export default function PromotedAdCard({ ad }: PromotedAdCardProps) {
  const href = getPromotedAdHref(ad);
  const isWorkerSearch = ad.ad_type === 'worker_search';
  const bannerUrl = ad.banner_url || ad.image_url;

  return (
    <Link
      href={href}
      target={ad.cta_url ? '_blank' : undefined}
      rel={ad.cta_url ? 'noopener noreferrer' : undefined}
      className="group relative flex flex-col h-full rounded-2xl bg-ink-900/60 backdrop-blur-md border border-ink-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-orange/10 hover:border-brand-orange/30"
    >
      {/* Top brand accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange opacity-80" />

      {/* Banner */}
      <div className="relative aspect-[3/1] overflow-hidden bg-ink-950">
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />

        {/* Type badge */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
            isWorkerSearch
              ? 'bg-blue-500/20 text-blue-100 border-blue-400/30'
              : 'bg-brand-orange/20 text-orange-100 border-brand-orange/30'
          }`}
        >
          {isWorkerSearch ? <Users className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {getAdTypeLabel(ad.ad_type)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 -mt-7 relative z-10">
            <LogoDisplay
              name={ad.firms?.name || 'Firma'}
              src={ad.firms?.logo_url}
              alt={ad.firms?.name || 'Firma'}
              size="sm"
              rounded="xl"
              className="border-2 border-ink-800 shadow-lg"
            />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white truncate">
                {ad.firms?.name || 'Firma'}
              </p>
              {ad.firms?.verified && <VerifiedBadge size="sm" className="border-white/10 shrink-0" />}
            </div>
            {ad.firms?.city && (
              <p className="text-xs text-white/50 truncate">{ad.firms.city}</p>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {ad.title}
        </h3>
        <p className="text-sm text-white/70 line-clamp-2 mb-4 flex-1">
          {ad.description}
        </p>

        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange group-hover:gap-2 transition-all">
          {ad.cta_url ? 'Posjeti' : 'Pogledaj oglas'}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
