'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, Loader2, MapPin, Tag, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isFirmRole, type UserRole } from '@/lib/roles';
import { slugify } from '@/lib/slugify';
import { site } from '@/lib/site';
import { categories, cities } from '@/lib/data';

function formatError(err: unknown): string {
  if (typeof err === 'string') {
    const trimmed = err.trim();
    if (trimmed && trimmed !== '{}' && trimmed !== '[object Object]') return trimmed;
    return 'Došlo je do greške prilikom registracije. Pokušajte ponovo.';
  }
  if (err instanceof Error) {
    const msg = err.message?.trim();
    if (msg && msg !== '{}' && msg !== '[object Object]') return msg;
    return 'Došlo je do greške prilikom registracije. Pokušajte ponovo.';
  }
  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    const candidates: (string | undefined)[] = [
      typeof obj.message === 'string' ? obj.message : undefined,
      typeof obj.error === 'string' ? obj.error : undefined,
      typeof obj.error_description === 'string' ? obj.error_description : undefined,
      typeof obj.msg === 'string' ? obj.msg : undefined,
      typeof obj.error_msg === 'string' ? obj.error_msg : undefined,
    ];
    for (const candidate of candidates) {
      const trimmed = candidate?.trim();
      if (trimmed && trimmed !== '{}' && trimmed !== '[object Object]') return trimmed;
    }
    if (typeof obj.code === 'string' && obj.code.trim()) return `Greška: ${obj.code.trim()}`;
    try {
      const str = JSON.stringify(err);
      if (str && str !== '{}' && str !== '[]') return str;
    } catch {}
    return 'Došlo je do greške prilikom registracije. Pokušajte ponovo.';
  }
  return 'Došlo je do greške prilikom registracije. Pokušajte ponovo.';
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserRole>('client');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [city, setCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
    if (isFirmRole(userType)) {
      if (!city.trim()) return 'Odaberite grad u kojem radite.';
      if (selectedCategories.length === 0) return 'Odaberite bar jednu kategoriju u kojoj radite.';
    }
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

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: userType,
            city: isFirmRole(userType) ? city.trim() : '',
            categories: isFirmRole(userType) ? selectedCategories.join(',') : '',
          },
          emailRedirectTo: `${site.url}/auth/callback`,
        },
      });

      if (authError) {
        console.error('Registration auth error:', authError);
        setError(formatError(authError));
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Registracija nije uspjela. Pokušajte ponovo.');
        setLoading(false);
        return;
      }

    // Email confirmation enabled: no session yet, profile/firm will be created after callback
    if (!authData.session) {
      setEmailConfirmation(true);
      setLoading(false);
      return;
    }

    // Direct signup (no email confirmation): create profile and firm immediately.
    // The auth trigger now only creates the profile, so the app must create the firm.
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
      let slug = slugify(formData.name);
      const { data: existing } = await supabase.from('firms').select('slug').eq('slug', slug).maybeSingle();
      if (existing) {
        slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
      }
      const { data: newFirm, error: firmError } = await supabase.from('firms').insert({
        owner_id: authData.user.id,
        name: formData.name,
        slug,
        email: formData.email,
        phone: formData.phone,
        city: city.trim(),
      }).select('id').single();

      if (firmError) {
        console.error('Firm creation error:', firmError);
        setError('Nalog je kreiran, ali nismo uspjeli kreirati profil firme. Pokušajte se prijaviti.');
        setLoading(false);
        return;
      }

      if (newFirm && selectedCategories.length > 0) {
        const categoryRows = selectedCategories.map((catSlug) => ({
          firm_id: newFirm.id,
          category_slug: catSlug,
        }));
        const { error: catError } = await supabase.from('firm_categories').insert(categoryRows);
        if (catError) {
          console.error('Category creation error:', catError);
        }
      }
    }

    router.push(isFirmRole(userType) ? '/dashboard/firma/' : '/dashboard/');
    } catch (err) {
      console.error('Unexpected registration error:', err);
      setError(formatError(err));
      setLoading(false);
    }
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

              {isFirmRole(userType) && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grad <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field pl-10 appearance-none"
                        required
                      >
                        <option value="">Izaberite grad</option>
                        {cities.map((c) => (
                          <option key={c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategorije <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Odaberite bar jednu kategoriju u kojoj radite.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((category) => {
                        const selected = selectedCategories.includes(category.slug);
                        return (
                          <button
                            key={category.slug}
                            type="button"
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.includes(category.slug)
                                  ? prev.filter((s) => s !== category.slug)
                                  : [...prev, category.slug]
                              )
                            }
                            className={`flex items-center gap-3 text-left rounded-lg border p-3 transition-colors ${
                              selected
                                ? 'bg-orange-50 border-brand-orange'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                selected
                                  ? 'bg-brand-orange border-brand-orange'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {selected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-600'}`}>
                              {category.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedCategories.length === 0 && (
                      <p className="text-xs text-steel mt-2">Odaberite bar jednu kategoriju.</p>
                    )}
                  </div>
                </div>
              )}

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
                  <Link href="/uslovi-koristenja/" className="text-primary-600 hover:text-primary-700">Uslove korištenja</Link>{' '}
                  i{' '}
                  <Link href="/privacy/" className="text-primary-600 hover:text-primary-700">Politiku privatnosti</Link>
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
