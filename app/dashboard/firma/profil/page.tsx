'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/ui/DashboardHeader';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { categories } from '@/lib/data';
import { resizeAndCompressImage, blobToFile } from '@/lib/image-utils';
import useFirmActivityHeartbeat from '@/lib/hooks/useFirmActivityHeartbeat';
import NextImage from 'next/image';
import LogoDisplay from '@/components/ui/LogoDisplay';
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  Check,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Globe,
  ImageIcon,
  Loader2,
  Hash,
  Calendar,
} from 'lucide-react';

interface FirmRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  verification_submitted_at: string | null;
  verification_notes: string | null;
  registration_number: string | null;
  founded_at: string | null;
  last_active_at: string | null;
}

interface FirmCategoryRow {
  category_slug: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export default function FirmProfileEditorPage() {
  const { user, loading: authLoading, role } = useAuth();
  const router = useRouter();

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [foundedAt, setFoundedAt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useFirmActivityHeartbeat(firm?.id || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const [portfolioImages, setPortfolioImages] = useState<{ id: string; image_url: string }[]>([]);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [deletingPortfolioId, setDeletingPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isFirmRole(role)) {
      router.push('/prijava/');
      return;
    }
    loadFirm();
  }, [authLoading, user, role, router]);

  async function loadFirm() {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const { data, error: firmError } = await supabase
        .from('firms')
        .select('id, owner_id, name, slug, description, email, phone, city, logo_url, verified, verification_status, verification_submitted_at, verification_notes, registration_number, founded_at')
        .eq('owner_id', user.id)
        .single();

      if (firmError || !data) {
        setError('Nismo pronašli profil firme. Registrujte firmu ponovo.');
        setLoading(false);
        return;
      }

      const typedFirm = data as unknown as FirmRow;
      setFirm(typedFirm);
      setName(typedFirm.name);
      setSlug(typedFirm.slug);
      setDescription(typedFirm.description || '');
      setCity(typedFirm.city || '');
      setPhone(typedFirm.phone || '');
      setEmail(typedFirm.email || '');
      setRegistrationNumber(typedFirm.registration_number || '');
      setFoundedAt(typedFirm.founded_at || '');
      setLogoUrl(typedFirm.logo_url);
      setLogoPreview(typedFirm.logo_url);

      const { data: catData } = await supabase
        .from('firm_categories')
        .select('category_slug')
        .eq('firm_id', typedFirm.id);

      const rows = (catData as unknown as FirmCategoryRow[] | null) || [];
      setSelectedCategories(rows.map((c) => c.category_slug));

      const { data: portfolioData } = await supabase
        .from('portfolio_images')
        .select('id, image_url')
        .eq('firm_id', typedFirm.id)
        .order('created_at', { ascending: true });
      setPortfolioImages((portfolioData as { id: string; image_url: string }[]) || []);
    } catch (err) {
      setError('Došlo je do greške pri učitavanju profila.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setError('');
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Dozvoljeni formati logotipa: JPG, PNG, WEBP.');
      return;
    }

    setUploadingLogo(true);
    try {
      const compressedBlob = await resizeAndCompressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.9,
        type: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
      });

      if (compressedBlob.size > 2 * 1024 * 1024) {
        setError('Logotip je i nakon kompresije prevelik. Probajte manju sliku.');
        setUploadingLogo(false);
        return;
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const compressedFile = blobToFile(compressedBlob, `logo.${ext}`, file.type);
      setLogoFile(compressedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        setUploadingLogo(false);
      };
      reader.onerror = () => {
        setError('Greška pri učitavanju pregleda logotipa.');
        setUploadingLogo(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Logo compression error:', err);
      setError('Greška pri pripremi logotipa. Probajte drugu sliku.');
      setUploadingLogo(false);
    }
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handlePortfolioChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!firm || !e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 10);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024;

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(`Dozvoljeni formati fotografija: JPG, PNG, WEBP. (${file.name})`);
        return;
      }
      if (file.size > maxSize) {
        setError(`Fotografija mora biti manja od 2MB. (${file.name})`);
        return;
      }
    }

