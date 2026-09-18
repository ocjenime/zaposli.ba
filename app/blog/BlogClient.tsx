'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CalendarDays,
  LayoutGrid,
  Tag,
  BookOpen,
  Lightbulb,
  Send,
  X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { articles } from '@/lib/articles';
import { plural } from '@/lib/plural';

const CATEGORY_ICONS: Record<string, typeof Tag> = {
  Cijene: Tag,
  Vodiči: BookOpen,
  Savjeti: Lightbulb,
};

function CategoryPill({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-md ${
        dark ? 'bg-black/45 text-white border border-white/15' : 'bg-[#EDE6DA]/90 text-gray-900'
      }`}
    >
      {label}
    </span>
  );
}

function ArrowCircle({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors ${
        small ? 'w-8 h-8' : 'w-10 h-10'
      }`}
    >
      <ArrowUpRight className={small ? 'w-4 h-4' : 'w-5 h-5'} />
    </span>
  );
}

export default function BlogClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Svi članci');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category)));
    return ['Svi članci', ...unique];
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = category === 'Svi članci' || a.category === category;
      const matchesSearch =
        !term ||
        a.title.toLowerCase().includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const [featured, ...rest] = filtered;
  const gridPair = rest.slice(0, 2);
  const latest = rest.slice(2);
  const isFiltering = search.trim() !== '' || category !== 'Svi članci';

  function clearAll() {
    setSearch('');
    setCategory('Svi članci');
  }

  function scrollToList() {
    document.getElementById('clanci')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Blog' }]} />

        {/* Hero */}
        <section className="relative min-h-[440px] sm:min-h-[500px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/kategorije-majstori.jpg"
              alt="Moderna kuća u sumrak - inspiracija za vaš dom"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/20 to-ink-950/25" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 sm:pb-10">
              <div className="max-w-2xl">
                <p className="text-brand-orange text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 animate-fade-in">
                  Blog
                </p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.05] tracking-tight mb-3 animate-fade-in">
                  Bolji projekti.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                    Stvarni savjeti.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-4 sm:mb-5 max-w-xl animate-fade-in">
                  Praktični članci, ideje i vodiči za sve koji grade, renoviraju ili traže pouzdane
                  majstore u Bosni i Hercegovini.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    scrollToList();
                  }}
                  className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-4 shadow-xl shadow-black/20 max-w-xl animate-fade-in"
                  role="search"
                >
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pretraži članke..."
                    aria-label="Pretraži članke"
                    className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      aria-label="Očisti pretragu"
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 shrink-0"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="submit"
                    aria-label="Pretraži"
                    className="w-10 h-10 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-center shrink-0 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Handwritten note */}
          <p className="hidden sm:block absolute z-20 right-6 lg:right-12 top-[38%] max-w-[150px] text-right font-serif italic text-white/90 text-xl leading-snug rotate-2">
            Bolji domovi počinju pravim ljudima.
            <span className="block mt-1 h-0.5 w-16 bg-brand-orange rounded-full ml-auto" />
          </p>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* Category pills */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {categories.map((c) => {
                const active = category === c;
                const Icon = c === 'Svi članci' ? LayoutGrid : CATEGORY_ICONS[c] || Tag;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] ${
                      active
                        ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/25'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {c}
                  </button>
                );
              })}
            </div>
            {isFiltering && (
              <p className="text-xs text-gray-500 mt-2">
                {filtered.length} {plural(filtered.length, ['članak', 'članka', 'članaka'])} ·{' '}
                <button type="button" onClick={clearAll} className="text-brand-orange font-semibold">
                  Poništi filtere
                </button>
              </p>
            )}
          </div>
        </section>

        {/* Articles */}
        <section id="clanci" className="bg-white scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
            {filtered.length === 0 ? (
              <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Search className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nema članaka za &ldquo;{search}&rdquo;
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Pokušajte s drugim pojmom ili pogledajte sve članke.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors min-h-[48px]"
                >
                  <X className="w-4 h-4" /> Poništi filtere
                </button>
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && (
                  <Link
                    href={`/blog/${featured.slug}/`}
                    className="group relative block overflow-hidden rounded-3xl min-h-[380px] sm:min-h-[420px] mb-3 md:mb-4"
                  >
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                      <CategoryPill label={featured.category} />
                      <ArrowCircle />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 z-10">
                      <span className="block w-10 h-1 bg-brand-orange rounded-full mb-2.5" />
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                        {featured.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-3 max-w-2xl line-clamp-2">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {featured.readTime}
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4" />
                          {featured.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid pair */}
                {gridPair.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {gridPair.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/blog/${a.slug}/`}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl min-h-[240px] sm:min-h-[300px] p-3.5 sm:p-5"
                      >
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 600px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />
                        <div className="relative z-10 flex items-start justify-between gap-2">
                          <CategoryPill label={a.category} />
                          <ArrowCircle small />
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-[15px] sm:text-xl font-bold text-white leading-snug mb-1">
                            {a.title}
                          </h3>
                          <p className="hidden sm:block text-sm text-white/75 leading-relaxed mb-2 line-clamp-2">
                            {a.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/80">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {a.readTime}
                            </span>
                            <span className="text-white/40">|</span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {a.date}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-ink-950 mt-4">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-orange/10 blur-[90px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            <div className="flex-1">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60 mb-1.5">
                Zaposli.ba <span className="text-brand-orange">Blog</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-1.5">
                Imate <span className="text-brand-orange">temu</span> za članak?
              </h2>
              <p className="text-sm md:text-base text-white/70">
                Podijelite s nama vaša pitanja, ideje i iskustva.
              </p>
            </div>
            <Link
              href="/kontakt/"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-brand-orange/25 shrink-0 min-h-[52px]"
            >
              <Send className="w-4 h-4" />
              Pošalji prijedlog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Latest */}
        {latest.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Najnoviji članci</h2>
                <button
                  type="button"
                  onClick={() => {
                    clearAll();
                    scrollToList();
                  }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark"
                >
                  Pogledaj sve članke
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
                {latest.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}/`}
                    className="group shrink-0 w-[220px] md:w-[260px] snap-start"
                  >
                    <div className="relative h-28 md:h-32 rounded-2xl overflow-hidden mb-2.5">
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="260px"
                      />
                      <span className="absolute top-2.5 left-2.5">
                        <CategoryPill label={a.category} />
                      </span>
                    </div>
                    <h3 className="text-sm md:text-[15px] font-bold text-gray-900 leading-snug mb-1 group-hover:text-brand-orange transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-500">{a.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-8 md:pb-10 text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
              &ldquo;Iz Bosne i Hercegovine za bolje majstore.&rdquo;
            </p>
            <span className="block w-10 h-0.5 bg-brand-orange rounded-full mx-auto mt-2.5" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
