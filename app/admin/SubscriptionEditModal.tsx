'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plan, Subscription, addMonths, formatDateTime } from '@/lib/subscriptions';
import {
  X, Loader2, AlertCircle, Check, Crown, Calendar, Clock, Gift, Pause, Play, Trash2,
} from 'lucide-react';

interface SubscriptionEditModalProps {
  firmId: string;
  firmName: string;
  subscription: Subscription | null;
  plans: Plan[];
  onClose: () => void;
  onSaved: () => void;
}

const PROMO_LIMIT = 1000;

const durations = [
  { label: '1 mjesec', months: 1 },
  { label: '3 mjeseca', months: 3 },
  { label: '6 mjeseci', months: 6 },
  { label: '12 mjeseci', months: 12 },
  { label: 'Custom', months: 0 },
];

export default function SubscriptionEditModal({
  firmId,
  firmName,
  subscription,
  plans,
  onClose,
  onSaved,
}: SubscriptionEditModalProps) {
  const [planId, setPlanId] = useState(subscription?.plan_id || '');
  const [durationMonths, setDurationMonths] = useState(1);
  const [customMonths, setCustomMonths] = useState(1);
  const [startsAt, setStartsAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [isPromo, setIsPromo] = useState(false);
  const [notes, setNotes] = useState('');
  const [extendMonths, setExtendMonths] = useState(1);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [promoCount, setPromoCount] = useState<number | null>(null);

  useEffect(() => {
    if (isPromo) {
      loadPromoCount();
    } else {
      setPromoCount(null);
    }
  }, [isPromo]);

  async function loadPromoCount() {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'promo_free_premium_count')
      .single();
    setPromoCount(error ? 0 : parseInt(data?.value || '0'));
  }

  const selectedPlan = plans.find((p) => p.id === planId);

  const computedEndDate = useMemo(() => {
    const months = durationMonths === 0 ? customMonths : durationMonths;
    return addMonths(new Date(startsAt + 'T00:00:00'), months).toISOString().slice(0, 10);
  }, [startsAt, durationMonths, customMonths]);

  useEffect(() => {
    if (subscription) {
      setPlanId(subscription.plan_id);
      setStartsAt(subscription.starts_at ? subscription.starts_at.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setIsPromo(subscription.is_promo || false);
      setNotes(subscription.notes || '');
    }
  }, [subscription]);

  async function assignSubscription() {
    if (!planId) {
      setError('Odaberite paket.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    if (isPromo) {
      const currentPromo = promoCount ?? (await loadPromoCountSafe());
      if (currentPromo >= PROMO_LIMIT) {
        setSaving(false);
        setError('Promo limit od 1000 firmi je dostignut.');
        return;
      }
    }

    // Expire any existing active/cancelled/paused subscriptions
    await supabase
      .from('subscriptions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('firm_id', firmId)
      .in('status', ['active', 'cancelled', 'paused']);

    const months = durationMonths === 0 ? customMonths : durationMonths;
    const starts = new Date(startsAt + 'T00:00:00');
    const ends = addMonths(starts, months);

    const { error: err } = await supabase.from('subscriptions').insert({
      firm_id: firmId,
      plan_id: planId,
      status: 'active',
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      is_promo: isPromo,
      notes: notes.trim() || null,
    });

    if (err) {
      setSaving(false);
      setError(err.message);
      return;
    }

    if (isPromo) {
      await incrementPromoCountSafe();
    }

    setSaving(false);
    setSuccess('Pretplata je uspješno dodijeljena.');
    onSaved();
  }

  async function loadPromoCountSafe(): Promise<number> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'promo_free_premium_count')
      .single();
    return error ? 0 : parseInt(data?.value || '0');
  }

  async function incrementPromoCountSafe() {
    const current = await loadPromoCountSafe();
    await supabase
      .from('admin_settings')
      .update({ value: (current + 1).toString(), updated_at: new Date().toISOString() })
      .eq('key', 'promo_free_premium_count');
  }

  async function extendSubscription() {
    if (!subscription) return;
    setSaving(true);
    setError('');
    setSuccess('');

    const currentEnd = subscription.ends_at ? new Date(subscription.ends_at) : new Date();
    const newEnd = addMonths(currentEnd, extendMonths);

    const { error: err } = await supabase
      .from('subscriptions')
      .update({
        ends_at: newEnd.toISOString(),
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }

    setSuccess(`Pretplata produžena za ${extendMonths} mjesec/a.`);
    onSaved();
  }

  async function updateStatus(status: 'active' | 'cancelled' | 'paused') {
    if (!subscription) return;
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: err } = await supabase
      .from('subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', subscription.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }

    const labels: Record<string, string> = {
      active: 'Pretplata aktivirana.',
      cancelled: 'Pretplata zaustavljena.',
      paused: 'Pretplata pauzirana.',
    };
    setSuccess(labels[status]);
    onSaved();
  }

  async function deleteSubscription() {
    if (!subscription) return;
    if (!confirm('Da li ste sigurni da želite obrisati ovu pretplatu?')) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const { error: err } = await supabase.from('subscriptions').delete().eq('id', subscription.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }

    setSuccess('Pretplata obrisana.');
    onSaved();
  }

  const isExpired = subscription?.ends_at && new Date(subscription.ends_at) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pretplata</h2>
              <p className="text-sm text-steel dark:text-gray-400">{firmName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5 text-steel" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-xl px-4 py-3 mb-4">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          {subscription && (
            <div className="mb-6 p-4 bg-cloud dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-brand-orange" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {subscription.plans?.name || 'Nepoznati paket'}
                </span>
                {subscription.is_promo && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">PROMO</span>
                )}
              </div>
              <div className="text-sm text-steel dark:text-gray-400 space-y-1">
                <p>Status: <span className={`font-medium ${isExpired ? 'text-red-600' : subscription.status === 'active' ? 'text-green-600' : 'text-steel'}`}>{subscription.status}{isExpired ? ' (istekla)' : ''}</span></p>
                <p>Početak: {formatDateTime(subscription.starts_at)}</p>
                <p>Istek: {subscription.ends_at ? formatDateTime(subscription.ends_at) : '-'}</p>
                {subscription.notes && <p>Napomena: {subscription.notes}</p>}
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Dodijeli ili promijeni paket</h3>
              <label className="block text-xs font-medium text-steel dark:text-gray-400 mb-1.5">Paket</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white mb-3"
              >
                <option value="">Odaberite paket</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>

              <label className="block text-xs font-medium text-steel dark:text-gray-400 mb-1.5">Trajanje</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {durations.map((d) => (
                  <button
                    key={d.months}
                    type="button"
                    onClick={() => setDurationMonths(d.months)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      durationMonths === d.months
                        ? 'bg-brand-orange text-[#ffffff] border-brand-orange'
                        : 'bg-cloud dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {durationMonths === 0 && (
                <div className="mb-3">
                  <label className="block text-xs font-medium text-steel dark:text-gray-400 mb-1.5">Broj mjeseci</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={customMonths}
                    onChange={(e) => setCustomMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-steel dark:text-gray-400 mb-1.5">Početak</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-steel dark:text-gray-400 mb-1.5">Istek</label>
                  <input
                    type="date"
                    value={computedEndDate}
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setIsPromo((v) => !v)}
                  className={`inline-flex items-center gap-1.5 self-start px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    isPromo
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-cloud dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  {isPromo ? 'Promo / besplatno' : 'Označi kao promo'}
                </button>
                {isPromo && promoCount !== null && (
                  <p className="text-xs text-steel dark:text-gray-400">
                    Preostalo promo mjesta:{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.max(0, PROMO_LIMIT - promoCount)} / {PROMO_LIMIT}
                    </span>
                  </p>
                )}
              </div>

              <label className="block text-xs font-medium text-steel dark:text-gray-400 mb-1.5">Napomena</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="npr. Prvih 1000 firmi - 6 mjeseci premium"
                className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel mb-3"
              />

              <button
                type="button"
                onClick={assignSubscription}
                disabled={saving || !planId}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Dodijeli paket'}
              </button>
            </div>

            {subscription && (
              <>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Produži pretplatu</h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={extendMonths}
                      onChange={(e) => setExtendMonths(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white"
                    />
                    <span className="self-center text-sm text-steel">mjeseci</span>
                    <button
                      type="button"
                      onClick={extendSubscription}
                      disabled={saving}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Produži'}
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Upravljanje statusom</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus('active')}
                      disabled={saving || subscription.status === 'active'}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" /> Aktiviraj
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus('paused')}
                      disabled={saving || subscription.status === 'paused'}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors disabled:opacity-50"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pauziraj
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus('cancelled')}
                      disabled={saving || subscription.status === 'cancelled'}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Zaustavi
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={deleteSubscription}
                    disabled={saving}
                    className="w-full mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-steel hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Obriši pretplatu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
