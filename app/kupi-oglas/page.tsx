'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FirmAdsTab from '@/components/FirmAdsTab';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { Subscription, getPlanAndUsage } from '@/lib/subscriptions';
import { Loader2 } from 'lucide-react';

export default function BuyAdPage() {
  const { user, loading: authLoading, role } = useAuth();
  const router = useRouter();

  const [firmId, setFirmId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/prijava/?redirectTo=/kupi-oglas/');
      return;
    }
    if (!isFirmRole(role)) {
      router.push('/dashboard/');
      return;
    }
  }, [user, role, authLoading, router]);

  const loadFirmAndPlan = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const { data: firmData, error: firmErr } = await supabase
        .from('firms')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (firmErr) throw firmErr;
      if (!firmData?.id) {
        setError('Nije pronađena firma za ovog korisnika.');
        setLoading(false);
        return;
      }
      const id = firmData.id as string;
      setFirmId(id);
      const usage = await getPlanAndUsage(id);
      setSubscription(usage.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom učitavanja.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && isFirmRole(role)) {
      loadFirmAndPlan();
    }
  }, [user, role, loadFirmAndPlan]);

  if (authLoading || loading || !firmId) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-2 text-steel">
            <Loader2 className="w-5 h-5 animate-spin" /> Učitavanje...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Kreirajte premium oglas
            </h1>
            <p className="text-steel">
              Odaberite poziciju, unesite sadržaj i pošaljite oglas na odobrenje.
            </p>
          </div>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
          ) : (
            <FirmAdsTab firmId={firmId} subscription={subscription} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
