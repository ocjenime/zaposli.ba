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
  LayoutDashboard, Users, Building2, CreditCard, FileText,   Bell,
  Loader2, Check, Crown, AlertCircle, Search,
  Star, CheckCircle, XCircle,
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'client' | 'firm';
  is_admin: boolean;
  created_at: string;
}

interface Firm {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  verified: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
  owner?: Profile;
}

interface AdminRequest {
  id: string;
  type: string;
  firm_id: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
  firms?: Firm;
}

interface FirmPlan {
  firm: Firm;
  subscription: Subscription | null;
}

const tabs = [
  { id: 'overview', label: 'Pregled', icon: LayoutDashboard },
  { id: 'users', label: 'Korisnici', icon: Users },
  { id: 'firms', label: 'Firme', icon: Building2 },
  { id: 'subscriptions', label: 'Pretplate', icon: CreditCard },
  { id: 'plans', label: 'Paketi', icon: FileText },
  { id: 'requests', label: 'Zahtjevi', icon: Bell },
];

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [firmPlans, setFirmPlans] = useState<FirmPlan[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const [savingSubscription, setSavingSubscription] = useState<string | null>(null);
  const [savingVerified, setSavingVerified] = useState<string | null>(null);
  const [savingAdmin, setSavingAdmin] = useState<string | null>(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

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
    setProfiles((data as Profile[]) || []);
  }

  async function loadFirms() {
    const { data, error: err } = await supabase
      .from('firms')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) throw err;
    setFirms((data as Firm[]) || []);
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

  useEffect(() => {
    if (activeTab === 'subscriptions' && firms.length > 0) {
      loadFirmPlans();
    }
  }, [activeTab, firms]);

  async function assignPlan(firmId: string, planId: string) {
    setSavingSubscription(firmId);
    setError('');
    setSuccess('');

    // Expire any existing active/cancelled subscriptions for this firm
    const { error: expireErr } = await supabase
      .from('subscriptions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('firm_id', firmId)
      .in('status', ['active', 'cancelled']);

    if (expireErr) {
      setSavingSubscription(null);
      setError(expireErr.message);
      return;
    }

    const { error: err } = await supabase.from('subscriptions').insert({
      firm_id: firmId,
      plan_id: planId,
      status: 'active',
      starts_at: new Date().toISOString(),
    });

    setSavingSubscription(null);
    if (err) {
      setError(err.message);
      return;
    }
    await loadFirmPlans();
    setSuccess('Pretplata je uspješno ažurirana.');
  }

  async function toggleVerified(firm: Firm) {
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

  async function toggleAdmin(profile: Profile) {
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
            <h1 className="text-xl font-bold text-ink mb-2">Admin panel</h1>
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
            <h1 className="text-xl font-bold text-ink mb-2">Pristup odbijen</h1>
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
              <h1 className="text-2xl font-bold text-ink">Admin panel</h1>
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

          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-orange text-white'
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Korisnici" value={profiles.length} icon={Users} />
                  <StatCard label="Firme" value={firms.length} icon={Building2} />
                  <StatCard label="Paketi" value={plans.length} icon={FileText} />
                  <StatCard label="Zahtjevi" value={requests.filter((n) => !n.read).length} icon={Bell} />
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
                        className="w-full bg-cloud border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-ink placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredProfiles().map((profile) => (
                      <div key={profile.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">{profile.full_name || profile.email}</p>
                          <p className="text-sm text-steel">{profile.email} · {profile.phone || '—'}</p>
                          <p className="text-xs text-steel mt-1">
                            {profile.role === 'firm' ? 'Firma' : 'klijent'} · {formatDate(profile.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleAdmin(profile)}
                            disabled={savingAdmin === profile.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              profile.is_admin
                                ? 'bg-brand-orange text-white hover:bg-brand-orange-dark'
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
                        className="w-full bg-cloud border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-ink placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredFirms().map((firm) => (
                      <div key={firm.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink">{firm.name}</p>
                            {firm.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-steel">{firm.email} · {firm.city || '—'} · {firm.review_count} recenzija</p>
                          <p className="text-xs text-steel mt-1">{formatDate(firm.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/firma-profil/?slug=${firm.slug}`}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Profil
                          </Link>
                          <button
                            onClick={() => toggleVerified(firm)}
                            disabled={savingVerified === firm.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
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
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-steel">Dodijeli ili promijeni paket za firmu</p>
                    <button
                      onClick={loadFirmPlans}
                      disabled={loadingSubscriptions}
                      className="text-sm text-brand-orange hover:text-brand-orange-dark font-medium disabled:opacity-50"
                    >
                      {loadingSubscriptions ? 'Učitavanje...' : 'Osvježi'}
                    </button>
                  </div>
                  {loadingSubscriptions ? (
                    <div className="flex items-center justify-center py-12 text-steel">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje pretplata...
                    </div>
                  ) : (
                  <div className="divide-y divide-gray-100">
                    {firmPlans.map(({ firm, subscription }) => (
                      <div key={firm.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="font-medium text-ink">{firm.name}</p>
                          <p className="text-sm text-steel">
                            Trenutni paket:{' '}
                            <span className="font-medium text-ink">
                              {subscription?.plans?.name || 'Besplatno'}
                            </span>
                            {subscription?.plans?.featured && (
                              <Star className="w-3.5 h-3.5 inline text-brand-orange ml-1" />
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {plans.map((plan) => (
                            <button
                              key={plan.id}
                              onClick={() => assignPlan(firm.id, plan.id)}
                              disabled={savingSubscription === firm.id || subscription?.plan_id === plan.id}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                subscription?.plan_id === plan.id
                                  ? 'bg-brand-orange text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {savingSubscription === firm.id && subscription?.plan_id !== plan.id
                                ? '...'
                                : plan.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink">{plan.name}</p>
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
                          <p className="font-bold text-ink">{formatPrice(plan.price_monthly)} KM/mj</p>
                          <p className="text-xs text-steel">{formatPrice(plan.price_yearly)} KM/god</p>
                        </div>
                      </div>
                    ))}
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
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-ink">
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
                              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
      <div className="p-3 bg-orange-50 rounded-xl">
        <Icon className="w-6 h-6 text-brand-orange" />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-sm text-steel">{label}</p>
      </div>
    </div>
  );
}
