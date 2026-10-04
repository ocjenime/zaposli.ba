'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Hammer, Wrench, Home, Car, PaintRoller, Zap, Droplet, Leaf, Briefcase, LayoutGrid,
  ChevronRight, ChevronDown, X, Check, MapPin, Camera, Lightbulb, ShieldCheck, Star,
  Phone, EyeOff, Calendar, ArrowRight, Search,
} from 'lucide-react';
import { categories as allCategories, cities as allCities, getCategory } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';

const categories = allCategories.filter((c) => !c.noSeo);
const cities = allCities.map((c) => c.name).sort((a, b) => a.localeCompare(b, 'bs'));

/** 10 mockup grupa, svaka mapira na prave kategorije iz baze. */
const STEP_GROUPS: { title: string; sub: string; Icon: typeof Hammer; slugs: string[] }[] = [
  { title: 'Građevina', sub: 'Fasade, zidanje, adaptacije...', Icon: Hammer, slugs: ['gradjevinarstvo', 'zidarski-radovi', 'tesarski-radovi', 'betoniranje-i-armatura', 'zemljani-radovi', 'rusenje', 'krovopokrivanje', 'limarski-radovi', 'izolacija', 'hidroizolacija'] },
  { title: 'Popravke i montaža', sub: 'Montaža, popravke, instalacije...', Icon: Wrench, slugs: ['stolarija', 'varilac', 'servis-aparata', 'sigurnost'] },
  { title: 'Dom i održavanje', sub: 'Čišćenje, vrt, održavanje...', Icon: Home, slugs: ['ciscenje', 'pranje-fasada-i-krovova', 'dimnjacar', 'odrzavanje-zgrada'] },
  { title: 'Auto i transport', sub: 'Prijevoz, selidbe, automehanika...', Icon: Car, slugs: ['auto-usluge', 'selidbe'] },
  { title: 'Adaptacije i uređenje', sub: 'Moleraj, keramika, podovi...', Icon: PaintRoller, slugs: ['molerski-radovi', 'masinsko-nabacivanje', 'gipsarski-radovi', 'zavrsni-radovi', 'tapetarski-radovi', 'keramicarski-radovi', 'podovi', 'tlakovi-estrih', 'staklar', 'kamen-i-poplocavanje', 'adaptacije', 'kupatila-kljuc-u-ruke', 'kuhinje-po-mjeri'] },
  { title: 'Električne instalacije', sub: 'Električari, rasvjeta, smart home...', Icon: Zap, slugs: ['elektroinstalacije', 'tehnologija'] },
  { title: 'Voda i grijanje', sub: 'Vodoinstalacije, grijanje, klima...', Icon: Droplet, slugs: ['vodoinstalacije', 'grijanje-i-hladjenje', 'plinske-instalacije', 'solarne-instalacije', 'kamin-i-peci'] },
  { title: 'Vrt i okućnica', sub: 'Košenje, sadnja, uređenje vrta...', Icon: Leaf, slugs: ['vrtlarstvo', 'pergole-nadstresnice-tende', 'bazeni-i-fontane', 'poplocavanje-dvorista-i-terasa', 'rusenje-stabala-drvoreda', 'ograde'] },
  { title: 'Poslovne usluge', sub: 'IT, marketing, dizajn...', Icon: Briefcase, slugs: ['projektovanje-i-arhitektura', 'dizajn-enterijera', 'dizajn-eksterijera', 'statika-i-nadzor', 'energetska-obnova'] },
  { title: 'Ostalo', sub: 'Ostale usluge...', Icon: LayoutGrid, slugs: ['hitne-intervencije'] },
];

const STEP_LABELS = ['Kategorija', 'Detalji posla', 'Lokacija i dodatno'];
const STEP_TITLES = ['Šta vam je potrebno?', 'Opišite šta vam treba', 'Gdje i kada?'];
const STEP_SUBS = [
  'Odaberite kategoriju koja najbolje opisuje vaš posao.',
  'Što više detalja, to bolje ponude od majstora i firmi.',
  'Još samo nekoliko informacija i vaš oglas je spreman.',
];

type BudgetOption = 'dogovor' | 'do500' | '500-1000' | 'preko1000';

const BUDGET_OPTIONS: { value: BudgetOption; label: string }[] = [
  { value: 'dogovor', label: 'Po dogovoru' },
  { value: 'do500', label: 'Do 500 KM' },
  { value: '500-1000', label: '500 - 1.000 KM' },
  { value: 'preko1000', label: 'Više od 1.000 KM' },
];

