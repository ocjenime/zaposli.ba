'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Shield,
  TrendingUp,
  Trophy,
  Search,
  X,
  LayoutGrid,
  Briefcase,
  Building2,
} from 'lucide-react';
import Header from '@/components/Header';
import { plural } from '@/lib/plural';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LogoDisplay from '@/components/ui/LogoDisplay';
import { supabase } from '@/lib/supabase';
import { getCategory, getCategoryShortName, getCategoryBarLabel, categories } from '@/lib/data';
import { JsonLd, localBusinessListSchema } from '@/lib/jsonld';

interface Firm {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  last_active_at: string | null;
  plan_priority: number | null;
  specialty?: string;
  categorySlugs?: string[];
  projectsCount?: number;
}

interface FirmCategory {
  firm_id: string;
  category_slug: string;
}

type TabId = 'top' | 'rated' | 'projects' | 'active';

const TABS: { id: TabId; label: string }[] = [
  { id: 'top', label: 'Top firme' },
  { id: 'rated', label: 'Najbolje ocijenjene' },
  { id: 'projects', label: 'Najviše projekata' },
  { id: 'active', label: 'Nedavno aktivne' },
];

const FILTER_CATS: { label: string; icon: typeof LayoutGrid; slugs: string[] }[] = [
  { label: 'Sve kategorije', icon: LayoutGrid, slugs: [] },
  ...[
    'adaptacije',
    'keramicarski-radovi',
    'elektroinstalacije',
    'vodoinstalacije',
    'stolarija',
    'krovopokrivanje',
    'molerski-radovi',
    'gipsarski-radovi',
  ].map((slug) => {
    const cat = categories.find((c) => c.slug === slug)!;
    return { label: getCategoryBarLabel(cat), icon: cat.icon, slugs: [slug] };
  }),
];

const TRUST_ITEMS = [
  { icon: Shield, text: 'Svaki majstor prošao verifikaciju' },
  { icon: Star, text: 'Ocjene isključivo od stvarnih klijenata' },
  { icon: TrendingUp, text: 'Sortirano prema ocjeni i broju poslova' },
];

