'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/ui/DashboardHeader';
import DashboardStat from '@/components/ui/DashboardStat';
import EmptyState from '@/components/ui/EmptyState';
import FeaturedBadge from '@/components/FeaturedBadge';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import {
  getPlanAndUsage,
  Subscription,
  remainingBidsText,
  getResetCountdownText,
  formatDateTime,
} from '@/lib/subscriptions';
import {
  MapPin,
  Tag,
  Loader2,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Crown,
  AlertTriangle,
  DollarSign,
  Calendar,
  ImageIcon,
  ArrowRight,
  Settings,
  Timer,
} from 'lucide-react';

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
  image_count?: number;
  is_featured: boolean | null;
  featured_until: string | null;
}

interface Bid {
  id: string;
  job_id: string;
  firm_id: string;
  amount: number;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  jobs: Job | null;
}

type BidStatus = Bid['status'];

const statusLabels: Record<BidStatus, string> = {
  pending: 'Na čekanju',
  accepted: 'Prihvaćena',
  rejected: 'Odbijena',
};

const statusIcons: Record<BidStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  accepted: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const statusBadgeClasses: Record<BidStatus, string> = {
  pending: 'bg-gray-100 text-steel border-gray-200',
  accepted: 'bg-success-50 text-success-700 border-success-100',
  rejected: 'bg-gray-100 text-gray-500 border-gray-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long' });
}

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min != null && job.budget_max != null) {
    return `${job.budget_min}–${job.budget_max} KM`;
  }
  if (job.budget_min != null) return `od ${job.budget_min} KM`;
  if (job.budget_max != null) return `do ${job.budget_max} KM`;
  return 'Budžet po dogovoru';
}

