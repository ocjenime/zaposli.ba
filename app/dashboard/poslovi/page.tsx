'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MapPin, Loader2, MessageSquare, CheckCircle, DollarSign, Calendar, ImageIcon, X } from 'lucide-react';

interface Firm {
  id: string;
  name: string;
  city: string;
  logo_url: string | null;
}

interface Bid {
  id: string;
  firm_id: string;
  amount: number;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  firms: Firm;
}

interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string | null;
  status: 'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
}

interface JobImage {
  id: string;
  image_url: string;
}

const statusLabels: Record<Job['status'], string> = {
  open: 'Otvoren',
  bidding: 'U ponudama',
  in_progress: 'U toku',
  completed: 'Završen',
  cancelled: 'Otkazan',
};

const statusColors: Record<Job['status'], string> = {
  open: 'bg-blue-50 text-blue-700',
  bidding: 'bg-orange-50 text-brand-orange',
  in_progress: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function JobDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, loading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [images, setImages] = useState<JobImage[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/');
  }, [user, loading, router]);

  useEffect(() => {
    if (id && user) fetchData();
  }, [id, user]);

  async function fetchData() {
    if (!id) return;
    setLoadingData(true);
    setError('');

    const { data: jobData, error: jobErr } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('client_id', user!.id)
      .single();

    if (jobErr || !jobData) {
      setError('Posao nije pronađen ili nemate pristup.');
      setLoadingData(false);
      return;
    }
    setJob(jobData as Job);

    const [{ data: bidsData, error: bidsErr }, { data: imagesData, error: imagesErr }] = await Promise.all([
      supabase
        .from('bids')
        .select('*, firms(id,name,city,logo_url)')
        .eq('job_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('job_images')
        .select('id, image_url')
        .eq('job_id', id)
        .order('created_at', { ascending: true }),
    ]);

    if (bidsErr) {
      setError('Greška prilikom učitavanja ponuda.');
    } else {
      setBids((bidsData as Bid[]) || []);
    }

    if (imagesErr) {
      setError('Greška prilikom učitavanja fotografija.');
    } else {
      setImages((imagesData as JobImage[]) || []);
    }

    setLoadingData(false);
  }

  async function acceptBid(bidId: string) {
    if (!job) return;
    setActionId(bidId);
    setError('');

    const { error: rejectErr } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('job_id', job.id)
      .neq('id', bidId);

    if (rejectErr) {
      setError(rejectErr.message);
      setActionId(null);
      return;
    }

    const { error: acceptErr } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId);

    if (acceptErr) {
      setError(acceptErr.message);
      setActionId(null);
      return;
    }

    const { error: jobErr } = await supabase
      .from('jobs')
      .update({ status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', job.id);

    setActionId(null);
    if (jobErr) {
      setError(jobErr.message);
      return;
    }
    await fetchData();
  }

  async function completeJob() {
    if (!job) return;
    setActionId('complete');
    const { error: err } = await supabase
      .from('jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    setActionId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchData();
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

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow pt-24 pb-10 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-steel">ID posla nije naveden.</p>
            <Link href="/dashboard/" className="btn-primary mt-4 inline-block">Nazad na dashboard</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard/" className="inline-flex items-center text-sm text-steel hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Nazad na poslove
          </Link>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {loadingData ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje...
            </div>
          ) : !job ? (
            <p className="text-steel">Posao nije pronađen.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                  <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[job.status]}`}>
                    {statusLabels[job.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-steel mb-4">
                  <MapPin className="w-4 h-4" /> {job.city}{job.address ? `, ${job.address}` : ''}
                  <span className="w-1 h-1 bg-steel rounded-full" />
                  <span>Objavljen {formatDate(job.created_at)}</span>
                </div>
                <p className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-3 text-sm mt-4">
                  <span className="inline-flex items-center gap-1.5 text-steel bg-cloud rounded-lg px-3 py-1.5">
                    <DollarSign className="w-4 h-4 text-brand-orange" />
                    {job.budget_mode === 'open'
                      ? 'Majstori predlažu cijenu'
                      : job.budget_min != null && job.budget_max != null
                      ? `${job.budget_min} – ${job.budget_max} KM`
                      : job.budget_min != null
                      ? `od ${job.budget_min} KM`
                      : job.budget_max != null
                      ? `do ${job.budget_max} KM`
                      : 'Budžet po dogovoru'}
                  </span>
                  {job.deadline && (
                    <span className="inline-flex items-center gap-1.5 text-steel bg-cloud rounded-lg px-3 py-1.5">
                      <Calendar className="w-4 h-4 text-brand-orange" />
                      Rok: {formatDate(job.deadline)}
                    </span>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Fotografije posla
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {images.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(img.image_url)}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand-orange transition"
                        >
                          <img src={img.image_url} alt={`Fotografija posla: ${job?.title || ''}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {job.status === 'in_progress' && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href={`/dashboard/razgovor/?job_id=${job.id}`}
                      className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Razgovor
                    </Link>
                    <button
                      onClick={completeJob}
                      disabled={actionId === 'complete'}
                      className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {actionId === 'complete' ? 'Obrada...' : 'Označi kao završen'}
                    </button>
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Posao je uspješno završen.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Ponude {bids.length > 0 && <span className="text-steel font-normal text-sm">({bids.length})</span>}
                </h2>

                {bids.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-steel text-sm">Još uvijek nema ponuda za ovaj posao.</p>
                    <p className="text-steel text-xs mt-1">Prve ponude obično stižu u roku od 24 sata.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {bids.map((bid) => (
                      <div key={bid.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{bid.firms?.name || 'Firma'}</h3>
                            <p className="text-xs text-steel">{bid.firms?.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-orange">{bid.amount} KM</p>
                            <p className={`text-xs font-medium ${bid.status === 'accepted' ? 'text-green-700' : bid.status === 'rejected' ? 'text-gray-500' : 'text-steel'}`}>
                              {bid.status === 'pending' && 'Na čekanju'}
                              {bid.status === 'accepted' && 'Prihvaćena'}
                              {bid.status === 'rejected' && 'Odbijena'}
                            </p>
                          </div>
                        </div>
                        {bid.message && (
                          <p className="text-sm text-gray-900 mt-2 bg-cloud rounded-lg p-3">{bid.message}</p>
                        )}
                        <p className="text-xs text-steel mt-2">Poslato {formatDate(bid.created_at)}</p>

                        {job.status === 'open' || job.status === 'bidding' ? (
                          <button
                            onClick={() => acceptBid(bid.id)}
                            disabled={actionId === bid.id}
                            className="mt-3 btn-primary text-sm py-2 px-4 disabled:opacity-50"
                          >
                            {actionId === bid.id ? 'Obrada...' : 'Prihvati ponudu'}
                          </button>
                        ) : bid.status === 'accepted' ? (
                          <Link
                            href={`/dashboard/razgovor/?job_id=${job.id}`}
                            className="mt-3 btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" /> Razgovor sa firmom
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
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
                  src={selectedImage}
                  alt={`Uvećana fotografija posla: ${job?.title || ''}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function JobDetailPage() {
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
      <JobDetail />
    </Suspense>
  );
}
