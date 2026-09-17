'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  Users,
  Briefcase,
  CheckCircle,
  Search,
  X,
  Siren,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CategoryCard from '@/components/CategoryCard';
import { categories, cities, type Category } from '@/lib/data';
import { plural } from '@/lib/plural';

const POPULAR_SLUGS = [
  'adaptacije',
  'keramicarski-radovi',
  'elektroinstalacije',
  'vodoinstalacije',
  'molerski-radovi',
  'stolarija',
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'Provjerene firme' },
  { icon: Clock, label: 'Ponude u 24h' },
  { icon: Star, label: 'Recenzije klijenata' },
  { icon: Users, label: `${cities.length} gradova širom BiH` },
];

export default function CategoriesClient() {
  const [search, setSearch] = useState('');

  const popular = useMemo(
    () =>
      POPULAR_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(
        (c): c is Category => Boolean(c)
      ),
    []
  );

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const visible = categories.filter((c) => !c.noSeo && !c.featured);
    const result: { name: string; cats: Category[] }[] = [];
    for (const c of visible) {
      if (
        term &&
        !c.name.toLowerCase().includes(term) &&
        !c.description.toLowerCase().includes(term) &&
        !c.group.toLowerCase().includes(term)
      ) {
        continue;
      }
      const g = result.find((g) => g.name === c.group);
      if (g) g.cats.push(c);
      else result.push({ name: c.group, cats: [c] });
    }
    return result;
  }, [search]);

  const matchCount = useMemo(() => groups.reduce((n, g) => n + g.cats.length, 0), [groups]);
  const totalCount = useMemo(() => categories.filter((c) => !c.noSeo && !c.featured).length, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <main className="flex-grow">
        {/* Emergency interventions banner */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg shadow-red-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
            <Link
              href="/kategorije/hitne-intervencije/"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity min-w-0"
            >
              <span className="inline-flex items-center gap-1 bg-white text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <Siren className="w-2 h-2" />
                24/7
              </span>
              <span className="truncate">Hitne intervencije - majstori dostupni odmah</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
            </Link>
          </div>
        </div>

        <Breadcrumbs items={[{ name: 'Kategorije' }]} />

        {/* Compact header */}
        <section className="pt-8 md:pt-10 pb-6 md:pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
              <Briefcase className="h-4 w-4" /> Kategorije
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 text-balance">
              Kategorije usluga
            </h1>
            <p className="text-steel text-base md:text-lg max-w-2xl mx-auto mb-6">
              Pronađite majstora u {cities.length} gradova i {totalCount} kategorija. Od građevine do
              čišćenja - sve na jednom mjestu.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pretraži kategorije..."
                aria-label="Pretraži kategorije"
                className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-white text-sm text-gray-900 shadow-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Očisti pretragu"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Popular */}
            {!search.trim() && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
                  Popularno:
                </span>
                {popular.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/kategorije/${c.slug}/`}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand-orange hover:text-brand-orange transition-colors shadow-sm"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-x-6 gap-y-2 flex-wrap mt-6 text-sm text-steel">
              {TRUST_ITEMS.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  <item.icon className="w-4 h-4 text-brand-orange" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Groups */}
        <section className="pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {search.trim() && (
              <p className="text-sm text-steel mb-4 text-center md:text-left">
                {matchCount} {plural(matchCount, ['kategorija', 'kategorije', 'kategorija'])}
                {matchCount !== totalCount && <span className="text-gray-400"> / {totalCount} ukupno</span>}
              </p>
            )}

            {groups.length === 0 ? (
              <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Search className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nema kategorija za &ldquo;{search}&rdquo;</h3>
                <p className="text-steel max-w-md mx-auto mb-6">
                  Pokušajte s drugim pojmom ili objavite posao pa će vam se majstori sami javiti.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSearch('')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]"
                  >
                    <X className="w-4 h-4" /> Poništi pretragu
                  </button>
                  <Link
                    href="/objavi-projekat/"
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors min-h-[48px]"
                  >
                    Objavi posao <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-5">
                {groups.map((group) => (
                  <div
                    key={group.name}
                    className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-card"
                  >
                    <h2 className="text-sm font-bold text-steel uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-orange" />
                      {group.name}
                      <span className="ml-auto text-xs font-semibold text-gray-400 normal-case tracking-normal">
                        {group.cats.length}{' '}
                        {plural(group.cats.length, ['kategorija', 'kategorije', 'kategorija'])}
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                      {group.cats.map((category) => (
                        <CategoryCard key={category.slug} slug={category.slug} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-10 text-center border border-gray-100 relative overflow-hidden mt-8 md:mt-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-6 h-6 text-brand-orange" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Ne pronalazite traženu kategoriju?
                </h2>
                <p className="text-steel mb-6 max-w-xl mx-auto">
                  Objavite posao i majstori će vam se javiti sa ponudama. Besplatno i neobavezujuće.
                </p>
                <Link
                  href="/objavi-projekat/"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-orange text-white px-6 md:px-8 py-3.5 rounded-xl font-bold hover:bg-brand-orange-dark transition-all active:scale-95 min-h-[48px]"
                >
                  Objavi posao besplatno
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
