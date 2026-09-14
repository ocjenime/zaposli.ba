'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { Sparkles, Users, MapPin, ArrowRight } from 'lucide-react';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getPromotedAdHref, getAdTypeLabel } from '@/lib/promoted-ads';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface PromotedAdCardProps {
  ad: PublicPromotedAd;
  variant?: 'default' | 'compact';
}

export default function PromotedAdCard({ ad, variant = 'default' }: PromotedAdCardProps) {
  const href = getPromotedAdHref(ad);
  const isWorkerSearch = ad.ad_type === 'worker_search';

  return (
    <Link
      href={href}
      target={ad.cta_url ? '_blank' : undefined}
      rel={ad.cta_url ? 'noopener noreferrer' : undefined}
      className="group relative flex flex-col h-full rounded-2xl bg-ink-900/60 backdrop-blur-md border border-ink-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-orange/10 hover:border-brand-orange/30"
    >
      {/* Top brand accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange opacity-80" />

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-950">
        {ad.image_url ? (
          <NextImage
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-900 to-ink-950">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
              {isWorkerSearch ? (
                <Users className="w-8 h-8 text-brand-orange" />
              ) : (
                <Sparkles className="w-8 h-8 text-brand-orange" />
              )}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
            isWorkerSearch
              ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
              : 'bg-brand-orange/20 text-orange-100 border-brand-orange/30'
          }`}
        >
          {isWorkerSearch ? <Users className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {getAdTypeLabel(ad.ad_type)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {ad.title}
        </h3>
        <p className="text-sm text-white/70 line-clamp-2 mb-4 flex-1">
          {ad.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
          <span className="font-semibold text-white/90">
            {ad.firms?.name || 'Firma'}
          </span>
          {ad.firms?.verified && <VerifiedBadge size="sm" className="border-white/10" />}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {ad.firms?.city ? (
            <span className="inline-flex items-center gap-1 text-xs text-white/50">
              <MapPin className="w-3.5 h-3.5" />
              {ad.firms.city}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange group-hover:gap-2 transition-all">
            {ad.cta_url ? 'Posjeti' : 'Profil'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
