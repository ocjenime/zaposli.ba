'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/ui/DashboardHeader';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
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
  Calendar, Building2, Banknote, Receipt,
} from 'lucide-react';

type BillingInterval = 'monthly' | 'yearly';

function FirmSubscriptionContent() {
  const { user, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firmId, setFirmId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestedPlanId, setRequestedPlanId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const [instructionsPlanId, setInstructionsPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isFirmRole(role)) {
      router.push('/prijava/');
      return;
    }
    loadData();
  }, [authLoading, user, role, router]);

  useEffect(() => {
    const status = searchParams.get('payment');
    if (status === 'success') {
      setSuccess('Hvala na uplati. Vaša pretplata će biti aktivirana nakon potvrde plaćanja.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (status === 'cancel') {
      setError('Plaćanje je otkazano. Možete pokušati ponovo.');
    }
  }, [searchParams]);

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
      // Put free plan first, then sort by sort_order/price
      const sorted = [...plansData].sort((a, b) => {
        if ((a.sort_order ?? 999) !== (b.sort_order ?? 999)) {
          return (a.sort_order ?? 999) - (b.sort_order ?? 999);
        }
        return a.price_monthly - b.price_monthly;
      });
      setPlans(sorted);
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

    const plan = plans.find((p) => p.id === planId);
    const { error: err } = await supabase.from('admin_requests').insert({
      type: 'subscription_request',
      firm_id: firmId,
      metadata: {
        requested_plan_id: planId,
        requested_interval: interval,
        requested_price: interval === 'yearly' ? plan?.price_yearly : plan?.price_monthly,
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

  if (authLoading || (!user && !isFirmRole(role))) {
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
          <DashboardHeader
            label="Pretplata"
            title="Paketi i plaćanje"
            email={user?.email || ''}
            planName={subscription?.plans?.name || 'Besplatno'}
            planFeatured={Boolean(subscription?.plans?.featured)}
            actions={
              <Link
                href="/dashboard/firma/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-ink-700 text-steel dark:text-steel hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-ink-800 hover:border-gray-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Nazad na dashboard
              </Link>
            }
          />

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
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-1 inline-flex">
                  <button
                    onClick={() => setInterval('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      interval === 'monthly'
                        ? 'bg-brand-orange text-[#ffffff]'
                        : 'text-steel hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-1.5" />
                    Mjesečno
                  </button>
                  <button
                    onClick={() => setInterval('yearly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      interval === 'yearly'
                        ? 'bg-brand-orange text-[#ffffff]'
                        : 'text-steel hover:text-gray-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4 inline mr-1.5" />
                    Godišnje
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const price = interval === 'yearly' ? plan.price_yearly : plan.price_monthly;
                  return (
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
                          {formatPrice(price)}
                          <span className="text-sm font-normal text-steel">
                            {' '}
                            KM/{interval === 'yearly' ? 'god' : 'mj'}
                          </span>
                        </p>
                        {interval === 'yearly' && plan.price_monthly > 0 && (
                          <p className="text-xs text-green-700 font-medium">
                            Uštedite 10% · umjesto {formatPrice(plan.price_monthly * 12)} KM
                          </p>
                        )}
                        {interval === 'monthly' && plan.price_yearly > 0 && (
                          <p className="text-xs text-green-700 font-medium">
                            Godišnje {formatPrice(plan.price_yearly)} KM (ušteda 10%)
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
                      ) : plan.slug === 'besplatno' ? (
                        <span className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 text-center block">
                          Aktivno po registraciji
                        </span>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={() => requestUpgrade(plan.id)}
                            disabled={requesting && requestedPlanId === plan.id}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-brand-orange text-[#ffffff] hover:bg-brand-orange-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                          >
                            <Receipt className="w-4 h-4" />
                            {requesting && requestedPlanId === plan.id ? 'Slanje...' : 'Platni nalog / uplatnica'}
                          </button>
                          <button
                            onClick={() => setInstructionsPlanId(instructionsPlanId === plan.id ? null : plan.id)}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <Banknote className="w-4 h-4" />
                            {instructionsPlanId === plan.id ? 'Sakrij uplate' : 'Keš / kartica na licu mjesta'}
                          </button>
                          {instructionsPlanId === plan.id && (
                            <div className="mt-3 p-3 bg-cloud rounded-xl text-xs text-steel border border-gray-100">
                              <p className="font-medium text-gray-900 mb-1">Uplate u BiH:</p>
                              <ul className="space-y-1 list-disc list-inside">
                                <li>Platni nalog / uplatnica na žiro račun</li>
                                <li>Keš prilikom susreta</li>
                                <li>Kartica na licu mjesta (POS terminal)</li>
                              </ul>
                              <p className="mt-2">Nakon slanja zahtjeva, admin tim će vas kontaktirati s uplatnim podacima.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-8 bg-white rounded-xl border border-gray-100 p-5 text-sm text-steel">
            <p className="mb-2">
              <strong>Plaćanje u Bosni i Hercegovini:</strong>
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Platni nalog / uplatnica na žiro račun (preporučeno)</li>
              <li>Keš ili kartica prilikom susreta (POS terminal)</li>
            </ul>
            <p className="mt-3">
              Nakon slanja zahtjeva, admin tim će vas kontaktirati s uplatnim podacima i aktivirati
              pretplatu nakon potvrde uplate.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function FirmSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-cloud">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </main>
          <Footer />
        </div>
      }
    >
      <FirmSubscriptionContent />
    </Suspense>
  );
}
