'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { normalizeCityName } from '@/lib/city-utils';

interface City {
  slug: string;
  name: string;
}

interface CityGridProps {
  cities: City[];
  initialHasFirms: string[]; // city names (lower-cased)
}

export default function CityGrid({ cities, initialHasFirms }: CityGridProps) {
  const [hasFirms, setHasFirms] = useState<Set<string>>(() => new Set(initialHasFirms));

  useEffect(() => {
    async function refresh() {
      try {
        const { data } = await supabase
          .from('firms')
          .select('city')
          .not('slug', 'like', 'test-%');
        const set = new Set<string>();
        (data || []).forEach((row: { city: string | null }) => {
          if (row.city) set.add(normalizeCityName(row.city));
        });
        setHasFirms(set);
      } catch {
        // keep initial values
      }
    }
    refresh();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cities.map((city) => {
        const firmAvailable = hasFirms.has(normalizeCityName(city.name));
        const gradient = firmAvailable
          ? 'from-emerald-50 to-white border-emerald-100 hover:shadow-emerald-100'
          : 'from-red-50 to-white border-red-100 hover:shadow-red-100';
        return (
          <Link
            key={city.slug}
            href={`/gradovi/${city.slug}/`}
            className={`group relative overflow-hidden rounded-2xl border p-5 shadow-card hover:shadow-xl transition-all duration-300 active:scale-[0.98] bg-gradient-to-br ${gradient}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate group-hover:text-brand-orange transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs text-steel">Pogledajte majstore</p>
              </div>
            </div>
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        );
      })}
    </div>
  );
}
