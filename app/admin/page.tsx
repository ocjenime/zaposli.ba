'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  getPlans, getCurrentSubscription, Plan, Subscription, formatPrice,
} from '@/lib/subscriptions';
import {
  LayoutDashboard, Users, Building2, CreditCard, FileText, Bell,
  Loader2, Check, Crown, AlertCircle, Search,
  Star, CheckCircle, XCircle, Pencil,
  MessageSquare, Briefcase, TrendingUp, DollarSign,
} from 'lucide-react';
import ProfileEditModal, { AdminProfile } from './ProfileEditModal';
import FirmEditModal, { AdminFirm } from './FirmEditModal';
import SubscriptionEditModal from './SubscriptionEditModal';
import { roleLabel, isFirmRole } from '@/lib/roles';
import { formatDateTime, getResetCountdownText } from '@/lib/subscriptions';

interface AdminRequest {
  id: string;
  type: string;
  firm_id: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
  firms?: AdminFirm;
}

interface AdminConversation {
  job_id: string;
  job_title: string;
  job_city: string;
  firm_name: string;
  created_at: string;
}

interface FirmPlan {
  firm: AdminFirm;
  subscription: Subscription | null;
}

interface PaymentRow {
  id: string;
  firm_id: string;
  plan_id: string;
  provider: string;
  provider_session_id: string | null;
  amount: number;
  currency: string;
  interval: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  firms: { name: string } | null;
  plans: { name: string } | null;
}

interface AdminStats {
  users: number;
  clients: number;
  firms: number;
  majstors: number;
  jobs: number;
  openJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  bids: number;
  reviews: number;
  messages: number;
  revenue: number;
  pendingPayments: number;
  completedPayments: number;
  recentJobs: { title: string; city: string; created_at: string }[];
  recentBids: { amount: number; firm_name: string; created_at: string }[];
}

