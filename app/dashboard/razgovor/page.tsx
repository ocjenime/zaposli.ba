'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MapPin, Send, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { formatDate as formatDateHelper } from '@/lib/date';

interface Profile {
  id: string;
  full_name: string | null;
  is_admin?: boolean | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
}

interface Job {
  id: string;
  title: string;
  city: string;
  client_id: string;
  status: string;
  private_status: string | null;
  is_private: boolean;
  target_firm_id: string | null;
  deadline: string | null;
  mediation_requested: boolean;
  mediation_requested_at: string | null;
  mediation_requested_by: string | null;
  mediation_reason: string | null;
  mediation_resolved: boolean;
  mediation_resolution: string | null;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return formatDateHelper(iso);
}

function Conversation() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');
  const { user, loading, role, isAdmin } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Profile | null>(null);
  const [adminInfo, setAdminInfo] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showMediationForm, setShowMediationForm] = useState(false);
  const [mediationReason, setMediationReason] = useState('');
  const [mediationLoading, setMediationLoading] = useState(false);
  const [mediationError, setMediationError] = useState('');
  const [mediationSuccess, setMediationSuccess] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const markAsRead = useCallback(async () => {
    if (!jobId || !user) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('job_id', jobId)
      .neq('sender_id', user.id)
      .eq('read', false);
  }, [jobId, user]);

  const fetchData = useCallback(async () => {
    if (!jobId || !user) return;
    setLoadingData(true);
    setError('');

    const { data: jobData, error: jobErr } = await supabase
      .from('jobs')
      .select('id,title,city,client_id,status,private_status,is_private,target_firm_id,deadline,mediation_requested,mediation_requested_at,mediation_requested_by,mediation_reason,mediation_resolved,mediation_resolution')
      .eq('id', jobId)
      .single();

    if (jobErr || !jobData) {
      setError('Razgovor nije pronađen.');
      setLoadingData(false);
      return;
    }

    const currentJob = jobData as Job;

    let allowed = false;
    let partnerId: string | null = null;

    async function getPrivateFirmOwner() {
      if (!currentJob.target_firm_id) return null;
      const { data } = await supabase
        .from('firms')
        .select('owner_id, name')
        .eq('id', currentJob.target_firm_id)
        .single();
      return data as { owner_id: string; name: string } | null;
    }

    if (isAdmin) {
      allowed = true;
      if (currentJob.is_private && currentJob.target_firm_id) {
        const firmOwner = await getPrivateFirmOwner();
        const [{ data: clientProfile }, { data: ownerProfile }] = await Promise.all([
          supabase.from('profiles').select('id, full_name').eq('id', currentJob.client_id).single(),
          firmOwner?.owner_id
            ? supabase.from('profiles').select('id, full_name').eq('id', firmOwner.owner_id).single()
            : Promise.resolve({ data: null }),
        ]);
        const clientName = (clientProfile as Profile | null)?.full_name || 'Klijent';
        const ownerName = (ownerProfile as Profile | null)?.full_name || 'Firma';
        setAdminInfo(`Klijent: ${clientName} · Firma: ${firmOwner?.name || ownerName}`);
        partnerId = firmOwner?.owner_id ?? currentJob.client_id;
      } else {
        const { data: bidData } = await supabase
          .from('bids')
          .select('firm_id, firms(owner_id, name)')
          .eq('job_id', jobId)
          .eq('status', 'accepted')
          .single();
        const typedBid = bidData as unknown as { firm_id: string; firms: { owner_id: string; name: string } | null } | null;
        if (typedBid?.firms) {
          const [{ data: clientProfile }, { data: ownerProfile }] = await Promise.all([
            supabase.from('profiles').select('id, full_name').eq('id', currentJob.client_id).single(),
            supabase.from('profiles').select('id, full_name').eq('id', typedBid.firms.owner_id).single(),
          ]);
          const clientName = (clientProfile as Profile | null)?.full_name || 'Klijent';
          const ownerName = (ownerProfile as Profile | null)?.full_name || 'Firma';
          setAdminInfo(`Klijent: ${clientName} · Firma: ${typedBid.firms.name || ownerName}`);
          partnerId = typedBid.firms.owner_id;
        } else {
          setAdminInfo('Admin pregled');
          partnerId = currentJob.client_id;
        }
      }
    } else if (role === 'client' && currentJob.client_id === user.id) {
      allowed = true;
      if (currentJob.is_private && currentJob.target_firm_id) {
        const firmOwner = await getPrivateFirmOwner();
        partnerId = firmOwner?.owner_id ?? null;
      } else {
        const { data: bidData } = await supabase
          .from('bids')
          .select('firm_id')
          .eq('job_id', jobId)
          .eq('status', 'accepted')
          .single();
        if (bidData?.firm_id) {
          const { data: firmData } = await supabase
            .from('firms')
            .select('owner_id')
            .eq('id', bidData.firm_id)
            .single();
          partnerId = firmData?.owner_id ?? null;
        }
      }
    } else if (isFirmRole(role)) {
      const { data: firmData } = await supabase.from('firms').select('id').eq('owner_id', user.id).single();
      if (firmData) {
        if (currentJob.is_private && currentJob.target_firm_id === firmData.id) {
          allowed = true;
          partnerId = currentJob.client_id;
        } else {
          const { data: bidData } = await supabase
            .from('bids')
            .select('id')
            .eq('job_id', jobId)
            .eq('firm_id', firmData.id)
            .eq('status', 'accepted')
            .single();
          if (bidData) {
            allowed = true;
            partnerId = currentJob.client_id;
          }
        }
      }
    }

    if (!allowed) {
      setError('Nemate pristup ovom razgovoru.');
      setLoadingData(false);
      return;
    }

    setJob(currentJob);

    if (partnerId) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', partnerId)
        .single();
      setPartner(profileData as Profile | null);
    }

    const { data: messagesData, error: messagesErr } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, is_admin)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (messagesErr) {
      setError('Greška prilikom učitavanja poruka.');
    } else {
      setMessages((messagesData as Message[]) || []);
    }

    markAsRead();
    setLoadingData(false);
  }, [jobId, user, role, isAdmin, markAsRead]);

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/');
  }, [user, loading, router]);

  useEffect(() => {
    if (jobId && user) fetchData();
  }, [jobId, user, fetchData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!jobId) return;
    const channel = supabase
      .channel(`messages:${jobId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `job_id=eq.${jobId}` },
        async (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id && newMessage.sender_id !== user?.id) {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('id, full_name, is_admin')
              .eq('id', newMessage.sender_id)
              .single();
            newMessage.sender = senderProfile as Profile | undefined;
          }
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          if (newMessage.sender_id !== user?.id) markAsRead();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, user, markAsRead]);

  function getSenderLabel(msg: Message, isMe: boolean) {
    if (isMe) return isAdmin ? 'Vi (admin)' : 'Vi';
    if (msg.sender?.is_admin) return 'Administrator';
    if (isAdmin) return msg.sender_id === job?.client_id ? 'Klijent' : 'Firma';
    return role === 'client' ? 'Firma' : 'Klijent';
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !jobId || !user || sending) return;
    setSending(true);
    const { error: err } = await supabase.from('messages').insert({
      job_id: jobId,
      sender_id: user.id,
      content: input.trim(),
      read: false,
    });
    setSending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setInput('');
  }

  function canRequestMediation() {
    if (!job || isAdmin || job.mediation_requested) return false;
    const activeStatuses = ['in_progress', 'done_pending', 'completed'];
    const currentStatus = job.is_private && job.private_status ? job.private_status : job.status;
    if (!activeStatuses.includes(currentStatus)) return false;
    if (!job.deadline) return false;
    if (new Date() <= new Date(job.deadline)) return false;
    return true;
  }

  async function requestMediation() {
    if (!job || !user || !mediationReason.trim()) return;
    setMediationLoading(true);
    setMediationError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/request-mediation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ job_id: job.id, reason: mediationReason.trim() }),
      });
      const data = await res.json().catch(() => ({ error: 'Nepoznata greška' }));
      if (!res.ok) {
        setMediationError(data.error || 'Greška prilikom slanja zahtjeva.');
      } else {
        setMediationSuccess(true);
        setShowMediationForm(false);
        setMediationReason('');
        await fetchData();
      }
    } catch (err) {
      setMediationError(err instanceof Error ? err.message : 'Greška prilikom slanja zahtjeva.');
    } finally {
      setMediationLoading(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">Učitavanje...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto h-[calc(100vh-14rem)] sm:h-[calc(100vh-15rem)] flex flex-col">
          <Link href={isAdmin ? '/admin/' : isFirmRole(role) ? '/dashboard/firma/' : '/dashboard/'} className="inline-flex items-center text-sm text-steel hover:text-gray-900 mb-3">
            <ArrowLeft className="w-4 h-4 mr-1" /> Nazad
          </Link>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}

          {isAdmin && (
            <div className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-xl px-4 py-3 mb-3 text-sm font-medium">
              Pregled administratora - možete slati poruke u ovaj razgovor
            </div>
          )}

          {loadingData ? (
            <div className="flex-grow flex items-center justify-center text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje razgovora...
            </div>
          ) : !job ? (
            <p className="text-steel flex-grow">Razgovor nije pronađen.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="font-bold text-gray-900">{job.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-steel mt-1">
                      <MapPin className="w-4 h-4" /> {job.city}
                      {adminInfo && (
                        <>
                          <span className="w-1 h-1 bg-steel rounded-full" />
                          <span className="text-brand-orange font-medium">{adminInfo}</span>
                        </>
                      )}
                      {!adminInfo && partner?.full_name && (
                        <>
                          <span className="w-1 h-1 bg-steel rounded-full" />
                          <span>{role === 'client' ? 'Firma' : 'Klijent'}: {partner.full_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!isAdmin && canRequestMediation() && (
                    <button
                      onClick={() => setShowMediationForm(true)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" /> Zatraži pomoć administratora
                    </button>
                  )}
                </div>

                {job.mediation_requested && (
                  <div className={`mt-3 rounded-xl px-4 py-3 text-sm ${job.mediation_resolved ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <div className="flex items-start gap-2">
                      {job.mediation_resolved ? <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" /> : <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />}
                      <div>
                        <p className="font-semibold">
                          {job.mediation_resolved
                            ? 'Spor je riješen'
                            : 'Zatražena je pomoć administratora'}
                        </p>
                        {job.mediation_reason && (
                          <p className="mt-1 text-red-700/80">{job.mediation_reason}</p>
                        )}
                        {job.mediation_resolution && (
                          <p className="mt-1 text-green-700/80"><strong>Odluka:</strong> {job.mediation_resolution}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showMediationForm && (
                <div className="bg-white rounded-xl border border-red-100 p-4 mb-3 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-1">Zatražite pomoć administratora</h3>
                  <p className="text-sm text-steel mb-3">
                    Opcija je dostupna jer je rok za ovaj posao istekao i postoji nesuglasica. Admin će se uključiti u razgovor i pomoći u rješavanju spora.
                  </p>
                  {mediationError && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-3">{mediationError}</p>}
                  {mediationSuccess && (
                    <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2 mb-3">
                      Zahtjev je poslan. Administrator će pregledati slučaj i kontaktirati vas.
                    </p>
                  )}
                  <textarea
                    value={mediationReason}
                    onChange={(e) => setMediationReason(e.target.value)}
                    rows={3}
                    placeholder="Opišite u čemu je problem i šta očekujete..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={requestMediation}
                      disabled={mediationReason.trim().length < 10 || mediationLoading}
                      className="bg-red-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {mediationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                      Pošalji zahtjev
                    </button>
                    <button
                      onClick={() => { setShowMediationForm(false); setMediationReason(''); setMediationError(''); }}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Odustani
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-grow bg-white rounded-xl border border-gray-100 p-4 shadow-sm overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center text-steel text-sm mt-8">Pošaljite prvu poruku i dogovorite detalje posla.</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender_id === user.id;
                      const showDate = idx === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[idx - 1].created_at).toDateString();
                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="text-center text-xs text-steel my-3">{formatDate(msg.created_at)}</div>
                          )}
                          <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                                isMe ? 'bg-brand-orange text-[#ffffff] rounded-br-none' : 'bg-cloud text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p className={`text-[10px] font-semibold mb-1 ${isMe ? 'text-[#ffffff]/80' : 'text-steel'}`}>
                                {getSenderLabel(msg, isMe)}
                              </p>
                              <p>{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${isMe ? 'text-[#ffffff]/80' : 'text-steel'}`}>
                                {formatTime(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              <form onSubmit={sendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Napišite poruku..."
                  className="input-field flex-grow"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Pošalji poruku"
                  className="btn-primary px-4 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ConversationPage() {
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
      <Conversation />
    </Suspense>
  );
}