function FirmDashboardContent() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firmId, setFirmId] = useState<string | null>(null);
  const [openJobs, setOpenJobs] = useState<Job[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [loadingFirm, setLoadingFirm] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [error, setError] = useState('');

  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitJobId, setSubmitJobId] = useState<string | null>(null);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bidsUsed, setBidsUsed] = useState(0);
  const [bidsLimit, setBidsLimit] = useState(0);
  const [canBid, setCanBid] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [activeTab, setActiveTab] = useState<'jobs' | 'bids'>('jobs');

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/prijava/');
      else if (!isFirmRole(role)) router.push('/dashboard/');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    const expandId = searchParams.get('expandJobId');
    if (expandId) {
      setExpandedJob(expandId);
      setActiveTab('jobs');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && isFirmRole(role)) fetchFirm();
  }, [user, role]);

  async function fetchFirm() {
    if (!user) return;
    setLoadingFirm(true);
    setError('');

    const { data, error: err } = await supabase
      .from('firms')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (err || !data) {
      setError('Nije pronađena firma povezana sa vašim nalogom. Registrujte firmu.');
      setLoadingFirm(false);
      return;
    }

    setFirmId(data.id);
    setLoadingFirm(false);

    await Promise.all([fetchOpenJobs(), fetchMyBids(data.id), loadPlan(data.id)]);
  }

  async function loadPlan(id: string) {
    setLoadingPlan(true);
    try {
      const usage = await getPlanAndUsage(id);
      setSubscription(usage.subscription);
      setBidsUsed(usage.bidsUsed);
      setBidsLimit(usage.bidsLimit);
      setCanBid(usage.canBid);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  }

  function isActiveFeatured(job: Job) {
    if (!job.is_featured || !job.featured_until) return false;
    return new Date(job.featured_until).getTime() > Date.now();
  }

  async function fetchOpenJobs() {
    setLoadingJobs(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (err) {
      setError('Greška prilikom učitavanja otvorenih poslova.');
      setLoadingJobs(false);
      return;
    }

    const jobs = (data as Job[]) || [];
    const sortedJobs = jobs.sort((a, b) => {
      const aFeatured = isActiveFeatured(a) ? 1 : 0;
      const bFeatured = isActiveFeatured(b) ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    if (sortedJobs.length > 0) {
      const { data: imagesData } = await supabase
        .from('job_images')
        .select('job_id')
        .in('job_id', sortedJobs.map((j) => j.id));
      const counts: Record<string, number> = {};
      (imagesData || []).forEach((row: { job_id: string }) => {
        counts[row.job_id] = (counts[row.job_id] || 0) + 1;
      });
      setOpenJobs(sortedJobs.map((j) => ({ ...j, image_count: counts[j.id] || 0 })));
    } else {
      setOpenJobs(sortedJobs);
    }
    setLoadingJobs(false);
  }

  async function fetchMyBids(id: string) {
    setLoadingBids(true);
    const { data, error: err } = await supabase
      .from('bids')
      .select('*, jobs(id,title,description,city,address,category_slug,status,created_at,budget_mode,budget_min,budget_max,deadline)')
      .eq('firm_id', id)
      .order('created_at', { ascending: false });

    if (err) {
      setError('Greška prilikom učitavanja vaših ponuda.');
    } else {
      setMyBids((data as Bid[]) || []);
    }
    setLoadingBids(false);
  }

  async function submitBid(jobId: string) {
    if (!firmId) return;
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError('Unesite ispravan iznos ponude.');
      return;
    }
    if (!canBid) {
      setError('Dostigli ste mjesečno ograničenje ponuda. Nadogradite paket.');
      return;
    }

    setSubmitting(true);
    setSubmitJobId(jobId);
    setError('');

    const { error: err } = await supabase.from('bids').insert({
      job_id: jobId,
      firm_id: firmId,
      amount: value,
      message: message.trim() || null,
      status: 'pending',
    });

    setSubmitting(false);
    setSubmitJobId(null);

    if (err) {
      setError(err.message);
      return;
    }

    setAmount('');
    setMessage('');
    setExpandedJob(null);
    await Promise.all([fetchOpenJobs(), fetchMyBids(firmId)]);
  }

  function hasBidForJob(jobId: string) {
    return myBids.some((b) => b.job_id === jobId);
  }

  const planName = subscription?.plans?.name || 'Besplatno';
  const planFeatured = Boolean(subscription?.plans?.featured);
  const planActiveDate = subscription?.ends_at
    ? formatDateTime(subscription.ends_at)
    : null;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud dark:bg-ink-950">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud dark:bg-ink-950">
      <Header />
      <main className="flex-grow pt-24 md:pt-28 pb-10 md:pb-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {error && (
            <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-200 rounded-xl px-4 py-3 border border-red-100 dark:border-red-900/30 animate-fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <DashboardHeader
            label="Firm dashboard"
            title="Dobro došli natrag"
            email={user.email || ''}
            planName={firmId && !loadingPlan ? planName : undefined}
            planFeatured={planFeatured}
            actions={
              <>
                <Link
                  href="/dashboard/firma/profil/"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-ink-700 text-steel dark:text-steel hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-ink-800 hover:border-gray-300 transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Uredi profil</span>
                  <span className="sm:hidden">Profil</span>
                </Link>
                <Link
                  href="/dashboard/firma/pretplata/"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white shadow-sm hover:shadow-lg hover:shadow-brand-orange/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:translate-y-0"
                >
                  <Crown className="w-4 h-4" />
                  Pretplata
                </Link>
              </>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <DashboardStat
                label="Trenutni paket"
                value={loadingPlan ? 'Učitavanje...' : planName}
                sub={planFeatured ? 'Istaknut profil' : 'Aktivni paket'}
                icon={Crown}
                tone={planFeatured ? 'orange' : 'neutral'}
                isLoading={loadingPlan}
              />
              <DashboardStat
                label="Ponude ovaj mjesec"
                value={loadingPlan ? 'Učitavanje...' : remainingBidsText(bidsUsed, bidsLimit)}
                sub={canBid ? 'Možete slati ponude' : 'Dostignuto ograničenje'}
                icon={Send}
                tone={canBid ? 'green' : 'red'}
                isLoading={loadingPlan}
              />
              <DashboardStat
                label="Reset ponuda"
                value={loadingPlan ? 'Učitavanje...' : getResetCountdownText()}
                sub="Ponude se resetuju 1. u mjesecu"
                icon={Timer}
                tone="neutral"
                isLoading={loadingPlan}
              />
              <DashboardStat
                label="Pretplata aktivna do"
                value={loadingPlan ? 'Učitavanje...' : planActiveDate || '—'}
                sub={planActiveDate ? 'Nakon toga se podrazumijeva besplatni paket' : 'Besplatan paket'}
                icon={Calendar}
                tone="neutral"
                isLoading={loadingPlan}
              />
            </div>
          </DashboardHeader>

          {!loadingFirm && !firmId && (
            <EmptyState
              title="Profil firme nije pronađen"
              description="Nemate povezan profil firme. Registrujte firmu kako biste mogli slati ponude."
              ctaLabel="Registruj firmu"
              ctaHref="/registracija/"
            />
          )}

          {loadingFirm && (
            <div className="flex items-center justify-center py-16 text-steel">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Učitavanje profila firme...
            </div>
          )}

          {firmId && !loadingFirm && (
            <>
              {!canBid && !loadingPlan && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-100 dark:border-red-900/30 px-4 py-3 text-sm text-red-800 dark:text-red-200 animate-fade-in">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    Dostigli ste mjesečno ograničenje ponuda.
                  </div>
                  <Link
                    href="/dashboard/firma/pretplata/"
                    className="inline-flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-200 hover:underline"
                  >
                    Nadogradite paket <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="inline-flex p-1 bg-white dark:bg-ink-900 rounded-xl border border-gray-100 dark:border-ink-800 shadow-sm">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'jobs'
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-steel hover:text-gray-900 dark:hover:text-white hover:bg-cloud dark:hover:bg-ink-800'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Otvoreni poslovi
                    <span
                      className={`ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        activeTab === 'jobs'
                          ? 'bg-white/20 text-white'
                          : 'bg-cloud dark:bg-ink-800 text-steel'
                      }`}
                    >
                      {openJobs.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bids')}
                    className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'bids'
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-steel hover:text-gray-900 dark:hover:text-white hover:bg-cloud dark:hover:bg-ink-800'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Moje ponude
                    <span
                      className={`ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        activeTab === 'bids'
                          ? 'bg-white/20 text-white'
                          : 'bg-cloud dark:bg-ink-800 text-steel'
                      }`}
                    >
                      {myBids.length}
                    </span>
                  </button>
                </div>

                <p className="text-sm text-steel">
                  {activeTab === 'jobs'
                    ? 'Pronađite nove poslove i pošaljite ponudu.'
                    : 'Pregledajte sve ponude koje ste poslali.'}
                </p>
              </div>

              {activeTab === 'jobs' && (
                <section className="animate-fade-in space-y-4">
                  {loadingJobs ? (
                    <div className="grid gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-28 bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-sm p-5 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : openJobs.length === 0 ? (
                    <EmptyState
                      title="Nema otvorenih poslova"
                      description="Trenutno nema dostupnih otvorenih poslova. Vratite se kasnije."
                    />
                  ) : (
                    <div className="grid gap-4">
                      {openJobs.map((job) => {
                        const category = getCategory(job.category_slug);
                        const alreadyBid = hasBidForJob(job.id);
                        const isExpanded = expandedJob === job.id;
                        const budget = formatBudget(job);

                        return (
                          <div
                            key={job.id}
                            className={`group bg-white dark:bg-ink-900 rounded-2xl border p-5 shadow-sm transition-all duration-200 ${
                              alreadyBid || !canBid
                                ? 'border-gray-100 dark:border-ink-800 opacity-80'
                                : 'border-gray-100 dark:border-ink-800 hover:border-brand-orange/30 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                            }`}
                            onClick={() => {
                              if (!alreadyBid && canBid) setExpandedJob(isExpanded ? null : job.id);
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-cloud dark:bg-ink-800 items-center justify-center text-steel shrink-0">
                                  <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                      {job.title}
                                    </h3>
                                    {isActiveFeatured(job) && <FeaturedBadge />}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-steel">
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5" />
                                      {job.city}
                                    </span>
                                    {category && (
                                      <span className="inline-flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        {category.name}
                                      </span>
                                    )}
                                    <span className="inline-flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      {formatDate(job.created_at)}
                                    </span>
                                    {budget && (
                                      <span className="inline-flex items-center gap-1">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        {budget}
                                      </span>
                                    )}
                                    {job.deadline && (
                                      <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Rok: {formatDate(job.deadline)}
                                      </span>
                                    )}
                                    {(job.image_count || 0) > 0 && (
                                      <span className="inline-flex items-center gap-1">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        {job.image_count} foto
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!alreadyBid && canBid) setExpandedJob(isExpanded ? null : job.id);
                                }}
                                disabled={alreadyBid || !canBid}
                                className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto md:shrink-0 ${
                                  alreadyBid || !canBid
                                    ? 'bg-cloud dark:bg-ink-800 text-steel'
                                    : isExpanded
                                    ? 'bg-gray-100 dark:bg-ink-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-ink-700'
                                    : 'bg-orange-50 dark:bg-orange-900/20 text-brand-orange-dark dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                                }`}
                              >
                                {alreadyBid
                                  ? 'Već poslano'
                                  : !canBid
                                  ? 'Limit dostignut'
                                  : isExpanded
                                  ? 'Zatvori'
                                  : 'Pošalji ponudu'}
                              </button>
                            </div>

                            {isExpanded && !alreadyBid && (
                              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-ink-800 animate-fade-in">
                                <div className="bg-cloud dark:bg-ink-950 rounded-xl p-4 mb-4">
                                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                  </p>
                                </div>
                                {job.address && (
                                  <div className="flex items-center gap-2 text-sm text-steel mb-4">
                                    <MapPin className="w-4 h-4" />
                                    {job.address}
                                  </div>
                                )}
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-steel uppercase tracking-wide mb-1.5">
                                      Iznos ponude (KM) *
                                    </label>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                                      <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="npr. 500"
                                        className="input-field pl-9"
                                        min="1"
                                        step="0.01"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-steel uppercase tracking-wide mb-1.5">
                                      Poruka (opcionalno)
                                    </label>
                                    <textarea
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      placeholder="Predstavite se i navedite rok izvršenja..."
                                      rows={3}
                                      className="input-field resize-none"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <button
                                    onClick={() => submitBid(job.id)}
                                    disabled={(submitting && submitJobId === job.id) || !canBid}
                                    className="inline-flex items-center gap-2 btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Send className="w-4 h-4" />
                                    {submitting && submitJobId === job.id
                                      ? 'Slanje...'
                                      : !canBid
                                      ? 'Limit dostignut'
                                      : 'Pošalji ponudu'}
                                  </button>
                                  <button
                                    onClick={() => setExpandedJob(null)}
                                    className="text-sm font-medium text-steel hover:text-gray-900 dark:hover:text-white px-3 py-2.5 transition-colors"
                                  >
                                    Odustani
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {activeTab === 'bids' && (
                <section className="animate-fade-in space-y-4">
                  {loadingBids ? (
                    <div className="grid gap-4">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-32 bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-sm p-5 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : myBids.length === 0 ? (
                    <EmptyState
                      title="Još nema ponuda"
                      description="Niste poslali nijednu ponudu. Pregledajte otvorene poslove i pošaljite prvu ponudu."
                    />
                  ) : (
                    <div className="grid gap-4">
                      {myBids.map((bid) => {
                        const badgeClass = statusBadgeClasses[bid.status];
                        return (
                          <div
                            key={bid.id}
                            className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${badgeClass}`}
                                >
                                  {statusIcons[bid.status]}
                                </div>
                                <div>
                                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {bid.jobs?.title || 'Posao'}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-steel">
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5" />
                                      {bid.jobs?.city || '—'}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      {formatDate(bid.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-start md:items-end gap-2">
                                <p className="text-xl font-bold text-brand-orange">{bid.amount} KM</p>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${badgeClass}`}
                                >
                                  {statusIcons[bid.status]}
                                  {statusLabels[bid.status]}
                                </span>
                              </div>
                            </div>

                            {bid.message && (
                              <div className="mt-4 bg-cloud dark:bg-ink-950 rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200">
                                <p className="font-medium text-steel text-xs uppercase tracking-wide mb-1">
                                  Vaša poruka
                                </p>
                                <p className="whitespace-pre-line">{bid.message}</p>
                              </div>
                            )}

                            {bid.status === 'accepted' && bid.jobs?.id && (
                              <Link
                                href={`/dashboard/razgovor/?job_id=${bid.jobs.id}`}
                                className="mt-4 inline-flex items-center gap-2 btn-secondary text-sm py-2 px-4"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Razgovor sa klijentom
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function FirmDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-cloud dark:bg-ink-950">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </main>
          <Footer />
        </div>
      }
    >
      <FirmDashboardContent />
    </Suspense>
  );
}
