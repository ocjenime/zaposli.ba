'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MapPin, Send, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
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
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long' });
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/');
  }, [user, loading, router]);

  useEffect(() => {
    if (jobId && user) fetchData();
  }, [jobId, user]);

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
        (payload) => {
          const newMessage = payload.new as Message;
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
  }, [jobId, user]);

  async function fetchData() {
    if (!jobId || !user) return;
    setLoadingData(true);
    setError('');

    const { data: jobData, error: jobErr } = await supabase
      .from('jobs')
      .select('id,title,city,client_id,status')
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

    if (isAdmin) {
      allowed = true;
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
    } else if (role === 'client' && currentJob.client_id === user.id) {
      allowed = true;
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
    } else if (isFirmRole(role)) {
      const { data: firmData } = await supabase.from('firms').select('id').eq('owner_id', user.id).single();
      if (firmData) {
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
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (messagesErr) {
      setError('Greška prilikom učitavanja poruka.');
    } else {
      setMessages((messagesData as Message[]) || []);
    }

    markAsRead();
    setLoadingData(false);
  }

  async function markAsRead() {
    if (!jobId || !user) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('job_id', jobId)
      .neq('sender_id', user.id)
      .eq('read', false);
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

          {loadingData ? (
            <div className="flex-grow flex items-center justify-center text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje razgovora...
            </div>
          ) : !job ? (
            <p className="text-steel flex-grow">Razgovor nije pronađen.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
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
                                {isMe
                                  ? 'Vi'
                                  : isAdmin
                                  ? (msg.sender_id === job?.client_id ? 'Klijent' : 'Firma')
                                  : role === 'client'
                                  ? 'Firma'
                                  : 'Klijent'}
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

              {!isAdmin && (
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
                    className="btn-primary px-4 disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
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
