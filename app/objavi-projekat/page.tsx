'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, MapPin, Calendar, DollarSign, ChevronRight, X, ImageIcon } from 'lucide-react';
import { categories as allCategories, cities as allCities, getWorker, getCategory } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const categories = allCategories.filter((c) => !c.noSeo);
const cities = allCities.map((c) => c.name);

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
    budgetMin: '',
    budgetMax: '',
    deadline: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [targetProvider, setTargetProvider] = useState<{ id: string; name: string; type: 'worker' | 'firm'; ownerId?: string } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
      const worker = getWorker(workerId);
      if (worker) {
        const cat = getCategory(worker.categorySlug);
        setTargetProvider({ id: worker.id, name: worker.name, type: 'worker' });
        setFormData((prev) => ({
          ...prev,
          category: cat?.name || prev.category,
          title: prev.title || worker.specialty,
        }));
      }
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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
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
        status: 'open',
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

    setSubmitting(false);

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

    router.push('/dashboard/');
  };

  if (loading || !user) return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <p className="text-steel">Učitavanje...</p>
      </main>
      <Footer />
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-orange/25">
              <svg className="w-10 h-10 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Posao je objavljen!</h1>
            <p className="text-steel mb-8 leading-relaxed">
              Vaš posao <b className="text-gray-900">"{formData.title || 'Adaptacija'}"</b> je sada vidljiv provjerenim firmama.
              Prve ponude obično stižu u roku od <b className="text-gray-900">24 sata</b>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/" className="btn-secondary">Idi na dashboard</Link>
              <button
                onClick={() => { setSubmitted(false); setStep(1); setFormData({ title: '', category: '', description: '', city: '', address: '', budgetMin: '', budgetMax: '', deadline: '' }); setImages([]); setImagePreviews([]); }}
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
      <main className="flex-grow py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-primary-600 text-[#ffffff]' : 'bg-gray-200 text-gray-500'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`hidden sm:block w-24 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="hidden sm:flex justify-between mt-2 text-sm text-gray-500">
              <span>Osnovne informacije</span>
              <span>Detalji posla</span>
              <span>Pregled i objava</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Budžet (min) <span className="text-gray-400 font-normal">— opcionalno</span></label>
                      <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange} placeholder="Minimalni budžet (KM)" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Budžet (max) <span className="text-gray-400 font-normal">— opcionalno</span></label>
                      <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange} placeholder="Maksimalni budžet (KM)" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Rok izvršenja <span className="text-gray-400 font-normal">— opcionalno</span></label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-1" />Fotografije posla (opcionalno)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        id="job-images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="job-images" className="cursor-pointer inline-flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">Kliknite za upload fotografija</span>
                        <span className="text-xs text-gray-400">Do 5 fotografija (JPEG, PNG, WebP)</span>
                      </label>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary">Nazad</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary flex items-center justify-center gap-2">Nastavi <ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pregled posla</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between"><dt className="text-gray-500">Naslov:</dt><dd className="font-medium text-gray-900">{formData.title || '-'}</dd></div>
                      <div className="flex justify-between"><dt className="text-gray-500">Kategorija:</dt><dd className="font-medium text-gray-900">{formData.category || '-'}</dd></div>
                      <div className="flex justify-between"><dt className="text-gray-500">Grad:</dt><dd className="font-medium text-gray-900">{formData.city || '-'}</dd></div>
                    </dl>
                    {formData.description && <div className="mt-4 pt-4 border-t border-gray-200"><dt className="text-gray-500 mb-2">Opis:</dt><dd className="text-gray-700 whitespace-pre-wrap">{formData.description}</dd></div>}
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary">Nazad</button>
                    <button type="submit" disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
                      {submitting ? 'Objavljivanje...' : 'Objavi posao besplatno'}
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
          <main className="flex-grow flex items-center justify-center">
            <p className="text-steel">Učitavanje...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <PostProjectContent />
    </Suspense>
  );
}
