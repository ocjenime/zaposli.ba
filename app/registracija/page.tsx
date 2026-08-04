'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

function formatError(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object') {
    const message = (err as { message?: string }).message;
    if (message) return message;
    const error = (err as { error?: string }).error;
    if (error) return error;
    const errorDescription = (err as { error_description?: string }).error_description;
    if (errorDescription) return errorDescription;
    try {
      return JSON.stringify(err);
    } catch {
      return 'Došlo je do nepoznate greške.';
    }
  }
  return 'Došlo je do nepoznate greške.';
}
import { supabase } from '@/lib/supabase';
import { isFirmRole, type UserRole } from '@/lib/roles';
import { slugify } from '@/lib/slugify';
import { site } from '@/lib/site';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserRole>('client');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!formData.name.trim()) return 'Unesite ime i prezime ili naziv firme.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Unesite ispravnu email adresu.';
    }
    if (!formData.phone.trim()) return 'Unesite broj telefona.';
    if (formData.password.length < 6) return 'Lozinka mora imati najmanje 6 znakova.';
    if (formData.password !== formData.confirmPassword) return 'Lozinke se ne podudaraju.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          phone: formData.phone,
          role: userType,
        },
        emailRedirectTo: `${site.url}/auth/callback`,
      },
    });

    if (authError) {
      setError(formatError(authError));
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError('Registracija nije uspjela');
      setLoading(false);
      return;
    }

    // Email confirmation enabled: no session yet, profile/firm will be created after callback
    if (!authData.session) {
      setEmailConfirmation(true);
      setLoading(false);
      return;
    }

    // Direct signup (no email confirmation): create profile and firm immediately
    // Using upsert with ignoreDuplicates to avoid conflicts with the database trigger
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      email: formData.email,
      full_name: formData.name,
      phone: formData.phone,
      role: userType,
    }, { ignoreDuplicates: true });

    if (profileError) {
      setError(formatError(profileError));
      setLoading(false);
      return;
    }

    if (isFirmRole(userType)) {
      const { error: firmError } = await supabase.from('firms').upsert({
        owner_id: authData.user.id,
        name: formData.name,
        slug: slugify(formData.name),
        email: formData.email,
        phone: formData.phone,
      }, { ignoreDuplicates: true });
      if (firmError) {
        console.error('Firm creation error:', firmError);
      }
    }

    router.push(isFirmRole(userType) ? '/dashboard/firma/' : '/dashboard/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Kreirajte nalog</h1>
              <p className="text-gray-600 mt-2">Registrujte se besplatno</p>
            </div>

            {emailConfirmation ? (
              <div className="mb-6 bg-green-50 text-green-700 rounded-xl px-4 py-4 text-sm">
                <p className="font-semibold mb-1">Registracija uspješna!</p>
                <p>Poslali smo vam email za potvrdu. Kliknite na link u emailu da biste aktivirali nalog.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {([
                    { value: 'client', label: 'Klijent' },
                    { value: 'firm', label: 'Firma' },
                    { value: 'majstor', label: 'Majstor' },
                  ] as const).map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setUserType(type.value)}
                      className={`py-3 px-2 rounded-lg font-medium text-sm transition-colors ${
                        userType === type.value
                          ? 'bg-primary-600 text-[#ffffff]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === 'firm' ? 'Naziv firme' : 'Ime i prezime'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={userType === 'firm' ? 'Naziv firme' : 'Vaše ime'}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email adresa</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vas@email.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+387 61 123 456"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lozinka</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potvrdi lozinku</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? 'Sakrij potvrdu lozinke' : 'Prikaži potvrdu lozinke'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-start">
                <input type="checkbox" id="terms" className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500" required />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Prihvaćam{' '}
                  <Link href="/pravila/" className="text-primary-600 hover:text-primary-700">Pravila</Link>{' '}
                  i{' '}
                  <Link href="/privacy/" className="text-primary-600 hover:text-primary-700">Privacy policy</Link>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Registracija...' : 'Registrujte se'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Već imate nalog?{' '}
              <Link href="/prijava/" className="text-primary-600 font-medium hover:text-primary-700">Prijavite se</Link>
            </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
