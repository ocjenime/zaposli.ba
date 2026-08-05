'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, ArrowLeft, AlertCircle, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { site } from '@/lib/site';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Unesite ispravnu email adresu.');
      return;
    }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${site.url}/nova-lozinka/`,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Zaboravili ste lozinku?</h1>
              <p className="text-gray-600 mt-2">
                Unesite email adresu i poslat ćemo vam link za resetovanje lozinke.
              </p>
            </div>

            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Link je poslan</h2>
                <p className="text-sm text-steel mb-6">
                  Ako nalog postoji, ubrzo ćete primiti email sa uputama za resetovanje lozinke.
                </p>
                <Link
                  href="/prijava/"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold"
                >
                  Nazad na prijavu
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email adresa</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas@email.com"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Slanje...' : 'Pošalji link za reset'}
                </button>

                <Link
                  href="/prijava/"
                  className="inline-flex items-center justify-center gap-2 w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Nazad na prijavu
                </Link>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