function findCategoryByService(service: string) {
  const s = service.toLowerCase();
  return (
    categories.find((c) => c.name.toLowerCase() === s) ||
    categories.find((c) => c.name.toLowerCase().includes(s)) ||
    categories.find((c) => c.services.some((svc) => svc.toLowerCase().includes(s) || s.includes(svc.toLowerCase()))) ||
    null
  );
}

function groupIndexForCategoryName(name: string): number | null {
  const cat = categories.find((c) => c.name === name);
  if (!cat) return null;
  const idx = STEP_GROUPS.findIndex((g) => g.slugs.includes(cat.slug));
  return idx >= 0 ? idx : null;
}

function ToggleRow({
  Icon, title, sub, on, onChange,
}: {
  Icon: typeof Star; title: string; sub: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="w-full flex items-center gap-3 py-2 text-left"
    >
      <span className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-[18px] h-[18px] text-gray-900" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-bold text-gray-900 leading-tight">{title}</span>
        <span className="block text-xs text-gray-500 leading-snug">{sub}</span>
      </span>
      <span className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${on ? 'bg-brand-orange' : 'bg-gray-200'}`}>
        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
      </span>
    </button>
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
    budgetOption: 'dogovor' as BudgetOption,
    deadlineMode: 'asap' as 'asap' | 'custom',
    deadline: '',
    isUrgent: false,
    showPhone: true,
    isAnonymous: false,
  });
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
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

  // Otvori grupu koja sadrži već odabranu/prefill kategoriju
  useEffect(() => {
    if (formData.category && expandedGroup === null) {
      const idx = groupIndexForCategoryName(formData.category);
      if (idx !== null) setExpandedGroup(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.category]);

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/?redirectTo=/objavi-projekat/');
    if (!loading && user && isFirmRole(role)) router.push('/dashboard/firma/');
  }, [user, loading, role, router]);

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

  function budgetToDb(): { mode: 'open' | 'fixed'; min: number | null; max: number | null } {
    switch (formData.budgetOption) {
      case 'do500':
        return { mode: 'fixed', min: null, max: 500 };
      case '500-1000':
        return { mode: 'fixed', min: 500, max: 1000 };
      case 'preko1000':
        return { mode: 'fixed', min: 1000, max: null };
      default:
        return { mode: 'open', min: null, max: null };
    }
  }

  const resetForm = () => {
    setSubmitted(false);
    setNotifiedCount(null);
    setStep(1);
    setExpandedGroup(null);
    setFormData({
      title: '', category: '', description: '', city: '',
      budgetOption: 'dogovor', deadlineMode: 'asap', deadline: '',
      isUrgent: false, showPhone: true, isAnonymous: false,
    });
    setImages([]);
    setImagePreviews([]);
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) { router.push('/prijava/?redirectTo=/objavi-projekat/'); return; }
    // Poslove smiju objavljivati samo klijenti - firme i majstori imaju oglase.
    if (isFirmRole(role)) {
      setError('Poslove mogu objavljivati samo klijenti. Kao firma/majstor koristite sponzorirane oglase.');
      router.push('/dashboard/firma/');
      return;
    }

    const cat = categories.find((c) => c.name === formData.category);
    if (!cat) { setError('Odaberite kategoriju'); return; }
    if (formData.title.trim().length < 5) { setError('Naslov mora imati najmanje 5 znakova'); return; }
    if (formData.description.trim().length < 20) { setError('Opis mora imati najmanje 20 znakova'); return; }
    if (!formData.city.trim()) { setError('Odaberite grad'); return; }

    setSubmitting(true);
    const budget = budgetToDb();
    const deadline = formData.deadlineMode === 'custom' && formData.deadline ? formData.deadline : null;

    const { data: jobData, error: err } = await supabase
      .from('jobs')
      .insert({
        client_id: user.id,
        category_slug: cat.slug,
        title: formData.title.trim().slice(0, 80),
        description: formData.description.trim().slice(0, 500),
        city: formData.city,
        address: null,
        status: 'open',
        budget_mode: budget.mode,
        budget_min: budget.min,
        budget_max: budget.max,
        deadline: deadline,
        is_urgent: formData.isUrgent,
        show_phone: formData.showPhone,
        is_anonymous: formData.isAnonymous,
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

    setSubmitting(false);
    setSubmitted(true);
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  };

  const selectedSlug = categories.find((c) => c.name === formData.category)?.slug;
  const filteredCities = cityQuery.trim()
    ? cities.filter((c) => c.toLowerCase().includes(cityQuery.trim().toLowerCase()))
    : cities;

  if (loading || !user) return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
      <Header />
      <main className="flex-grow px-4 pt-8 pb-12">
        <div className="mx-auto w-full max-w-[520px] animate-pulse">
          <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-3/4 h-9 bg-gray-200 rounded-xl mb-2" />
          <div className="w-full h-16 bg-gray-200 rounded-2xl mb-4" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full h-20 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
        <Header />
        <main className="flex-grow flex items-start justify-center px-4 pt-10 pb-16">
          <div className="mx-auto w-full max-w-[520px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-orange/25">
              <svg className="w-8 h-8 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Posao je objavljen!</h1>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Vaš posao <b className="text-gray-900">&ldquo;{formData.title || 'Adaptacija'}&rdquo;</b> je sada vidljiv provjerenim firmama.
              {notifiedCount != null && notifiedCount > 0 && (
                <>
                  {' '}Obavijestili smo <b className="text-gray-900">{notifiedCount} {notifiedCount === 1 ? 'firmu' : notifiedCount < 5 ? 'firme' : 'firmi'}</b> iz kategorije.
                </>
              )}
              {' '}Prve ponude obično stižu u roku od <b className="text-gray-900">24 sata</b>.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={resetForm}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-extrabold text-[15px] px-4 py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-[0.99] min-h-[56px]"
              >
                Objavite još jedan posao
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/dashboard/"
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 font-bold text-[15px] px-4 py-4 rounded-2xl hover:bg-gray-200 transition-colors min-h-[56px]"
              >
                Idi na dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
      <Header />
      <main className="flex-grow px-4 pt-5 sm:pt-8 pb-16">
        <div className="mx-auto w-full max-w-[520px]">
          {/* Step header */}
          <div className="flex items-baseline gap-3 mb-1.5">
            <span className="text-sm font-bold text-gray-900">{step} / 3</span>
            <span className="text-sm font-semibold text-gray-900">{STEP_LABELS[step - 1]}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden mb-5">
            <div
              className="h-full rounded-full bg-brand-orange transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <h1 className="text-[32px] leading-[1.1] font-extrabold text-gray-900 tracking-tight">
            {targetProvider ? 'Zatražite ponudu' : STEP_TITLES[step - 1]}
          </h1>
          <p className="text-[15px] text-gray-500 leading-snug mt-1.5 mb-5">
            {targetProvider ? `Zahtjev za firmu ${targetProvider.name}.` : STEP_SUBS[step - 1]}
          </p>

          {targetProvider && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-2xl text-sm">
              <p className="text-gray-500">Zahtjev za ponudu od:</p>
              <p className="font-bold text-gray-900 text-base">{targetProvider.name}</p>
            </div>
          )}
          {(prefill.service || prefill.city) && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-2xl text-sm">
              <p className="text-gray-500">Preuzeto iz pretrage:</p>
              <p className="font-medium text-gray-900">
                {prefill.service && <span className="text-brand-orange">{prefill.service}</span>}
                {prefill.service && prefill.city && <span className="text-gray-400 mx-1">·</span>}
                {prefill.city && <span>{prefill.city}</span>}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ================= KORAK 1: kategorija ================= */}
            {step === 1 && (
              <div>
                <div className="space-y-2.5">
                  {STEP_GROUPS.map((group, gi) => {
                    const groupCats = categories.filter((c) => group.slugs.includes(c.slug));
                    if (groupCats.length === 0) return null;
                    const isSelected = !!selectedSlug && group.slugs.includes(selectedSlug);
                    const isOpen = expandedGroup === gi;
                    const GroupIcon = group.Icon;
                    return (
                      <div
                        key={group.title}
                        className={`bg-white rounded-2xl border transition-colors overflow-hidden ${
                          isSelected ? 'border-brand-orange ring-1 ring-brand-orange' : 'border-gray-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedGroup(isOpen ? null : gi)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <GroupIcon className="w-6 h-6 text-gray-900" strokeWidth={2.2} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[16px] font-bold text-gray-900 leading-tight">
                              {group.title}
                            </span>
                            <span className="block text-[13px] text-gray-500 leading-snug truncate">
                              {isSelected
                                ? categories.find((c) => c.slug === selectedSlug)?.name
                                : group.sub}
                            </span>
                          </span>
                          {isSelected && !isOpen ? (
                            <span className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0">
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          ) : (
                            <ChevronRight
                              className={`w-5 h-5 text-gray-300 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                            />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 pt-1 border-t border-gray-50">
                            {groupCats.map((c) => {
                              const active = formData.category === c.name;
                              return (
                                <button
                                  key={c.slug}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, category: c.name }))}
                                  className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    active ? 'bg-orange-50 text-brand-orange' : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {c.name}
                                  {active && <Check className="w-4 h-4 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 bg-[#eef6f6] border border-[#d9ecec] rounded-2xl p-4 flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white border border-[#d9ecec] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-gray-900">Potpuno besplatno</span>
                    <span className="block text-[13px] text-gray-600 leading-snug">
                      Vaš oglas mogu vidjeti provjereni majstori i firme u vašem području.
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.category) { setError('Odaberite kategoriju koja najbolje opisuje vaš posao.'); return; }
                    setError('');
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-extrabold text-[16px] px-4 py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-[0.99] min-h-[56px]"
                >
                  Nastavi
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ================= KORAK 2: detalji ================= */}
            {step === 2 && (
              <div>
                <div className="mb-4">
                  <label htmlFor="job-title" className="block text-[15px] font-bold text-gray-900 mb-1.5">
                    Naslov oglasa
                  </label>
                  <input
                    id="job-title"
                    type="text"
                    value={formData.title}
                    maxLength={80}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Npr. Potrebna izrada fasade na kući"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all"
                  />
                  <p className="text-right text-xs text-gray-400 mt-1">{formData.title.length}/80</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="job-desc" className="block text-[15px] font-bold text-gray-900 mb-1.5">
                    Detaljan opis
                  </label>
                  <textarea
                    id="job-desc"
                    value={formData.description}
                    maxLength={500}
                    rows={6}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Opišite šta trebate, koje radove, materijale, dimenzije, specifične zahtjeve, rokove..."
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all resize-none"
                  />
                  <p className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/500</p>
                </div>

                <div className="mb-4">
                  <p className="text-[15px] font-bold text-gray-900 mb-2">
                    Dodajte fotografije <span className="font-medium text-gray-400">(opcionalno)</span>
                  </p>
                  <div className="flex gap-2.5">
                    <label
                      htmlFor="job-images"
                      className="w-[104px] h-[104px] shrink-0 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-brand-orange transition-colors"
                    >
                      <Camera className="w-6 h-6 text-gray-900" />
                      <span className="text-[11px] font-medium text-gray-600 text-center leading-tight px-1">
                        Dodaj fotografije
                      </span>
                    </label>
                    <input
                      type="file"
                      id="job-images"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-[104px] h-[104px] shrink-0 rounded-2xl overflow-hidden border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt={`Fotografija ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`Ukloni fotografiju ${index + 1}`}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5 bg-[#fdf3e7] border border-[#f5e3c8] rounded-2xl p-4 flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-[15px] font-bold text-brand-orange">Savjet</span>
                    <span className="block text-[13px] text-gray-600 leading-snug">
                      Fotografije pomažu majstorima da brže i tačnije ponude cijenu.
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (formData.title.trim().length < 5) { setError('Naslov mora imati najmanje 5 znakova'); return; }
                    if (formData.description.trim().length < 20) { setError('Opis mora imati najmanje 20 znakova'); return; }
                    setError('');
                    setStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-extrabold text-[16px] px-4 py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-[0.99] min-h-[56px]"
                >
                  Nastavi
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setError(''); setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="mt-1 w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Nazad
                </button>
              </div>
            )}

            {/* ================= KORAK 3: lokacija i dodatno ================= */}
            {step === 3 && (
              <div>
                <p className="text-[15px] font-bold text-gray-900 mb-1.5">Lokacija</p>
                <button
                  type="button"
                  onClick={() => { setCityQuery(''); setCitySheetOpen(true); }}
                  className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-left focus:border-brand-orange transition-colors"
                >
                  <MapPin className="w-5 h-5 text-gray-900 shrink-0" />
                  <span className={`flex-1 text-[15px] ${formData.city ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                    {formData.city || 'Odaberite grad'}
                  </span>
                  {formData.city && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Ukloni grad"
                      onClick={(e) => { e.stopPropagation(); setFormData((prev) => ({ ...prev, city: '' })); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setFormData((prev) => ({ ...prev, city: '' })); } }}
                      className="text-gray-400 hover:text-gray-900 p-1"
                    >
                      <X className="w-4 h-4" />
                    </span>
                  )}
                </button>
                <p className="flex items-start gap-2 text-[13px] text-gray-500 leading-snug mt-2 mb-5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  Oglas će biti vidljiv majstorima u vašem području.
                </p>

                <p className="text-[15px] font-bold text-gray-900 mb-2">
                  Okvirni budžet <span className="font-medium text-gray-400">(opcionalno)</span>
                </p>
                <div className="space-y-2.5 mb-5">
                  {BUDGET_OPTIONS.map((opt) => {
                    const activeOpt = formData.budgetOption === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, budgetOption: opt.value }))}
                        aria-pressed={activeOpt}
                        className={`w-full px-4 py-3.5 rounded-2xl border text-[15px] font-semibold transition-colors ${
                          activeOpt
                            ? 'border-brand-orange bg-orange-50 text-brand-orange'
                            : 'border-gray-200 bg-white text-gray-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[15px] font-bold text-gray-900 mb-1.5">Kada vam treba?</p>
                {formData.deadlineMode === 'asap' ? (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, deadlineMode: 'custom' }))}
                    className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-left"
                  >
                    <Calendar className="w-5 h-5 text-gray-900 shrink-0" />
                    <span className="flex-1 text-[15px] font-semibold text-gray-900">Što prije</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.deadline}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                      className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[15px] text-gray-900 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 min-h-[56px]"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, deadlineMode: 'asap', deadline: '' }))}
                      className="px-4 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:text-gray-900"
                    >
                      Što prije
                    </button>
                  </div>
                )}

                <p className="text-[15px] font-bold text-gray-900 mt-5 mb-1">
                  Dodatne opcije <span className="font-medium text-gray-400">(opcionalno)</span>
                </p>
                <div className="divide-y divide-gray-100">
                  <ToggleRow
                    Icon={Star}
                    title="Hitno"
                    sub="Oglas označen kao hitan"
                    on={formData.isUrgent}
                    onChange={(v) => setFormData((prev) => ({ ...prev, isUrgent: v }))}
                  />
                  <ToggleRow
                    Icon={Phone}
                    title="Prikaži moj broj telefona"
                    sub="Majstori vas mogu direktno kontaktirati"
                    on={formData.showPhone}
                    onChange={(v) => setFormData((prev) => ({ ...prev, showPhone: v }))}
                  />
                  <ToggleRow
                    Icon={EyeOff}
                    title="Ostati anoniman"
                    sub="Prikazuje se samo grad"
                    on={formData.isAnonymous}
                    onChange={(v) => setFormData((prev) => ({ ...prev, isAnonymous: v }))}
                  />
                </div>

                <div className="mt-4 bg-[#eef6f6] border border-[#d9ecec] rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-[15px] font-bold text-gray-900">Spremni za objavu!</span>
                    <span className="block text-[13px] text-gray-600 leading-snug">
                      Vaš oglas je besplatan i mogu ga vidjeti provjereni majstori i firme u vašem području.
                    </span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-extrabold text-[16px] px-4 py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-[0.99] min-h-[56px] disabled:opacity-50"
                >
                  {submitting ? 'Objavljivanje...' : targetProvider ? 'Zatraži ponudu' : 'Objavi posao — besplatno'}
                  {!submitting && <ChevronRight className="w-5 h-5" />}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2.5">
                  Objavom pristajete na naše{' '}
                  <Link href="/uslovi-koristenja/" className="underline hover:text-gray-600">
                    Uslove korištenja
                  </Link>.
                </p>
                <button
                  type="button"
                  onClick={() => { setError(''); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="mt-1 w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Nazad
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />

      {/* City bottom sheet */}
      {citySheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Odaberite grad">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCitySheetOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[75vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <p className="text-lg font-extrabold text-gray-900">Odaberite grad</p>
              <button
                type="button"
                onClick={() => setCitySheetOpen(false)}
                aria-label="Zatvori"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Pretraži gradove..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-[15px] outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
                />
              </div>
            </div>
            <div className="overflow-y-auto px-2 pb-6">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, city }));
                    setCitySheetOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                    formData.city === city ? 'bg-orange-50 text-brand-orange' : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {city}
                  {formData.city === city && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-6">Nema gradova za pretragu.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PostProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
          <Header />
          <main className="flex-grow px-4 pt-8 pb-12">
            <div className="mx-auto w-full max-w-[520px] animate-pulse">
              <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
              <div className="w-3/4 h-9 bg-gray-200 rounded-xl mb-2" />
              <div className="w-full h-16 bg-gray-200 rounded-2xl mb-4" />
              <div className="space-y-3">
                <div className="w-full h-20 bg-gray-200 rounded-2xl" />
                <div className="w-full h-20 bg-gray-200 rounded-2xl" />
                <div className="w-full h-20 bg-gray-200 rounded-2xl" />
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
