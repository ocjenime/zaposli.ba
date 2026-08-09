'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin, Clock, ArrowRight, Loader2, Send,
  Calendar, ImageIcon, ChevronDown, ChevronUp, X, Search, SlidersHorizontal,
  ArrowUpDown, ShieldCheck, Wallet, AlertTriangle, Briefcase, Sparkles,
  Banknote, Tag, LayoutGrid,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FeaturedBadge from '@/components/FeaturedBadge';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { getCategory, categories } from '@/lib/data';
import { formatDate } from '@/lib/date';
import { JsonLd, jobListSchema, breadcrumbSchema } from '@/lib/jsonld';

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
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')} - ${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Budžet po dogovoru';
}

function formatBudgetShort(job: Job) {
  if (job.budget_mode === 'open') return 'po dogovoru';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')}-${job.budget_max.toLocaleString('bs')} KM`;
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
      .select('id,title,description,city,address,category_slug,status,created_at,budget_mode,budget_min,budget_max,deadline,bids_count,is_featured,featured_until')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Greška prilikom učitavanja poslova.');
    } else {
      setJobs((data as Job[]) || []);
    }
    setLoading(false);
  }, []);

  const fetchImages = useCallback(async (jobId: string) => {
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
  }, [jobImages]);

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
    const expandId = searchParams.get('expandId');
    if (expandId) {
      setExpandedJobId(expandId);
      fetchImages(expandId);
    }
  }, [searchParams, fetchImages]);

  useEffect(() => {
    if (user && isFirmRole(role)) loadFirmCategories();
  }, [user, role, loadFirmCategories]);

  function isActiveFeatured(job: Job) {
    if (!job.is_featured || !job.featured_until) return false;
    return new Date(job.featured_until).getTime() > Date.now();
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
    return firmCategories.length > 0 && firmCategories.includes(job.category_slug);
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
      <JsonLd data={breadcrumbSchema([{ name: 'Početna', url: '/' }, { name: 'Poslovi', url: '/poslovi/' }])} />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Poslovi' }]} />

        {/* Hero - premium dark Higgsfield style with full-bleed image */}
        <section className="relative overflow-hidden border-b border-white/5">
          <Image
            src="/images/poslovi-hero.jpg"
            alt="Majstor na poslu - varilački radovi"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 md:pt-40 pb-16 md:pb-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide uppercase mb-6">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                Uživo objavljeni poslovi
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                Pronađite svoj <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">sljedeći posao</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
                Stvarni klijenti širom Bosne i Hercegovine svakodnevno objavljuju poslove.
                Filtrirajte, sortirajte i pošaljite ponudu za manje od minuta.
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl shadow-black/30">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyHeroSearch()}
                      placeholder="npr. adaptacija kupatila u Sarajevu"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 outline-none text-base focus:bg-white/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={applyHeroSearch}
                    className="shrink-0 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-brand-orange/30"
                  >
                    Pretraži
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { icon: Clock, label: 'Prve ponude u 24h' },
                    { icon: Wallet, label: 'Bez provizije' },
                    { icon: LayoutGrid, label: 'Sve kategorije' },
                    { icon: ShieldCheck, label: 'Verificirane firme' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90">
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-orange shrink-0" />
                        <p className="text-xs md:text-sm font-medium text-left leading-tight">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="listings" className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Filter bar - sticky, pill-style */}
            <div className="sticky top-16 md:top-20 z-30 bg-[#f8f7f4]/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 md:py-4 mb-6 md:mb-8 border-b border-gray-200/60">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                    <div className="relative flex-1 md:max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pretraži poslove..."
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
                          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                          className="pl-9 pr-7 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none appearance-none cursor-pointer min-h-[44px]"
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
                  <p className="text-sm text-steel md:text-right">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'posao' : filteredJobs.length < 5 ? 'posla' : 'poslova'}
                    {activeFiltersCount > 0 && <span className="text-gray-400"> / {jobs.length} ukupno</span>}
                  </p>
                </div>

                {showFilters && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 mt-3 border-t border-gray-200/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategorija</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
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
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
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
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Max. budžet (KM)</label>
                      <input
                        type="number"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        placeholder="npr. 5000"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none min-h-[44px]"
                      />
                    </div>
                  </div>
                )}

                {activeFiltersCount > 0 && (
                  <div className="flex items-start md:items-center justify-between gap-3 pt-3 mt-3 border-t border-gray-200/60">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                        {search && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                            {search}
                            <button onClick={() => setSearch('')} aria-label="Ukloni pretragu" className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"><X className="w-3 h-3" /></button>
                          </span>
                        )}
                        {categoryFilter && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                            {getCategory(categoryFilter)?.name || categoryFilter}
                            <button onClick={() => setCategoryFilter('')} aria-label="Ukloni filter kategorije" className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"><X className="w-3 h-3" /></button>
                          </span>
                        )}
                        {cityFilter && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                            {cityFilter}
                            <button onClick={() => setCityFilter('')} aria-label="Ukloni filter grada" className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"><X className="w-3 h-3" /></button>
                          </span>
                        )}
                        {(minBudget || maxBudget) && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-700 whitespace-nowrap">
                            {minBudget || '0'} - {maxBudget || '∞'} KM
                            <button onClick={() => { setMinBudget(''); setMaxBudget(''); }} aria-label="Ukloni filter budžeta" className="hover:text-brand-orange w-5 h-5 flex items-center justify-center -mr-1"><X className="w-3 h-3" /></button>
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
              <div className="space-y-3 mb-12">
                {filteredJobs.map((job) => {
                  const category = getCategory(job.category_slug);
                  const isExpanded = expandedJobId === job.id;
                  const images = jobImages[job.id] || [];
                  return (
                    <article
                      key={job.id}
                      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md ${
                        isExpanded ? 'ring-1 ring-brand-orange/20 shadow-lg' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleExpand(job.id)}
                        className="w-full text-left p-4 md:p-5"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                              <Tag className="w-5 h-5 text-brand-orange" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">{job.title}</h3>
                                {isActiveFeatured(job) && <FeaturedBadge />}
                              </div>
                              <div className="flex items-center gap-3 text-xs md:text-sm text-steel mt-0.5 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" /> {job.city}{job.address ? `, ${job.address}` : ''}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {relativeTime(job.created_at)}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                  {category?.name || job.category_slug}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:justify-end shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 text-sm font-semibold text-brand-orange">
                              <Banknote className="w-4 h-4" />
                              {formatBudgetShort(job)}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-gray-100 text-sm font-semibold text-gray-600">
                              {job.bids_count} {job.bids_count === 1 ? 'ponuda' : job.bids_count >= 2 && job.bids_count <= 4 ? 'ponude' : 'ponuda'}
                            </span>
                            <span className={`inline-flex items-center text-brand-orange transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                              <ChevronDown className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 md:px-5 pb-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-steel text-sm leading-relaxed py-4">{job.description}</p>

                          {job.deadline && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                              <Calendar className="w-4 h-4 text-brand-orange" />
                              Rok: {formatDate(job.deadline)}
                            </div>
                          )}

                          {loadingImages === job.id ? (
                            <div className="flex items-center gap-2 text-sm text-steel py-2 mb-4">
                              <Loader2 className="w-4 h-4 animate-spin" /> Učitavanje fotografija...
                            </div>
                          ) : images.length > 0 ? (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-brand-orange" /> Fotografije
                              </h4>
                              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                {images.map((img) => (
                                  <button
                                    key={img.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImage({ url: img.image_url, title: job.title });
                                    }}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand-orange transition"
                                    aria-label={`Pogledaj fotografiju posla: ${job.title}`}
                                  >
                                    <Image
                                      src={img.image_url}
                                      alt={`Fotografija posla: ${job.title}`}
                                      fill
                                      sizes="96px"
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBidClick(job);
                            }}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                            {!mounted ? 'Pošalji ponudu' : user ? (isFirmRole(role) ? 'Pošalji ponudu' : 'Moj dashboard') : 'Prijavi se da pošalješ ponudu'}
                          </button>
                        </div>
                      )}
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
                  <Image
                    src={selectedImage.url}
                    alt={`Uvećana fotografija posla: ${selectedImage.title}`}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    unoptimized
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
