'use client';

import { Suspense, useEffect, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, MapPin, Calendar, DollarSign, ChevronRight, X, ImageIcon, ClipboardList, Clock, ShieldCheck, Users } from 'lucide-react';
import { categories as allCategories, cities as allCities, getCategory } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const categories = allCategories.filter((c) => !c.noSeo);
const cities = allCities.map((c) => c.name).sort((a, b) => a.localeCompare(b, 'bs'));

function findCategoryByService(service: string) {
  const s = service.toLowerCase();
  return (
    categories.find((c) => c.name.toLowerCase() === s) ||
    categories.find((c) => c.name.toLowerCase().includes(s)) ||
    categories.find((c) => c.services.some((svc) => svc.toLowerCase().includes(s) || s.includes(svc.toLowerCase()))) ||
    null
  );
}

function PostProjectContent() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [prefill, setPrefill] = useState<{ service: string | null; city: string | null }>({ service: null, city: null });
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    city: '',
    address: '',
    budgetMode: 'open',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notifiedCount, setNotifiedCount] = useState<number | null>(null);
  const [targetProvider, setTargetProvider] = useState<{ id: string; name: string; type: 'worker' | 'firm'; ownerId?: string } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Auto-save form progress to localStorage
  const STORAGE_KEY = 'zaposli-objavi-posao';

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          setFormData((prev) => ({ ...prev, ...parsed.formData }));
        }
        if (parsed.step && parsed.step >= 1 && parsed.step <= 3) {
          setStep(parsed.step);
        }
      }
    } catch {
      // ignore corrupt saved data
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            formData,
            step,
            savedAt: new Date().toISOString(),
          })
        );
      }
    } catch {
      // ignore storage errors
    }
  }, [formData, step]);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const cityParam = searchParams.get('city');
    const workerId = searchParams.get('worker_id');
    const firmId = searchParams.get('firm_id');

    if (serviceParam || cityParam) {
      setPrefill({ service: serviceParam, city: cityParam });
    }

    if (cityParam && cities.includes(cityParam)) {
      setFormData((prev) => ({ ...prev, city: cityParam }));
    }

    if (serviceParam) {
      const matched = findCategoryByService(serviceParam);
      if (matched) {
        setFormData((prev) => ({ ...prev, category: matched.name, title: serviceParam }));
      } else {
        setFormData((prev) => ({ ...prev, title: serviceParam }));
      }
    }

    if (workerId) {
      (async () => {
        const { data: firmData } = await supabase
          .from('firms')
          .select('id, name, owner_id')
          .eq('id', workerId)
          .single();
        if (firmData) {
          const typed = firmData as unknown as { id: string; name: string; owner_id: string };
          const { data: catData } = await supabase
            .from('firm_categories')
            .select('category_slug')
            .eq('firm_id', workerId)
            .limit(1);
          const catSlug = (catData as unknown as { category_slug: string }[])?.[0]?.category_slug;
          const cat = catSlug ? getCategory(catSlug) : null;
          setTargetProvider({ id: typed.id, name: typed.name, type: 'firm', ownerId: typed.owner_id });
          setFormData((prev) => ({
            ...prev,
            category: cat?.name || prev.category,
            title: prev.title || cat?.name || prev.title,
          }));
        }
      })();
    } else if (firmId) {
      (async () => {
        const { data: firmData } = await supabase
          .from('firms')
          .select('id, name, owner_id')
          .eq('id', firmId)
          .single();
        if (firmData) {
          const typed = firmData as unknown as { id: string; name: string; owner_id: string };
          const { data: catData } = await supabase
            .from('firm_categories')
            .select('category_slug')
            .eq('firm_id', firmId)
            .limit(1);
          const catSlug = (catData as unknown as { category_slug: string }[])?.[0]?.category_slug;
          const cat = catSlug ? getCategory(catSlug) : null;
          setTargetProvider({ id: typed.id, name: typed.name, type: 'firm', ownerId: typed.owner_id });
          setFormData((prev) => ({
            ...prev,
            category: cat?.name || prev.category,
            title: prev.title || cat?.name || prev.title,
          }));
        }
      })();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/');
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'budgetMin' || name === 'budgetMax') setError('');
  };

  const handleBudgetModeChange = (mode: 'open' | 'fixed') => {
    setFormData((prev) => ({
      ...prev,
      budgetMode: mode,
      budgetMin: mode === 'open' ? '' : prev.budgetMin,
      budgetMax: mode === 'open' ? '' : prev.budgetMax,
    }));
    setError('');
  };

  const validateBudget = () => {
    if (formData.budgetMode === 'fixed') {
      const min = formData.budgetMin ? parseFloat(formData.budgetMin) : null;
      const max = formData.budgetMax ? parseFloat(formData.budgetMax) : null;
      if (min === null && max === null) {
        setError('Unesite minimalni ili maksimalni budžet.');
        return false;
      }
      if (min !== null && max !== null && min > max) {
        setError('Maksimalni budžet ne može biti manji od minimalnog.');
        return false;
      }
    }
    return true;
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const name = file.name.replace(/\.[^.]+$/, '.jpg') || 'image.jpg';
          resolve(new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => reject(new Error('Greška prilikom učitavanja slike.'));
      img.src = url;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png'];
    const allAllowed = selected.every((file) => allowedTypes.includes(file.type));
    if (!allAllowed) {
      setError('Dozvoljeni su samo JPG, JPEG i PNG formati.');
      e.target.value = '';
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    const files = selected.slice(0, 5);

    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const compressed = await compressImage(file);
          if (compressed.size > MAX_SIZE) {
            throw new Error(`Slika „${file.name}” i dalje ima ${(compressed.size / 1024 / 1024).toFixed(1)} MB nakon kompresije. Maksimalno dozvoljeno je 2 MB.`);
          }
          return compressed;
        })
      );
      setImages(processed);
      setImagePreviews(processed.map((file) => URL.createObjectURL(file)));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo je do greške prilikom obrade slika.');
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) { router.push('/prijava/'); return; }

    const cat = categories.find((c) => c.name === formData.category);
    if (!cat) { setError('Odaberite kategoriju'); return; }
    if (!validateBudget()) return;

    setSubmitting(true);
    const budgetMin = formData.budgetMin ? parseFloat(formData.budgetMin) : null;
    const budgetMax = formData.budgetMax ? parseFloat(formData.budgetMax) : null;
    const deadline = formData.deadline || null;

    const { data: jobData, error: err } = await supabase
      .from('jobs')
      .insert({
        client_id: user.id,
        category_slug: cat.slug,
        title: formData.title,
        description: formData.description,
        city: formData.city,
        address: formData.address || null,
        status: 'open',
        budget_mode: formData.budgetMode,
        budget_min: budgetMin,
        budget_max: budgetMax,
        deadline: deadline,
      })
      .select('id')
      .single();

    if (err || !jobData) {
      setSubmitting(false);
      setError(err?.message || 'Došlo je do greške');
      return;
    }

    // Count firms that will be notified
    try {
      const { data: notifyRows } = await supabase
        .from('firm_categories')
        .select('firms(email)')
        .eq('category_slug', cat.slug)
        .eq('email_enabled', true);
      const rows = (notifyRows as unknown as Array<{ firms?: { email: string | null } }>) || [];
      setNotifiedCount(rows.filter((row) => row.firms?.email).length);
    } catch {
      setNotifiedCount(null);
    }

    // Upload images
    if (images.length > 0) {
      for (const file of images) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${jobData.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('job-images').upload(path, file);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('job-images').getPublicUrl(path);
          if (urlData?.publicUrl) {
            await supabase.from('job_images').insert({
              job_id: jobData.id,
              image_url: urlData.publicUrl,
            });
          }
        }
      }
    }

    // Obavijesti ciljanu firmu ako je posao zatražen s profila firme
    if (targetProvider?.type === 'firm' && targetProvider.ownerId) {
      try {
        await supabase.from('notifications').insert({
          user_id: targetProvider.ownerId,
          type: 'direct_quote_request',
          title: 'Novi zahtjev za ponudu',
          message: `Klijent traži ponudu za "${formData.title || 'posao'}" s vašeg profila.`,
          job_id: jobData.id,
        });
      } catch {}
    }

    setSubmitting(false);
    setSubmitted(true);
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (loading || !user) return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-28 pb-12 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 animate-pulse">
            <div className="w-48 h-7 bg-gray-200 rounded mb-2" />
            <div className="w-3/4 h-4 bg-gray-200 rounded mb-8" />
            <div className="space-y-6">
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-full h-32 bg-gray-200 rounded-xl" />
              </div>
              <div className="w-full h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-4">
          <div className="w-full max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-orange/25">
              <svg className="w-10 h-10 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Posao je objavljen!</h1>
            <p className="text-steel mb-8 leading-relaxed">
              Vaš posao <b className="text-gray-900">&ldquo;{formData.title || 'Adaptacija'}&rdquo;</b> je sada vidljiv provjerenim firmama.
              {notifiedCount != null && notifiedCount > 0 && (
                <>
                  {' '}Obavijestili smo <b className="text-gray-900">{notifiedCount} {notifiedCount === 1 ? 'firmu' : notifiedCount < 5 ? 'firme' : 'firmi'}</b> iz kategorije.
                </>
              )}
              {' '}Prve ponude obično stižu u roku od <b className="text-gray-900">24 sata</b>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/" className="btn-secondary">Idi na dashboard</Link>
              <button
                onClick={() => { setSubmitted(false); setNotifiedCount(null); setStep(1); setFormData({ title: '', category: '', description: '', city: '', address: '', budgetMode: 'open', budgetMin: '', budgetMax: '', deadline: '' }); setImages([]); setImagePreviews([]); try { if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY); } catch {} }}
                className="btn-primary"
              >
                Objavite još jedan posao
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pb-16">
        <section className="relative overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28">
          <NextImage
            src="/images/herozaposli.png"
            alt="Objavi posao"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.3),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide uppercase mb-6">
                Besplatno i neobavezujuće
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.05] tracking-tight mb-5">
                {targetProvider ? 'Zatraži ponudu' : 'Objavite posao besplatno'}
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
                {targetProvider ? `Pošaljite zahtjev firmi ${targetProvider.name}. U par koraka do ponude.` : 'U 3 koraka do ponuda provjerenih majstora i firmi iz vašeg grada.'}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-orange" /> Verificirane firme</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-orange" /> Prve ponude u 24h</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-brand-orange" /> 50+ kategorija</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cloud to-transparent z-10" />
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { n: 1, label: 'Osnovno' },
                { n: 2, label: 'Detalji' },
                { n: 3, label: 'Pregled' },
              ].map((s, idx) => (
                <div key={s.n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors ${step >= s.n ? 'bg-brand-orange border-brand-orange text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                      {step > s.n ? '✓' : s.n}
                    </div>
                    <span className={`mt-1.5 text-xs font-medium ${step >= s.n ? 'text-brand-orange' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full ${step > s.n ? 'bg-brand-orange' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {targetProvider ? 'Zatraži ponudu' : 'Objavite novi posao'}
            </h1>
            {targetProvider && (
              <div className="mb-6 p-3 bg-gradient-to-r from-brand-orange/10 to-brand-orange/5 border border-brand-orange/20 rounded-xl text-sm">
                <p className="text-steel">Zahtjev za ponudu od:</p>
                <p className="font-bold text-gray-900 text-lg">{targetProvider.name}</p>
              </div>
            )}
            {(prefill.service || prefill.city) && (
              <div className="mb-6 p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm">
                <p className="text-steel">Preuzeto iz pretrage:</p>
                <p className="font-medium text-gray-900">
                  {prefill.service && <span className="text-brand-orange">{prefill.service}</span>}
                  {prefill.service && prefill.city && <span className="text-steel mx-1">·</span>}
                  {prefill.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {prefill.city}</span>}
                </p>
              </div>
            )}

            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Naslov posla *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="npr. Adaptacija kupatila" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategorija *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="input-field" required>
                      <option value="">Odaberite kategoriju</option>
                      {categories.map((cat) => <option key={cat.slug} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opis posla *</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Opišite detaljno šta vam je potrebno..." rows={5} className="input-field" required />
                    <p className="mt-1 text-sm text-gray-500">Što detaljniji opis, to ćete preciznije ponude dobiti.</p>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full btn-primary flex items-center justify-center gap-2">Nastavi <ChevronRight className="w-5 h-5" /></button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" />Grad *</label>
                      <select name="city" value={formData.city} onChange={handleInputChange} className="input-field" required>
                        <option value="">Odaberite grad</option>
                        {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresa / Lokacija</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Ulica, broj..." className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Imate li okvirni budžet?</label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className={`relative flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${formData.budgetMode === 'open' ? 'border-brand-orange bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="budgetMode" value="open" checked={formData.budgetMode === 'open'} onChange={() => handleBudgetModeChange('open')} className="mt-1 h-4 w-4 text-brand-orange border-gray-300 focus:ring-brand-orange" />
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                            Želim da mi majstori predlože cijenu
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-orange text-white">Preporučeno</span>
                          </div>
                          <div className="text-gray-500 mt-0.5">Povećava šansu za više ponuda</div>
                        </div>
                      </label>
                      <label className={`relative flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${formData.budgetMode === 'fixed' ? 'border-brand-orange bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="budgetMode" value="fixed" checked={formData.budgetMode === 'fixed'} onChange={() => handleBudgetModeChange('fixed')} className="mt-1 h-4 w-4 text-brand-orange border-gray-300 focus:ring-brand-orange" />
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">Već imam okvirni budžet</div>
                          <div className="text-gray-500 mt-0.5">Unesite procijenjeni raspon</div>
                        </div>
                      </label>
                    </div>
                    {formData.budgetMode === 'fixed' && (
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Budžet (min)</label>
                          <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange} placeholder="Minimalni budžet (KM)" className="input-field" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Budžet (max)</label>
                          <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange} placeholder="Maksimalni budžet (KM)" className="input-field" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Rok izvršenja <span className="text-gray-400 font-normal">- opcionalno</span></label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-1" />Fotografije posla (opcionalno)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        id="job-images"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="job-images" className="cursor-pointer inline-flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">Kliknite za upload fotografija</span>
                        <span className="text-xs text-gray-400">Do 5 fotografija (JPG, JPEG, PNG), max 2 MB po slici</span>
                      </label>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview} alt={`Pregled fotografije ${index + 1} za posao`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              aria-label={`Ukloni fotografiju ${index + 1}`}
                              className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-red-600"
                            >
                              <X className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary">Nazad</button>
                    <button type="button" onClick={() => { if (validateBudget()) setStep(3); }} className="flex-1 btn-primary flex items-center justify-center gap-2">Nastavi <ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pregled posla</h3>
                    <dl className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                        <dt className="text-gray-500 text-sm sm:text-base">Naslov</dt>
                        <dd className="font-medium text-gray-900 text-sm sm:text-base text-left sm:text-right break-words">{formData.title || '-'}</dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                        <dt className="text-gray-500 text-sm sm:text-base">Kategorija</dt>
                        <dd className="font-medium text-gray-900 text-sm sm:text-base text-left sm:text-right">{formData.category || '-'}</dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                        <dt className="text-gray-500 text-sm sm:text-base">Grad</dt>
                        <dd className="font-medium text-gray-900 text-sm sm:text-base text-left sm:text-right">{formData.city || '-'}</dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                        <dt className="text-gray-500 text-sm sm:text-base">Budžet</dt>
                        <dd className="font-medium text-gray-900 text-sm sm:text-base text-left sm:text-right">
                          {formData.budgetMode === 'open'
                            ? 'Majstori predlažu cijenu'
                            : formData.budgetMin && formData.budgetMax
                            ? `${formData.budgetMin} - ${formData.budgetMax} KM`
                            : formData.budgetMin
                            ? `od ${formData.budgetMin} KM`
                            : formData.budgetMax
                            ? `do ${formData.budgetMax} KM`
                            : 'Budžet po dogovoru'}
                        </dd>
                      </div>
                    </dl>
                    {formData.description && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <dt className="text-gray-500 text-sm sm:text-base mb-2">Opis</dt>
                        <dd className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base break-words">{formData.description}</dd>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary">Nazad</button>
                    <button type="submit" disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
                      {submitting
                        ? (targetProvider ? 'Slanje...' : 'Objavljivanje...')
                        : (targetProvider ? 'Zatraži ponudu' : 'Objavi posao besplatno')}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PostProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-cloud">
          <Header />
          <main className="flex-grow pt-28 pb-12 px-4 sm:px-6">
            <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-md p-6 md:p-8 animate-pulse">
              <div className="w-48 h-7 bg-gray-200 rounded mb-2" />
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-8" />
              <div className="space-y-6">
                <div><div className="w-24 h-4 bg-gray-200 rounded mb-2" /><div className="w-full h-12 bg-gray-200 rounded-xl" /></div>
                <div><div className="w-24 h-4 bg-gray-200 rounded mb-2" /><div className="w-full h-12 bg-gray-200 rounded-xl" /></div>
                <div><div className="w-24 h-4 bg-gray-200 rounded mb-2" /><div className="w-full h-32 bg-gray-200 rounded-xl" /></div>
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <PostProjectContent />
    </Suspense>
  );
}
