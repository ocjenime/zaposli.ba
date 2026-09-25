'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronRight, ArrowRight, X, LayoutGrid } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories, type Category } from '@/lib/data';
import { plural } from '@/lib/plural';

const POPULAR_SLUGS = [
  'adaptacije',
  'keramicarski-radovi',
  'elektroinstalacije',
  'vodoinstalacije',
  'molerski-radovi',
  'krovopokrivanje',
  'stolarija',
  'podovi',
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

export default function CategoriesClient() {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('Svi');

  const popular = useMemo(
    () =>
      POPULAR_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(
        (c): c is Category => Boolean(c)
      ),
    []
  );

  const letters = useMemo(() => {
    const visible = categories.filter((c) => !c.noSeo && !c.featured);
    return ALPHABET.filter((L) => visible.some((c) => letterKey(c.name) === L));
  }, []);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const visible = categories
      .filter((c) => !c.noSeo && !c.featured)
      .sort((a, b) => a.name.localeCompare(b.name, 'bs'));
    const result: { letter: string; items: Category[] }[] = [];
    for (const c of visible) {
      if (
        term &&
        !c.name.toLowerCase().includes(term) &&
        !c.description.toLowerCase().includes(term)
      ) {
        continue;
      }
      const letter = letterKey(c.name);
      if (activeLetter !== 'Svi' && letter !== activeLetter) continue;
      const g = result.find((g) => g.letter === letter);
      if (g) g.items.push(c);
      else result.push({ letter, items: [c] });
    }
    return result;
  }, [query, activeLetter]);

  const matchCount = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), [groups]);

  function scrollToList() {
    document.getElementById('sve-kategorije')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije' }]} />

        {/* Hero */}
        <section className="relative min-h-[360px] sm:min-h-[430px] lg:min-h-[540px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/herozaposli.png"
              alt="Majstor na gradilištu u sumrak"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-ink-950/35 to-ink-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-ink-950/10 to-ink-950/15" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-7">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 animate-fade-in">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Kategorije
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-2 sm:mb-3 animate-fade-in">
                  Pronađi profesionalca{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                    za svaki posao.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-white/85 leading-snug sm:leading-relaxed mb-3 sm:mb-4 animate-fade-in">
                  Sve usluge na jednom mjestu. Provjereni majstori i firme širom BiH.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    scrollToList();
                  }}
                  className="flex items-center gap-2 bg-white rounded-2xl p-1.5 pl-4 shadow-xl shadow-black/20 max-w-xl animate-fade-in"
                  role="search"
                >
                  <Search className="w-5 h-5 text-gray-900 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Šta trebaš uraditi?"
                    aria-label="Šta trebaš uraditi"
                    className="flex-1 min-w-0 bg-transparent text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Očisti pretragu"
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 shrink-0"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="submit"
                    aria-label="Pretraži kategorije"
                    className="h-11 w-12 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-center shrink-0 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* Popularne kategorije */}
        <section className="py-6 md:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Popularne kategorije
              </h2>
              <button
                type="button"
                onClick={scrollToList}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-brand-orange transition-colors shrink-0"
              >
                Pogledajte sve
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {popular.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/kategorije/${cat.slug}/`}
                    className="group flex items-center gap-2 sm:gap-3 bg-white border border-gray-100 rounded-2xl px-3 sm:px-4 py-3 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all min-w-0"
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800 group-hover:text-brand-orange transition-colors shrink-0" />
                    <span className="flex-1 min-w-0 text-[13px] sm:text-[15px] font-semibold text-gray-900 leading-snug">
                      {cat.name}
                    </span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sve kategorije */}
        <section id="sve-kategorije" className="pb-12 md:pb-16 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Sve kategorije
              </h2>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveLetter('Svi');
                  }}
                  placeholder="Pretraži kategorije..."
                  aria-label="Pretraži kategorije"
                  className="w-44 sm:w-56 pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none transition-all"
                />
              </div>
            </div>

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

            {query.trim() && (
              <p className="text-xs text-gray-500 mb-1">
                {matchCount} {plural(matchCount, ['kategorija', 'kategorije', 'kategorija'])}
              </p>
            )}

            {groups.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center mt-2">
                <p className="font-bold text-gray-900 mb-1">Nema kategorija za zadati filter</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
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
                    {g.items.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/kategorije/${cat.slug}/`}
                        className="group flex items-center justify-between gap-3 py-3 border-b border-gray-200/70"
                      >
                        <span className="text-[15px] text-gray-900 group-hover:text-brand-orange transition-colors">
                          {cat.name}
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