const tabs = [
  { id: 'overview', label: 'Pregled', icon: LayoutDashboard },
  { id: 'users', label: 'Korisnici', icon: Users },
  { id: 'firms', label: 'Firme', icon: Building2 },
  { id: 'conversations', label: 'Razgovori', icon: MessageSquare },
  { id: 'subscriptions', label: 'Pretplate', icon: CreditCard },
  { id: 'payments', label: 'Plaćanja', icon: DollarSign },
  { id: 'plans', label: 'Paketi', icon: FileText },
  { id: 'requests', label: 'Zahtjevi', icon: Bell },
];

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [firms, setFirms] = useState<AdminFirm[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [firmPlans, setFirmPlans] = useState<FirmPlan[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const [savingVerified, setSavingVerified] = useState<string | null>(null);
  const [savingAdmin, setSavingAdmin] = useState<string | null>(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const [editingProfile, setEditingProfile] = useState<AdminProfile | null>(null);
  const [editingFirm, setEditingFirm] = useState<AdminFirm | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<FirmPlan | null>(null);
  const [promoCount, setPromoCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (user && isAdmin) loadAll();
  }, [authLoading, user, isAdmin]);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        loadProfiles(),
        loadFirms(),
        loadPlans(),
        loadRequests(),
        loadStats(),
      ]);
    } catch (err) {
      setError('Greška prilikom učitavanja admin podataka.');
    } finally {
      setLoading(false);
    }
  }

  async function loadProfiles() {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) throw err;
    setProfiles((data as AdminProfile[]) || []);
  }

  async function loadFirms() {
    const { data, error: err } = await supabase
      .from('firms')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) throw err;
    setFirms((data as AdminFirm[]) || []);
  }

  async function loadPlans() {
    const data = await getPlans();
    setPlans(data);
  }

  async function loadRequests() {
    const { data, error: err } = await supabase
      .from('admin_requests')
      .select('*, firms(*)')
      .order('created_at', { ascending: false });
    if (err) throw err;
    setRequests((data as AdminRequest[]) || []);
  }

  async function loadPayments() {
    const { data, error: err } = await supabase
      .from('payments')
      .select('*, firms(name), plans(name)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (err) throw err;
    setPayments((data as unknown as PaymentRow[]) || []);
  }

  async function loadFirmPlans() {
    setLoadingSubscriptions(true);
    const combined: FirmPlan[] = [];
    for (const firm of firms) {
      const sub = await getCurrentSubscription(firm.id);
      combined.push({ firm, subscription: sub });
    }
    setFirmPlans(combined);
    setLoadingSubscriptions(false);
  }

  async function loadPromoCount() {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'promo_free_premium_count')
      .single();
    if (!error && data) {
      setPromoCount(parseInt(data.value) || 0);
    }
  }

  async function loadStats() {
    const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: clients } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client');
    const { count: firmsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'firm');
    const { count: majstors } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'majstor');
    const { count: jobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
    const { count: openJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open');
    const { count: inProgressJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'in_progress');
    const { count: completedJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed');
    const { count: bids } = await supabase.from('bids').select('*', { count: 'exact', head: true });
    const { count: reviews } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
    const { count: messages } = await supabase.from('messages').select('*', { count: 'exact', head: true });
    const { count: pendingPayments } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: completedPayments } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'completed');
    const { data: revenueData } = await supabase.from('payments').select('amount').eq('status', 'completed');

    const { data: recentJobs } = await supabase
      .from('jobs')
      .select('title, city, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentBids } = await supabase
      .from('bids')
      .select('amount, created_at, firms(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    const revenue = (revenueData || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    setStats({
      users: users || 0,
      clients: clients || 0,
      firms: firmsCount || 0,
      majstors: majstors || 0,
      jobs: jobs || 0,
      openJobs: openJobs || 0,
      inProgressJobs: inProgressJobs || 0,
      completedJobs: completedJobs || 0,
      bids: bids || 0,
      reviews: reviews || 0,
      messages: messages || 0,
      revenue,
      pendingPayments: pendingPayments || 0,
      completedPayments: completedPayments || 0,
      recentJobs: (recentJobs as AdminStats['recentJobs']) || [],
      recentBids: (recentBids as unknown as AdminStats['recentBids']) || [],
    });
  }

  async function loadConversations() {
    const { data, error } = await supabase
      .from('bids')
      .select('created_at, jobs(id,title,city), firms(id,name)')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Greška prilikom učitavanja razgovora.');
      return;
    }
    const rows = (data as unknown as Array<{ created_at: string; jobs: { id: string; title: string; city: string } | null; firms: { id: string; name: string } | null }>) || [];
    setConversations(
      rows.map((row) => ({
        job_id: row.jobs?.id || '',
        job_title: row.jobs?.title || 'Nepoznati posao',
        job_city: row.jobs?.city || '',
        firm_name: row.firms?.name || 'Nepoznata firma',
        created_at: row.created_at,
      }))
    );
  }

  useEffect(() => {
    if (activeTab === 'subscriptions' && firms.length > 0) {
      loadFirmPlans();
      loadPromoCount();
    }
    if (activeTab === 'conversations') {
      loadConversations();
    }
    if (activeTab === 'payments') {
      loadPayments();
    }
  }, [activeTab, firms]);

  async function toggleVerified(firm: AdminFirm) {
    setSavingVerified(firm.id);
    setError('');
    setSuccess('');
    const { error: err } = await supabase
      .from('firms')
      .update({ verified: !firm.verified })
      .eq('id', firm.id);
    setSavingVerified(null);
    if (err) {
      setError(err.message);
      return;
    }
    await loadFirms();
    await loadFirmPlans();
    setSuccess('Verifikacija firme ažurirana.');
  }

  async function toggleAdmin(profile: AdminProfile) {
    setSavingAdmin(profile.id);
    setError('');
    setSuccess('');
    const { error: err } = await supabase
      .from('profiles')
      .update({ is_admin: !profile.is_admin })
      .eq('id', profile.id);
    setSavingAdmin(null);
    if (err) {
      setError(err.message);
      return;
    }
    await loadProfiles();
    setSuccess('Admin status ažuriran.');
  }

  async function resetPassword(email: string) {
    const redirectTo = `${window.location.origin}/zaposli.ba/nova-lozinka/`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (err) throw err;
  }

  async function markRequestRead(id: string) {
    const { error: err } = await supabase
      .from('admin_requests')
      .update({ read: true })
      .eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    await loadRequests();
  }

  function filteredFirms() {
    const q = search.toLowerCase();
    return firms.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.email?.toLowerCase() || '').includes(q) ||
        (f.city?.toLowerCase() || '').includes(q)
    );
  }

  function filteredProfiles() {
    const q = search.toLowerCase();
    return profiles.filter(
      (p) =>
        (p.email?.toLowerCase() || '').includes(q) ||
        (p.full_name?.toLowerCase() || '').includes(q) ||
        (p.phone?.toLowerCase() || '').includes(q)
    );
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <Crown className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Admin panel</h1>
            <p className="text-steel mb-6">Morate biti prijavljeni sa administratorskim nalogom da biste nastavili.</p>
            <Link href="/prijava/" className="btn-primary inline-flex items-center gap-2">
              Prijavite se
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Pristup odbijen</h1>
            <p className="text-steel mb-6">Nemate ovlaštenje za pristup admin panelu.</p>
            <Link href="/dashboard/" className="btn-primary inline-flex items-center gap-2">
              Nazad na dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin panel</h1>
              <p className="text-steel text-sm">Upravljanje korisnicima, firmama i pretplatama</p>
            </div>
            <Link href="/dashboard/" className="btn-secondary text-sm py-2.5 px-4 inline-flex items-center gap-2">
              Nazad na dashboard
            </Link>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-6">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto md:flex-wrap md:overflow-visible no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-brand-orange text-[#ffffff]'
                      : 'text-steel hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading && activeTab !== 'subscriptions' ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje...
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Korisnici" value={stats?.users ?? profiles.length} icon={Users} />
                    <StatCard label="Firme / Majstori" value={stats ? stats.firms + stats.majstors : firms.length} icon={Building2} />
                    <StatCard label="Poslovi" value={stats?.jobs ?? 0} icon={Briefcase} />
                    <StatCard label="Ponude" value={stats?.bids ?? 0} icon={TrendingUp} />
                    <StatCard label="Recenzije" value={stats?.reviews ?? 0} icon={Star} />
                    <StatCard label="Poruke" value={stats?.messages ?? 0} icon={MessageSquare} />
                    <StatCard label="Prihod (KM)" value={stats?.revenue ?? 0} icon={DollarSign} isCurrency />
                    <StatCard label="Nepročitani zahtjevi" value={requests.filter((n) => !n.read).length} icon={Bell} />
                  </div>

                  {stats && (
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Status poslova</h3>
                        <div className="space-y-3">
                          <StatusBar label="Otvoreni" value={stats.openJobs} total={stats.jobs} color="bg-blue-500" />
                          <StatusBar label="U toku" value={stats.inProgressJobs} total={stats.jobs} color="bg-yellow-500" />
                          <StatusBar label="Završeni" value={stats.completedJobs} total={stats.jobs} color="bg-green-500" />
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Korisnici po ulogama</h3>
                        <div className="space-y-3">
                          <StatusBar label="Klijenti" value={stats.clients} total={stats.users} color="bg-brand-orange" />
                          <StatusBar label="Firme" value={stats.firms} total={stats.users} color="bg-blue-500" />
                          <StatusBar label="Majstori" value={stats.majstors} total={stats.users} color="bg-green-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {stats && (
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Nedavni poslovi</h3>
                        {stats.recentJobs.length === 0 ? (
                          <p className="text-sm text-steel">Nema nedavnih poslova.</p>
                        ) : (
                          <ul className="space-y-3">
                            {stats.recentJobs.map((job, i) => (
                              <li key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-900 font-medium truncate max-w-[60%]">{job.title}</span>
                                <span className="text-steel">{job.city}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Nedavne ponude</h3>
                        {stats.recentBids.length === 0 ? (
                          <p className="text-sm text-steel">Nema nedavnih ponuda.</p>
                        ) : (
                          <ul className="space-y-3">
                            {stats.recentBids.map((bid, i) => (
                              <li key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-900 font-medium">{bid.firm_name}</span>
                                <span className="text-brand-orange font-semibold">{bid.amount} KM</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pretraži korisnike..."
                        className="w-full bg-cloud border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredProfiles().map((profile) => (
                      <div key={profile.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{profile.full_name || profile.email}</p>
                          <p className="text-sm text-steel">{profile.email} · {profile.phone || '—'}</p>
                          <p className="text-xs text-steel mt-1">
                            {roleLabel(profile.role)} · {formatDate(profile.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setEditingProfile(profile)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Uredi
                          </button>
                          <button
                            onClick={() => toggleAdmin(profile)}
                            disabled={savingAdmin === profile.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg transition-colors ${
                              profile.is_admin
                                ? 'bg-brand-orange text-[#ffffff] hover:bg-brand-orange-dark'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <Crown className="w-3.5 h-3.5" />
                            {savingAdmin === profile.id ? '...' : profile.is_admin ? 'Admin' : 'Postavi admin'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'firms' && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pretraži firme..."
                        className="w-full bg-cloud border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredFirms().map((firm) => (
                      <div key={firm.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-gray-900">{firm.name}</p>
                            {firm.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-steel">{firm.email} · {firm.city || '—'} · {firm.review_count} recenzija</p>
                          <p className="text-xs text-steel mt-1">{formatDate(firm.created_at)}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/firma-profil/?slug=${firm.slug}`}
                            className="text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Profil
                          </Link>
                          <button
                            onClick={() => setEditingFirm(firm)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Uredi
                          </button>
                          <button
                            onClick={() => toggleVerified(firm)}
                            disabled={savingVerified === firm.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg transition-colors ${
                              firm.verified
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {savingVerified === firm.id ? '...' : firm.verified ? <><Check className="w-3.5 h-3.5" /> Verifikovana</> : 'Verifikuj'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                      <p className="text-xs text-steel dark:text-gray-400">Aktivnih pretplata</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {firmPlans.filter(({ subscription }) => subscription?.status === 'active').length}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                      <p className="text-xs text-steel dark:text-gray-400">Promo iskorišteno</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {promoCount} <span className="text-sm font-normal text-steel">/ 1000</span>
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                      <p className="text-xs text-steel dark:text-gray-400">Mjesečni reset ponuda</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getResetCountdownText()}</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-sm text-steel dark:text-gray-400">Upravljanje pretplatama po firmama</p>
                      <button
                        onClick={() => { loadFirmPlans(); loadPromoCount(); }}
                        disabled={loadingSubscriptions}
                        className="text-sm text-brand-orange hover:text-brand-orange-dark font-medium disabled:opacity-50"
                      >
                        {loadingSubscriptions ? 'Učitavanje...' : 'Osvježi'}
                      </button>
                    </div>
                    {loadingSubscriptions ? (
                      <div className="flex items-center justify-center py-12 text-steel dark:text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje pretplata...
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {firmPlans.map(({ firm, subscription }) => {
                          const isExpired = subscription?.ends_at && new Date(subscription.ends_at) < new Date();
                          return (
                            <div key={firm.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{firm.name}</p>
                                <p className="text-sm text-steel dark:text-gray-400">
                                  Paket:{' '}
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {subscription?.plans?.name || 'Besplatno'}
                                  </span>
                                  {subscription?.plans?.featured && (
                                    <Star className="w-3.5 h-3.5 inline text-brand-orange ml-1" />
                                  )}
                                  {subscription?.is_promo && (
                                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">PROMO</span>
                                  )}
                                </p>
                                <p className="text-xs text-steel dark:text-gray-500 mt-1">
                                  {subscription?.status === 'active' && !isExpired
                                    ? `Aktivna do ${formatDateTime(subscription.ends_at || '')}`
                                    : isExpired
                                    ? 'Pretplata istekla'
                                    : subscription?.status
                                    ? `Status: ${subscription.status}`
                                    : 'Bez pretplate'}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => setEditingSubscription({ firm, subscription })}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Uredi
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-steel">Pregled svih uplata</p>
                    <button
                      onClick={loadPayments}
                      className="text-sm text-brand-orange hover:text-brand-orange-dark font-medium"
                    >
                      Osvježi
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {payments.length === 0 ? (
                      <p className="p-6 text-sm text-steel text-center">Nema uplata.</p>
                    ) : (
                      payments.map((p) => (
                        <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {p.firms?.name || 'Firma'} · {p.plans?.name || 'Paket'}
                              </p>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  p.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : p.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {p.status === 'completed' ? 'Završeno' : p.status === 'pending' ? 'Na čekanju' : p.status}
                              </span>
                            </div>
                            <p className="text-sm text-steel">
                              {p.provider.toUpperCase()} · {p.amount.toFixed(2)} {p.currency} · {p.interval === 'yearly' ? 'Godišnje' : 'Mjesečno'}
                            </p>
                            <p className="text-xs text-steel mt-1">{formatDate(p.created_at)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-steel">Trenutni paketi. Izmjene se vrše direktno u bazi.</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {plans.map((plan) => (
                      <div key={plan.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-gray-900">{plan.name}</p>
                            {plan.featured && <Star className="w-4 h-4 text-brand-orange" />}
                          </div>
                          <p className="text-sm text-steel">{plan.description}</p>
                          <p className="text-xs text-steel mt-1">
                            {plan.bids_per_month === 9999 ? 'Neograničene ponude' : `${plan.bids_per_month} ponuda/mj`}
                            {' · '}
                            {plan.verified_badge && 'verifikacija · '}
                            {plan.priority_support && 'prioritetna podrška'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(plan.price_monthly)} KM/mj</p>
                          <p className="text-xs text-steel">{formatPrice(plan.price_yearly)} KM/god</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'conversations' && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-steel">Razgovori između klijenata i firmi sa prihvaćenom ponudom</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {conversations.length === 0 ? (
                      <p className="p-6 text-sm text-steel text-center">Nema aktivnih razgovora.</p>
                    ) : (
                      conversations.map((c) => (
                        <div
                          key={c.job_id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{c.job_title}</p>
                            <p className="text-sm text-steel">
                              {c.job_city} · Firma: {c.firm_name} · {formatDate(c.created_at)}
                            </p>
                          </div>
                          <Link
                            href={`/dashboard/razgovor/?job_id=${c.job_id}`}
                            className="text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                          >
                            Pregledaj razgovor
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-steel">Zahtjevi od firmi (npr. za nadogradnju pretplate)</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {requests.length === 0 ? (
                      <p className="p-6 text-sm text-steel text-center">Nema zahtjeva.</p>
                    ) : (
                      requests.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${n.read ? 'opacity-60' : ''}`}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {n.type === 'subscription_request' ? 'Zahtjev za nadogradnju' : n.type}
                              </p>
                              {!n.read && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                                  NOVO
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-steel">
                              Firma: {n.firms?.name || '—'} · {formatDate(n.created_at)}
                            </p>
                            {n.metadata && (
                              <p className="text-xs text-steel mt-1">
                                {JSON.stringify(n.metadata)}
                              </p>
                            )}
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => markRequestRead(n.id)}
                              className="text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              Označi pročitanim
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {editingProfile && (
            <ProfileEditModal
              profile={editingProfile}
              onClose={() => setEditingProfile(null)}
              onSaved={() => {
                loadProfiles();
                setSuccess('Korisnički profil ažuriran.');
              }}
              onResetPassword={async (email) => {
                await resetPassword(email);
                setSuccess(`Email za reset lozinke poslat na ${email}.`);
              }}
            />
          )}

          {editingFirm && (
            <FirmEditModal
              firm={editingFirm}
              onClose={() => setEditingFirm(null)}
              onSaved={() => {
                loadFirms();
                loadFirmPlans();
                setSuccess('Profil firme ažuriran.');
              }}
            />
          )}

          {editingSubscription && (
            <SubscriptionEditModal
              firmId={editingSubscription.firm.id}
              firmName={editingSubscription.firm.name}
              subscription={editingSubscription.subscription}
              plans={plans}
              onClose={() => setEditingSubscription(null)}
              onSaved={() => {
                loadFirmPlans();
                loadPromoCount();
                setSuccess('Pretplata ažurirana.');
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  isCurrency,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  isCurrency?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
      <div className="p-3 bg-orange-50 rounded-xl">
        <Icon className="w-6 h-6 text-brand-orange" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">
          {isCurrency ? `${value.toLocaleString('bs-BA')} KM` : value.toLocaleString('bs-BA')}
        </p>
        <p className="text-sm text-steel">{label}</p>
      </div>
    </div>
  );
}

function StatusBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium text-gray-900">
          {value} <span className="text-steel">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
