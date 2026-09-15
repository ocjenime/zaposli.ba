'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Loader2 } from 'lucide-react';
import { categories } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { getFallbackEstimate } from '@/lib/estimate-data';

const categoryOptions = categories
  .filter((c) => !c.noSeo)
  .sort((a, b) => a.name.localeCompare(b.name, 'bs'));

interface EstimateResult {
  min: number;
  max: number;
  real: boolean;
  count?: number;
}

export default function QuickEstimateWidget() {
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState('');

  const selected = useMemo(
    () => categoryOptions.find((c) => c.slug === slug),
    [slug]
  );

  async function handleEstimate() {
    if (!slug) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_category_price_stats', {
        p_category_slug: slug,
      });
      if (rpcError) throw rpcError;
      const rows = (data as { min_amount: number; avg_amount: number; max_amount: number; bid_count: number }[] | null) || [];
      const row = rows[0];
      if (row && row.bid_count > 0 && row.avg_amount > 0) {
        // Build a ±30% range around the average for a friendly estimate
        const avg = Number(row.avg_amount);
        setResult({
          min: Math.max(50, Math.round(avg * 0.7)),
          max: Math.round(avg * 1.3),
          real: true,
          count: Number(row.bid_count),
        });
      } else {
        setResult({ ...getFallbackEstimate(slug), real: false });
      }
    } catch (err) {
      console.error(err);
      setError('Trenutno nije moguće dohvatiti procjenu. Pokušajte ponovo.');
      setResult({ ...getFallbackEstimate(slug), real: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative py-10 md:py-14 bg-cloud overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-black/5 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Brza procjena cijene</h2>
              <p className="text-sm text-steel">Saznajte okvirnu cijenu prije nego što zatražite ponude.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <select
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setResult(null);
                setError('');
              }}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
            >
              <option value="">Odaberite kategoriju posla</option>
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleEstimate}
              disabled={!slug || loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              Procijeni
            </button>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          {result && (
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 md:p-6 mb-6 animate-fade-in">
              <p className="text-sm text-steel mb-1">
                Procijenjeni raspon za <span className="font-semibold text-gray-900">{selected?.name}</span>:
              </p>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                {result.min.toLocaleString('bs-BA')} – {result.max.toLocaleString('bs-BA')} KM
              </p>
              <p className="text-xs text-steel">
                {result.real
                  ? `Bazirano na ${result.count} završenih poslova u ovoj kategoriji.`
                  : 'Okvirna procjena na osnovu tipičnih cijena u BiH. Točna cijena ovisi o opsegu rada.'}
              </p>
            </div>
          )}

          <Link
            href="/objavi-projekat/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all active:scale-95"
          >
            Objavi posao i dobijte tačnu ponudu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
