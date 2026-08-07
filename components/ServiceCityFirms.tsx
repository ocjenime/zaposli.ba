'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LogoDisplay from '@/components/ui/LogoDisplay';

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

interface ServiceCityFirmsProps {
  categorySlug: string;
  cityName: string;
  profession: string;
}

export default function ServiceCityFirms({ categorySlug, cityName, profession }: ServiceCityFirmsProps) {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFirms() {
      setLoading(true);
      setError('');
      try {
        const { data: firmData, error: firmError } = await supabase
          .from('firm_categories')
          .select('firm_id')
          .eq('category_slug', categorySlug);

        if (firmError) throw firmError;

        const firmIds = (firmData || []).map((row: unknown) => (row as FirmCategory).firm_id);
        if (firmIds.length === 0) {
          setFirms([]);
          setLoading(false);
          return;
        }

        const { data: firmsData, error: firmsError } = await supabase
          .from('firms')
          .select('id, name, slug, city, logo_url, verified, average_rating, review_count, description')
          .in('id', firmIds)
          .eq('city', cityName)
          .not('slug', 'like', 'test-%')
          .order('verified', { ascending: false })
          .order('average_rating', { ascending: false });

        if (firmsError) throw firmsError;

        const category = getCategory(categorySlug);
        const typed = (firmsData || []) as unknown as Firm[];
        setFirms(
          typed.map((f) => ({
            ...f,
            specialty: category?.name || 'Razne usluge',
          }))
        );
      } catch (err: any) {
        setError(err?.message || 'Greška pri učitavanju firmi.');
      } finally {
        setLoading(false);
      }
    }

    loadFirms();
  }, [categorySlug, cityName]);

  if (loading) {
    return (
      <section className="py-14 bg-white">
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
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (firms.length === 0) {
    return (
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-cloud rounded-2xl p-8 md:p-10 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-brand-orange" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Još uvijek nema registrovanih {profession.toLowerCase()} u {cityName}
            </h2>
            <p className="text-steel max-w-xl mx-auto mb-6">
              Firme se aktivno registruju. Objavite posao besplatno i prve provjerene ponude stižu u roku od 24 sata.
            </p>
            <Link
              href={`/objavi-projekat/?service=${encodeURIComponent(getCategory(categorySlug)?.name || profession)}&city=${encodeURIComponent(cityName)}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              Objavi posao besplatno
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {profession} u {cityName}
            </h2>
            <p className="text-sm text-steel mt-1">
              Pronađeno {firms.length} {firms.length === 1 ? 'firma' : firms.length < 5 ? 'firme' : 'firmi'}
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
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer block"
            >
              <div className="flex items-start gap-4 mb-4">
                <LogoDisplay
                  name={firm.name}
                  src={firm.logo_url}
                  alt={firm.name}
                  size="lg"
                  rounded="2xl"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{firm.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-steel mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{firm.city || 'BiH'}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-steel line-clamp-2 mb-4 min-h-[2.5rem]">
                {firm.description || firm.specialty}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <span className="text-sm font-bold text-gray-900">
                    {(firm.average_rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-steel">({firm.review_count || 0})</span>
                </div>
                {firm.verified && <VerifiedBadge size="sm" />}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/objavi-projekat/"
            className="block w-full text-center bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 py-3 rounded-xl font-semibold text-sm"
          >
            Objavi posao besplatno
          </Link>
        </div>
      </div>
    </section>
  );
}
