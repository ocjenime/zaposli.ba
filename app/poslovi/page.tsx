'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin, Clock, ArrowRight, Loader2, Send,
  Calendar, ImageIcon, ChevronDown, ChevronUp, X, Search, SlidersHorizontal,
  ArrowUpDown, ShieldCheck, Wallet, AlertTriangle, Briefcase, Sparkles,
  Banknote, Tag,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FeaturedBadge from '@/components/FeaturedBadge';
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
}

interface JobImage {
  id: string;
  image_url: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return 'upravo objavljeno';
  if (minutes < 60) return `prije ${minutes} min`;
  if (hours < 24) return `prije ${hours} h`;
  if (days === 1) return 'jučer';
  if (days < 7) return `prije ${days} dana`;
  return formatDate(iso);
}

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')} – ${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Budžet po dogovoru';
}

function formatBudgetShort(job: Job) {
  if (job.budget_mode === 'open') return 'po dogovoru';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')}–${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'po dogovoru';
}

function ProjectsPageContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobImages, setJobImages] = useState<Record<string, JobImage[]>>({});
  const [loadingImages, setLoadingImages] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'budget-asc' | 'budget-desc' | 'bids'>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [firmCategories, setFirmCategories] = useState<string[]>([]);
  const [categoryWarningJob, setCategoryWarningJob] = useState<Job | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const { user, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    loadJobs();
  }, []);

  useEffect(() => {
    const expandId = searchParams.get('expandId');
    if (expandId) {
      setExpandedJobId(expandId);
      fetchImages(expandId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && isFirmRole(role)) loadFirmCategories();
  }, [user, role]);

  async function loadFirmCategories() {
    const { data: firmData } = await supabase
      .from('firms')
      .select('id')
      .eq('owner_id', user!.id)
      .single();
    if (!firmData) return;
    const { data: catData } = await supabase
      .from('firm_categories')
      .select('category_slug')
      .eq('firm_id', firmData.id);
    setFirmCategories((catData as { category_slug: string }[] | null)?.map((c) => c.category_slug) || []);
  }

  function isActiveFeatured(job: Job) {
    if (!job.is_featured || !job.featured_until) return false;
    return new Date(job.featured_until).getTime() > Date.now();
  }

  async function loadJobs() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('id,title,description,city,address,category_slug,status,created_at,budget_mode,budget_min,budget_max,deadline,bids_count,is_featured,featured_until')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Greška prilikom učitavanja poslova.');
    } else {
      setJobs((data as Job[]) || []);
    }
    setLoading(false);
  }

  async function fetchImages(jobId: string) {
    if (jobImages[jobId]) return;
    setLoadingImages(jobId);
    const { data, error: err } = await supabase
      .from('job_images')
      .select('id, image_url')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });
    if (!err) {
      setJobImages((prev) => ({ ...prev, [jobId]: (data as JobImage[]) || [] }));
    }
    setLoadingImages(null);
  }

  function toggleExpand(jobId: string) {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      fetchImages(jobId);
    }
  }

  function isCategoryAllowed(job: Job) {
    if (firmCategories.length === 0) return true;
    return firmCategories.includes(job.category_slug);
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

  function applyHeroSearch() {
    if (heroSearch.trim()) {
      setSearch(heroSearch.trim());
      const section = document.getElementById('listings');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
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
      return matchesSearch && matchesCategory && matchesCity && matchesBudget;
    })
    .sort((a, b) => {
      const aFeatured = isActiveFeatured(a) ? 1 : 0;
      const bFeatured = isActiveFeatured(b) ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      if (sortBy === 'newest' || sortBy === 'featured') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'budget-asc') return (a.budget_min || a.budget_max || 0) - (b.budget_min || b.budget_max || 0);
      if (sortBy === 'budget-desc') return (b.budget_min || b.budget_max || 0) - (a.budget_min || a.budget_max || 0);
      if (sortBy === 'bids') return b.bids_count - a.bids_count;
      return 0;
    });

  const activeFiltersCount = [
    search.trim(),
    categoryFilter,
    cityFilter,
    minBudget,
    maxBudget,
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch('');
    setHeroSearch('');
    setCategoryFilter('');
    setCityFilter('');
    setMinBudget('');
    setMaxBudget('');
    setSortBy('featured');
  }

  const cities = Array.from(new Set(jobs.map((j) => j.city))).sort();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <JsonLd data={jobListSchema(filteredJobs)} />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Poslovi' }]} />

        {/* Hero — light, editorial, search-first */}
        <section className="relative bg-white border-b border-gray-100">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.06),_transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-brand-orange text-xs font-semibold tracking-wide uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                Uživo objavljeni poslovi
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.05] mb-6">
                Pronađite svoj <span className="text-brand-orange">sljedeći posao</span>
              </h1>
              <p className="text-lg md:text-xl text-steel max-w-2xl mx-auto leading-relaxed mb-10">
                Stvarni klijenti širom Bosne i Hercegovine svakodnevno objavljuju poslove. 
                Filtrirajte, sortirajte i pošaljite ponudu za manje od minuta.
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-2 shadow-lg shadow-gray-200/50 focus-within:ring-4 focus-within:ring-brand-orange/10 focus-within:border-brand-orange transition-all">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyHeroSearch()}
                      placeholder="npr. adaptacija kupatila u Sarajevu"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none text-base"
                    />
                  </div>
                  <button
                    onClick={applyHeroSearch}
                    className="shrink-0 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3.5 rounded-xl font-semibold transition-all active:scale-95"
                  >
                    Pretraži
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-steel">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-orange" /> Verificirane firme</span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4 text-brand-orange" /> Bez provizije</span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-orange" /> Ponude u 24h</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="listings" className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Filter bar — sticky, pill-style */}
            <div className="sticky top-16 md:top-20 z-30 bg-[#f8f7f4]/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8 border-b border-gray-200/60">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pretraži poslove..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none transition-all"
                      />
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                      <button
                        onClick={() => setShowFilters((s) => !s)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
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
                          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                          className="pl-9 pr-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none appearance-none cursor-pointer"
                        >
                          <option value="featured">Istaknuti prvo</option>
                          <option value="newest">Najnovije</option>
                          <option value="budget-asc">Budžet: rastući</option>
                          <option value="budget-desc">Budžet: opadajući</option>
                          <option value="bids">Najviše ponuda</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-steel lg:text-right">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'posao' : filteredJobs.length < 5 ? 'posla' : 'poslova'}
                    {activeFiltersCount > 0 && <span className="text-gray-400"> / {jobs.length} ukupno</span>}
                  </p>
                </div>

                {showFilters && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 mt-4 border-t border-gray-200/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategorija</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                      >
                        <option value="">Sve kategorije</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Grad</label>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                      >
                        <option value="">Svi gradovi</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Min. budžet (KM)</label>
                      <input
                        type="number"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        placeholder="npr. 500"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Max. budžet (KM)</label>
                      <input
                        type="number"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        placeholder="npr. 5000"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeFiltersCount > 0 && (
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/60">
                    <div className="flex flex-wrap items-center gap-2">
                      {search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700">
                          {search}
                          <button onClick={() => setSearch('')} className="hover:text-brand-orange"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {categoryFilter && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700">
                          {getCategory(categoryFilter)?.name || categoryFilter}
                          <button onClick={() => setCategoryFilter('')} className="hover:text-brand-orange"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {cityFilter && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700">
                          {cityFilter}
                          <button onClick={() => setCityFilter('')} className="hover:text-brand-orange"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {(minBudget || maxBudget) && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700">
                          {minBudget || '0'} – {maxBudget || '∞'} KM
                          <button onClick={() => { setMinBudget(''); setMaxBudget(''); }} className="hover:text-brand-orange"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-brand-orange font-semibold hover:text-brand-orange-dark flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Poništi sve
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-200" />
                    <div className="p-6">
                      <div className="w-24 h-5 bg-gray-200 rounded-full mb-4" />
                      <div className="w-3/4 h-6 bg-gray-200 rounded mb-3" />
                      <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                      <div className="w-2/3 h-4 bg-gray-200 rounded mb-5" />
                      <div className="flex gap-3 mb-5">
                        <div className="w-28 h-4 bg-gray-200 rounded" />
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                      </div>
                      <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                        <div className="w-28 h-8 bg-gray-200 rounded-xl" />
                        <div className="w-24 h-4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 text-center">{error}</p>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 md:p-16 text-center mb-12">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-brand-orange" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeFiltersCount > 0 ? 'Nema poslova za izabrane filtere' : 'Trenutno nema otvorenih poslova'}
                </h3>
                <p className="text-steel max-w-md mx-auto mb-8">
                  {activeFiltersCount > 0
                    ? 'Pokušajte poništiti filtere ili se vratite kasnije.'
                    : 'Budite prvi koji će objaviti posao i primiti ponude od provjerenih firmi.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFiltersCount > 0 ? (
                    <button onClick={clearFilters} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      <X className="w-4 h-4" /> Poništi filtere
                    </button>
                  ) : (
                    <Link href="/objavi-projekat/" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors">
                      Objavi prvi posao <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <Link href="/registracija/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Registruj firmu <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {filteredJobs.map((job) => {
                  const category = getCategory(job.category_slug);
                  const isExpanded = expandedJobId === job.id;
                  const images = jobImages[job.id] || [];
                  return (
                    <article
                      key={job.id}
                      className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 ${
                        isExpanded ? 'ring-2 ring-brand-orange/20 shadow-xl shadow-gray-200/50' : ''
                      }`}
                    >
                      {/* Card header image band */}
                      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.08),_transparent_60%)]" />
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm border border-gray-100">
                            <Tag className="w-3 h-3 text-brand-orange" />
                            {category?.name || job.category_slug}
                          </span>
                          {isActiveFeatured(job) && <FeaturedBadge />}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-gray-600 shadow-sm border border-gray-100">
                            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                            {job.city}{job.address ? `, ${job.address}` : ''}
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-gray-600 shadow-sm border border-gray-100">
                            <Clock className="w-3.5 h-3.5 text-brand-orange" />
                            {relativeTime(job.created_at)}
                          </div>
                        </div>
                        {job.bids_count > 0 && (
                          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold shadow-sm">
                            {job.bids_count} {job.bids_count === 1 ? 'ponuda' : 'ponude'}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">{job.title}</h3>
                        <p className={`text-steel text-sm leading-relaxed mb-5 ${isExpanded ? '' : 'line-clamp-2'}`}>{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-sm font-semibold text-brand-orange">
                            <Banknote className="w-4 h-4" />
                            {formatBudgetShort(job)}
                          </span>
                          {job.deadline && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              Rok: {formatDate(job.deadline)}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-sm text-green-700">
                            <Briefcase className="w-4 h-4" />
                            Otvoren za ponude
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="mb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                            {loadingImages === job.id ? (
                              <div className="flex items-center gap-2 text-sm text-steel py-3">
                                <Loader2 className="w-4 h-4 animate-spin" /> Učitavanje fotografija...
                              </div>
                            ) : images.length > 0 ? (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4 text-brand-orange" /> Fotografije posla
                                </h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                  {images.map((img) => (
                                    <button
                                      key={img.id}
                                      onClick={() => setSelectedImage({ url: img.image_url, title: job.title })}
                                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand-orange transition"
                                    >
                                      <img src={img.image_url} alt={`Fotografija posla: ${job.title}`} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            <button
                              onClick={() => handleBidClick(job)}
                              className="mt-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors active:scale-95"
                            >
                              <Send className="w-4 h-4" />
                              {!mounted ? 'Pošalji ponudu' : user ? (isFirmRole(role) ? 'Pošalji ponudu' : 'Moj dashboard') : 'Prijavi se da pošalješ ponudu'}
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                          <span className="text-xs text-steel">{formatDate(job.created_at)}</span>
                          <button
                            onClick={() => toggleExpand(job.id)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
                          >
                            {isExpanded ? (
                              <><ChevronUp className="w-4 h-4" /> Manje detalja</>
                            ) : (
                              <><ChevronDown className="w-4 h-4" /> Više detalja</>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {selectedImage && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
                onClick={() => setSelectedImage(null)}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Zatvori"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                  <img
                    src={selectedImage.url}
                    alt={`Uvećana fotografija posla: ${selectedImage.title}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
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
                      <h3 className="font-bold text-gray-900 mb-1">Ne pokrivate ovu kategoriju</h3>
                      <p className="text-sm text-steel">
                        Da biste poslali ponudu za posao <strong>{categoryWarningJob.title}</strong> u kategoriji{' '}
                        <strong>{getCategory(categoryWarningJob.category_slug)?.name || categoryWarningJob.category_slug}</strong>,
                        morate dodati tu uslugu u profilu svoje firme.
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

            {/* CTA za firme */}
            <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Želite slati ponude na ove poslove?</h2>
                <p className="text-steel mb-8 max-w-xl mx-auto">
                  Registrujte firmu besplatno, pregledajte poslove u vašoj kategoriji i pošaljite prvu ponudu već danas.
                </p>
                <Link
                  href="/registracija/"
                  className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-orange-dark transition-all active:scale-95"
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
