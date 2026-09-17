'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Search, X, SlidersHorizontal, ArrowUpDown, Megaphone,
  Crown, MapPin, ShieldCheck, Clock, Users, Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PromotedAdRowCard from '@/components/PromotedAdRowCard';
import AdCreateCTA from '@/components/AdCreateCTA';
import { plural } from '@/lib/plural';
import type { PublicPromotedAd } from '@/lib/promoted-ads';

type TypeFilter = 'all' | 'promotion' | 'worker_search';
type SortBy = 'newest' | 'ending' | 'name';

interface PromotedAdsPageClientProps {
  ads: PublicPromotedAd[];
  breadcrumbLabel: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

const TYPE_TABS: { value: TypeFilter; label: string; icon: typeof Sparkles }[] = [
  { value: 'all', label: 'Svi oglasi', icon: Megaphone },
  { value: 'promotion', label: 'Promocije', icon: Sparkles },
  { value: 'worker_search', label: 'Tražim radnike', icon: Users },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Provjerene firme' },
  { icon: Crown, label: 'Premium oglasi' },
  { icon: MapPin, label: 'Cijela BiH' },
  { icon: Clock, label: 'Novi oglasi stalno' },
];

export default function PromotedAdsPageClient({
  ads,
  breadcrumbLabel,
  eyebrow = 'Premium oglasi',
  title = 'Premium oglasi i reklame',
  subtitle = 'Pregledajte promocije provjerenih firmi i majstora ili pronađite radnike spremne za posao. Sve na jednom mjestu.',
}: PromotedAdsPageClientProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(
    () =>
      Array.from(new Set(ads.map((ad) => ad.firms?.city).filter((c): c is string => Boolean(c)))).sort((a, b) =>
        a.localeCompare(b, 'bs')
      ),
    [ads]
  );

  const filteredAds = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ads
      .filter((ad) => {
        const matchesSearch =
          !term ||
          ad.title.toLowerCase().includes(term) ||
          ad.description.toLowerCase().includes(term) ||
          (ad.firms?.name || '').toLowerCase().includes(term) ||
          (ad.firms?.city || '').toLowerCase().includes(term);
        const matchesType = typeFilter === 'all' || ad.ad_type === typeFilter;
        const matchesCity = !cityFilter || ad.firms?.city === cityFilter;
        return matchesSearch && matchesType && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title, 'bs');
        if (sortBy === 'ending') {
          const at = a.ends_at ? new Date(a.ends_at).getTime() : Infinity;
          const bt = b.ends_at ? new Date(b.ends_at).getTime() : Infinity;
          return at - bt;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [ads, search, typeFilter, cityFilter, sortBy]);

  const activeFiltersCount = [search.trim(), typeFilter !== 'all' ? typeFilter : '', cityFilter].filter(
    Boolean
  ).length;

  function clearFilters() {
    setSearch('');
    setTypeFilter('all');
    setCityFilter('');
    setSortBy('newest');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: breadcrumbLabel }]} />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <Image
            src="/images/poslovi-hero.jpg"
            alt="Premium oglasi za firme i majstore"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-ink-950/40" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-10 md:pb-14">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide uppercase mb-6">
                <Megaphone className="w-4 h-4 text-brand-orange" />
                {eyebrow}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                {title}
              </h1>

              <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <AdCreateCTA
                  variant="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold transition-all active:scale-95 shadow-lg shadow-brand-orange/25"
                />
              </div>

