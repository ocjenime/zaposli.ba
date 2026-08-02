'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin, Clock, BadgeCheck, ArrowRight, Loader2, Send, DollarSign,
  Calendar, ImageIcon, ChevronDown, ChevronUp, X, Search, SlidersHorizontal,
  ArrowUpDown, ShieldCheck, LayoutGrid, Wallet,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { getCategory, categories } from '@/lib/data';

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
}

interface JobImage {
  id: string;
  image_url: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min && job.budget_max) return `${job.budget_min.toLocaleString('bs')} – ${job.budget_max.toLocaleString('bs')} KM`;
  if (job.budget_min) return `Od ${job.budget_min.toLocaleString('bs')} KM`;
  if (job.budget_max) return `Do ${job.budget_max.toLocaleString('bs')} KM`;
  return 'Budžet po dogovoru';
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
  const [sortBy, setSortBy] = useState<'newest' | 'budget-asc' | 'budget-desc' | 'bids'>('newest');
  const [showFilters, setShowFilters] = useState(false);
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

  async function loadJobs() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('id,title,description,city,address,category_slug,status,created_at,budget_mode,budget_min,budget_max,deadline,bids_count')
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

  function handleBidClick(jobId: string) {
    if (!user) {
      router.push('/registracija/');
      return;
    }
    if (!isFirmRole(role)) {
      router.push('/dashboard/');
      return;
    }
    router.push(`/dashboard/firma/?expandJobId=${jobId}`);
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
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
    setCategoryFilter('');
    setCityFilter('');
    setMinBudget('');
    setMaxBudget('');
    setSortBy('newest');
  }

  const cities = Array.from(new Set(jobs.map((j) => j.city))).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Poslovi' }]} />

        {/* Premium banner — world-class editorial layout */}
        <section className="relative overflow-hidden bg-ink">
          {/* Ambient gradient layers */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#2d2d3a] rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,125,0,0.12),transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,18,0)_0%,rgba(13,13,18,0.85)_100%)]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium tracking-wide uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                Uživo objavljeni poslovi
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                Pronađite posao <br className="hidden md:block" />
                <span className="text-brand-orange">po vašoj mjeri.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-8">
                Stvarni klijenti širom Bosne i Hercegovine objavljuju poslove svaki dan. 
                Filtrirajte, sortirajte i pošaljite ponudu za manje od minuta.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/registracija/"
                  className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-all active:scale-95"
                >
                  Registrujte firmu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/za-firme/"
                  className="inline-flex items-center gap-2 text-white/80 font-medium hover:text-white transition-colors"
                >
                  Kako funkcioniše
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              {[
                { icon: Clock, label: 'Prve ponude u 24h' },
                { icon: Wallet, label: 'Bez provizije' },
                { icon: LayoutGrid, label: 'Sve kategorije' },
                { icon: ShieldCheck, label: 'Verificirane firme' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-ink/90 backdrop-blur-sm px-6 py-5 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
                    <Icon className="w-5 h-5 text-brand-orange shrink-0" />
                    <p className="text-sm text-white/80 font-medium">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-14 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search & filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pretraži poslove po nazivu, kategoriji, gradu..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setShowFilters((s) => !s)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand-orange hover:text-brand-orange transition-colors w-full sm:w-auto"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filteri
                    {activeFiltersCount > 0 && (
                      <span className="bg-brand-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none appearance-none bg-white w-full sm:min-w-[160px]"
                    >
                      <option value="newest">Najnovije</option>
                      <option value="budget-asc">Budžet: rastući</option>
                      <option value="budget-desc">Budžet: opadajući</option>
                      <option value="bids">Najviše ponuda</option>
                    </select>
                  </div>
                </div>
              </div>

              {showFilters && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategorija</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none bg-white"
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
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none bg-white"
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
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Max. budžet (KM)</label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="npr. 5000"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-steel">{filteredJobs.length} od {jobs.length} poslova</p>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-brand-orange font-medium hover:text-brand-orange-dark flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Poništi filtere
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-5 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-24 h-6 bg-gray-200 rounded-lg" />
                      <div className="w-20 h-4 bg-gray-200 rounded" />
                    </div>
                    <div className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
                    <div className="w-full h-4 bg-gray-200 rounded mb-1" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded mb-4" />
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="w-24 h-4 bg-gray-200 rounded" />
                      <div className="w-28 h-4 bg-gray-200 rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="w-28 h-6 bg-gray-200 rounded-lg" />
                      <div className="w-24 h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 text-center">{error}</p>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-14 text-center mb-12">
                <div className="w-16 h-16 bg-cloud rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Search className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activeFiltersCount > 0 ? 'Nema poslova za izabrane filtere' : 'Trenutno nema otvorenih poslova'}
                </h3>
                <p className="text-steel max-w-md mx-auto mb-6">
                  {activeFiltersCount > 0
                    ? 'Pokušajte poništiti filtere ili se vratite kasnije.'
                    : 'Budite prvi koji će objaviti posao i primiti ponude od provjerenih firmi.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFiltersCount > 0 ? (
                    <button onClick={clearFilters} className="btn-secondary inline-flex items-center justify-center gap-2">
                      Poništi filtere
                    </button>
                  ) : (
                    <Link href="/objavi-projekat/" className="btn-primary inline-flex items-center justify-center gap-2">
                      Objavi prvi posao <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <Link href="/registracija/" className="btn-secondary inline-flex items-center justify-center gap-2">
                    Registruj firmu <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5 mb-12">
                {filteredJobs.map((job) => {
                  const category = getCategory(job.category_slug);
                  const isExpanded = expandedJobId === job.id;
                  const images = jobImages[job.id] || [];
                  return (
                    <div
                      key={job.id}
                      className={`bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 ${
                        isExpanded ? 'ring-2 ring-brand-orange/20 shadow-xl' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-brand-orange">
                            {category?.name || job.category_slug}
                          </span>
                        </div>
                        <span className="text-xs text-steel">{formatDate(job.created_at)}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                      <p className={`text-steel text-sm mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>{job.description}</p>

                      <div className="flex flex-wrap gap-3 text-xs text-steel mb-4">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.city}</span>
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <DollarSign className="w-3.5 h-3.5 text-brand-orange" />{formatBudget(job)}
                        </span>
                        {job.deadline && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange" />Rok: {formatDate(job.deadline)}
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          {loadingImages === job.id ? (
                            <div className="flex items-center gap-2 text-sm text-steel py-3">
                              <Loader2 className="w-4 h-4 animate-spin" /> Učitavanje fotografija...
                            </div>
                          ) : images.length > 0 ? (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Fotografije posla
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

                          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-100">
                            <button
                              onClick={() => handleBidClick(job.id)}
                              className="inline-flex items-center gap-1.5 text-sm py-2 px-4 rounded-xl font-medium bg-orange-50 text-brand-orange hover:bg-orange-100 transition-colors"
                            >
                              <Send className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {!mounted ? 'Pošalji ponudu' : user ? (isFirmRole(role) ? 'Pošalji ponudu' : 'Moj dashboard') : 'Prijavi se da pošalješ ponudu'}
                              </span>
                              <span className="sm:hidden">
                                {!mounted ? 'Pošalji ponudu' : user ? (isFirmRole(role) ? 'Pošalji ponudu' : 'Dashboard') : 'Prijavi se'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-steel">
                          <span className="flex items-center gap-1.5 bg-cloud px-2.5 py-1 rounded-lg">
                            <BadgeCheck className="w-3.5 h-3.5 text-brand-orange" />
                            Otvoren za ponude
                          </span>
                          {job.bids_count > 0 && (
                            <span className="bg-cloud px-2.5 py-1 rounded-lg">{job.bids_count} ponuda</span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleExpand(job.id)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:text-brand-orange-dark transition-colors"
                        >
                          {isExpanded ? (
                            <><ChevronUp className="w-4 h-4" /> Manje detalja</>
                          ) : (
                            <><ChevronDown className="w-4 h-4" /> Više detalja</>
                          )}
                        </button>
                      </div>
                    </div>
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

            {/* CTA za firme */}
            <div className="bg-ink rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-4">Želite slati ponude na ove poslove?</h2>
                <p className="text-[#ffffff]/60 mb-8 max-w-xl mx-auto">
                  Registrujte firmu besplatno, pregledajte poslove u vašoj kategoriji i pošaljite prvu ponudu već danas.
                </p>
                <Link
                  href="/registracija/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
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
