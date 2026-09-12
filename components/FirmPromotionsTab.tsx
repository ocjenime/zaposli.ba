'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plan, Subscription, getFeaturedAdsUsedThisMonth, getIncludedAdsRemaining } from '@/lib/subscriptions';
import { Megaphone, Loader2, CheckCircle, Clock, AlertCircle, Crown, Zap } from 'lucide-react';

const PAID_AD_PRICE = 39;

interface JobOption {
  id: string;
  title: string;
  city: string;
  target_firm_id?: string | null;
}

interface Promotion {
  id: string;
  job_id: string;
  amount: number;
  status: 'pending' | 'active' | 'expired';
  source: 'included' | 'paid';
  created_at: string;
  ends_at: string | null;
  jobs: { title: string; city: string } | null;
}

interface FirmPromotionsTabProps {
  firmId: string;
  subscription: Subscription | null;
}

export default function FirmPromotionsTab({ firmId, subscription }: FirmPromotionsTabProps) {
  const [eligibleJobs, setEligibleJobs] = useState<JobOption[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [adsUsed, setAdsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const includedRemaining = getIncludedAdsRemaining(subscription, adsUsed);
  const canUseIncluded = includedRemaining > 0;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usedCount, directJobsData, acceptedBidsData, promotionsData] = await Promise.all([
        getFeaturedAdsUsedThisMonth(firmId),
        supabase
          .from('jobs')
          .select('id, title, city, target_firm_id')
          .eq('is_private', true)
          .eq('target_firm_id', firmId)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('bids')
          .select('job_id, jobs(id, title, city)')
          .eq('firm_id', firmId)
          .eq('status', 'accepted')
          .limit(50),
        supabase
          .from('job_promotions')
          .select('*, jobs(title, city)')
          .eq('firm_id', firmId)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      setAdsUsed(usedCount);
      const directJobs = (directJobsData.data || []) as JobOption[];
      const acceptedBids = (acceptedBidsData.data || []) as unknown as Array<{
        job_id: string;
        jobs: { id: string; title: string; city: string } | null;
      }>;
      const acceptedJobs = acceptedBids
        .filter((b) => b.jobs)
        .map((b) => ({
          id: b.jobs!.id,
          title: b.jobs!.title,
          city: b.jobs!.city,
        }));
      const seen = new Set<string>();
      const eligible: JobOption[] = [];
      for (const job of [...directJobs, ...acceptedJobs]) {
        if (!seen.has(job.id)) {
          seen.add(job.id);
          eligible.push(job);
        }
      }
      setEligibleJobs(eligible);
      setPromotions((promotionsData.data || []) as unknown as Promotion[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom učitavanja.');
    } finally {
      setLoading(false);
    }
  }, [firmId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function requestPromotion() {
    if (!selectedJobId) {
      setError('Odaberite posao koji želite promovirati.');
      return;
    }
    setRequesting(true);
    setError('');
    setSuccess('');

    const source = canUseIncluded ? 'included' : 'paid';
    const amount = source === 'included' ? 0 : PAID_AD_PRICE;

    const { error: err } = await supabase.from('job_promotions').insert({
      job_id: selectedJobId,
      firm_id: firmId,
      amount,
      status: 'pending',
      source,
    });

    setRequesting(false);
    if (err) {
      setError(err.message);
      return;
    }

    setSuccess(
      source === 'included'
        ? 'Zahtjev za promovisani oglas je poslan (uključen u paket).'
        : `Zahtjev za promovisani oglas je poslan. Nakon odobrenja plaćate ${PAID_AD_PRICE} KM.`
    );
    setSelectedJobId('');
    await loadData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-steel">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje...
      </div>
    );
  }

  return (
    <section className="animate-fade-in space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-steel">Trenutni paket</p>
              <p className="font-bold text-gray-900 dark:text-white">{subscription?.plans?.name || 'Besplatno'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-steel">Uključeni oglasi ovaj mjesec</p>
              <p className="font-bold text-gray-900 dark:text-white">{includedRemaining} preostalo</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-steel">Cijena jednog oglasa</p>
              <p className="font-bold text-gray-900 dark:text-white">{PAID_AD_PRICE} KM</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Novi promovisani oglas</h3>
        <p className="text-sm text-steel mb-4">
          Odaberite posao koji želite istaknuti. Ako imate uključene oglase u paketu, koristit će se prvo oni. Inače plaćate {PAID_AD_PRICE} KM po oglasu.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-grow rounded-xl border border-gray-200 dark:border-ink-700 px-4 py-3 text-sm bg-white dark:bg-ink-900 text-gray-900 dark:text-white"
          >
            <option value="">Odaberite posao...</option>
            {eligibleJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} · {job.city}
              </option>
            ))}
          </select>
          <button
            onClick={requestPromotion}
            disabled={requesting || !selectedJobId}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
          >
            {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
            {canUseIncluded ? 'Iskoristi uključeni oglas' : `Zatraži oglas (${PAID_AD_PRICE} KM)`}
          </button>
        </div>
        {eligibleJobs.length === 0 && (
          <p className="text-sm text-steel mt-3">
            Nemate dostupnih poslova za promociju. Možete promovirati direktne zahtjeve ili poslove na koje ste poslali prihvaćenu ponudu.
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-ink-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vaši oglasi</h3>
        </div>
        {promotions.length === 0 ? (
          <p className="p-6 text-sm text-steel text-center">Još nemate promovisanih oglasa.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-ink-800">
            {promotions.map((p) => (
              <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{p.jobs?.title || 'Nepoznati posao'}</p>
                  <p className="text-sm text-steel">{p.jobs?.city || ''}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {p.status === 'pending' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">NA ČEKANJU</span>
                    )}
                    {p.status === 'active' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">AKTIVAN</span>
                    )}
                    {p.status === 'expired' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">ISTEKAO</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.source === 'included' ? 'bg-blue-100 text-blue-700' : 'bg-brand-orange/10 text-brand-orange'}`}>
                      {p.source === 'included' ? 'Uključen u paket' : `Plaćeno ${p.amount} KM`}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-steel flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {p.status === 'pending'
                    ? 'Čeka odobrenje admina'
                    : p.ends_at
                    ? `Vrijedi do ${new Date(p.ends_at).toLocaleDateString('bs-BA')}`
                    : 'Aktivan'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
