'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface Firm {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  description: string | null;
  specialty?: string;
}

interface FirmCategory {
  firm_id: string;
  category_slug: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function FeaturedWorkers() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFirms() {
      try {
        const { data: firmData } = await supabase
          .from('firms')
          .select('id, name, slug, city, logo_url, verified, average_rating, review_count, description')
          .not('slug', 'like', 'test-%')
          .order('review_count', { ascending: false })
          .limit(10);

        if (!firmData || firmData.length === 0) return;

        const { data: catData } = await supabase
          .from('firm_categories')
          .select('firm_id, category_slug');

        const categoryMap = (catData || []).reduce<Record<string, string[]>>((acc, row: unknown) => {
          const fc = row as FirmCategory;
          acc[fc.firm_id] = acc[fc.firm_id] || [];
          acc[fc.firm_id].push(fc.category_slug);
          return acc;
        }, {});

        const firmsWithCategory = (firmData as unknown as Firm[]).map((f) => {
          const slugs = categoryMap[f.id] || [];
          const primarySlug = slugs[0];
          const category = primarySlug ? getCategory(primarySlug) : null;
          return { ...f, specialty: category?.name || 'Razne usluge' };
        });

        setFirms(firmsWithCategory);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }

    loadFirms();
  }, []);

  if (!loading && firms.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-50 rounded-full opacity-60 blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cloud rounded-full opacity-80 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
            Naši najbolji
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Top firme
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Provjereni profesionalci sa najboljim ocjenama na našoj platformi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4" />
                <div className="w-24 h-4 bg-gray-200 rounded mx-auto mb-1" />
                <div className="w-20 h-3 bg-gray-200 rounded mx-auto mb-3" />
                <div className="flex items-center justify-center gap-1 mb-2">
                  <div className="w-12 h-3 bg-gray-200 rounded" />
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded mx-auto mb-3" />
                <div className="w-20 h-5 bg-gray-200 rounded-lg mx-auto" />
              </div>
            ))
          ) : (
            firms.slice(0, 5).map((firm) => (
              <Link
                key={firm.id}
                href={`/firma-profil/${firm.slug}/`}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 text-center cursor-pointer block"
              >
              {firm.logo_url ? (
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Image
                    src={firm.logo_url}
                    alt={firm.name}
                    fill
                    sizes="64px"
                    className="rounded-2xl object-cover border border-gray-100"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-extrabold text-xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {getInitials(firm.name)}
                </div>
              )}

              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{firm.name}</h3>
              <p className="text-xs text-steel mb-3">{firm.specialty}</p>

              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                <span className="text-sm font-bold text-gray-900">
                  {(firm.average_rating || 0).toFixed(1)}
                </span>
                <span className="text-xs text-steel">({firm.review_count || 0})</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-steel mb-3">
                <MapPin className="w-3 h-3" />
                <span>{firm.city || 'BiH'}</span>
              </div>

              {firm.verified && (
                <div className="flex justify-center">
                  <VerifiedBadge size="sm" />
                </div>
              )}
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/top-firme/"
            className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors group"
          >
            Pogledajte sve majstore
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