export default function TopFirmeContent() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSlugs, setFilterSlugs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('top');

  useEffect(() => {
    async function loadFirms() {
      try {
        const { data: firmData } = await supabase
          .from('firms')
          .select(
            'id, name, slug, city, logo_url, verified, average_rating, review_count, last_active_at, plan_priority'
          )
          .not('slug', 'like', 'test-%')
          .order('average_rating', { ascending: false })
          .limit(50);

        if (!firmData || firmData.length === 0) return;

        const [{ data: catData }, projectCounts] = await Promise.all([
          supabase.from('firm_categories').select('firm_id, category_slug'),
          (async () => {
            try {
              const { data } = await supabase.rpc('get_firm_project_counts');
              const map: Record<string, number> = {};
              ((data as { firm_id: string; project_count: number }[] | null) || []).forEach(
                (row) => {
                  map[row.firm_id] = Number(row.project_count) || 0;
                }
              );
              return map;
            } catch {
              return {} as Record<string, number>;
            }
          })(),
        ]);

        const categoryMap = (catData || []).reduce<Record<string, string[]>>((acc, row: unknown) => {
          const fc = row as FirmCategory;
          acc[fc.firm_id] = acc[fc.firm_id] || [];
          acc[fc.firm_id].push(fc.category_slug);
          return acc;
        }, {});

        const enriched = (firmData as unknown as Firm[]).map((f) => {
          const slugs = categoryMap[f.id] || [];
          const primarySlug = slugs[0];
          const category = primarySlug ? getCategory(primarySlug) : null;
          return {
            ...f,
            specialty: category?.name || 'Razne usluge',
            categorySlugs: slugs,
            projectsCount: projectCounts[f.id] || 0,
          };
        });

        setFirms(enriched);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }

    loadFirms();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = firms.filter((f) => {
      const matchesCategory =
        filterSlugs.length === 0 || (f.categorySlugs || []).some((s) => filterSlugs.includes(s));
      const matchesSearch =
        !term ||
        f.name.toLowerCase().includes(term) ||
        (f.city || '').toLowerCase().includes(term) ||
        (f.specialty || '').toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    const by = [...list];
    if (activeTab === 'rated') {
      by.sort(
        (a, b) =>
          (b.average_rating || 0) - (a.average_rating || 0) ||
          (b.review_count || 0) - (a.review_count || 0)
      );
    } else if (activeTab === 'projects') {
      by.sort((a, b) => (b.projectsCount || 0) - (a.projectsCount || 0));
    } else if (activeTab === 'active') {
      by.sort(
        (a, b) =>
          new Date(b.last_active_at || 0).getTime() - new Date(a.last_active_at || 0).getTime()
      );
    } else {
      by.sort(
        (a, b) =>
          (b.average_rating || 0) +
          (b.verified ? 0.5 : 0) +
          ((b.plan_priority || 0) >= 0.4 ? 0.25 : 0) -
          ((a.average_rating || 0) + (a.verified ? 0.5 : 0) + ((a.plan_priority || 0) >= 0.4 ? 0.25 : 0))
      );
    }
    return by;
  }, [firms, search, filterSlugs, activeTab]);

  function scrollToList() {
    document.getElementById('firme')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Top firme' }]} />
        {!loading && firms.length > 0 && (
          <JsonLd
            data={localBusinessListSchema(
              firms.map((f) => ({
                name: f.name,
                specialty: f.specialty || 'Razne usluge',
                location: f.city || 'BiH',
                rating: f.average_rating || 0,
                reviews: f.review_count || 0,
                url: `/firma-profil/${f.slug}/`,
                image: f.logo_url || undefined,
              }))
            )}
          />
        )}

        {/* Hero */}
        <section className="relative min-h-[440px] sm:min-h-[500px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/herozaposli.png"
              alt="Majstor sa Zaposli.ba oznakom na gradilištu"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[65%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-ink-950/35 to-ink-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-ink-950/10 to-ink-950/15" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8 sm:pb-10">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold text-brand-orange uppercase tracking-wider mb-2.5 animate-fade-in">
                  <Trophy className="w-3.5 h-3.5" />
                  Povjerenje stvara rezultate.
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.05] tracking-tight mb-3 animate-fade-in">
                  Top{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                    firme
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-4 max-w-xl animate-fade-in">
                  Provjereni profesionalci sa najboljim ocjenama stvarnih klijenata. Izaberite firmu
                  sa povjerenjem.
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4 max-w-xl animate-fade-in">
                  {TRUST_ITEMS.map((t) => (
                    <div key={t.text} className="flex items-start gap-1.5">
                      <t.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0 mt-0.5" />
                      <p className="text-[11px] sm:text-[13px] text-white/85 leading-snug">{t.text}</p>
                    </div>
                  ))}
                </div>

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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pretraži top firme..."
                    aria-label="Pretraži top firme"
                    className="flex-1 min-w-0 bg-transparent text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none"
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
                    className="h-11 px-5 sm:px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-sm md:text-base font-bold flex items-center justify-center shrink-0 transition-colors"
                  >
                    Pretraži
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* Category bar - isti stil kao homepage CategoryIconRow */}
        <section className="relative z-30 px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-xl shadow-black/5 p-2 sm:p-4">
              <div className="flex items-start justify-start gap-3 overflow-x-auto no-scrollbar pb-0.5">
                {FILTER_CATS.map((c) => {
                  const active =
                    (c.slugs.length === 0 && filterSlugs.length === 0) ||
                    (c.slugs.length > 0 &&
                      filterSlugs.length === c.slugs.length &&
                      c.slugs.every((s) => filterSlugs.includes(s)));
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => {
                        setFilterSlugs(c.slugs);
                        scrollToList();
                      }}
                      className="group flex flex-col items-center gap-1.5 min-w-[84px] sm:min-w-[92px] text-center"
                    >
                      <span
                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                          active
                            ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange'
                            : 'bg-gray-50 dark:bg-ink-800 border-gray-100 dark:border-ink-700 text-gray-700 dark:text-[#ffffff]/90 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orange'
                        }`}
                      >
                        <c.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </span>
                      <span
                        className={`block text-center text-[10px] sm:text-xs font-medium leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis transition-colors ${
                          active
                            ? 'text-brand-orange'
                            : 'text-gray-700 dark:text-[#ffffff]/85 group-hover:text-brand-orange'
                        }`}
                      >
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Promo banner */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-2">
            <div className="relative overflow-hidden rounded-3xl min-h-[190px] sm:min-h-[220px] flex items-center">
              <Image
                src="/images/kategorije-majstori.jpg"
                alt="Moderna kuća u sumrak"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/20" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full p-5 sm:p-8">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1.5">
                    Samo najbolje
                    <br />
                    <span className="text-brand-orange">za vaš projekat.</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    Firme sa najvišim ocjenama, najviše uspješnih projekata.
                  </p>
                </div>
                <Link
                  href="/kako-funkcionise/"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-white/20 transition-colors shrink-0"
                >
                  Kako funkcioniše?
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Firms */}
        <section id="firme" className="bg-white scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            {/* Tabs */}
            <div className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar border-b border-gray-100 mb-4">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`pb-2.5 text-sm md:text-[15px] whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === t.id
                      ? 'font-bold text-gray-900 border-brand-orange'
                      : 'font-medium text-gray-400 border-transparent hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 animate-pulse"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Nema firmi za zadati filter</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Pokušajte s drugom pretragom ili kategorijom.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setFilterSlugs([]);
                    setActiveTab('top');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors min-h-[48px]"
                >
                  <X className="w-4 h-4" /> Poništi filtere
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((f) => (
                  <Link
                    key={f.id}
                    href={`/firma-profil/${f.slug}/`}
                    className="group flex items-center gap-3 sm:gap-4 bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all"
                  >
                    <LogoDisplay
                      name={f.name}
                      src={f.logo_url}
                      alt={f.name}
                      size="md"
                      rounded="xl"
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-gray-900 truncate text-[15px] sm:text-lg">
                          {f.name}
                        </h3>
                        {f.verified && <VerifiedBadge size="sm" showLabel={false} className="shrink-0" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm text-gray-500 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <strong className="text-gray-900">{(f.average_rating || 0).toFixed(1)}</strong>
                          <span>
                            ({f.review_count || 0}{' '}
                            {plural(f.review_count || 0, ['ocjena', 'ocjene', 'ocjena'])})
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {f.projectsCount || 0}{' '}
                          {plural(f.projectsCount || 0, ['projekat', 'projekta', 'projekata'])}
                        </span>
                      </div>
                      {f.city && (
                        <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {f.city}
                        </p>
                      )}
                      {(f.categorySlugs || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {(f.categorySlugs || [])
                            .slice(0, 3)
                            .map((slug) => getCategory(slug))
                            .filter(Boolean)
                            .map((cat) => (
                              <span
                                key={cat!.slug}
                                className="bg-gray-100 text-gray-700 rounded-lg px-2 py-0.5 text-[11px] sm:text-xs font-medium"
                              >
                                {getCategoryShortName(cat!)}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-200 text-gray-900 group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <span className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-brand-orange" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-[15px] sm:text-lg leading-snug">
                  Vaša firma može biti ovdje
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Izgradite povjerenje i osvojite nove klijente.
                </p>
              </div>
              <Link
                href="/registracija/"
                className="inline-flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 shrink-0 min-h-[48px]"
              >
                Registrujte firmu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
