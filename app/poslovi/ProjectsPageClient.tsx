'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { plural } from '@/lib/plural';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight, Loader2, X, Search, SlidersHorizontal,
  MapPin, ChevronDown, Wallet, Calendar, AlertTriangle, Briefcase,
  LayoutGrid, Users,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProjectListCard from '@/components/ProjectListCard';
import RecommendedFirmsSection from '@/components/RecommendedFirmsSection';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { getCategory, categories } from '@/lib/data';
import { JsonLd, jobListSchema } from '@/lib/jsonld';

interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string | null;
  category_slug: string;
  status: string;
  created_at: string;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  bids_count: number;
  is_featured: boolean | null;
  featured_until: string | null;
  job_images: { image_url: string }[] | null;
}

function ProjectsPageContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [rokFilter, setRokFilter] = useState<'' | '7' | '30'>('');
  const [sortBy, setSortBy] = useState<'newest' | 'nearest'>('newest');
  const [openPanel, setOpenPanel] = useState<null | 'kategorija' | 'lokacija' | 'budzet' | 'rok'>(null);
  const [firmCategories, setFirmCategories] = useState<string[]>([]);
  const [categoryWarningJob, setCategoryWarningJob] = useState<Job | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadFirmCategories = useCallback(async () => {
    if (!user) return;
    const { data: firmData } = await supabase
      .from('firms')
      .select('id')
      .eq('owner_id', user.id)
      .single();
    if (!firmData) return;
    const { data: catData } = await supabase
      .from('firm_categories')
      .select('category_slug')
      .eq('firm_id', firmData.id);
    setFirmCategories((catData as { category_slug: string }[] | null)?.map((c) => c.category_slug) || []);
  }, [user]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('id,title,description,city,address,category_slug,status,created_at,budget_mode,budget_min,budget_max,deadline,bids_count,is_featured,featured_until,job_images(image_url)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Greška prilikom učitavanja poslova.');
    } else {
      setJobs((data as Job[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setCategoryFilter(category);
      const section = document.getElementById('listings');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  useEffect(() => {
    const expandId = searchParams.get('expandId');
    if (expandId) setExpandedId(expandId);
  }, [searchParams]);

  useEffect(() => {
    if (user && isFirmRole(role)) loadFirmCategories();
  }, [user, role, loadFirmCategories]);

  function isActiveFeatured(job: Job) {
    if (!job.is_featured || !job.featured_until) return false;
    return new Date(job.featured_until).getTime() > Date.now();
  }

  function isCategoryAllowed(job: Job) {
    return firmCategories.length > 0 && firmCategories.includes(job.category_slug);
  }

  function handleToggleExpand(jobId: string, next: boolean) {
    setExpandedId(next ? jobId : null);
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set('expandId', jobId);
    } else {
      params.delete('expandId');
    }
    router.replace(`/poslovi/?${params.toString()}`, { scroll: false });
  }

  function handleBidClick(job: Job) {
    if (!user) {
      router.push('/registracija/');
      return;
    }
    if (role === null) return;
    if (!isFirmRole(role)) {
      router.push('/dashboard/');
      return;
    }
    if (!isCategoryAllowed(job)) {
      setCategoryWarningJob(job);
      return;
    }
    router.push(`/dashboard/firma/?expandJobId=${job.id}`);
  }

  const filteredJobs = jobs
    .filter((job) => {
      const category = getCategory(job.category_slug);
      const categoryName = category?.name || job.category_slug;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.city.toLowerCase().includes(term) ||
        categoryName.toLowerCase().includes(term);
      const matchesCategory = !categoryFilter || job.category_slug === categoryFilter;
      const matchesCity = !cityFilter || job.city === cityFilter;
      const min = minBudget ? parseFloat(minBudget) : null;
      const max = maxBudget ? parseFloat(maxBudget) : null;
      const matchesBudget =
        (!min || (job.budget_max != null && job.budget_max >= min) || (job.budget_min != null && job.budget_min >= min)) &&
        (!max || (job.budget_min != null && job.budget_min <= max) || (job.budget_max != null && job.budget_max <= max));
      let matchesRok = true;
      if (rokFilter) {
        if (job.deadline) {
          const diffDays = (new Date(job.deadline).getTime() - Date.now()) / 86400000;
          matchesRok = diffDays >= 0 && diffDays <= parseInt(rokFilter, 10);
        }
      }
      return matchesSearch && matchesCategory && matchesCity && matchesBudget && matchesRok;
    })
    .sort((a, b) => {
      const aFeatured = isActiveFeatured(a) ? 1 : 0;
      const bFeatured = isActiveFeatured(b) ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      if (sortBy === 'nearest' && cityFilter) {
        const aNear = a.city === cityFilter ? 1 : 0;
        const bNear = b.city === cityFilter ? 1 : 0;
        if (aNear !== bNear) return bNear - aNear;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const activeFiltersCount = [
    search.trim(),
    categoryFilter,
    cityFilter,
    minBudget,
    maxBudget,
    rokFilter,
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch('');
    setCategoryFilter('');
    setCityFilter('');
    setMinBudget('');
    setMaxBudget('');
    setRokFilter('');
    setSortBy('newest');
    setOpenPanel(null);
  }

  const cities = Array.from(new Set(jobs.map((j) => j.city))).sort();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <JsonLd data={jobListSchema(filteredJobs)} />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Poslovi' }]} />

        {/* Header */}
        <section className="pt-20 md:pt-24 pb-4 md:pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Poslovi</h1>
                <p className="text-steel mt-1 text-sm md:text-base">Pronađi pravi posao za svoj projekat.</p>
              </div>
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-3 py-2 shrink-0">
                <Users className="w-5 h-5 text-brand-orange shrink-0" />
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  {jobs.length} {plural(jobs.length, ['aktivan posao', 'aktivna posla', 'aktivnih poslova'])}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Šta treba uraditi?"
                aria-label="Pretraži poslove"
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white text-[15px] text-gray-900 placeholder-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Očisti pretragu"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="relative mt-2.5">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                aria-label="Lokacija"
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white text-[15px] font-medium text-gray-900 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Cijela BiH</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
              {[
                { key: 'kategorija' as const, icon: LayoutGrid, label: categoryFilter ? getCategory(categoryFilter)?.name || 'Kategorija' : 'Kategorija', active: !!categoryFilter },
                { key: 'lokacija' as const, icon: MapPin, label: cityFilter || 'Lokacija', active: !!cityFilter },
                { key: 'budzet' as const, icon: Wallet, label: minBudget || maxBudget ? `${minBudget || '0'}–${maxBudget || '∞'} KM` : 'Budžet', active: !!(minBudget || maxBudget) },
                { key: 'rok' as const, icon: Calendar, label: rokFilter ? `Rok: ${rokFilter} dana` : 'Rok', active: !!rokFilter },
              ].map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setOpenPanel(openPanel === pill.key ? null : pill.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all min-h-[44px] max-w-[200px] ${
                    openPanel === pill.key || pill.active
                      ? 'bg-ink-950 text-white border-ink-950'
                      : 'bg-white text-gray-800 border-gray-200'
                  }`}
                >
                  <pill.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{pill.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${openPanel === pill.key ? 'rotate-180' : ''}`} />
                </button>
              ))}
            </div>

            {/* Filter panels */}
            {openPanel === 'kategorija' && (
              <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setCategoryFilter(''); setOpenPanel(null); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${!categoryFilter ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Sve kategorije
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => { setCategoryFilter(c.slug); setOpenPanel(null); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${categoryFilter === c.slug ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {openPanel === 'lokacija' && (
              <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setCityFilter(''); setOpenPanel(null); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${!cityFilter ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Cijela BiH
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => { setCityFilter(city); setOpenPanel(null); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${cityFilter === city ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}

            {openPanel === 'budzet' && (
              <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Min. (KM)</label>
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Max. (KM)</label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="∞"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => { setMinBudget(''); setMaxBudget(''); }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 min-h-[44px]"
                  >
                    Poništi
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenPanel(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-ink-950 text-white text-sm font-semibold min-h-[44px]"
                  >
                    Primijeni
                  </button>
                </div>
              </div>
            )}

            {openPanel === 'rok' && (
              <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-2">
                {[
                  { value: '' as const, label: 'Svi rokovi' },
                  { value: '7' as const, label: 'Do 7 dana' },
                  { value: '30' as const, label: 'Do 30 dana' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => { setRokFilter(opt.value); setOpenPanel(null); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${rokFilter === opt.value ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Sort toggle */}
            <div className="flex bg-gray-100 rounded-full p-1 mt-2.5">
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all min-h-[44px] ${
                  sortBy === 'newest' ? 'bg-ink-950 text-white shadow' : 'text-gray-500'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Najnoviji
              </button>
              <button
                type="button"
                onClick={() => setSortBy('nearest')}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all min-h-[44px] ${
                  sortBy === 'nearest' ? 'bg-ink-950 text-white shadow' : 'text-gray-500'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Najbliži
              </button>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2.5 text-sm text-brand-orange font-semibold inline-flex items-center gap-1 min-h-[36px]"
              >
                <X className="w-4 h-4" /> Poništi filtere ({activeFiltersCount})
              </button>
            )}
          </div>
        </section>

        <section id="listings" className="pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {loading ? (
              <div className="space-y-3 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 animate-pulse">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="w-2/3 h-5 bg-gray-200 rounded" />
                        <div className="w-1/2 h-4 bg-gray-200 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-24 h-8 bg-gray-200 rounded-lg" />
                        <div className="w-20 h-8 bg-gray-200 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-8 md:p-12 lg:p-16 text-center mb-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-5 md:mb-6">
                  <Search className="w-8 h-8 md:w-10 md:h-10 text-brand-orange" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {activeFiltersCount > 0 ? 'Nema poslova za izabrane filtere' : 'Trenutno nema otvorenih poslova'}
                </h3>
                <p className="text-steel max-w-md mx-auto mb-6 md:mb-8">
                  {activeFiltersCount > 0
                    ? 'Pokušajte poništiti filtere ili se vratite kasnije.'
                    : 'Budite prvi koji će objaviti posao i primiti ponude od provjerenih firmi.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFiltersCount > 0 ? (
                    <button onClick={clearFilters} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]">
                      <X className="w-4 h-4" /> Poništi filtere
                    </button>
                  ) : (
                    <Link href="/objavi-projekat/" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors min-h-[48px]">
                      Objavi prvi posao <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <Link href="/registracija/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]">
                    Registruj firmu <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:gap-5 mb-12">
                {filteredJobs.map((job) => (
                  <ProjectListCard
                    key={job.id}
                    job={job as unknown as import('@/components/ProjectListCard').ProjectListCardJob}
                    onSendOffer={() => handleBidClick(job)}
                    expanded={expandedId === job.id}
                    onToggleExpand={handleToggleExpand}
                  />
                ))}
              </div>
            )}

            {/* Upozorenje za kategoriju */}
            {categoryWarningJob && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {firmCategories.length === 0
                          ? 'Nemate odabranih kategorija'
                          : 'Ne pokrivate ovu kategoriju'}
                      </h3>
                      <p className="text-sm text-steel">
                        {firmCategories.length === 0
                          ? 'Prije slanja ponude morate u profilu firme odabrati kategorije koje pokrivate.'
                          : <>Da biste poslali ponudu za posao <strong>{categoryWarningJob.title}</strong> u kategoriji{' '}
                            <strong>{getCategory(categoryWarningJob.category_slug)?.name || categoryWarningJob.category_slug}</strong>,
                            morate dodati tu uslugu u profilu svoje firme.</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/dashboard/firma/profil/"
                      onClick={() => setCategoryWarningJob(null)}
                      className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors"
                    >
                      Idi na Profil firme
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setCategoryWarningJob(null)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-steel hover:bg-gray-100 transition-colors"
                    >
                      Zatvori
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Provjereni majstori - ispod poslova */}
            <RecommendedFirmsSection />

            {/* CTA za firme */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-14 text-center border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6">
                  <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-brand-orange" />
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Želite slati ponude na ove poslove?</h2>
                <p className="text-steel mb-6 md:mb-8 max-w-xl mx-auto">
                  Registrujte firmu besplatno, pregledajte poslove u vašoj kategoriji i pošaljite prvu ponudu već danas.
                </p>
                <Link
                  href="/registracija/"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-orange text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold hover:bg-brand-orange-dark transition-all active:scale-95 min-h-[48px]"
                >
                  Registrujte firmu besplatno
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
        </main>
        <Footer />
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}