    setUploadingPortfolio(true);
    setError('');
    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${firm.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(path, file);
      if (uploadError) {
        setError(`Greška pri uploadu ${file.name}.`);
        continue;
      }
      const { data: publicUrl } = supabase.storage.from('portfolio-images').getPublicUrl(path);
      const { data: inserted, error: insertError } = await supabase
        .from('portfolio_images')
        .insert({ firm_id: firm.id, image_url: publicUrl.publicUrl })
        .select('id, image_url')
        .single();
      if (!insertError && inserted) {
        setPortfolioImages((prev) => [...prev, inserted as { id: string; image_url: string }]);
      }
    }
    setUploadingPortfolio(false);
    if (portfolioInputRef.current) portfolioInputRef.current.value = '';
  }

  async function deletePortfolioImage(id: string) {
    if (!firm) return;
    setDeletingPortfolioId(id);
    const { error: deleteError } = await supabase.from('portfolio_images').delete().eq('id', id);
    if (!deleteError) {
      setPortfolioImages((prev) => prev.filter((img) => img.id !== id));
    } else {
      setError('Greška pri brisanju fotografije.');
    }
    setDeletingPortfolioId(null);
  }

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function requestVerification() {
    if (!firm) return;
    setVerificationLoading(true);
    setVerificationMessage('');
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('firms')
        .update({
          verification_status: 'pending',
          verification_submitted_at: new Date().toISOString(),
        })
        .eq('id', firm.id);
      if (updateError) {
        setVerificationMessage('Zahtjev za verifikaciju nije uspio. Pokušajte ponovo.');
      } else {
        setFirm({
          ...firm,
          verification_status: 'pending',
          verification_submitted_at: new Date().toISOString(),
        });
        setVerificationMessage('Zahtjev za verifikaciju poslan. Hvala!');
      }
    } catch (err) {
      setVerificationMessage('Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setVerificationLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!firm || !user) {
      setError('Nedostaju podaci o firmi.');
      return;
    }

    if (!name.trim()) {
      setError('Unesite naziv firme.');
      return;
    }

    if (!slug.trim()) {
      setError('Unesite slug profila.');
      return;
    }

    const finalSlug = slug.trim();
    const { data: existingSlug, error: slugError } = await supabase
      .from('firms')
      .select('id')
      .eq('slug', finalSlug)
      .neq('id', firm.id)
      .maybeSingle();

    if (slugError) {
      setError('Greška pri provjeri dostupnosti sluga.');
      return;
    }

    if (existingSlug) {
      setError('Ovaj slug je već zauzet. Izaberite drugi.');
      return;
    }

    setSaving(true);

    try {
      let newLogoUrl = logoUrl;

      if (logoFile) {
        const ext = logoFile.name.split('.').pop() || 'jpg';
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('firm-logos')
          .upload(path, logoFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          setError('Greška pri otpremanju logotipa. Provjerite da li je bucket omogućen.');
          setSaving(false);
          return;
        }

        const { data: publicUrl } = supabase.storage.from('firm-logos').getPublicUrl(path);
        newLogoUrl = publicUrl.publicUrl;
      } else if (logoPreview === null) {
        newLogoUrl = null;
      }

      const { error: updateError } = await supabase
        .from('firms')
        .update({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim() || null,
          city: city.trim() || null,
          phone: phone.trim() || null,
          email: email.trim() || null,
          registration_number: registrationNumber.trim() || null,
          founded_at: foundedAt || null,
          logo_url: newLogoUrl,
        })
        .eq('id', firm.id);

      if (updateError) {
        setError('Greška pri spremanju profila.');
        setSaving(false);
        return;
      }

      await supabase.from('firm_categories').delete().eq('firm_id', firm.id);

      if (selectedCategories.length > 0) {
        const rows = selectedCategories.map((slug) => ({
          firm_id: firm.id,
          category_slug: slug,
        }));
        const { error: catError } = await supabase.from('firm_categories').insert(rows);
        if (catError) {
          setError('Profil je spremljen, ali kategorije nisu ažurirane.');
          setSaving(false);
          return;
        }
      }

      setLogoUrl(newLogoUrl);
      setLogoFile(null);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Došlo je do neočekivane greške.');
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || (!user && !isFirmRole(role))) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <DashboardHeader
            label="Profil firme"
            title="Upravljanje profilom"
            email={user?.email || ''}
            actions={
              <Link
                href="/dashboard/firma/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-ink-700 text-steel dark:text-steel hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-ink-800 hover:border-gray-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Nazad na dashboard
              </Link>
            }
          />

          <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-card border border-gray-100 dark:border-ink-800 p-6 sm:p-8">

            {success && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Profil je uspješno ažuriran.
                </div>
                <Link
                  href={`/firma-profil/${slug}/`}
                  className="text-brand-orange font-medium hover:underline"
                >
                  Pogledaj javni profil
                </Link>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error && !firm ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Profil nije pronađen</h2>
                <p className="text-steel">{error}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Naziv firme</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (slug === slugify(name)) setSlug(slugify(e.target.value));
                      }}
                      className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="Naziv firme"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    URL slug
                    <span className="text-steel font-normal ml-1">(npr. moja-firma)</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="slug"
                      required
                    />
                  </div>
                  <p className="text-xs text-steel mt-1">
                    Profil će biti dostupan na /firma-profil/{slug || 'slug'}/
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Opis</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-steel" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
                      placeholder="Opisite vašu firmu i usluge..."
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Grad</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Npr. Sarajevo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="+387 61 123 456"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-cloud rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-orange" />
                    Poslovni podaci
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Registracijski broj</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                        <input
                          type="text"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          placeholder="npr. 12345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Datum osnivanja</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                        <input
                          type="date"
                          value={foundedAt}
                          onChange={(e) => setFoundedAt(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cloud border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="firma@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Logotip</label>
                  <p className="text-xs text-steel mb-3">Maksimalno 2MB, formati: JPG, PNG, WEBP.</p>
                  <div className="relative inline-block">
                    <LogoDisplay
                      name={name || 'Firma'}
                      src={logoPreview}
                      alt={`Logotip firme ${name || ''}`}
                      size="xl"
                      rounded="xl"
                    />
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                      </div>
                    )}
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 p-1 bg-white border border-gray-100 rounded-full text-steel hover:text-red-500 shadow-sm"
                        aria-label="Ukloni logotip"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-cloud border border-gray-200 border-dashed rounded-xl text-sm text-steel hover:text-gray-900 hover:border-brand-orange transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {logoPreview ? 'Promijeni logotip' : 'Dodaj logotip'}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoChange}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Portfolio fotografije</label>
                  <p className="text-xs text-steel mb-3">Dodajte fotografije vaših radova. Maksimalno 2MB po fotografiji.</p>

                  <input
                    ref={portfolioInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handlePortfolioChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => portfolioInputRef.current?.click()}
                    disabled={uploadingPortfolio}
                    className="flex items-center gap-2 px-4 py-3 bg-cloud border border-gray-200 border-dashed rounded-xl text-sm text-steel hover:text-gray-900 hover:border-brand-orange transition-colors disabled:opacity-50"
                  >
                    {uploadingPortfolio ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Upload...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" /> Dodaj fotografije
                      </>
                    )}
                  </button>

                  {portfolioImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                      {portfolioImages.map((img, index) => (
                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                          <NextImage
                            src={img.image_url}
                            alt={`Portfolio firme ${name || ''} - fotografija ${index + 1}`}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 33vw, 25vw"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => deletePortfolioImage(img.id)}
                            disabled={deletingPortfolioId === img.id}
                            className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-steel hover:text-red-500 shadow-sm disabled:opacity-50"
                            aria-label="Ukloni fotografiju"
                          >
                            {deletingPortfolioId === img.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Kategorije</label>
                  <p className="text-xs text-steel mb-3">Označite kategorije koje pokrivate. Obavještenja možete podesiti na dashboardu.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const selected = selectedCategories.includes(category.slug);
                      return (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() => toggleCategory(category.slug)}
                          className={`flex items-center gap-3 text-left rounded-xl border p-4 transition-colors ${
                            selected
                              ? 'bg-orange-50/50 border-brand-orange'
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

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Spremanje...' : 'Spremi promjene'}
                  </button>
                  <Link
                    href="/dashboard/firma/"
                    className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-steel hover:text-gray-900 hover:bg-cloud transition-colors"
                  >
                    Odustani
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
