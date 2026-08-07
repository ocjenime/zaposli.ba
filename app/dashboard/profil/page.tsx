'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { isFirmRole } from '@/lib/roles';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Loader2,
  AlertCircle,
  Check,
  KeyRound,
  Trash2,
} from 'lucide-react';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  is_admin: boolean;
  created_at: string;
}

export default function ClientProfilePage() {
  const { user, loading: authLoading, role } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role, is_admin, created_at')
      .eq('id', user.id)
      .single();

    if (err || !data) {
      setError('Nismo mogli učitati profil. Pokušajte ponovo.');
      setLoading(false);
      return;
    }

    const typed = data as unknown as ProfileRow;
    setProfile(typed);
    setFullName(typed.full_name || '');
    setPhone(typed.phone || '');
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/prijava/');
      return;
    }
    if (isFirmRole(role)) {
      router.push('/dashboard/firma/profil/');
      return;
    }
    loadProfile();
  }, [authLoading, user, role, router, loadProfile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
      })
      .eq('id', user.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess('Podaci su uspješno ažurirani.');
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Nova lozinka mora imati najmanje 6 znakova.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Lozinke se ne poklapaju.');
      return;
    }

    setChangingPassword(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);

    if (err) {
      setPasswordError(err.message);
      return;
    }

    setPasswordSuccess('Lozinka je uspješno promijenjena.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function handleDeleteAccount() {
    if (!user) return;
    if (!window.confirm('Da li ste sigurni? Ova radnja nepovratno briše vaš nalog i sve povezane podatke.')) {
      return;
    }

    // Full user deletion requires a service-role Edge Function (we do not run it from the browser
    // because the anon client cannot call auth.admin.deleteUser). For now, we sign the user out
    // and ask them to contact support so we can delete auth + data server-side.
    await supabase.auth.signOut();
    router.push('/kontakt/');
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24">
          <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard/"
            className="inline-flex items-center text-sm text-steel hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Nazad na dashboard
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Moj profil</h1>
          <p className="text-steel mb-6">Upravljajte svojim podacima i sigurnošću.</p>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-6">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-orange" /> Lični podaci
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Ime i prezime</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="npr. Amila Softić"
                    className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Email adresa</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-steel mt-1">Email za prijavu ne može se mijenjati ovde.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+387 61 123 456"
                    className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-steel">
                  <Shield className="w-4 h-4" />
                  <span>Uloga: <span className="font-medium text-gray-900">Klijent</span></span>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? 'Spremanje...' : 'Spremi promjene'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-orange" /> Promjena lozinke
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-5">
              {passwordError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
                  <Check className="w-4 h-4" />
                  {passwordSuccess}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Nova lozinka</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cloud border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Potvrdi novu lozinku</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cloud border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-gray-900 text-[#ffffff] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {changingPassword ? 'Promjena...' : 'Promijeni lozinku'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Obriši nalog
            </h2>
            <p className="text-sm text-steel mb-4">
              Za brisanje naloga i svih povezanih podataka, kontaktirajte našu podršku. Sigurnosno, nalog ne možemo obrisati direktno iz preglednika.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 text-sm font-semibold hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Kontaktiraj podršku za brisanje
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
