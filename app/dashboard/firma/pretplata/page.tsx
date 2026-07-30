'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  getPlans,
  getCurrentSubscription,
  Plan,
  Subscription,
  formatPrice,
} from '@/lib/subscriptions';
import {
  ArrowLeft, Check, Crown, Loader2, AlertCircle,
  Star, HeadphonesIcon, Briefcase,
} from 'lucide-react';

export default function FirmSubscriptionPage() {
  const { user, loading: authLoading, role } = useAuth();
  const router = useRouter();

  const [firmId, setFirmId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestedPlanId, setRequestedPlanId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || role !== 'firm') {
      router.push('/prijava/');
      return;
    }
    loadData();
  }, [authLoading, user, role, router]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError('');

    const { data: firm } = await supabase
      .from('firms')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!firm) {
      setError('Nije pronađena firma povezana sa vašim nalogom.');
      setLoading(false);
      return;
    }

    setFirmId(firm.id);

    try {
      const [plansData, subData] = await Promise.all([
        getPlans(),
        getCurrentSubscription(firm.id),
      ]);
      setPlans(plansData);
      setSubscription(subData);
    } catch (err) {
      setError('Greška prilikom učitavanja podataka o pretplati.');
    } finally {
      setLoading(false);
    }
  }

  async function requestUpgrade(planId: string) {
    if (!firmId) return;
    setRequesting(true);
    setRequestedPlanId(planId);
    setError('');
    setSuccess('');

    const { error: err } = await supabase.from('admin_requests').insert({
      type: 'subscription_request',
      firm_id: firmId,
      metadata: {
        requested_plan_id: planId,
        requested_at: new Date().toISOString(),
      },
    });

    setRequesting(false);
    setRequestedPlanId(null);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess('Zahtjev za nadogradnju je poslan. Admin tim će vas kontaktirati.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isCurrent = (planId: string) => subscription?.plan_id === planId;

  if (authLoading || (!user && role !== 'firm')) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/dashboard/firma/"
            className="inline-flex items-center gap-2 text-sm text-steel hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad na dashboard firme
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pretplata</h1>
            <p className="text-steel text-sm">
              Trenutni paket:{' '}
              <span className="font-medium text-gray-900">
                {subscription?.plans?.name || 'Besplatno'}
              </span>
            </p>
          </div>

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-6">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje paketa...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl border p-5 flex flex-col transition-all hover:shadow-md ${
                    isCurrent(plan.id)
                      ? 'border-brand-orange shadow-md'
                      : 'border-gray-100'
                  }`}
                >
                  {isCurrent(plan.id) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Aktivno
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-steel mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {formatPrice(plan.price_monthly)}
                      <span className="text-sm font-normal text-steel"> KM/mj</span>
                    </p>
                    {plan.price_yearly > 0 && (
                      <p className="text-xs text-steel">
                        ili {formatPrice(plan.price_yearly)} KM/godišnje
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6 text-sm text-gray-900 flex-1">
                    <li className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                      <span>
                        {plan.bids_per_month === 9999
                          ? 'Neograničene ponude mjesečno'
                          : `${plan.bids_per_month} ponuda mjesečno`}
                      </span>
                    </li>
                    {plan.verified_badge && (
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Verifikacija profila</span>
                      </li>
                    )}
                    {plan.featured && (
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                        <span>Istaknut profil</span>
                      </li>
                    )}
                    {plan.priority_support && (
                      <li className="flex items-start gap-2">
                        <HeadphonesIcon className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                        <span>Prioritetna podrška</span>
                      </li>
                    )}
                  </ul>

                  {isCurrent(plan.id) ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-orange-50 text-brand-orange cursor-default"
                    >
                      Aktivni paket
                    </button>
                  ) : (
                    <button
                      onClick={() => requestUpgrade(plan.id)}
                      disabled={requesting && requestedPlanId === plan.id}
                      className="w-full btn-primary text-sm py-2.5 disabled:opacity-50"
                    >
                      {requesting && requestedPlanId === plan.id ? 'Slanje...' : 'Odaberi paket'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-white rounded-xl border border-gray-100 p-5 text-sm text-steel">
            <p>
              Napomena: Naplata se vrši ručno putem admin tima. Kada odaberete paket, admin će
              provjeriti uplatu i aktivirati pretplatu u najkraćem roku.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
