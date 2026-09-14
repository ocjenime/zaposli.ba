'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
          if (row.city) set.add(row.city.trim().toLowerCase());
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
        const firmAvailable = hasFirms.has(city.name.toLowerCase());
        return (
          <Link
            key={city.slug}
            href={`/gradovi/${city.slug}/`}
            className="group relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60 p-5 hover:border-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/5 transition-all duration-300 active:scale-[0.98]"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${
                firmAvailable ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            <div className="flex items-center gap-4 pl-2">
              <div className="w-12 h-12 bg-ink-800 border border-ink-700 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate group-hover:text-brand-orange transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs text-white/60">Pogledajte majstore</p>
              </div>
            </div>
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        );
      })}
    </div>
  );
}
