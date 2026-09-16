'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmptyState from '@/components/ui/EmptyState';
import FirmDashboardHero from '@/components/FirmDashboardHero';
import FirmActivityFeed from '@/components/FirmActivityFeed';
import FirmRecommendedJobs from '@/components/FirmRecommendedJobs';
import FirmJobPipeline from '@/components/FirmJobPipeline';
import FirmAdsTab from '@/components/FirmAdsTab';
import FirmBottomNav from '@/components/dashboard/FirmBottomNav';
import FirmMoreMenu from '@/components/dashboard/FirmMoreMenu';
import FirmDashboardWelcome from '@/components/dashboard/FirmDashboardWelcome';
import FirmPlanCard from '@/components/dashboard/FirmPlanCard';
import FirmQuickStats from '@/components/dashboard/FirmQuickStats';
import FirmQuickActions from '@/components/dashboard/FirmQuickActions';
import FirmIconMenu from '@/components/dashboard/FirmIconMenu';
import FirmMyAdsList from '@/components/dashboard/FirmMyAdsList';
import FirmRecentBids from '@/components/dashboard/FirmRecentBids';
import FirmMiniChart from '@/components/dashboard/FirmMiniChart';
import FeaturedBadge from '@/components/FeaturedBadge';
import JobChat from '@/components/JobChat';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import {
  getPlanAndUsage,
  Subscription,
  formatDateTime,
} from '@/lib/subscriptions';
import {
  getFirmVisitStats,
  getFirmVisitDaily,
  getFirmVisitReferrers,
  FirmVisitStats,
  DailyVisit,
  ReferrerCount,
} from '@/lib/analytics';
import useFirmActivityHeartbeat from '@/lib/hooks/useFirmActivityHeartbeat';
import { formatDate } from '@/lib/date';
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
  AlertTriangle,
  DollarSign,
  Calendar,
  ImageIcon,
  ArrowRight,
  Bell,
  Mail,
  Save,
  User,
  AlertCircle,
  Megaphone,
  BarChart3,
  TrendingUp,
  Eye,
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

interface DirectJob {
  id: string;
  client_id: string;
  title: string;
  description: string;
  city: string;
  address: string | null;
  category_slug: string;
  status: 'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  private_status: PrivateStatus;
  is_private: boolean;
  client_question: string | null;
  problem_reported: boolean;
  problem_description: string | null;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  pending_deadline: string | null;
  image_count?: number;
  profiles: { full_name: string | null; email: string | null } | null;
}

type PrivateStatus = 'pending' | 'accepted' | 'in_progress' | 'done_pending' | 'completed' | 'declined' | 'cancelled';

type BidStatus = Bid['status'];

const privateStatusLabels: Record<PrivateStatus, string> = {
  pending: 'Zahtjev na čekanju',
  accepted: 'Prihvaćeno',
  in_progress: 'Rad u toku',
  done_pending: 'Čeka potvrdu',
  completed: 'Završeno',
  declined: 'Odbijeno',
  cancelled: 'Otkazano',
};

