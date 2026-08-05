'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  Loader2, AlertCircle, Check, Lock, Eye, EyeOff,
} from 'lucide-react';

function parseHashParams(hash: string): Record<string, string> {
  const params: Record<string, string> = {};
  const clean = hash.replace(/^#/, '');
  if (!clean) return params;
  const url = new URL(`http://localhost/?${clean}`);
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export default function NewPasswordForm() {
  const router = useRouter();
  const clientRef = useRef<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { detectSessionInUrl: false, persistSession: true, autoRefreshToken: true } }
      );
      clientRef.current = client;

      const hashParams = parseHashParams(window.location.hash);
      const url = new URL(window.location.href);
      const type = hashParams.type || url.searchParams.get('type') || undefined;
      const token = hashParams.access_token || hashParams.token || url.searchParams.get('token') || undefined;
      const tokenHash = hashParams.token_hash || url.searchParams.get('token_hash') || undefined;

      if (cancelled) return;

      if (type !== 'recovery' || (!token && !tokenHash)) {
        setError('Link za reset lozinke je istekao ili nije važeći. Zatražite novi link.');
        setLoading(false);
        return;
      }

      try {
        const { error: verifyError } = await client.auth.verifyOtp({
          type: 'recovery',
          token: (token || tokenHash) as string,
          token_hash: tokenHash || token || '',
        });
        if (cancelled) return;

        if (verifyError) {
          setError(verifyError.message);
          setLoading(false);
          return;
        }

        const { data: sessionData } = await client.auth.getSession();
        if (cancelled) return;

        if (!sessionData.session) {
          setError('Link za reset lozinke je istekao ili nije važeći. Zatražite novi link.');
          setLoading(false);
          return;
        }

        setSessionReady(true);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Link za reset lozinke je istekao ili nije važeći.');
        setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    setSaving(true);
    const client = clientRef.current;
    if (!client) {
      setError('Sesija nije učitana. Osvježite stranicu.');
      setSaving(false);
      return;
    }
    const { error: updateError } = await client.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/prijava/');
    }, 2500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud dark:bg-gray-950">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-brand-orange" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Postavi novu lozinku</h1>
            <p className="text-sm text-steel dark:text-gray-400 mt-1">
              Unesite novu lozinku za vaš nalog.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-steel dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="text-sm">Provjera linka...</p>
            </div>
          ) : success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lozinka je promijenjena</h2>
              <p className="text-sm text-steel dark:text-gray-400 mb-6">
                Možete se sada prijaviti sa novom lozinkom.
              </p>
              <Link
                href="/prijava/"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-semibold"
              >
                Prijavi se
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {sessionReady && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Nova lozinka</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Ponovi novu lozinku</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Spremanje...
                      </span>
                    ) : (
                      'Spremi novu lozinku'
                    )}
                  </button>
                </>
              )}

              {!sessionReady && !loading && !error && (
                <p className="text-sm text-steel dark:text-gray-400 text-center">
                  Link za reset nije važeći.{' '}
                  <Link href="/prijava/" className="text-brand-orange hover:underline">
                    Nazad na prijavu
                  </Link>
                </p>
              )}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
