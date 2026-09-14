'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Subscription, getFeaturedAdsUsedThisMonth, getIncludedAdsRemaining } from '@/lib/subscriptions';
import { Megaphone, Loader2, CheckCircle, Clock, AlertCircle, Crown, Zap, Users, Sparkles, Upload, X, ImageIcon } from 'lucide-react';
import NextImage from 'next/image';

const PAID_AD_PRICE = 49;

interface PromotedAd {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  banner_url: string | null;
  cta_url: string | null;
  ad_type: 'promotion' | 'worker_search';
  amount: number;
  status: 'pending' | 'active' | 'expired' | 'rejected';
  source: 'included' | 'paid';
  created_at: string;
  ends_at: string | null;
}

interface FirmAdsTabProps {
  firmId: string;
  subscription: Subscription | null;
}

export default function FirmAdsTab({ firmId, subscription }: FirmAdsTabProps) {
  const [ads, setAds] = useState<PromotedAd[]>([]);
  const [adsUsed, setAdsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adType, setAdType] = useState<'promotion' | 'worker_search'>('promotion');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const includedRemaining = getIncludedAdsRemaining(subscription, adsUsed);
  const canUseIncluded = includedRemaining > 0;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usedCount, adsData] = await Promise.all([
        getFeaturedAdsUsedThisMonth(firmId, subscription),
        supabase
          .from('promoted_ads')
          .select('*')
          .eq('firm_id', firmId)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);
      setAdsUsed(usedCount);
      setAds((adsData.data || []) as unknown as PromotedAd[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom učitavanja.');
    } finally {
      setLoading(false);
    }
  }, [firmId, subscription]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Slika može biti najviše 5MB.');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  }

  function removeImage() {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Banner može biti najviše 5MB.');
      return;
    }
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
    setError('');
  }

  function removeBanner() {
    setBanner(null);
    setBannerPreview(null);
    if (bannerInputRef.current) bannerInputRef.current.value = '';
  }

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${folder}/${firmId}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('job-images').upload(path, file);
    if (uploadErr) throw uploadErr;
    const { data } = supabase.storage.from('job-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function uploadImage(): Promise<string | null> {
    if (!image) return null;
    return uploadFile(image, 'promoted-ads');
  }

  async function uploadBanner(): Promise<string | null> {
    if (!banner) return null;
    return uploadFile(banner, 'promoted-ads-banners');
  }

  async function submitAd() {
    if (!title.trim() || !description.trim()) {
      setError('Unesite naslov i opis oglasa.');
      return;
    }
    if (description.trim().length < 20) {
      setError('Opis mora imati najmanje 20 znakova.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const [imageUrl, bannerUrl] = await Promise.all([uploadImage(), uploadBanner()]);
      const source = canUseIncluded ? 'included' : 'paid';
      const amount = source === 'included' ? 0 : PAID_AD_PRICE;

      const { error: insertErr } = await supabase.from('promoted_ads').insert({
        firm_id: firmId,
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl,
        banner_url: bannerUrl,
        ad_type: adType,
        amount,
        status: 'pending',
        source,
      });

      if (insertErr) throw insertErr;

      setTitle('');
      setDescription('');
      setAdType('promotion');
      removeImage();
      removeBanner();
      setSuccess(
        source === 'included'
          ? 'Oglas je poslan na odobrenje (uključen u paket).'
          : `Oglas je poslan na odobrenje. Nakon odobrenja plaćate ${PAID_AD_PRICE} KM.`
      );
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom slanja oglasa.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/70">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje...
      </div>
    );
  }

  return (
    <section className="animate-fade-in space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-ink-900/60 rounded-2xl border border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-white/70">Trenutni paket</p>
              <p className="font-bold text-white">{subscription?.plans?.name || 'Besplatno'}</p>
            </div>
          </div>
        </div>
        <div className="bg-ink-900/60 rounded-2xl border border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-white/70">Uključeni oglasi ovaj mjesec</p>
              <p className="font-bold text-white">{includedRemaining} preostalo</p>
            </div>
          </div>
        </div>
        <div className="bg-ink-900/60 rounded-2xl border border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-white/70">Cijena jednog oglasa</p>
              <p className="font-bold text-white">{PAID_AD_PRICE} KM</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="bg-ink-900/60 rounded-2xl border border-ink-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-white mb-1">Kreirajte novi oglas</h3>
        <p className="text-sm text-white/70 mb-5">
          Promovirajte svoju firmu/majstorstvo ili objavite da tražite radnike. Oglas ide na odobrenje admina prije objave.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Tip oglasa</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdType('promotion')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  adType === 'promotion'
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-ink-700 text-white/50 hover:bg-ink-800'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Promocija firme
              </button>
              <button
                type="button"
                onClick={() => setAdType('worker_search')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  adType === 'worker_search'
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-ink-700 text-white/50 hover:bg-ink-800'
                }`}
              >
                <Users className="w-4 h-4" /> Tražim radnike
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Naslov oglasa</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={adType === 'promotion' ? 'npr. Kvalitetne adaptacije stanova' : 'npr. Tražimo majstore za ekipu'}
              className="w-full rounded-xl border border-ink-700 px-4 py-3 text-sm bg-ink-900/60 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Opišite ponudu ili potrebu..."
              className="w-full rounded-xl border border-ink-700 px-4 py-3 text-sm bg-ink-900/60 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Banner oglasa
            </label>
            <p className="text-xs text-white/70 mb-2">
              Preporučene dimenzije: <strong>1200 × 400 px</strong> (omjer 3:1), visoka kvaliteta, max 5MB.
              Savršeno se prikazuje na homepage traci i stranici izdvojenih oglasa.
            </p>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleBannerChange}
              className="hidden"
            />
            {!bannerPreview ? (
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-ink-700 text-white/70 hover:border-brand-orange hover:text-brand-orange transition-colors"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">Kliknite da dodate banner (max 5MB)</span>
                <span className="text-xs text-white/70">1200 × 400 px preporučeno</span>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-ink-700 aspect-[3/1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={submitAd}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
            {canUseIncluded ? 'Pošalji oglas (uključen u paket)' : `Pošalji oglas (${PAID_AD_PRICE} KM)`}
          </button>
        </div>
      </div>

      <div className="bg-ink-900/60 rounded-2xl border border-ink-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-ink-800">
          <h3 className="text-lg font-bold text-white">Vaši oglasi</h3>
        </div>
        {ads.length === 0 ? (
          <p className="p-6 text-sm text-white/70 text-center">Još nemate oglasa. Kreirajte prvi iznad.</p>
        ) : (
          <div className="divide-y divide-ink-800">
            {ads.map((ad) => (
              <div key={ad.id} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {ad.image_url && (
                    <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden border border-ink-800 shrink-0">
                      <NextImage
                        src={ad.image_url}
                        alt={ad.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-white">{ad.title}</p>
                      {ad.status === 'pending' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full">NA ČEKANJU</span>
                      )}
                      {ad.status === 'active' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full">AKTIVAN</span>
                      )}
                      {ad.status === 'expired' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-ink-800 text-white/50 rounded-full">ISTEKAO</span>
                      )}
                      {ad.status === 'rejected' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full">ODBIJEN</span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ad.source === 'included' ? 'bg-blue-500/10 text-blue-400' : 'bg-brand-orange/10 text-brand-orange'}`}>
                        {ad.source === 'included' ? 'Uključen u paket' : `Plaćeno ${ad.amount} KM`}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-2">{ad.description}</p>
                    <p className="text-xs text-white/70 mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ad.status === 'pending'
                        ? 'Čeka odobrenje admina'
                        : ad.ends_at
                        ? `Vrijedi do ${new Date(ad.ends_at).toLocaleDateString('bs-BA')}`
                        : 'Aktivan'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