const privateStatusColors: Record<PrivateStatus, string> = {
  pending: 'bg-blue-50 text-blue-700 border-blue-100',
  accepted: 'bg-green-50 text-green-700 border-green-100',
  in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  done_pending: 'bg-orange-50 text-brand-orange border-orange-100',
  completed: 'bg-green-50 text-green-700 border-green-100',
  declined: 'bg-gray-100 text-gray-500 border-gray-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

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

function formatBudget(job: Job) {
  if (job.budget_mode === 'open') return 'Majstori predlažu cijenu';
  if (job.budget_min != null && job.budget_max != null) {
    return `${job.budget_min}-${job.budget_max} KM`;
  }
  if (job.budget_min != null) return `od ${job.budget_min} KM`;
  if (job.budget_max != null) return `do ${job.budget_max} KM`;
  return 'Budžet po dogovoru';
}

function isActiveFeatured(job: Job) {
  if (!job.is_featured || !job.featured_until) return false;
  return new Date(job.featured_until).getTime() > Date.now();
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

  useFirmActivityHeartbeat(firmId);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitJobId, setSubmitJobId] = useState<string | null>(null);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bidsUsed, setBidsUsed] = useState(0);
  const [bidsLimit, setBidsLimit] = useState(0);
  const [canBid, setCanBid] = useState(true);
  const [nextReset, setNextReset] = useState<Date | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [firmCategories, setFirmCategories] = useState<string[]>([]);
  const [categoryPrefs, setCategoryPrefs] = useState<
    Record<string, { notify_enabled: boolean; email_enabled: boolean }>
  >({});
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [firmCity, setFirmCity] = useState<string | null>(null);
  const [firmName, setFirmName] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'bids' | 'direct' | 'ads' | 'stats' | 'profile' | 'messages'>('home');
  const [moreOpen, setMoreOpen] = useState(false);
  const [directJobs, setDirectJobs] = useState<DirectJob[]>([]);
  const [loadingDirect, setLoadingDirect] = useState(true);
  const [expandedDirectJob, setExpandedDirectJob] = useState<string | null>(null);
  const [directActionId, setDirectActionId] = useState<string | null>(null);

  const [visitStats, setVisitStats] = useState<FirmVisitStats | null>(null);
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
  const [referrers, setReferrers] = useState<ReferrerCount[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [adsCount, setAdsCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/prijava/');
    } else if (!isFirmRole(role)) {
      router.push('/dashboard/');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    const expandId = searchParams.get('expandJobId');
    const directId = searchParams.get('directJobId');
    const tab = searchParams.get('tab');
    if (expandId) {
      setExpandedJob(expandId);
      setActiveTab('jobs');
    } else if (directId) {
      setExpandedDirectJob(directId);
      setActiveTab('direct');
    } else if (tab === 'profile') {
      router.push('/dashboard/firma/profil/');
    } else if (tab === 'messages') {
      router.push('/dashboard/razgovor/');
    } else if (tab === 'ads' || tab === 'stats' || tab === 'bids' || tab === 'direct') {
      setActiveTab(tab);
    } else if (tab === 'home' || tab === null) {
      setActiveTab('home');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!expandedJob) return;
    const el = document.getElementById(`job-row-${expandedJob}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [expandedJob]);

  const fetchDirectJobs = useCallback(async (id: string) => {
    setLoadingDirect(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select(
        '*, profiles!client_id(full_name, email)'
      )
      .eq('is_private', true)
      .eq('target_firm_id', id)
      .order('created_at', { ascending: false });

    if (err) {
      console.error('Greška prilikom učitavanja direktnih zahtjeva:', err);
      setLoadingDirect(false);
      return;
    }

    const jobs = (data as DirectJob[]) || [];
    if (jobs.length > 0) {
      const { data: imagesData } = await supabase
        .from('job_images')
        .select('job_id')
        .in('job_id', jobs.map((j) => j.id));
      const counts: Record<string, number> = {};
      (imagesData || []).forEach((row: { job_id: string }) => {
        counts[row.job_id] = (counts[row.job_id] || 0) + 1;
      });
      setDirectJobs(jobs.map((j) => ({ ...j, image_count: counts[j.id] || 0 })));
    } else {
      setDirectJobs(jobs);
    }
    setLoadingDirect(false);
  }, []);

  const loadPlan = useCallback(async (id: string) => {
    setLoadingPlan(true);
    try {
      const usage = await getPlanAndUsage(id);
      setSubscription(usage.subscription);
      setBidsUsed(usage.bidsUsed);
      setBidsLimit(usage.bidsLimit);
      setCanBid(usage.canBid);
      setNextReset(usage.nextReset);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  }, []);

  const loadStats = useCallback(async (id: string, advanced: boolean) => {
    setLoadingStats(true);
    try {
      const [stats, daily, refs] = await Promise.all([
        getFirmVisitStats(id),
        advanced ? getFirmVisitDaily(id, 30) : Promise.resolve([]),
        advanced ? getFirmVisitReferrers(id, 5) : Promise.resolve([]),
      ]);
      setVisitStats(stats);
      setDailyVisits(daily);
      setReferrers(refs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (!firmId || activeTab !== 'stats') return;
    const isPremium = subscription?.plans?.slug === 'premium';
    loadStats(firmId, isPremium);
  }, [firmId, activeTab, subscription, loadStats]);

  async function saveCategoryPrefs() {
    if (!firmId) return;
    setSavingPrefs(true);
    setPrefsSaved(false);
    setError('');
    try {
      const rows = firmCategories.map((slug) => ({
        firm_id: firmId,
        category_slug: slug,
        notify_enabled: categoryPrefs[slug]?.notify_enabled !== false,
        email_enabled: categoryPrefs[slug]?.email_enabled !== false,
      }));
      const { error: upsertError } = await supabase.from('firm_categories').upsert(rows, {
        onConflict: 'firm_id,category_slug',
      });
      if (upsertError) {
        setError('Greška pri spremanju postavki obavještenja.');
      } else {
        setPrefsSaved(true);
        setTimeout(() => setPrefsSaved(false), 3000);
      }
    } catch (err) {
      setError('Došlo je do greške pri spremanju postavki obavještenja.');
    } finally {
      setSavingPrefs(false);
    }
  }

  function togglePref(slug: string, key: 'notify_enabled' | 'email_enabled') {
    setCategoryPrefs((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [key]: !prev[slug]?.[key],
      },
    }));
  }

  const fetchOpenJobs = useCallback(async () => {
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
  }, []);

  const fetchMyBids = useCallback(async (id: string) => {
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
  }, []);

  const fetchFirm = useCallback(async () => {
    if (!user) return;
    setLoadingFirm(true);
    setError('');

    const { data, error: err } = await supabase
      .from('firms')
      .select('id, name, city, average_rating, review_count')
      .eq('owner_id', user.id)
      .single();

    if (err || !data) {
      setError('Nije pronađena firma povezana sa vašim nalogom. Registrujte firmu.');
      setLoadingFirm(false);
      return;
    }

    setFirmId(data.id);
    setFirmName(data.name || null);
    setFirmCity(data.city || null);
    setAverageRating(data.average_rating ?? null);
    setReviewCount(data.review_count ?? null);
    setLoadingFirm(false);

    const { data: catData } = await supabase
      .from('firm_categories')
      .select('category_slug, notify_enabled, email_enabled')
      .eq('firm_id', data.id);
    const rows = (catData as { category_slug: string; notify_enabled: boolean; email_enabled: boolean }[] | null) || [];
    setFirmCategories(rows.map((c) => c.category_slug));
    setCategoryPrefs(
      rows.reduce((acc, c) => {
        acc[c.category_slug] = {
          notify_enabled: c.notify_enabled !== false,
          email_enabled: c.email_enabled !== false,
        };
        return acc;
      }, {} as Record<string, { notify_enabled: boolean; email_enabled: boolean }>)
    );

    await Promise.all([fetchOpenJobs(), fetchMyBids(data.id), fetchDirectJobs(data.id), loadPlan(data.id), loadStats(data.id, false), loadAdsCount(data.id)]);
  }, [user, fetchOpenJobs, fetchMyBids, fetchDirectJobs, loadPlan, loadStats]);

  async function loadAdsCount(id: string) {
    const { count, error } = await supabase
      .from('promoted_ads')
      .select('*', { count: 'exact', head: true })
      .eq('firm_id', id)
      .eq('status', 'active');
    if (!error) setAdsCount(count || 0);
  }

  useEffect(() => {
    if (user && isFirmRole(role)) fetchFirm();
  }, [user, role, fetchFirm]);

  function isCategoryAllowed(job: Job) {
    return firmCategories.length > 0 && firmCategories.includes(job.category_slug);
  }

  async function submitBid(job: Job) {
    if (!firmId) return;
    if (hasBidForJob(job.id)) {
      setError('Već ste poslali ponudu za ovaj posao.');
      return;
    }
    if (!isCategoryAllowed(job)) {
      const category = getCategory(job.category_slug);
      setError(
        `Ne možete slati ponudu za kategoriju "${category?.name || job.category_slug}". Idite na Profil firme i dodajte tu uslugu.`
      );
      return;
    }
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
    setSubmitJobId(job.id);
    setError('');

    const { error: err } = await supabase.from('bids').insert({
      job_id: job.id,
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

  function publicStatusForPrivate(status: PrivateStatus) {
    if (status === 'completed') return 'completed';
    if (status === 'declined' || status === 'cancelled') return 'cancelled';
    return 'in_progress';
  }

  async function updatePrivateStatus(job: DirectJob, newStatus: PrivateStatus) {
    if (!firmId) return;
    setDirectActionId(job.id);
    setError('');

    const update: Record<string, unknown> = {
      private_status: newStatus,
      status: publicStatusForPrivate(newStatus),
      updated_at: new Date().toISOString(),
    };
    if (newStatus === 'completed') {
      update.completed_at = new Date().toISOString();
    }

    const { error: err } = await supabase.from('jobs').update(update).eq('id', job.id);

    setDirectActionId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchDirectJobs(firmId);
  }

  async function acceptDirect(job: DirectJob) {
    await updatePrivateStatus(job, 'accepted');
  }

  async function declineDirect(job: DirectJob) {
    if (!confirm('Da li ste sigurni da želite odbiti ovaj zahtjev?')) return;
    await updatePrivateStatus(job, 'declined');
  }

  async function startWork(job: DirectJob) {
    await updatePrivateStatus(job, 'in_progress');
  }

  async function markDone(job: DirectJob) {
    await updatePrivateStatus(job, 'done_pending');
  }

  async function cancelDirect(job: DirectJob) {
    if (!confirm('Da li ste sigurni da želite otkazati ovaj zahtjev?')) return;
    await updatePrivateStatus(job, 'cancelled');
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-ink-950">
      <Header dark />
      <main className="flex-grow pt-14 md:pt-28 pb-24 md:pb-14 px-4 sm:px-6 bg-white md:bg-cloud dark:bg-ink-950">
        <div className="max-w-6xl mx-auto space-y-6">
          {error && (
            <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-200 rounded-xl px-4 py-3 border border-red-100 dark:border-red-900/30 animate-fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {firmId && !loadingFirm && (
            <div className="hidden md:block">
              <FirmDashboardHero
                firmName={firmName}
                city={firmCity}
                planName={planName}
                planFeatured={planFeatured}
                planActiveDate={planActiveDate}
                bidsUsed={bidsUsed}
                bidsLimit={bidsLimit}
                canBid={canBid}
                nextReset={nextReset}
                averageRating={averageRating}
                reviewCount={reviewCount}
                profileViews={visitStats?.total || 0}
                myBids={myBids}
                loadingPlan={loadingPlan}
              />
            </div>
          )}

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

          {firmId && !loadingFirm && (!firmCity?.trim() || firmCategories.length === 0) && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-100 p-6 text-sm text-amber-800 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-base mb-1">Dovršite profil firme</p>
                  <p className="mb-4">
                    Prije slanja ponuda morate unijeti grad u kojem radite i odabrati bar jednu kategoriju.
                  </p>
                  <Link
                    href="/dashboard/firma/profil/"
                    className="inline-flex items-center gap-2 font-semibold text-amber-700 hover:underline"
                  >
                    Idi na Profil firme <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {firmId && !loadingFirm && firmCity?.trim() && firmCategories.length > 0 && (
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

              {/* Mobile home overview */}
              {activeTab === 'home' && (
                <div className="md:hidden space-y-4">
                  <FirmDashboardWelcome firmName={firmName} />
                  <FirmPlanCard
                    planName={planName}
                    planFeatured={planFeatured}
                    planActiveDate={planActiveDate}
                    loadingPlan={loadingPlan}
                  />
                  <FirmQuickStats
                    adsCount={adsCount}
                    bidsCount={myBids.length}
                    viewsCount={visitStats?.total || 0}
                    rating={averageRating}
                    reviewCount={reviewCount}
                  />
                  <FirmQuickActions />
                  <FirmIconMenu
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    bidsCount={myBids.length}
                  />
                  <FirmMyAdsList firmId={firmId} />
                  <div className="grid grid-cols-1 gap-4">
                    <FirmRecentBids bids={myBids} />
                    <FirmMiniChart
                      data={dailyVisits}
                      total={visitStats?.thisMonth}
                      growth={visitStats?.total ? 28 : 0}
                    />
                  </div>
                </div>
              )}

              {/* Desktop overview + tab bar */}
              <div className="hidden md:block space-y-6">
                {/* Dashboard overview: activity feed, pipeline, recommended jobs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <FirmActivityFeed />
                    <FirmJobPipeline myBids={myBids} directJobs={directJobs} />
                  </div>
                  <div className="lg:col-span-2">
                    <FirmRecommendedJobs
                      openJobs={openJobs}
                      myBids={myBids}
                      firmCategories={firmCategories}
                      firmCity={firmCity}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="inline-flex flex-wrap p-1 bg-white dark:bg-ink-900 rounded-xl border border-gray-100 dark:border-ink-800 shadow-sm">
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
                    onClick={() => setActiveTab('direct')}
                    className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'direct'
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-steel hover:text-gray-900 dark:hover:text-white hover:bg-cloud dark:hover:bg-ink-800'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Direktni zahtjevi
                    <span
                      className={`ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        activeTab === 'direct'
                          ? 'bg-white/20 text-white'
                          : 'bg-cloud dark:bg-ink-800 text-steel'
                      }`}
                    >
                      {directJobs.length}
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
                  <button
                    onClick={() => setActiveTab('ads')}
                    className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'ads'
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-steel hover:text-gray-900 dark:hover:text-white hover:bg-cloud dark:hover:bg-ink-800'
                    }`}
                  >
                    <Megaphone className="w-4 h-4" />
                    Oglasi
                  </button>
                  {(subscription?.plans?.slug === 'pro' || subscription?.plans?.slug === 'premium') && (
                    <button
                      onClick={() => setActiveTab('stats')}
                      className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'stats'
                          ? 'bg-brand-orange text-white shadow-sm'
                          : 'text-steel hover:text-gray-900 dark:hover:text-white hover:bg-cloud dark:hover:bg-ink-800'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      {subscription?.plans?.slug === 'premium' ? 'Analitika' : 'Statistika'}
                    </button>
                  )}
                </div>

                <p className="text-sm text-steel">
                  {activeTab === 'jobs'
                    ? 'Pronađite nove poslove i pošaljite ponudu.'
                    : activeTab === 'direct'
                    ? 'Upravljajte direktnim zahtjevima klijenata.'
                    : activeTab === 'bids'
                    ? 'Pregledajte sve ponude koje ste poslali.'
                    : activeTab === 'ads'
                    ? 'Plaćeni oglasi i promovisani poslovi.'
                    : 'Pregled posjeta vašeg profila.'}
                </p>
              </div>
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
                            id={`job-row-${job.id}`}
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
                              <div
                                className="mt-5 pt-5 border-t border-gray-100 dark:border-ink-800 animate-fade-in"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {!isCategoryAllowed(job) && (
                                  <div className="mb-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-100 p-4 text-sm text-amber-800">
                                    <div className="flex items-start gap-3">
                                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                      <div>
                                        <p className="font-semibold mb-1">
                                          {firmCategories.length === 0
                                            ? 'Nemate odabranih kategorija'
                                            : 'Ne pokrivate ovu kategoriju'}
                                        </p>
                                        <p className="mb-2">
                                          {firmCategories.length === 0
                                            ? 'Prije slanja ponude morate u profilu firme odabrati kategorije koje pokrivate.'
                                            : `Da biste poslali ponudu za kategoriju "${getCategory(job.category_slug)?.name || job.category_slug}", prvo dodajte tu uslugu u profilu svoje firme.`}
                                        </p>
                                        <Link
                                          href="/dashboard/firma/profil/"
                                          className="inline-flex items-center gap-1.5 font-semibold text-amber-700 hover:underline"
                                        >
                                          Idi na Profil firme <ArrowRight className="w-4 h-4" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                                    onClick={() => submitBid(job)}
                                    disabled={(submitting && submitJobId === job.id) || !canBid || !isCategoryAllowed(job)}
                                    className="inline-flex items-center gap-2 btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Send className="w-4 h-4" />
                                    {submitting && submitJobId === job.id
                                      ? 'Slanje...'
                                      : !canBid
                                      ? 'Limit dostignut'
                                      : !isCategoryAllowed(job)
                                      ? 'Kategorija nije odabrana'
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
                                      {bid.jobs?.city || '-'}
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

              {activeTab === 'direct' && (
                <section className="animate-fade-in space-y-4">
                  {loadingDirect ? (
                    <div className="grid gap-4">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-32 bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-sm p-5 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : directJobs.length === 0 ? (
                    <EmptyState
                      title="Nema direktnih zahtjeva"
                      description="Klijenti će vas moći kontaktirati direktno s vašeg profila."
                    />
                  ) : (
                    <div className="grid gap-4">
                      {directJobs.map((job) => {
                        const category = getCategory(job.category_slug);
                        const clientName = job.profiles?.full_name || 'Klijent';
                        const clientEmail = job.profiles?.email || '';
                        const isExpanded = expandedDirectJob === job.id;
                        const badgeClass = privateStatusColors[job.private_status];
                        const budget = formatBudget(job as unknown as Job);

                        return (
                          <div
                            key={job.id}
                            className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                  <User className="w-6 h-6" />
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                      {job.title}
                                    </h3>
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${badgeClass}`}>
                                      {privateStatusLabels[job.private_status]}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-steel">
                                    <span className="inline-flex items-center gap-1">
                                      <User className="w-3.5 h-3.5" />
                                      {clientName}
                                    </span>
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

                              <div className="flex flex-wrap items-center gap-2 md:shrink-0">
                                {job.private_status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => acceptDirect(job)}
                                      disabled={directActionId === job.id}
                                      className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      {directActionId === job.id ? 'Obrada...' : 'Prihvati'}
                                    </button>
                                    <button
                                      onClick={() => declineDirect(job)}
                                      disabled={directActionId === job.id}
                                      className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Odbij
                                    </button>
                                  </>
                                )}
                                {job.private_status === 'accepted' && (
                                  <button
                                    onClick={() => startWork(job)}
                                    disabled={directActionId === job.id}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-orange-50 text-brand-orange hover:bg-orange-100 transition-colors disabled:opacity-50"
                                  >
                                    <Clock className="w-4 h-4" />
                                    {directActionId === job.id ? 'Obrada...' : 'Započni rad'}
                                  </button>
                                )}
                                {job.private_status === 'in_progress' && (
                                  <button
                                    onClick={() => markDone(job)}
                                    disabled={directActionId === job.id}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {directActionId === job.id ? 'Obrada...' : 'Označi kao gotov'}
                                  </button>
                                )}
                                {['pending', 'accepted', 'in_progress'].includes(job.private_status) && (
                                  <button
                                    onClick={() => cancelDirect(job)}
                                    disabled={directActionId === job.id}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Otkaži
                                  </button>
                                )}
                                {job.private_status === 'done_pending' && (
                                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-700 bg-orange-50 rounded-xl px-4 py-2.5">
                                    <Clock className="w-4 h-4" /> Čeka potvrdu klijenta
                                  </span>
                                )}
                                <button
                                  onClick={() => setExpandedDirectJob(isExpanded ? null : job.id)}
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 dark:border-ink-700 text-steel hover:bg-cloud dark:hover:bg-ink-800 transition-colors"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  {isExpanded ? 'Sakrij detalje' : 'Detalji i razgovor'}
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-ink-800 animate-fade-in">
                                <div className="grid lg:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div className="bg-cloud dark:bg-ink-950 rounded-xl p-4">
                                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                        {job.description}
                                      </p>
                                    </div>
                                    {job.client_question && (
                                      <div className="bg-blue-50 text-blue-800 rounded-lg p-3 text-sm">
                                        <p className="font-semibold mb-1">Pitanje klijenta:</p>
                                        <p>{job.client_question}</p>
                                      </div>
                                    )}
                                    {job.problem_reported && (
                                      <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">
                                        <p className="font-semibold flex items-center gap-2 mb-1">
                                          <AlertTriangle className="w-4 h-4" /> Prijavljen problem
                                        </p>
                                        <p>{job.problem_description}</p>
                                      </div>
                                    )}
                                    {clientEmail && (
                                      <p className="text-sm text-steel flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {clientEmail}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    {['declined', 'cancelled'].includes(job.private_status) ? (
                                      <p className="text-sm text-steel text-center py-8 bg-cloud dark:bg-ink-950 rounded-xl">
                                        Razgovor nije dostupan za otkazane/odbijene zahtjeve.
                                      </p>
                                    ) : (
                                      <JobChat
                                        jobId={job.id}
                                        userId={user!.id}
                                        role="firm"
                                        partnerName={clientName}
                                        partnerIsAdmin={false}
                                      />
                                    )}
                                  </div>
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

              {/* Notification preferences */}
              <section className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Postavke obavještenja</h3>
                    <p className="text-xs text-steel">Odaberite kako želite primati obavještenja po kategoriji.</p>
                  </div>
                </div>
                {firmCategories.length === 0 ? (
                  <p className="text-sm text-steel py-4">
                    Nemate odabranih kategorija. Idite na{' '}
                    <Link href="/dashboard/firma/profil/" className="text-brand-orange hover:underline">
                      Profil firme
                    </Link>{' '}
                    da biste odabrali kategorije.
                  </p>
                ) : (
                  <div className="space-y-3 mt-4">
                    {firmCategories.map((slug) => {
                      const category = getCategory(slug);
                      const prefs = categoryPrefs[slug] || { notify_enabled: true, email_enabled: true };
                      return (
                        <div
                          key={slug}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-100 dark:border-ink-800 last:border-b-0"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {category?.name || slug}
                          </span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-steel cursor-pointer">
                              <input
                                type="checkbox"
                                checked={prefs.notify_enabled}
                                onChange={() => togglePref(slug, 'notify_enabled')}
                                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                              />
                              <Bell className="w-4 h-4" />
                              In-app
                            </label>
                            <label className="flex items-center gap-2 text-sm text-steel cursor-pointer">
                              <input
                                type="checkbox"
                                checked={prefs.email_enabled}
                                onChange={() => togglePref(slug, 'email_enabled')}
                                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                              />
                              <Mail className="w-4 h-4" />
                              Email
                            </label>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={saveCategoryPrefs}
                        disabled={savingPrefs}
                        className="inline-flex items-center gap-2 bg-brand-orange text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
                      >
                        {savingPrefs ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Spremanje...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Spremi postavke
                          </>
                        )}
                      </button>
                      {prefsSaved && (
                        <span className="text-sm text-green-700 font-medium">Postavke su spremljene.</span>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {activeTab === 'ads' && (
                <FirmAdsTab firmId={firmId || ''} subscription={subscription} />
              )}

              {activeTab === 'stats' && (
                <section className="animate-fade-in space-y-6">
                  {loadingStats ? (
                    <div className="flex items-center justify-center py-16 text-steel">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Učitavanje statistike...
                    </div>
                  ) : !visitStats ? (
                    <EmptyState
                      title="Nema dostupnih podataka"
                      description="Trenutno nema podataka o posjetama vašeg profila."
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange">
                              <Eye className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-steel">Ukupno posjeta</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {visitStats.total.toLocaleString('bs-BA')}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-steel">Ovaj mjesec</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {visitStats.thisMonth.toLocaleString('bs-BA')}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-steel">Danas</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {visitStats.today.toLocaleString('bs-BA')}
                          </p>
                        </div>
                      </div>

                      {subscription?.plans?.slug === 'premium' && (
                        <>
                          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                              Posjete u posljednjih 30 dana
                            </h3>
                            {dailyVisits.length === 0 ? (
                              <p className="text-sm text-steel">Nema dovoljno podataka za prikaz grafa.</p>
                            ) : (
                              <div className="flex items-end gap-1 h-40 sm:h-56">
                                {dailyVisits.map((d) => {
                                  const max = Math.max(1, ...dailyVisits.map((v) => v.count));
                                  const height = `${(d.count / max) * 100}%`;
                                  return (
                                    <div
                                      key={d.date}
                                      className="group flex-1 flex flex-col items-center justify-end min-w-0"
                                      title={`${d.date}: ${d.count}`}
                                    >
                                      <div
                                        className="w-full max-w-[14px] rounded-t-sm bg-brand-orange/80 hover:bg-brand-orange transition-colors"
                                        style={{ height }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                              Top izvori posjeta
                            </h3>
                            {referrers.length === 0 ? (
                              <p className="text-sm text-steel">Nema podataka o izvorima.</p>
                            ) : (
                              <div className="space-y-3">
                                {referrers.map((r) => (
                                  <div key={r.referrer} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate pr-4">
                                      {r.referrer}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                                      {r.count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <FirmBottomNav bidsCount={myBids.length} onMoreClick={() => setMoreOpen(true)} />
      <FirmMoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
      <div className="hidden md:block">
        <Footer />
      </div>
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
