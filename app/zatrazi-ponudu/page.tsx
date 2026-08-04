'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { categories as allCategories, cities as allCities } from '@/lib/data';
import { Upload, MapPin, Calendar, DollarSign, ArrowLeft, Loader2, X, ImageIcon, MessageSquare, CheckCircle } from 'lucide-react';

const categories = allCategories.filter((c) => !c.noSeo);
const cities = allCities.map((c) => c.name).sort((a, b) => a.localeCompare(b, 'bs'));

interface Firm {
  id: string;
  name: string;
  city: string | null;
  logo_url: string | null;
  description: string | null;
}

function RequestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const firmId = searchParams.get('firm_id');
  const askMode = searchParams.get('ask') === '1';

  const [firm, setFirm] = useState<Firm | null>(null);
  const [loadingFirm, setLoadingFirm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    city: '',
    address: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    question: '',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/');
  }, [user, loading, router]);

  useEffect(() => {
    if (firmId) loadFirm();
  }, [firmId]);

  async function loadFirm() {
    setLoadingFirm(true);
    const { data } = await supabase
      .from('firms')
      .select('id, name, city, logo_url, description')
      .eq('id', firmId)
      .single();
    if (data) {
      const typed = data as unknown as Firm;
      setFirm(typed);
      if (typed.city && cities.includes(typed.city)) {
        setFormData((prev) => ({ ...prev, city: typed.city || '' }));
      }
    }
    setLoadingFirm(false);
  }

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
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allAllowed = selected.every((file) => allowedTypes.includes(file.type));
    if (!allAllowed) {
      setError('Dozvoljeni su samo JPG, PNG i WEBP formati.');
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
            throw new Error(`Slika „${file.name}” ima ${(compressed.size / 1024 / 1024).toFixed(1)} MB. Maksimalno dozvoljeno je 2 MB.`);
          }
          return compressed;
        })
      );
      setImages(processed);
      setImagePreviews(processed.map((file) => URL.createObjectURL(file)));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom obrade slika.');
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!askMode) {
      if (!formData.category) { setError('Odaberite kategoriju usluge.'); return false; }
      if (!formData.title.trim()) { setError('Unesite naslov posla.'); return false; }
      if (!formData.description.trim()) { setError('Unesite opis posla.'); return false; }
    }
    if (!formData.city) { setError('Odaberite grad.'); return false; }
    if (askMode && !formData.question.trim()) { setError('Postavite pitanje firmi.'); return false; }

    if (formData.budgetMin && formData.budgetMax) {
      const min = parseFloat(formData.budgetMin);
      const max = parseFloat(formData.budgetMax);
      if (min > max) { setError('Maksimalni budžet ne može biti manji od minimalnog.'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) { router.push('/prijava/'); return; }
    if (!firm) { setError('Firma nije učitana.'); return; }
    if (!validate()) return;

    setSubmitting(true);

    const cat = categories.find((c) => c.name === formData.category);
    const budgetMin = formData.budgetMin ? parseFloat(formData.budgetMin) : null;
    const budgetMax = formData.budgetMax ? parseFloat(formData.budgetMax) : null;

    const { data: jobData, error: jobErr } = await supabase
      .from('jobs')
      .insert({
        client_id: user.id,
        category_slug: askMode ? 'savjetovanje' : (cat?.slug || 'ostalo'),
        title: askMode ? `Upit: ${firm.name}` : formData.title,
        description: askMode ? formData.question : formData.description,
        city: formData.city,
        address: formData.address || null,
        status: 'open',
        is_private: true,
        target_firm_id: firm.id,
        private_status: 'pending',
        client_question: formData.question || null,
        budget_mode: 'open',
        budget_min: budgetMin,
        budget_max: budgetMax,
        deadline: formData.deadline || null,
        pending_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select('id')
      .single();

    if (jobErr || !jobData) {
      setSubmitting(false);
      setError(jobErr?.message || 'Došlo je do greške prilikom kreiranja zahtjeva.');
      return;
    }

    const jobId = jobData.id;

    // Upload images
    if (images.length > 0) {
      for (const file of images) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${jobId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('job-images').upload(path, file);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('job-images').getPublicUrl(path);
          if (urlData?.publicUrl) {
            await supabase.from('job_images').insert({ job_id: jobId, image_url: urlData.publicUrl });
          }
        }
      }
    }

    // Send first message if question exists
    if (formData.question.trim()) {
      await supabase.from('messages').insert({
        job_id: jobId,
        sender_id: user.id,
        content: formData.question.trim(),
      });
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">Učitavanje...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow pt-24 pb-10 px-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Zahtjev je poslan</h1>
            <p className="text-steel mb-6">
              {askMode
                ? `Vaše pitanje poslato je firmi ${firm?.name}. Firma će odgovoriti u roku od 48 sati.`
                : `Vaš zahtjev za ponudu poslan je firmi ${firm?.name}. Firma će odgovoriti u roku od 48 sati.`}
            </p>
            <Link
              href="/dashboard/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Idi na dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href={firm ? `/firma-profil/?id=${firm.id}` : '/top-firme/'} className="inline-flex items-center text-sm text-steel hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Nazad na profil firme
          </Link>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {loadingFirm ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje firme...
            </div>
          ) : !firm ? (
            <p className="text-steel">Firma nije pronađena.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                {firm.logo_url ? (
                  <img src={firm.logo_url} alt={firm.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-cloud flex items-center justify-center text-steel font-bold text-xl">
                    {firm.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {askMode ? `Pitaj ${firm.name} prije ponude` : `Zatraži ponudu od ${firm.name}`}
                  </h1>
                  <p className="text-steel text-sm">{firm.city ? `${firm.city} · ` : ''}Privatni zahtjev</p>
                </div>
              </div>

              {askMode ? (
                <p className="text-sm text-steel mb-6 bg-cloud rounded-lg p-3">
                  Postavite pitanje firmi {firm.name} prije nego što zatražite službenu ponudu. Nema obaveze.
                </p>
              ) : (
                <p className="text-sm text-steel mb-6 bg-cloud rounded-lg p-3">
                  Ovaj zahtjev vidi samo {firm.name}. Ne objavljuje se javno, ne šalje se drugim firmama.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!askMode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Kategorija usluge</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        required
                      >
                        <option value="">Odaberite kategoriju</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Naslov posla</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="npr. Adaptacija kupatila"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Opis posla</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Opišite što trebate učiniti, dimenzije, materijale, posebne želje..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Grad</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                      required
                    >
                      <option value="">Odaberite grad</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Željeni datum</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                      />
                    </div>
                  </div>
                </div>

                {!askMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Procjena budžeta (KM, opcionalno)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                        <input
                          type="number"
                          name="budgetMin"
                          value={formData.budgetMin}
                          onChange={handleInputChange}
                          placeholder="Od"
                          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        />
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                        <input
                          type="number"
                          name="budgetMax"
                          value={formData.budgetMax}
                          onChange={handleInputChange}
                          placeholder="Do"
                          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    {askMode ? 'Vaše pitanje' : 'Pitanje za firmu (opcionalno)'}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-steel" />
                    <textarea
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={askMode ? 'npr. Kada biste mogli doći na pogled?' : 'npr. Imate li iskustva s ovakvim poslovima?'}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none"
                      required={askMode}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Fotografije (opcionalno, max 5)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-brand-orange/50 transition-colors">
                    <input
                      id="request-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="request-images" className="cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-steel" />
                      <span className="text-sm text-gray-600 font-medium">Kliknite za upload fotografija</span>
                      <span className="text-xs text-steel">JPG, PNG, WEBP do 2 MB</span>
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                            aria-label="Ukloni fotografiju"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Šalje se...</>
                    ) : (
                      <>{askMode ? 'Pošalji pitanje' : 'Pošalji zahtjev'}</>
                    )}
                  </button>
                  <p className="text-xs text-steel text-center mt-3">
                    Zahtjev se šalje isključivo firmi {firm.name}. Nema javnog objavljivanja.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ZatraziPonuduPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-cloud">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </main>
          <Footer />
        </div>
      }
    >
      <RequestContent />
    </Suspense>
  );
}
