'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function FirmDashboard() {
  const { user, loading, role, signOut } = useAuth();
  const router = useRouter();
  const [firmId, setFirmId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || role !== 'firm')) router.push('/prijava');
  }, [user, role, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from('firms').select('id').eq('owner_id', user.id).single().then(({ data }) => {
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

  if (loading || !user) return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
      </main>
    </div>
  );

  return (
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

          <div className="grid md:grid-cols-3 gap-6 mb-10">
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

          <h2 className="text-lg font-bold text-ink mb-4">Aktivni poslovi</h2>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-ink">{job.title}</h3>
                    <p className="text-sm text-steel mt-1">{job.city} · {job.category_slug}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Otvoren</span>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-steel text-sm">Trenutno nema otvorenih poslova.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
