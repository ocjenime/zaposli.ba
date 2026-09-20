'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronRight, ArrowRight, X, Landmark } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cities, type City } from '@/lib/data';
import { normalizeCityName } from '@/lib/city-utils';
import { plural } from '@/lib/plural';

const POPULAR_SLUGS = [
  'sarajevo',
  'banja-luka',
  'mostar',
  'tuzla',
  'bihac',
  'velika-kladusa',
  'cazin',
  'zenica',
];

const ALPHABET = [
  'A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj',
  'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž',
];

function letterKey(name: string): string {
  const upper = name.toUpperCase();
  for (const digraph of ['DŽ', 'LJ', 'NJ']) {
    if (upper.startsWith(digraph)) return digraph;
  }
  return upper.charAt(0);
}

export default function GradoviClient() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState('');
  const [heroOpen, setHeroOpen] = useState(false);
  const [listQuery, setListQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('Svi');

  const popular = useMemo(
    () =>
      POPULAR_SLUGS.map((slug) => cities.find((c) => c.slug === slug)).filter(
        (c): c is City => Boolean(c)
      ),
    []
  );

  const heroMatches = useMemo(() => {
    const term = normalizeCityName(heroQuery);
    if (!term) return [];
    return cities.filter((c) => normalizeCityName(c.name).includes(term)).slice(0, 6);
  }, [heroQuery]);

  function scrollToList() {
    document.getElementById('svi-gradovi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function submitHero() {
    const term = normalizeCityName(heroQuery);
    if (!term) return;
    const exact = cities.find((c) => normalizeCityName(c.name) === term);
    setHeroOpen(false);
    if (exact) {
      router.push(`/gradovi/${exact.slug}/`);
    } else {
      setListQuery(heroQuery.trim());
      setActiveLetter('Svi');
      scrollToList();
    }
  }

  const letters = useMemo(
    () => ALPHABET.filter((L) => cities.some((c) => letterKey(c.name) === L)),
    []
  );

  const groups = useMemo(() => {
    const term = normalizeCityName(listQuery);
    const result: { letter: string; items: City[] }[] = [];
    const sorted = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs'));
    for (const city of sorted) {
      if (term && !normalizeCityName(city.name).includes(term)) continue;
      const letter = letterKey(city.name);
      if (activeLetter !== 'Svi' && letter !== activeLetter) continue;
      const g = result.find((g) => g.letter === letter);
      if (g) g.items.push(city);
      else result.push({ letter, items: [city] });
    }
    return result;
  }, [listQuery, activeLetter]);

  const matchCount = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), [groups]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi' }]} />

        {/* Hero */}
        <section className="relative min-h-[340px] sm:min-h-[440px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/gradovi-hero.jpg"
              alt="Gradovi Bosne i Hercegovine u sumrak"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-ink-950/35 to-ink-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-ink-950/10 to-ink-950/15" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-6 sm:pb-10">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 animate-fade-in">
                  <MapPin className="w-3.5 h-3.5" />
                  Gradovi
                </span>
                <h1 className="text-[28px] sm:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-2 animate-fade-in">
                  Pronađi majstora{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                    u svom gradu.
                  </span>
                </h1>
                <p className="text-[13px] sm:text-base text-white/85 leading-snug max-w-xl animate-fade-in">
                  Provjerene firme i majstori, dostupni širom BiH.
                </p>

                {/* City search */}
                <div className="relative max-w-xl animate-fade-in">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitHero();
                    }}
                    className="relative z-20 flex items-center gap-2 bg-white rounded-2xl p-1.5 pl-4 shadow-xl shadow-black/20"
                    role="search"
                  >
                    <MapPin className="w-5 h-5 text-gray-900 shrink-0" />
                    <input
                      type="text"
                      value={heroQuery}
                      onChange={(e) => {
                        setHeroQuery(e.target.value);
                        setHeroOpen(true);
                      }}
                      onFocus={() => setHeroOpen(true)}
                      placeholder="Unesite grad..."
                      aria-label="Unesite grad"
                      className="flex-1 min-w-0 bg-transparent text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none"
                    />
                    {heroQuery && (
                      <button
                        type="button"
                        onClick={() => setHeroQuery('')}
                        aria-label="Očisti pretragu"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 shrink-0"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="submit"
                      aria-label="Pronađi grad"
                      className="h-11 w-12 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </form>

                  {heroOpen && heroMatches.length > 0 && (
                    <>
                      <button
                        type="button"
                        aria-hidden="true"
                        tabIndex={-1}
                        onClick={() => setHeroOpen(false)}
                        className="fixed inset-0 z-10 cursor-default"
                      />
                      <div className="absolute z-20 inset-x-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
                        {heroMatches.map((c) => (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => {
                              setHeroOpen(false);
                              router.push(`/gradovi/${c.slug}/`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left"
                          >
                            <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                            <span className="flex-1 text-sm font-semibold text-gray-900">{c.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f8f7f4] to-transparent z-10" />
        </section>

        {/* Popularni gradovi */}
        <section className="py-6 md:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Popularni gradovi
              </h2>
              <button
                type="button"
                onClick={scrollToList}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-brand-orange transition-colors"
              >
                Pogledajte sve
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {popular.map((city) => (
                <Link
                  key={city.slug}
                  href={`/gradovi/${city.slug}/`}
                  className="group flex items-center gap-1.5 sm:gap-3 bg-white border border-gray-100 rounded-2xl px-2.5 sm:px-4 py-3 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all min-w-0"
                >
                  <Landmark className="w-[18px] h-[18px] sm:w-6 sm:h-6 text-gray-800 group-hover:text-brand-orange transition-colors shrink-0" />
                  <span className="flex-1 min-w-0 text-[13px] sm:text-base font-semibold text-gray-900 truncate">
                    {city.name}
                  </span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Svi gradovi */}
        <section id="svi-gradovi" className="pb-12 md:pb-16 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Svi gradovi
              </h2>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
                <input
                  type="text"
                  value={listQuery}
                  onChange={(e) => {
                    setListQuery(e.target.value);
                    setActiveLetter('Svi');
                  }}
                  placeholder="Pretraži gradove..."
                  aria-label="Pretraži gradove"
                  className="w-44 sm:w-56 pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none transition-all"
                />
              </div>
            </div>

            {/* Letters */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 mb-2">
              <button
                type="button"
                onClick={() => setActiveLetter('Svi')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors min-h-[36px] ${
                  activeLetter === 'Svi'
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-700 hover:text-brand-orange'
                }`}
              >
                Svi
              </button>
              {letters.map((L) => (
                <button
                  key={L}
                  type="button"
                  onClick={() => setActiveLetter(activeLetter === L ? 'Svi' : L)}
                  className={`px-2 py-1.5 rounded-lg text-sm font-semibold transition-colors min-h-[36px] min-w-[28px] ${
                    activeLetter === L
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-700 hover:text-brand-orange'
                  }`}
                >
                  {L}
                </button>
              ))}
            </div>

            {listQuery.trim() && (
              <p className="text-xs text-gray-500 mb-1">
                {matchCount} {plural(matchCount, ['grad', 'grada', 'gradova'])}
              </p>
            )}

            {groups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mt-2">
                <p className="font-bold text-gray-900 mb-1">Nema gradova za zadati filter</p>
                <button
                  type="button"
                  onClick={() => {
                    setListQuery('');
                    setActiveLetter('Svi');
                  }}
                  className="text-sm font-semibold text-brand-orange"
                >
                  Poništi filtere
                </button>
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.letter}>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-5 mb-1">{g.letter}</h3>
                  <div>
                    {g.items.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/gradovi/${city.slug}/`}
                        className="group flex items-center justify-between gap-3 py-3 border-b border-gray-200/70"
                      >
                        <span className="text-[15px] text-gray-900 group-hover:text-brand-orange transition-colors">
                          {city.name}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-900 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
