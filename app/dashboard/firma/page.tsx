'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  MapPin, Tag, Loader2, Send, MessageSquare, CheckCircle, XCircle, Clock,
  Briefcase, Crown, AlertTriangle,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  category_slug: string;
  status: string;
  created_at: string;
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

const statusLabels: Record<string, string> = {
  pending: 'Na čekanju',
  accepted: 'Prihvaćena',
  rejected: 'Odbijena',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-steel" />,
  accepted: <CheckCircle className="w-4 h-4 text-green-600" />,
  rejected: <XCircle className="w-4 h-4 text-gray-400" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long' });
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

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/prijava/');
      else if (!isFirmRole(role)) router.push('/dashboard/');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    const expandId = searchParams.get('expandJobId');
    if (expandId) setExpandedJob(expandId);
  }, [searchParams]);

  useEffect(() => {
    if (user && isFirmRole(role)) fetchFirm();
  }, [user, role]);

  async function fetchFirm() {
    if (!user) return;
    setLoadingFirm(true);
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
    await Promise.all([
      fetchOpenJobs(),
      fetchMyBids(data.id),
      loadPlan(data.id),
    ]);
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

  async function fetchOpenJobs() {
    setLoadingJobs(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Greška prilikom učitavanja otvorenih poslova.');
    } else {
      setOpenJobs((data as Job[]) || []);
    }
    setLoadingJobs(false);
  }

  async function fetchMyBids(id: string) {
    setLoadingBids(true);
    const { data, error: err } = await supabase
      .from('bids')
      .select('*, jobs(id,title,city,category_slug,status,created_at)')
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard firme</h1>
              <p className="text-steel text-sm">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/firma/profil/" className="btn-secondary text-sm py-2.5 px-4 inline-flex items-center gap-2">
                Uredi profil
              </Link>
              <Link href="/dashboard/firma/pretplata/" className="btn-secondary text-sm py-2.5 px-4 inline-flex items-center gap-2">
                <Crown className="w-4 h-4 text-brand-orange" /> Pretplata
              </Link>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {firmId && !loadingPlan && (
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 rounded-xl border px-4 py-3 text-sm ${canBid ? 'bg-white border-gray-100' : 'bg-orange-50 border-orange-100'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Crown className={`w-4 h-4 ${subscription?.plans?.featured ? 'text-brand-orange' : 'text-steel'}`} />
                <span className="font-medium text-gray-900">
                  {subscription?.plans?.name || 'Besplatno'}
                </span>
                <span className="text-steel">· {remainingBidsText(bidsUsed, bidsLimit)}</span>
                <span className="text-steel">· {getResetCountdownText()}</span>
                {subscription?.ends_at && (
                  <span className="text-steel">· Aktivna do {formatDateTime(subscription.ends_at)}</span>
                )}
              </div>
              {!canBid && (
                <div className="flex items-center gap-2 text-brand-orange-dark">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Ograničenje dostignuto</span>
                </div>
              )}
            </div>
          )}

          {loadingFirm ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje firme...
            </div>
          ) : !firmId ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <p className="text-steel text-sm">Nemate povezan profil firme.</p>
              <Link href="/registracija/" className="btn-primary text-sm py-2 px-4 mt-3 inline-block">Registruj firmu</Link>
            </div>
          ) : (
            <>
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-orange" /> Otvoreni poslovi
                </h2>
                {loadingJobs ? (
                  <div className="flex items-center text-steel py-6">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Učitavanje poslova...
                  </div>
                ) : openJobs.length === 0 ? (
                  <p className="text-steel text-sm bg-white rounded-xl border border-gray-100 p-4">Trenutno nema otvorenih poslova.</p>
                ) : (
                  <div className="grid gap-3">
                    {openJobs.map((job) => {
                      const category = getCategory(job.category_slug);
                      const alreadyBid = hasBidForJob(job.id);
                      return (
                        <div
                          key={job.id}
                          className={`bg-white rounded-xl border p-4 shadow-sm transition-all duration-200 ${alreadyBid || !canBid ? 'border-gray-100 opacity-75' : 'border-gray-100 hover:border-brand-orange/30 hover:shadow-md cursor-pointer'}`}
                          onClick={() => { if (!alreadyBid && canBid) setExpandedJob(expandedJob === job.id ? null : job.id); }}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{job.title}</h3>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-steel mt-1">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.city}</span>
                                {category && (
                                  <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {category.name}</span>
                                )}
                                <span className="w-1 h-1 bg-steel rounded-full" />
                                <span>{formatDate(job.created_at)}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); if (!alreadyBid && canBid) setExpandedJob(expandedJob === job.id ? null : job.id); }}
                              disabled={alreadyBid || !canBid}
                              className="text-sm py-2 px-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-orange-50 text-brand-orange hover:bg-orange-100 shrink-0"
                            >
                              {alreadyBid ? 'Već ste poslali ponudu' : !canBid ? 'Limit ponuda dostignut' : expandedJob === job.id ? 'Zatvori' : 'Pošalji ponudu'}
                            </button>
                          </div>

                          {expandedJob === job.id && !alreadyBid && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-900 mb-3 leading-relaxed">{job.description}</p>
                              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs font-medium text-steel mb-1">Iznos ponude (KM) *</label>
                                  <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="npr. 500"
                                    className="input-field"
                                    min="1"
                                    step="0.01"
                                    required
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-medium text-steel mb-1">Poruka (opcionalno)</label>
                                  <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Predstavite se i navedi rok izvršenja..."
                                    rows={3}
                                    className="input-field"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => submitBid(job.id)}
                                  disabled={(submitting && submitJobId === job.id) || !canBid}
                                  className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2 disabled:opacity-50"
                                >
                                  <Send className="w-4 h-4" />
                                  {submitting && submitJobId === job.id ? 'Slanje...' : !canBid ? 'Limit dostignut' : 'Pošalji ponudu'}
                                </button>
                                <button
                                  onClick={() => setExpandedJob(null)}
                                  className="text-sm text-steel hover:text-gray-900 px-3 py-2"
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

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Send className="w-5 h-5 text-brand-orange" /> Moje ponude
                </h2>
                {loadingBids ? (
                  <div className="flex items-center text-steel py-6">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Učitavanje ponuda...
                  </div>
                ) : myBids.length === 0 ? (
                  <p className="text-steel text-sm bg-white rounded-xl border border-gray-100 p-4">Još niste poslali nijednu ponudu.</p>
                ) : (
                  <div className="grid gap-3">
                    {myBids.map((bid) => (
                      <div key={bid.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{bid.jobs?.title || 'Posao'}</h3>
                            <div className="flex items-center gap-2 text-sm text-steel mt-1">
                              <MapPin className="w-4 h-4" /> {bid.jobs?.city}
                              <span className="w-1 h-1 bg-steel rounded-full" />
                              <span>{formatDate(bid.created_at)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-orange">{bid.amount} KM</p>
                            <div className="flex items-center justify-end gap-1 text-xs font-medium">
                              {statusIcons[bid.status]}
                              <span>{statusLabels[bid.status]}</span>
                            </div>
                          </div>
                        </div>
                        {bid.message && <p className="text-sm text-gray-900 mt-2 bg-cloud rounded-lg p-3">{bid.message}</p>}
                        {bid.status === 'accepted' && bid.jobs?.id && (
                          <Link
                            href={`/dashboard/razgovor/?job_id=${bid.jobs.id}`}
                            className="mt-3 btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" /> Razgovor sa klijentom
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
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
        <div className="min-h-screen flex flex-col bg-cloud">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </main>
          <Footer />
        </div>
      }
    >
      <FirmDashboardContent />
    </Suspense>
  );
}
