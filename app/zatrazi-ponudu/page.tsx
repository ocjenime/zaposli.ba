'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { categories as allCategories, cities as allCities } from '@/lib/data';
import {
  MapPin,
  Calendar,
  DollarSign,
  ArrowLeft,
  Loader2,
  X,
  ImageIcon,
  MessageSquare,
  CheckCircle,
  ClipboardList,
  HelpCircle,
  ShieldCheck,
  EyeOff,
  Clock,
  Send,
  ArrowRight,
} from 'lucide-react';
import NextImage from 'next/image';

const categories = allCategories.filter((c) => !c.noSeo);
const cities = allCities.map((c) => c.name).sort((a, b) => a.localeCompare(b, 'bs'));

interface Firm {
  id: string;
  slug: string;
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

  const loadFirm = useCallback(async () => {
    if (!firmId) {
      setLoadingFirm(false);
      return;
    }
    setLoadingFirm(true);
    const { data } = await supabase
      .from('firms')
      .select('id, slug, name, city, logo_url, description')
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
  }, [firmId]);

  useEffect(() => {
    loadFirm();
  }, [loadFirm]);

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
            throw new Error(
              `Slika "${file.name}" ima ${(compressed.size / 1024 / 1024).toFixed(1)} MB. Maksimalno dozvoljeno je 2 MB.`
            );
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!askMode) {
      if (!formData.category) {
        setError('Odaberite kategoriju usluge.');
        return false;
      }
      if (!formData.title.trim()) {
        setError('Unesite naslov posla.');
        return false;
      }
      if (!formData.description.trim()) {
        setError('Unesite opis posla.');
        return false;
      }
    }
    if (!formData.city) {
      setError('Odaberite grad.');
      return false;
    }
    if (askMode && !formData.question.trim()) {
      setError('Postavite pitanje firmi.');
      return false;
    }

    if (formData.budgetMin && formData.budgetMax) {
      const min = parseFloat(formData.budgetMin);
      const max = parseFloat(formData.budgetMax);
      if (min > max) {
        setError('Maksimalni budžet ne može biti manji od minimalnog.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) {
      router.push('/prijava/');
      return;
    }
    if (!firm) {
      setError('Firma nije učitana.');
      return;
    }
    if (!validate()) return;

    setSubmitting(true);

    const cat = categories.find((c) => c.name === formData.category);
    const budgetMin = formData.budgetMin ? parseFloat(formData.budgetMin) : null;
    const budgetMax = formData.budgetMax ? parseFloat(formData.budgetMax) : null;

    const { data: jobData, error: jobErr } = await supabase
      .from('jobs')
      .insert({
        client_id: user.id,
        category_slug: askMode ? 'savjetovanje' : cat?.slug || 'ostalo',
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

  const heroTitle = askMode
    ? `Pitaj ${firm?.name || 'firmu'}`
    : `Zatraži ponudu od ${firm?.name || 'firme'}`;
  const heroSubtitle = askMode
    ? 'Postavite pitanje prije nego što zatražite službenu ponudu. Brzo, besplatno i bez obaveze.'
    : 'Opišite posao, postavite pitanje i priložite fotografije. Firma će dobiti privatnu notifikaciju.';

  if (submitted) {
    return (
      <main className="flex-grow">
        <PageHero
          title="Zahtjev je poslan"
          subtitle={`${firm?.name} će pregledati vašu poruku i odgovoriti u najkraćem roku.`}
          icon={CheckCircle}
          align="center"
          size="md"
          gradient="bg-gradient-to-br from-ink via-slate-900 to-slate-800"
        >
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard/" className="btn-primary text-lg px-8 py-4">
              Idi na dashboard
            </Link>
            <Link
              href={firm ? `/firma-profil/${firm.slug}/` : '/top-firme/'}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors"
            >
              Nazad na profil firme <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </PageHero>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-cloud">
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        eyebrow="Privatni zahtjev"
        icon={askMode ? HelpCircle : ClipboardList}
        align="center"
        size="md"
        gradient="bg-gradient-to-br from-ink via-slate-900 to-slate-800"
      >
        {firm && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-5 py-2 text-white/90">
            {firm.logo_url ? (
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                <NextImage
                  src={firm.logo_url}
                  alt={firm.name}
                  fill
                  unoptimized
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center text-sm font-bold text-white">
                {firm.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium">
              {firm.name} · {firm.city || 'BiH'} · Samo ova firma vidi vaš zahtjev
            </span>
          </div>
        )}
      </PageHero>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-28 space-y-6">
                {firm && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                    <Link
                      href={`/firma-profil/${firm.slug}/`}
                      className="inline-flex items-center text-sm text-steel hover:text-brand-orange mb-4 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Nazad na profil firme
                    </Link>
                    <div className="flex items-center gap-4">
                      {firm.logo_url ? (
                        <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-gray-100">
                          <NextImage
                            src={firm.logo_url}
                            alt={firm.name}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-cloud flex items-center justify-center text-steel font-bold text-2xl">
                          {firm.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{firm.name}</h2>
                        <p className="text-sm text-steel">{firm.city || 'Bosna i Hercegovina'}</p>
                      </div>
                    </div>
                    {firm.description && (
                      <p className="mt-4 text-sm text-steel line-clamp-4">{firm.description}</p>
                    )}
                  </div>
                )}

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-6 text-white shadow-card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <EyeOff className="w-5 h-5 text-brand-orange" />
                      <h3 className="text-base font-bold">Zašto privatni zahtjev?</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-white/75">
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        Zahtjev vidi samo odabrana firma.
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        Odgovor u prosjeku do 48 sati.
                      </li>
                      <li className="flex items-start gap-2">
                        <Send className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        Bez javnog objavljivanja i konkurencije.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Kako funkcioniše?</h3>
                  <ol className="space-y-4">
                    {(askMode
                      ? [
                          { step: '01', text: 'Postavite pitanje firmi.' },
                          { step: '02', text: 'Firma pregleda upit i odgovori.' },
                          { step: '03', text: 'Ako vam odgovara, zatražite službenu ponudu.' },
                        ]
                      : [
                          { step: '01', text: 'Popunite detalje posla i budžeta.' },
                          { step: '02', text: 'Firma vidi zahtjev i šalje ponudu.' },
                          { step: '03', text: 'Uporedite ponude i izaberite najbolju.' },
                        ]
                    ).map((item) => (
                      <li key={item.step} className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-orange-50 text-brand-orange text-xs font-extrabold flex items-center justify-center shrink-0">
                          {item.step}
                        </span>
                        <span className="text-sm text-steel">{item.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-8 xl:col-span-9">
              {error && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loadingFirm ? (
                <div className="flex items-center justify-center py-16 text-steel bg-white rounded-3xl border border-gray-100 shadow-card">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje firme...
                </div>
              ) : !firm ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-card">
                  <p className="text-steel">Firma nije pronađena.</p>
                  <Link href="/top-firme/" className="btn-primary mt-4 inline-flex">
                    Pogledaj firme
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 md:p-10 space-y-8"
                >
                  {!askMode && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                            Kategorija usluge
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="input-field py-3"
                            required
                          >
                            <option value="">Odaberite kategoriju</option>
                            {categories.map((c) => (
                              <option key={c.slug} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                            Naslov posla
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="npr. Adaptacija kupatila"
                            className="input-field py-3"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                          Opis posla
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={5}
                          placeholder="Opišite što trebate učiniti, dimenzije, materijale, posebne želje..."
                          className="input-field resize-none"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Grad</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field py-3"
                        required
                      >
                        <option value="">Odaberite grad</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                        Adresa (opcionalno)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="npr. Fra Andže Zvizdovića 12"
                          className="input-field pl-10 py-3"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                        Željeni datum
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className="input-field pl-10 py-3"
                        />
                      </div>
                    </div>

                    {!askMode && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                          Procjena budžeta (KM, opcionalno)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
                            <input
                              type="number"
                              name="budgetMin"
                              value={formData.budgetMin}
                              onChange={handleInputChange}
                              placeholder="Od"
                              className="input-field pl-10 py-3"
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
                              className="input-field pl-10 py-3"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      {askMode ? 'Vaše pitanje' : 'Pitanje za firmu (opcionalno)'}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-steel" />
                      <textarea
                        name="question"
                        value={formData.question}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder={
                          askMode
                            ? 'npr. Kada biste mogli doći na pogled?'
                            : 'npr. Imate li iskustva s ovakvim poslovima?'
                        }
                        className="input-field pl-10 resize-none"
                        required={askMode}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Fotografije (opcionalno, max 5)
                    </label>
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
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
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

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Šalje se...
                        </>
                      ) : (
                        <>{askMode ? 'Pošalji pitanje' : 'Pošalji zahtjev'}</>
                      )}
                    </button>
                    <p className="text-xs text-steel text-center mt-3">
                      Zahtjev se šalje isključivo firmi {firm.name}. Nema javnog objavljivanja.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="flex-grow flex items-center justify-center bg-cloud py-24">
      <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
    </main>
  );
}

export default function ZatraziPonuduPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RequestContent />
    </Suspense>
  );
}
