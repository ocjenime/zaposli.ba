'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PageHero from '@/components/ui/PageHero';
import CategoryCard from '@/components/CategoryCard';
import { categories, cities, type Category } from '@/lib/data';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';
import {
  LayoutGrid,
  Search,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  CheckCircle,
  Siren,
  Wrench,
} from 'lucide-react';

const visible = categories.filter((c) => !c.noSeo);
const featured = visible.filter((c) => c.featured);

interface Group {
  name: string;
  cats: Category[];
}

const groups: Group[] = [];
for (const c of visible.filter((c) => !c.featured)) {
  const g = groups.find((x) => x.name === c.group);
  if (g) g.cats.push(c);
  else groups.push({ name: c.group, cats: [c] });
}

const stats = [
  { icon: LayoutGrid, value: visible.length, label: 'Kategorija' },
  { icon: MapPin, value: cities.length, label: 'Gradova' },
  { icon: Wrench, value: visible.reduce((sum, c) => sum + c.services.length, 0), label: 'Usluga' },
  { icon: ShieldCheck, value: 'Provjerene', label: 'firme' },
];

export default function CategoriesContent() {
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        cats: g.cats.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.services.some((s) => s.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.cats.length > 0);
  }, [query]);

  const flatResults = useMemo(
    () => filteredGroups.flatMap((g) => g.cats),
    [filteredGroups]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije' }]} />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Kategorije', url: '/kategorije/' },
          ])}
        />

        <PageHero
          title="Sve usluge na jednom mjestu"
          subtitle="Pronađite provjerenog majstora ili firmu za bilo koji posao u Bosni i Hercegovini. Od hitnih intervencija do kompletnih adaptacija."
          eyebrow="Kategorije usluga"
          icon={LayoutGrid}
          align="center"
          size="lg"
          image="/images/herozaposli.png"
        >
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pretražite kategorije, npr. keramičar, adaptacija, električar..."
                className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md pl-12 pr-5 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/80 hover:text-white"
                >
                  Očisti
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-white/70">
              {query ? (
                <>
                  Pronađeno <span className="font-bold text-white">{flatResults.length}</span>{' '}
                  {flatResults.length === 1 ? 'kategorija' : 'kategorija'} za &quot;{query}&quot;
                </>
              ) : (
                <>Ukupno {visible.length} kategorija i {cities.length} gradova</>
              )}
            </p>
          </div>
        </PageHero>

        {/* Stats */}
        <section className="py-10 bg-cloud border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-xs text-steel uppercase tracking-wide font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured bento */}
        {!query && featured.length > 0 && (
          <section className="py-16 md:py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Istaknute kategorije</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/kategorije/${cat.slug}/`}
                      className="group relative md:col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-8 text-white shadow-float hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                      <div className="relative flex flex-col h-full justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 bg-white text-red-600 text-xs font-extrabold px-3 py-1 rounded-full mb-4">
                            <Siren className="w-3.5 h-3.5" />
                            24/7 dostupno
                          </div>
                          <h3 className="text-3xl md:text-4xl font-extrabold mb-3">{cat.name}</h3>
                          <p className="text-white/80 max-w-lg">{cat.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-6">
                          {cat.services.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 font-bold">
                          Pogledaj kategoriju <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* Two quick links next to featured */}
                <div className="space-y-5">
                  <Link
                    href="/top-firme/"
                    className="group block rounded-3xl bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-6 text-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Top firme</h3>
                    <p className="text-sm text-white/70 mb-4">Najbolje ocijenjeni majstori u BiH</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
                      Pogledaj <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/objavi-projekat/"
                    className="group block rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange-dark p-6 text-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Objavi posao</h3>
                    <p className="text-sm text-white/80 mb-4">Besplatno i neobavezujuće</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      Započni <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Grouped categories */}
        <section className="py-16 md:py-24 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!query && (
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                  <Briefcase className="h-4 w-4" /> Pregled po strukama
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                  Pretražite po oblasti rada
                </h2>
                <p className="text-steel text-lg">
                  Svaka kategorija vodi do provjerenih majstora i firmi koje rade upravo ono što vam treba.
                </p>
              </div>
            )}

            {filteredGroups.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-card">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nema rezultata za &quot;{query}&quot;</h3>
                <p className="text-steel mb-6 max-w-md mx-auto">
                  Pokušajte drugačiju riječ ili objavite posao - majstori će vam se javiti sa ponudama.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-2 bg-white text-brand-orange border-2 border-brand-orange px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors mr-3"
                >
                  Pokaži sve
                </button>
                <Link href="/objavi-projekat/" className="btn-primary">
                  Objavi posao
                </Link>
              </div>
            ) : (
              <div className="space-y-14">
                {filteredGroups.map((group) => (
                  <div key={group.name} id={group.name.toLowerCase().replace(/\s+/g, '-')}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink to-slate-800 flex items-center justify-center text-white shadow-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{group.name}</h2>
                      <span className="ml-auto text-sm font-semibold text-steel bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        {group.cats.length} {group.cats.length === 1 ? 'kategorija' : 'kategorija'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.cats.map((cat) => (
                        <CategoryCard key={cat.slug} slug={cat.slug} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-ink via-slate-900 to-slate-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 text-balance">
              Ne pronalazite traženu kategoriju?
            </h2>
            <p className="text-white/70 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Objavite posao besplatno i majstori će vam se javiti sa ponudama. Brzo, jednostavno i bez obaveze.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/objavi-projekat/" className="btn-primary text-lg px-8 py-4">
                Objavi posao besplatno
              </Link>
              <Link
                href="/top-firme/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors"
              >
                Pogledaj top firme <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
