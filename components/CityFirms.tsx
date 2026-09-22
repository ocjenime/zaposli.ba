'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, MapPin, ArrowRight, Loader2, Heart, SlidersHorizontal,
  ArrowUpDown, ChevronDown, LayoutGrid, Search, ListFilter,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategory, getCategoryShortName } from '@/lib/data';
import { normalizeCityName } from '@/lib/city-utils';
import { plural } from '@/lib/plural';
import { isCompanyName } from '@/lib/firm-utils';

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
  last_active_at: string | null;
}

function score(f: Firm): number {
  return (f.average_rating || 0) + (f.verified ? 0.5 : 0) + (f.plan_priority || 0);
}

const DISPLAY_LIMIT = 12;

export default function CityFirms({ cityName }: { cityName: string }) {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [portfolio, setPortfolio] = useState<Record<string, string[]>>({});
  const [firmCats, setFirmCats] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [minRating, setMinRating] = useState(0);
  const [catFilter, setCatFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const target = normalizeCityName(cityName);
        const { data: firmsData, error: firmsError } = await supabase
          .from('firms')
          .select('id, name, slug, city, logo_url, verified, average_rating, review_count, description, plan_priority, last_active_at')
          .not('city', 'is', null)
          .not('slug', 'like', 'test-%')
          .limit(200);
        if (firmsError) throw firmsError;

        const inCity = ((firmsData || []) as Firm[]).filter(
          (f) => normalizeCityName(f.city || '') === target
        );
        const ranked = inCity.sort((a, b) => score(b) - score(a));
        if (!cancelled) setFirms(ranked);

        const ids = ranked.map((f) => f.id);
        if (!cancelled && ids.length > 0) {
          const [{ data: catData }, { data: pf }] = await Promise.all([
            supabase.from('firm_categories').select('firm_id, category_slug').in('firm_id', ids),
            supabase
              .from('portfolio_images')
              .select('firm_id, image_url')
              .in('firm_id', ids.slice(0, 30)),
          ]);
          if (!cancelled) {
            const catMap: Record<string, string[]> = {};
            ((catData || []) as { firm_id: string; category_slug: string }[]).forEach((row) => {
              if (!catMap[row.firm_id]) catMap[row.firm_id] = [];
              catMap[row.firm_id].push(row.category_slug);
            });
            setFirmCats(catMap);
            const map: Record<string, string[]> = {};
            ((pf || []) as { firm_id: string; image_url: string }[]).forEach((row) => {
              if (!map[row.firm_id]) map[row.firm_id] = [];
              if (map[row.firm_id].length < 8) map[row.firm_id].push(row.image_url);
            });
            setPortfolio(map);
          }
        }
        if (!cancelled) setLoading(false);
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
  }, [cityName]);

  const availableCats = useMemo(() => {
    const slugs = new Set<string>();
    Object.values(firmCats).forEach((list) => list.forEach((s) => slugs.add(s)));
    return Array.from(slugs)
      .map((s) => getCategory(s))
      .filter((c): c is NonNullable<typeof c> => !!c)
      .sort((a, b) => getCategoryShortName(a).localeCompare(getCategoryShortName(b), 'bs'));
  }, [firmCats]);

  const filtered = useMemo(() => {
    let list = [...firms];
    if (minRating > 0) list = list.filter((f) => (f.average_rating || 0) >= minRating);
    if (catFilter !== 'all')
      list = list.filter((f) => (firmCats[f.id] || []).includes(catFilter));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    if (sort === 'rating') list.sort((a, b) => score(b) - score(a));
    if (sort === 'reviews') list.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'bs'));
    return list;
  }, [firms, sort, minRating, catFilter, query, firmCats]);

  const visible = filtered.slice(0, DISPLAY_LIMIT);
  const objaviHref = `/objavi-projekat/?city=${encodeURIComponent(cityName)}`;

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <section className="py-6 bg-white">
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
      <section className="py-6 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
        </div>
      </section>
    );
  }

  if (firms.length === 0) return null;

  const primaryCat = (firmId: string) => {
    const slugs = firmCats[firmId] || [];
    const cat = slugs.length > 0 ? getCategory(slugs[0]) : null;
    return cat ? getCategoryShortName(cat) : 'Razne usluge';
  };

  return (
    <section className="py-6 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="text-[22px] sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Firme i majstori u {cityName}
          </h2>
          <Link
            href="/top-firme/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-brand-orange transition-colors shrink-0 pt-1"
          >
            Pogledajte sve
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-sm text-steel mb-4">
          Pronađeno {firms.length} {plural(firms.length, ['firma', 'firme', 'firmi'])} · sortirano po ocjeni
        </p>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setShowSearch((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${showSearch ? 'border-brand-orange text-brand-orange bg-orange-50' : 'border-gray-200 text-gray-700 bg-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filteri
          </button>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white whitespace-nowrap cursor-pointer">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'rating' | 'reviews' | 'name')}
              className="bg-transparent outline-none cursor-pointer appearance-none pr-1"
              aria-label="Sortiraj firme"
            >
              <option value="rating">Sortiraj</option>
              <option value="rating">Najbolje ocijenjeni</option>
              <option value="reviews">Najviše recenzija</option>
              <option value="name">Naziv A-Z</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </label>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white whitespace-nowrap cursor-pointer">
            <Star className="w-4 h-4 text-gray-500" />
            <select
              value={String(minRating)}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-transparent outline-none cursor-pointer appearance-none pr-1"
              aria-label="Minimalna ocjena"
            >
              <option value="0">Ocjena</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </label>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white whitespace-nowrap cursor-pointer">
            <ListFilter className="w-4 h-4 text-gray-500" />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer appearance-none pr-1 max-w-[130px]"
              aria-label="Kategorija"
            >
              <option value="all">Kategorija</option>
              {availableCats.map((c) => (
                <option key={c.slug} value={c.slug}>{getCategoryShortName(c)}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </label>
        </div>

        {showSearch && (
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pretraži firme po imenu..."
              className="w-full bg-cloud border border-gray-100 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-cloud rounded-2xl p-8 text-center mb-4">
            <p className="font-bold text-gray-900 mb-1">Nema rezultata za odabrane filtere.</p>
            <p className="text-sm text-steel mb-4">Pokušajte sa blažim kriterijima ili objavite posao.</p>
            <button
              onClick={() => { setMinRating(0); setCatFilter('all'); setQuery(''); }}
              className="text-sm font-semibold text-brand-orange"
            >
              Poništi filtere
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-2">
            {visible.map((firm) => {
              const imgs = portfolio[firm.id] || [];
              const cover = imgs[0] || firm.logo_url || null;
              const count = imgs.length > 0 ? imgs.length : cover ? 1 : 0;
              const company = isCompanyName(firm.name);
              const rating = firm.average_rating || 0;
              const reviews = firm.review_count || 0;
              const fav = favorites.has(firm.id);
              return (
                <article
                  key={firm.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)] p-3 flex gap-3"
                >
                  <Link
                    href={`/firma-profil/${firm.slug}/`}
                    className="relative w-[96px] h-[96px] sm:w-[128px] sm:h-[128px] rounded-xl overflow-hidden bg-cloud shrink-0 block"
                  >
                    {cover ? (
                      <Image src={cover} alt={firm.name} fill sizes="150px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-brand-orange/40">
                        {firm.name.charAt(0)}
                      </span>
                    )}
                    {count > 0 && (
                      <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        <LayoutGrid className="w-3 h-3" />
                        1/{count}
                      </span>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/firma-profil/${firm.slug}/`}>
                        <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-base leading-tight line-clamp-2 hover:text-brand-orange transition-colors">
                          {firm.name}
                        </h3>
                      </Link>
                      <p className="text-[13px] text-steel truncate">{primaryCat(firm.id)}</p>
                      <p className="flex items-center gap-1 mt-0.5 text-[13px] whitespace-nowrap">
                        <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                        {reviews > 0 ? (
                          <>
                            <span className="font-extrabold text-gray-900">{rating.toFixed(1)}</span>
                            <span className="text-steel">({reviews} {plural(reviews, ['recenzija', 'recenzije', 'recenzija'])})</span>
                          </>
                        ) : (
                          <span className="text-steel">Bez recenzija</span>
                        )}
                      </p>
                      <p className="flex items-center gap-1 text-[13px] text-steel mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{firm.city || cityName}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between shrink-0 py-0.5">
                      <button
                        onClick={() => toggleFavorite(firm.id)}
                        aria-label="Sačuvaj firmu"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${fav ? 'text-red-500 fill-red-500' : 'text-gray-900'}`} />
                      </button>
                      <div className="flex flex-col items-end gap-1.5">
                        {firm.verified && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${company ? 'bg-green-50 text-green-700' : 'bg-sky-50 text-sky-700'}`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${company ? 'bg-green-500 text-white' : 'bg-sky-500 text-white'}`}>
                              ✓
                            </span>
                            {company ? 'Provjerena firma' : 'Provjereni majstor'}
                          </span>
                        )}
                        <Link
                          href={`/firma-profil/${firm.slug}/`}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[12px] sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95 whitespace-nowrap"
                        >
                          Pogledaj profil
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {filtered.length > DISPLAY_LIMIT && (
          <p className="text-xs text-steel text-center mt-3">
            Prikazano prvih {DISPLAY_LIMIT} od {filtered.length} firmi · sortirano po ocjeni.
          </p>
        )}

        {/* CTA box */}
        <div className="bg-[#f0f7ff] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-brand-orange text-xl">
              👥
            </span>
            <div>
              <p className="font-extrabold text-gray-900 text-[15px]">Niste pronašli odgovarajućeg majstora?</p>
              <p className="text-steel text-[13px]">Objavite svoj projekat i primite ponude od provjerenih majstora.</p>
            </div>
          </div>
          <Link
            href={objaviHref}
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto"
          >
            Objavi posao
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
