'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  X, Loader2, Crown, AlertCircle, Check, KeyRound, Mail, Phone, User,
} from 'lucide-react';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'client' | 'firm';
  is_admin: boolean;
  created_at: string;
}

interface ProfileEditModalProps {
  profile: AdminProfile | null;
  onClose: () => void;
  onSaved: () => void;
  onResetPassword: (email: string) => Promise<void>;
}

export default function ProfileEditModal({
  profile,
  onClose,
  onSaved,
  onResetPassword,
}: ProfileEditModalProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [role, setRole] = useState(profile?.role || 'client');
  const [isAdmin, setIsAdmin] = useState(profile?.is_admin || false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!profile) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        role,
        is_admin: isAdmin,
      })
      .eq('id', profile!.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess('Profil je uspješno ažuriran.');
    onSaved();
  }

  async function handleResetPassword() {
    setResetting(true);
    setError('');
    setSuccess('');
    try {
      await onResetPassword(profile!.email);
      setSuccess('Email za reset lozinke je poslat korisniku.');
    } catch (err: any) {
      setError(err?.message || 'Greška prilikom slanja emaila za reset lozinke.');
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uredi korisnika</h2>
              <p className="text-sm text-steel dark:text-gray-400">{profile.email}</p>
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

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Ime i prezime</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="Ime i prezime"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-steel dark:text-gray-500 mt-1">
                Email za prijavu ne može se mijenjati iz admin panela. Koristite reset lozinke ispod.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="+387 61 123 456"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Uloga</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'client' | 'firm')}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                >
                  <option value="client">Klijent</option>
                  <option value="firm">Firma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Admin</label>
                <button
                  type="button"
                  onClick={() => setIsAdmin((v) => !v)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    isAdmin
                      ? 'bg-brand-orange text-[#ffffff] border-brand-orange'
                      : 'bg-cloud dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  {isAdmin ? 'Administrator' : 'Obični korisnik'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-steel dark:text-gray-300 hover:bg-cloud dark:hover:bg-gray-800 transition-colors"
              >
                Zatvori
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50"
              >
                {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Spremanje...</span> : 'Spremi promjene'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sigurnost</h3>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {resetting ? 'Slanje...' : 'Pošalji email za reset lozinke'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
