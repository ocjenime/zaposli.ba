'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, BadgeCheck, ArrowRight, Loader2, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';

interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  category_slug: string;
  status: string;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long' });
}

export default function ProjectsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('id,title,description,city,category_slug,status,created_at')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Greška prilikom učitavanja poslova.');
    } else {
      setJobs((data as Job[]) || []);
    }
    setLoading(false);
  }

  function handleBidClick(jobId: string) {
    if (!user) {
      router.push('/registracija/');
      return;
    }
    if (role !== 'firm') {
      router.push('/dashboard/');
      return;
    }
    router.push(`/dashboard/firma/?expandJobId=${jobId}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Poslovi' }]} />
        <PageHero
          title="Aktivni poslovi"
          subtitle="Stvarni poslovi kupaca širom BiH: registrujte firmu i pošaljite ponudu"
        />

        <section className="py-14 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-steel">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje poslova...
              </div>
            ) : error ? (
              <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 text-center">{error}</p>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-steel mb-4">Trenutno nema otvorenih poslova.</p>
                <Link href="/objavi-projekat/" className="btn-primary">
                  Objavi prvi posao
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5 mb-12">
                {jobs.map((job) => {
                  const category = getCategory(job.category_slug);
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-brand-orange">
                            {category?.name || job.category_slug}
                          </span>
                        </div>
                        <span className="text-xs text-steel">{formatDate(job.created_at)}</span>
                      </div>

                      <h3 className="text-lg font-bold text-ink mb-2">{job.title}</h3>
                      <p className="text-steel text-sm mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-steel mb-4">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.city}</span>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-steel bg-cloud px-2.5 py-1 rounded-lg">
                          <BadgeCheck className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Otvoren za ponude</span>
                        </div>
                        <button
                          onClick={() => handleBidClick(job.id)}
                          className="inline-flex items-center gap-1.5 text-sm py-2 px-3 rounded-xl font-medium bg-orange-50 text-brand-orange hover:bg-orange-100 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          {!mounted ? 'Pošalji ponudu' : user ? (role === 'firm' ? 'Pošalji ponudu' : 'Moj dashboard') : 'Prijavi se da pošalješ ponudu'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA za firme */}
            <div className="bg-ink rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Želite slati ponude na ove poslove?</h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  Registrujte firmu besplatno, pregledajte poslove u vašoj kategoriji i pošaljite prvu ponudu već danas.
                </p>
                <Link
                  href="/registracija/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
                >
                  Registrujte firmu besplatno
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
