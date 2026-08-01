'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin, Clock, BadgeCheck, ArrowRight, Loader2, Send, DollarSign,
  Calendar, ImageIcon, ChevronDown, ChevronUp, X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';

interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  category_slug: string;
  status: string;
  created_at: string;
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

function formatBudget(min: number | null, max: number | null) {
  if (min && max) return `${min.toLocaleString('bs')} – ${max.toLocaleString('bs')} KM`;
  if (min) return `Od ${min.toLocaleString('bs')} KM`;
  if (max) return `Do ${max.toLocaleString('bs')} KM`;
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      .select('id,title,description,city,category_slug,status,created_at,budget_min,budget_max,deadline,bids_count')
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Poslovi' }]} />
        <PageHero
          title="Aktivni poslovi"
          subtitle="Stvarni poslovi klijenata širom BiH: registrujte firmu i pošaljite ponudu"
        />

        <section className="py-14 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-steel">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje poslova...
              </div>
            ) : error ? (
              <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 text-center">{error}</p>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-steel mb-4">Trenutno nema otvorenih poslova.</p>
                <Link href="/objavi-projekat/" className="btn-primary">
                  Objavi prvi posao
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5 mb-12">
                {jobs.map((job) => {
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
                        {(job.budget_min != null || job.budget_max != null) && (
                          <span className="flex items-center gap-1.5 font-medium text-gray-700">
                            <DollarSign className="w-3.5 h-3.5 text-brand-orange" />{formatBudget(job.budget_min, job.budget_max)}
                          </span>
                        )}
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
                                    onClick={() => setSelectedImage(img.image_url)}
                                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand-orange transition"
                                  >
                                    <img src={img.image_url} alt="Fotografija posla" className="w-full h-full object-cover" />
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
                              {!mounted ? 'Pošalji ponudu' : user ? (isFirmRole(role) ? 'Pošalji ponudu' : 'Moj dashboard') : 'Prijavi se da pošalješ ponudu'}
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
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-4xl w-full max-h-[90vh]">
                  <img
                    src={selectedImage}
                    alt="Uvećana fotografija posla"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-10 right-0 text-white text-sm hover:text-brand-orange flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Zatvori
                  </button>
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
