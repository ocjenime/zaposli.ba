'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Crown, Loader2, MapPin, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import { plural } from '@/lib/plural';
import LogoDisplay from '@/components/ui/LogoDisplay';
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
  plan_priority: number;
}

/**
 * Ranking: ocjena je ključna, verifikacija i aktivni paket su pojačivači.
 * score = average_rating (0-5) + verified 0.5 + plan_priority (0-0.4)
 */
function score(f: Firm): number {
  return (f.average_rating || 0) + (f.verified ? 0.5 : 0) + (f.plan_priority || 0);
}

const LIMIT = 12;

export default function CategoryFirms({ categorySlug }: { categorySlug: string }) {
  const category = getCategory(categorySlug);
  const profession = category?.profession || 'majstori';
  const [firms, setFirms] = useState<Firm[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data: catRows, error: catError } = await supabase
          .from('firm_categories')
          .select('firm_id')
          .eq('category_slug', categorySlug);
        if (catError) throw catError;

        const ids = (catRows || []).map((r: { firm_id: string }) => r.firm_id);
        if (ids.length === 0) {
          if (!cancelled) {
            setFirms([]);
            setTotal(0);
            setLoading(false);
          }
          return;
        }
        if (!cancelled) setTotal(ids.length);

        const limited = ids.slice(0, 150);
        const { data: firmsData, error: firmsError } = await supabase
          .from('firms')
          .select('id, name, slug, city, logo_url, verified, average_rating, review_count, description, plan_priority')
          .in('id', limited)
          .not('slug', 'like', 'test-%');
        if (firmsError) throw firmsError;

        const typed = (firmsData || []) as Firm[];
        const ranked = typed.sort((a, b) => score(b) - score(a)).slice(0, LIMIT);
        if (!cancelled) {
          setFirms(ranked as Firm[]);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Greška pri učitavanju firmi.');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  if (loading) {
    return (
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12 text-steel">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Učitavanje firmi...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
        </div>
      </section>
    );
  }

  if (firms.length === 0) {
    return (
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-cloud rounded-2xl p-8 md:p-10 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-brand-orange" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Firme u kategoriji {profession} se registruju
            </h2>
            <p className="text-steel max-w-xl mx-auto mb-6">
              Objavite posao besplatno i prve provjerene ponude stižu u roku od 24 sata.
            </p>
            <Link href="/objavi-projekat/" className="btn-primary inline-flex items-center gap-2">
              Objavi posao besplatno
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
              Najbolje ocijenjene
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {profession} širom BiH
            </h2>
            <p className="text-sm text-steel mt-1">
              Pronađeno {total} {plural(total, ['firma', 'firme', 'firmi'])} · sortirano po ocjeni
            </p>
          </div>
          <Link
            href="/objavi-projekat/"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
          >
            Objavi posao
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {firms.map((firm) => (
            <Link
              key={firm.id}
              href={`/firma-profil/${firm.slug}/`}
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 block"
            >
              <div className="flex items-start gap-4 mb-4">
                <LogoDisplay name={firm.name} src={firm.logo_url} alt={firm.name} size="lg" rounded="2xl" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                    {firm.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-steel mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{firm.city || 'BiH'}</span>
                  </div>
                </div>
                {firm.plan_priority >= 0.4 && (
                  <span
                    className="shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-extrabold tracking-wide px-2 py-1 rounded-full shadow-sm"
                    title="Premium član"
                  >
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </span>
                )}
              </div>

              <p className="text-sm text-steel line-clamp-2 mb-4 min-h-[2.5rem]">
                {firm.description || 'Provjerena firma na Zaposli.ba.'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <span className="text-sm font-bold text-gray-900">
                    {(firm.average_rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-steel">
                    ({firm.review_count || 0} {plural(firm.review_count || 0, ['recenzija', 'recenzije', 'recenzija'])})
                  </span>
                </div>
                {firm.verified && <VerifiedBadge size="sm" />}
              </div>
            </Link>
          ))}
        </div>

        {total > LIMIT && (
          <p className="text-xs text-steel text-center mt-6">
            Prikazano prvih {LIMIT} firmi po ranking formuli: ocjena + verifikacija + aktivni paket.
          </p>
        )}
      </div>
    </section>
  );
}
