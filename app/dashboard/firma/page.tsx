'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Briefcase, Clock, Send } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function FirmDashboard() {
  const { user, loading, role, signOut } = useAuth();
  const router = useRouter();
  const [firmId, setFirmId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [bidJob, setBidJob] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && (!user || role !== 'firm')) router.push('/prijava');
  }, [user, role, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from('firms').select('id').eq('owner_id', user.id).single().then(({ data, error: err }) => {
      if (err) setError(err.message);
      if (data) setFirmId(data.id);
    });
  }, [user]);

  useEffect(() => {
    if (!firmId) return;
    supabase.from('bids').select('*, jobs(*)').eq('firm_id', firmId).then(({ data }) => {
      if (data) setBids(data);
    });
    supabase.from('jobs').select('*').eq('status', 'open').limit(20).then(({ data }) => {
      if (data) setJobs(data);
    });
  }, [firmId]);

  const submitBid = async () => {
    if (!firmId || !bidJob || !bidAmount) return;
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.from('bids').insert({
      job_id: bidJob,
      firm_id: firmId,
      amount: parseFloat(bidAmount),
      message: bidMessage,
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setSuccess('Ponuda poslana!');
    setBidJob(null);
    setBidAmount('');
    setBidMessage('');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading || !user) return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 font-bold mb-2">Greška</p>
          <p className="text-sm text-steel">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-brand-orange text-white rounded-lg">Pokušaj ponovo</button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <ErrorBoundary>
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-ink">Dashboard firme</h1>
              <p className="text-steel">{user.email}</p>
            </div>
            <button onClick={signOut} className="text-sm text-steel hover:text-ink underline">Odjavi se</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-6 h-6 text-brand-orange" />
                <span className="text-2xl font-bold text-ink">{jobs.length}</span>
              </div>
              <p className="text-sm text-steel">Otvorenih poslova</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-brand-orange" />
                <span className="text-2xl font-bold text-ink">{bids.length}</span>
              </div>
              <p className="text-sm text-steel">Poslanih ponuda</p>
            </div>
          </div>

          {success && <p className="text-green-700 bg-green-50 rounded-lg px-4 py-2 mb-4 text-sm">{success}</p>}

          <h2 className="text-lg font-bold text-ink mb-4">Aktivni poslovi</h2>
          {jobs.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-steel text-sm">Trenutno nema otvorenih poslova.</p>
              <p className="text-gray-400 text-xs mt-1">Čim neko objavi posao, pojaviće se ovdje.</p>
            </div>
          ) : (
          <div className="space-y-3">
            {jobs.slice(0, 10).map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-ink">{job.title}</h3>
                    <p className="text-sm text-steel mt-1">{job.city} · {job.category_slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Otvoren</span>
                    <button
                      onClick={() => setBidJob(bidJob === job.id ? null : job.id)}
                      className="text-xs bg-brand-orange text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange-dark transition-colors"
                    >
                      Pošalji ponudu
                    </button>
                  </div>
                </div>
                {bidJob === job.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <input
                        type="number"
                        placeholder="Iznos (KM)"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                    <textarea
                      placeholder="Poruka za klijenta (opcionalno)"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      className="input-field text-sm mb-3"
                      rows={2}
                    />
                    <button
                      onClick={submitBid}
                      disabled={submitting || !bidAmount}
                      className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-orange-dark disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Slanje...' : 'Pošalji ponudu'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      </main>
      <Footer />
      </div>
    </ErrorBoundary>
  );
}
