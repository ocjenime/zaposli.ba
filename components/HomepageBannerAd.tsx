'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicPromotedAd } from '@/lib/promoted-ads';
import { getPromotedAdHref } from '@/lib/promoted-ads';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

export default function HomepageBannerAd() {
  const [ad, setAd] = useState<PublicPromotedAd | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAd() {
      try {
        const { data, error } = await supabase
          .from('promoted_ads')
          .select(
            'id,title,description,image_url,banner_url,cta_url,ad_type,destination,ends_at,created_at,firms(name,slug,city,logo_url,verified)'
          )
          .eq('status', 'active')
          .eq('destination', 'homepage_banner')
          .gt('ends_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setAd((data as unknown as PublicPromotedAd) || null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load homepage banner ad:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAd();
  }, []);

  if (loading || !ad) return null;

  const firm = ad.firms;
  const bannerUrl = ad.banner_url || ad.image_url;
  const href = getPromotedAdHref(ad);

  return (
    <section className="relative py-6 md:py-8 bg-cloud px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <Link
          href={href}
          className="group relative flex flex-col lg:flex-row lg:items-center overflow-hidden rounded-2xl lg:rounded-3xl bg-ink-900 border border-ink-800 shadow-2xl shadow-black/20 min-h-[14rem] lg:min-h-[16rem]"
        >
          {/* Background banner */}
          {bannerUrl ? (
            <NextImage
              src={bannerUrl}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="100vw"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Content */}
          <div className="relative z-10 flex-1 p-6 md:p-8 lg:p-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-brand-orange uppercase mb-3">
              <Crown className="w-3.5 h-3.5" />
              Sponzorirano
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight line-clamp-2">
              {ad.title}
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-2xl line-clamp-2 mb-4">
              {ad.description}
            </p>

            <div className="flex items-center gap-3">
              <LogoDisplay
                name={firm?.name || 'Firma'}
                src={firm?.logo_url}
                alt={firm?.name || 'Firma'}
                size="sm"
                rounded="lg"
                className="border border-white/10"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white">{firm?.name || 'Firma'}</span>
                  {firm?.verified && <VerifiedBadge size="sm" className="shrink-0 border-transparent bg-transparent px-0 py-0" />}
                </div>
                {firm?.city && <span className="text-xs text-white/60">{firm.city}</span>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative z-10 p-6 md:p-8 lg:p-10 lg:pl-0 flex items-center">
            <span className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-brand-orange/30">
              Pogledaj oglas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