              <div className="mt-8 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {TRUST_BADGES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90"
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-orange shrink-0" />
                      <p className="text-xs md:text-sm font-medium text-left leading-tight">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f8f7f4] to-transparent z-10" />
        </section>

        <section id="listings" className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Filter bar */}
            <div className="bg-[#f8f7f4] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 md:py-4 mb-6 md:mb-8 border-b border-gray-200/60">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                    <div className="relative flex-1 md:max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pretraži oglase..."
                        aria-label="Pretraži oglase"
                        className="w-full pl-9 pr-9 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none transition-all"
                      />
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          aria-label="Očisti pretragu"
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar -mx-1 px-1">
                      <button
                        onClick={() => setShowFilters((s) => !s)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                          showFilters || activeFiltersCount > 0
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filteri
                        {activeFiltersCount > 0 && (
                          <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </button>
                      <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortBy)}
                          aria-label="Sortiraj oglase"
                          className="pl-9 pr-7 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none appearance-none cursor-pointer min-h-[44px]"
                        >
                          <option value="newest">Najnovije</option>
                          <option value="ending">Ističu uskoro</option>
                          <option value="name">Naziv: A-Ž</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-steel md:text-right">
                    {filteredAds.length} {plural(filteredAds.length, ['oglas', 'oglasa', 'oglasa'])}
                    {activeFiltersCount > 0 && <span className="text-gray-400"> / {ads.length} ukupno</span>}
                  </p>
                </div>

                {/* Type tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pt-3 mt-3 border-t border-gray-200/60 pb-1">
                  {TYPE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = typeFilter === tab.value;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => setTypeFilter(tab.value)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all min-h-[40px] ${
                          active
                            ? 'bg-ink-950 text-white border-ink-950 dark:bg-white dark:text-ink-950 dark:border-white'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {showFilters && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 mt-3 border-t border-gray-200/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Grad</label>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                      >
                        <option value="">Svi gradovi</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Tip oglasa</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                      >
                        <option value="all">Svi oglasi</option>
                        <option value="promotion">Promocije</option>
                        <option value="worker_search">Tražim radnike</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Sortiranje</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                      >
                        <option value="newest">Najnovije</option>
                        <option value="ending">Ističu uskoro</option>
                        <option value="name">Naziv: A-Ž</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        disabled={activeFiltersCount === 0}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-700 min-h-[44px]"
                      >
                        <X className="w-4 h-4" /> Poništi filtere
                      </button>
                    </div>
                  </div>
                )}

                {activeFiltersCount > 0 && (
                  <div className="flex items-start md:items-center justify-between gap-3 pt-3 mt-3 border-t border-gray-200/60">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                      {search && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                          {search}
                          <button
                            onClick={() => setSearch('')}
                            aria-label="Ukloni pretragu"
                            className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {typeFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                          {TYPE_TABS.find((t) => t.value === typeFilter)?.label}
                          <button
                            onClick={() => setTypeFilter('all')}
                            aria-label="Ukloni filter tipa"
                            className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {cityFilter && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                          {cityFilter}
                          <button
                            onClick={() => setCityFilter('')}
                            aria-label="Ukloni filter grada"
                            className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="shrink-0 text-sm text-brand-orange font-semibold hover:text-brand-orange-dark flex items-center gap-1 min-h-[44px]"
                    >
                      <X className="w-4 h-4" /> Poništi
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredAds.length === 0 ? (
              <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-8 md:p-12 lg:p-16 text-center mb-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-5 md:mb-6">
                  <Megaphone className="w-8 h-8 md:w-10 md:h-10 text-brand-orange" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {activeFiltersCount > 0 ? 'Nema oglasa za izabrane filtere' : 'Trenutno nema aktivnih oglasa'}
                </h3>
                <p className="text-steel max-w-md mx-auto mb-6 md:mb-8">
                  {activeFiltersCount > 0
                    ? 'Pokušajte poništiti filtere ili se vratite kasnije.'
                    : 'Budite prvi koji će objaviti premium oglas i predstaviti svoje usluge širom BiH.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFiltersCount > 0 ? (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]"
                    >
                      <X className="w-4 h-4" /> Poništi filtere
                    </button>
                  ) : (
                    <AdCreateCTA
                      variant="button"
                      className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors min-h-[48px]"
                    />
                  )}
                  <Link
                    href="/poslovi/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]"
                  >
                    Pogledaj poslove <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:gap-5 mb-12">
                {filteredAds.map((ad) => (
                  <PromotedAdRowCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-14 text-center border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6">
                  <Megaphone className="w-6 h-6 md:w-7 md:h-7 text-brand-orange" />
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  Želite da i vaš oglas bude ovdje?
                </h2>
                <p className="text-steel mb-6 md:mb-8 max-w-xl mx-auto">
                  Registrujte firmu ili majstora i objavite premium oglas. Besplatno za Start, Pro i Premium
                  pakete, ili od 5 KM za ostale profile.
                </p>
                <AdCreateCTA
                  variant="button"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-orange text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold hover:bg-brand-orange-dark transition-all active:scale-95 min-h-[48px]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
