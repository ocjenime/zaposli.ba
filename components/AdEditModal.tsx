'use client';

import { useRef, useState } from 'react';
import {
  X, Loader2, AlertCircle, Check, Upload, Trash2, Sparkles, Users, ImageIcon, Phone,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { resizeAndCompressImage, blobToFile } from '@/lib/image-utils';
import { removeAdBannerFile } from '@/lib/ad-storage';

export interface EditableAd {
  id: string;
  firm_id: string;
  title: string;
  description: string;
  banner_url: string | null;
  image_url?: string | null;
  ad_type: 'promotion' | 'worker_search';
  destination: 'homepage' | 'homepage_banner' | 'listing' | null;
  amount: number;
  status: 'pending' | 'active' | 'expired' | 'rejected';
  source: 'included' | 'paid';
  show_phone?: boolean | null;
}

interface AdEditModalProps {
  ad: EditableAd;
  onClose: () => void;
  onSaved: () => void;
}

function destinationLabel(d: EditableAd['destination']): string {
  if (d === 'homepage_banner') return 'Homepage banner';
  if (d === 'listing') return 'Svi oglasi';
  return 'Homepage mini';
}

  async function removeOldBanner(oldUrl: string | null) {
    await removeAdBannerFile(supabase, oldUrl);
  }

export default function AdEditModal({ ad, onClose, onSaved }: AdEditModalProps) {
  const [title, setTitle] = useState(ad.title);
  const [description, setDescription] = useState(ad.description);
  const [adType, setAdType] = useState<'promotion' | 'worker_search'>(ad.ad_type);
  const [showPhone, setShowPhone] = useState(ad.show_phone !== false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(ad.banner_url);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Slika može biti najviše 5MB.');
      return;
    }
    setError('');
    try {
      const normalizedBlob = await resizeAndCompressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
        type: 'image/jpeg',
      });
      const normalizedFile = blobToFile(normalizedBlob, 'banner.jpg', 'image/jpeg');
      setBannerFile(normalizedFile);
      setBannerPreview(URL.createObjectURL(normalizedFile));
    } catch {
      setError('Slika se ne može pročitati. Molimo koristite JPG ili PNG fotografiju.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function uploadBanner(): Promise<string | null> {
    if (!bannerFile) return bannerPreview;
    const ext = 'jpg';
    const path = `promoted-ads-banners/${ad.firm_id}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('job-images').upload(path, bannerFile);
    if (uploadErr) throw uploadErr;
    const { data } = supabase.storage.from('job-images').getPublicUrl(path);
    return data.publicUrl;
  }

  function validate(): boolean {
    if (!title.trim()) {
      setError('Unesite naslov oglasa.');
      return false;
    }
    if (!description.trim() || description.trim().length < 20) {
      setError('Opis mora imati najmanje 20 znakova.');
      return false;
    }
    if (!bannerPreview) {
      setError('Dodajte sliku oglasa.');
      return false;
    }
    return true;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const oldUrl = ad.banner_url;
      const bannerUrl = await uploadBanner();
      if (bannerFile && oldUrl !== bannerUrl) {
        await removeOldBanner(oldUrl);
      }
      const { error: updateErr } = await supabase
        .from('promoted_ads')
        .update({
          title: title.trim(),
          description: description.trim(),
          banner_url: bannerUrl,
          ad_type: adType,
          show_phone: showPhone,
          status: 'pending',
          starts_at: null,
          ends_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ad.id);
      if (updateErr) throw updateErr;
      setSuccess('Izmjene spremljene. Oglas je vraćen na odobrenje admina.');
      onSaved();
      setTimeout(onClose, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom spremanja.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Jeste li sigurni da želite obrisati oglas "${ad.title}"? Ova akcija je nepovratna.`)) return;
    setDeleting(true);
    setError('');
    try {
      await removeOldBanner(ad.banner_url);
      const { error: deleteErr } = await supabase.from('promoted_ads').delete().eq('id', ad.id);
      if (deleteErr) throw deleteErr;
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom brisanja.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 sm:rounded-2xl rounded-t-2xl w-full max-w-lg sm:max-h-[90vh] h-[92vh] sm:h-auto overflow-y-auto border-t sm:border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uredi oglas</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5 text-steel" />
            </button>
          </div>
          <p className="text-xs text-steel dark:text-gray-400 mb-5">
            Pozicija: <strong>{destinationLabel(ad.destination)}</strong> (zaključana) · Spremanjem se
            oglas vraća na odobrenje admina.
          </p>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-4">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Slika oglasa
              </label>
              {bannerPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-ink-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerPreview} alt="Banner" className="w-full max-h-56 object-contain" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" /> Promijeni sliku
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-2xl border-2 border-dashed border-gray-200 text-steel hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  <Upload className="w-7 h-7" />
                  <span className="text-sm font-medium">Dodaj sliku (max 5MB)</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Naslov oglasa
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Opis (min 20 znakova)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-cloud dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Tip oglasa
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdType('promotion')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    adType === 'promotion'
                      ? 'border-brand-orange bg-orange-50 text-brand-orange'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Promocija
                </button>
                <button
                  type="button"
                  onClick={() => setAdType('worker_search')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    adType === 'worker_search'
                      ? 'border-brand-orange bg-orange-50 text-brand-orange'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4" /> Tražim radnike
                </button>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Vidljivost broja telefona
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showPhone}
                onClick={() => setShowPhone((v) => !v)}
                className="w-full flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    showPhone ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                      showPhone ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <Phone className="w-4 h-4 text-green-600" />
                  {showPhone ? 'Broj je vidljiv - klijenti mogu zvati' : 'Broj je sakriven'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sačuvaj izmjene'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-steel hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Obriši oglas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
