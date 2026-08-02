'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { Plus, MapPin, ClipboardList, Loader2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  city: string;
  status: 'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  bids: { id: string }[];
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

export default function DashboardPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/prijava/');
    } else if (isFirmRole(role)) {
      router.push('/dashboard/firma/');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    if (user && role === 'client') fetchJobs();
  }, [user, role]);

  async function fetchJobs() {
    if (!user) return;
    setLoadingJobs(true);
    setError('');
    const { data, error: err } = await supabase
      .from('jobs')
      .select('*, bids(id)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });
    if (err) {
      setError('Došlo je do greške prilikom učitavanja poslova.');
      setLoadingJobs(false);
      return;
    }
    setJobs((data as Job[]) || []);
    setLoadingJobs(false);
  }

  async function completeJob(id: string) {
    setActionId(id);
    const { error: err } = await supabase
      .from('jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    setActionId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchJobs();
  }

  async function cancelJob(id: string) {
    setActionId(id);
    const { error: err } = await supabase
      .from('jobs')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id);
    setActionId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchJobs();
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
              <h1 className="text-2xl font-bold text-gray-900">Moji poslovi</h1>
              <p className="text-steel text-sm">{user.email}</p>
            </div>
            <Link href="/objavi-projekat/" className="btn-primary text-sm py-2.5 px-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Objavi novi posao
            </Link>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {loadingJobs ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje poslova...
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Nemate objavljenih poslova</h3>
              <p className="text-steel text-sm mb-4">Objavite prvi posao i primite ponude od provjerenih firmi.</p>
              <Link href="/objavi-projekat/" className="btn-primary text-sm py-2.5 px-4">Objavi posao</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-steel mt-1">
                        <MapPin className="w-4 h-4" /> {job.city}
                        <span className="w-1 h-1 bg-steel rounded-full" />
                        <span>{job.bids?.length || 0} ponuda</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[job.status]}`}>
                      {statusLabels[job.status]}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/dashboard/poslovi/?id=${job.id}`} className="btn-primary text-sm py-2 px-4 text-center w-full sm:w-auto">
                      Pogledaj ponude
                    </Link>
                    {job.status === 'in_progress' && (
                      <>
                        <Link
                          href={`/dashboard/razgovor/?job_id=${job.id}`}
                          className="btn-secondary text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        >
                          Razgovor
                        </Link>
                        <button
                          onClick={() => completeJob(job.id)}
                          disabled={actionId === job.id}
                          className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 w-full sm:w-auto"
                        >
                          {actionId === job.id ? 'Obrada...' : 'Označi završen'}
                        </button>
                      </>
                    )}
                    {job.status === 'completed' && (
                      <Link
                        href={`/dashboard/recenzija/?job_id=${job.id}`}
                        className="btn-secondary text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                      >
                        Ostavi recenziju
                      </Link>
                    )}
                    {(job.status === 'open' || job.status === 'bidding') && (
                      <button
                        onClick={() => cancelJob(job.id)}
                        disabled={actionId === job.id}
                        className="text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100 transition-colors disabled:opacity-50 w-full sm:w-auto"
                      >
                        Otkaži
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
