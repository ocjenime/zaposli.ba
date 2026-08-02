'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { categories } from '@/lib/data';
import {
  X, Loader2, AlertCircle, Check, Building2, Globe, FileText,
  MapPin, Phone, Mail, Upload, Star,
} from 'lucide-react';

export interface AdminFirm {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  description: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
}

interface FirmEditModalProps {
  firm: AdminFirm | null;
  onClose: () => void;
  onSaved: () => void;
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

export default function FirmEditModal({ firm, onClose, onSaved }: FirmEditModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!firm) return;
    setName(firm.name);
    setSlug(firm.slug);
    setDescription(firm.description || '');
    setCity(firm.city || '');
    setPhone(firm.phone || '');
    setEmail(firm.email || '');
    setVerified(firm.verified);
    setLogoUrl(firm.logo_url);
    setLogoPreview(firm.logo_url);
    setLogoFile(null);
    setError('');
    setSuccess('');
    loadFirmCategories(firm.id);
  }, [firm]);

  async function loadFirmCategories(firmId: string) {
    setLoadingCategories(true);
    const { data, error: err } = await supabase
      .from('firm_categories')
      .select('category_slug')
      .eq('firm_id', firmId);
    setLoadingCategories(false);
    if (err) {
      setError('Greška pri učitavanju kategorija.');
      return;
    }
    setSelectedCategories((data || []).map((c: any) => c.category_slug));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setError('');
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Dozvoljeni formati logotipa: JPG, PNG, WEBP.');
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Logotip mora biti manji od 2MB.');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firm) return;

    setSaving(true);
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Unesite naziv firme.');
      setSaving(false);
      return;
    }
    if (!slug.trim()) {
      setError('Unesite slug profila.');
      setSaving(false);
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
      setSaving(false);
      return;
    }
    if (existingSlug) {
      setError('Ovaj slug je već zauzet. Izaberite drugi.');
      setSaving(false);
      return;
    }

    try {
      let newLogoUrl = logoUrl;

      if (logoFile) {
        const ext = logoFile.name.split('.').pop() || 'jpg';
        const path = `${firm.owner_id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('firm-logos')
          .upload(path, logoFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          setError('Greška pri otpremanju logotipa.');
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
          verified,
          logo_url: newLogoUrl,
        })
        .eq('id', firm.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      const { error: deleteCatError } = await supabase
        .from('firm_categories')
        .delete()
        .eq('firm_id', firm.id);

      if (deleteCatError) {
        setError('Greška pri ažuriranju kategorija.');
        setSaving(false);
        return;
      }

      if (selectedCategories.length > 0) {
        const rows = selectedCategories.map((slug) => ({ firm_id: firm.id, category_slug: slug }));
        const { error: catError } = await supabase.from('firm_categories').insert(rows);
        if (catError) {
          setError('Profil je spremljen, ali kategorije nisu ažurirane.');
          setSaving(false);
          return;
        }
      }

      setLogoUrl(newLogoUrl);
      setLogoFile(null);
      setSuccess('Profil firme je uspješno ažuriran.');
      onSaved();
    } catch (err: any) {
      setError(err?.message || 'Došlo je do neočekivane greške.');
    } finally {
      setSaving(false);
    }
  }

  if (!firm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uredi firmu</h2>
              <p className="text-sm text-steel dark:text-gray-400">{firm.name}</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setVerified((v) => !v)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  verified
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                    : 'bg-cloud dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                {verified ? <Check className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                {verified ? 'Verifikovana firma' : 'Nije verifikovana'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Naziv firme</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (slug === slugify(name)) setSlug(slugify(e.target.value));
                  }}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="Naziv firme"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                URL slug <span className="text-steel font-normal">(npr. moja-firma)</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="slug"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Opis</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-steel" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
                  placeholder="Opišite firmu i usluge..."
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Grad</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    placeholder="Npr. Sarajevo"
                  />
                </div>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="firma@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Logotip</label>
              <p className="text-xs text-steel dark:text-gray-500 mb-3">Maksimalno 2MB, formati: JPG, PNG, WEBP.</p>
              {logoPreview ? (
                <div className="relative inline-block rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <img src={logoPreview} alt={`Logotip firme ${name || ''}`} className="w-32 h-32 object-cover" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute top-2 right-2 p-1 bg-[#ffffff]/90 rounded-full text-steel hover:text-red-500 shadow-sm"
                    aria-label="Ukloni logotip"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl text-sm text-steel dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-brand-orange transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Dodaj logotip
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Kategorije
                {loadingCategories && <Loader2 className="w-3.5 h-3.5 inline ml-2 animate-spin" />}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const selected = selectedCategories.includes(category.slug);
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => toggleCategory(category.slug)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-colors ${
                        selected
                          ? 'bg-brand-orange text-[#ffffff] border-brand-orange'
                          : 'bg-cloud dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-brand-orange'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {category.name}
                    </button>
                  );
                })}
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
        </div>
      </div>
    </div>
  );
}
