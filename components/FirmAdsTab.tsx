'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Subscription, getFeaturedAdsUsedThisMonth, getIncludedAdsRemaining } from '@/lib/subscriptions';
import {
  Megaphone,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Crown,
  Zap,
  Users,
  Sparkles,
  Upload,
  X,
  Home,
  Monitor,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Eye,
  Wallet,
  ImageIcon,
} from 'lucide-react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/date';

const HOMEPAGE_MINI_PRICE = 19;
const HOMEPAGE_BANNER_PRICE = 49;
const LISTING_AD_PRICE = 5;

type Destination = 'homepage' | 'homepage_banner' | 'listing';
type AdType = 'promotion' | 'worker_search';

interface PromotedAd {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  banner_url: string | null;
  cta_url: string | null;
  ad_type: AdType;
  destination: Destination | null;
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

const destinationMeta: Record<
  Destination,
  {
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    price: number;
    aspect: string;
    aspectClass: string;
    dimensions: string;
    description: string;
  }
> = {
  homepage: {
    label: 'Homepage mini oglas',
    shortLabel: 'Homepage mini',
    icon: Home,
    price: HOMEPAGE_MINI_PRICE,
    aspect: '16:10',
    aspectClass: 'aspect-[16/10]',
    dimensions: '640 × 400 px',
    description: 'Istaknuto mjesto u homepage traci sponzorisanih oglasa.',
  },
  homepage_banner: {
    label: 'Homepage banner',
    shortLabel: 'Homepage banner',
    icon: Monitor,
    price: HOMEPAGE_BANNER_PRICE,
    aspect: '3:1',
    aspectClass: 'aspect-[3/1]',
    dimensions: '1200 × 400 px',
    description: 'Veliki hero banner na vrhu homepage-a. Najveća vidljivost.',
  },
  listing: {
    label: 'Oglas na stranici svih oglasa',
    shortLabel: 'Svi oglasi',
    icon: LayoutGrid,
    price: LISTING_AD_PRICE,
    aspect: '3:1',
    aspectClass: 'aspect-[3/1]',
    dimensions: '900 × 300 px',
    description: 'Prikazuje se u galeriji na /izdvojeni-oglasi/.',
  },
};

export default function FirmAdsTab({ firmId, subscription }: FirmAdsTabProps) {
  const [ads, setAds] = useState<PromotedAd[]>([]);
  const [adsUsed, setAdsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adType, setAdType] = useState<AdType>('promotion');

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const [destination, setDestination] = useState<Destination>(() => {
    const d = searchParams.get('destination');
    return d === 'listing' ? 'listing' : d === 'homepage_banner' ? 'homepage_banner' : 'homepage';
  });

  const includedRemaining = getIncludedAdsRemaining(subscription, adsUsed);
  const hasPaidPlan = !!subscription?.plans && (subscription.plans.price_monthly ?? 0) > 0;
  const isHomepageMini = destination === 'homepage';
  const isHomepageBanner = destination === 'homepage_banner';
  const isListing = destination === 'listing';
  const canUseIncluded = isHomepageMini && includedRemaining > 0;
  const isFreeListing = isListing && hasPaidPlan;

  const effectivePrice = isHomepageMini
    ? HOMEPAGE_MINI_PRICE
    : isHomepageBanner
    ? HOMEPAGE_BANNER_PRICE
    : LISTING_AD_PRICE;

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

  async function uploadBanner(): Promise<string | null> {
    if (!banner) return null;
    return uploadFile(banner, 'promoted-ads-banners');
  }

  function validateStep(currentStep: number): boolean {
    setError('');
    if (currentStep === 2) {
      if (!title.trim()) {
        setError('Unesite naslov oglasa.');
        return false;
      }
      if (!description.trim() || description.trim().length < 20) {
        setError('Opis mora imati najmanje 20 znakova.');
        return false;
      }
    }
    if (currentStep === 3 && !banner) {
      setError('Dodajte vizual za oglas.');
      return false;
    }
    return true;
  }

  function nextStep() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 4));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function submitAd() {
    if (!validateStep(2) || !banner) {
      setStep(banner ? 2 : 3);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const bannerUrl = await uploadBanner();
      let source: 'included' | 'paid' = canUseIncluded ? 'included' : 'paid';
      let amount = canUseIncluded ? 0 : effectivePrice;
      if (isFreeListing) {
        source = 'paid';
        amount = 0;
      }

      const { error: insertErr } = await supabase.from('promoted_ads').insert({
        firm_id: firmId,
        title: title.trim(),
        description: description.trim(),
        banner_url: bannerUrl,
        ad_type: adType,
        destination,
        amount,
        status: 'pending',
        source,
      });

      if (insertErr) throw insertErr;

      setTitle('');
      setDescription('');
      setAdType('promotion');
      removeBanner();
      setStep(1);

      if (canUseIncluded) {
        setSuccess('Oglas je poslan na odobrenje (uključen u paket).');
      } else if (isFreeListing) {
        setSuccess('Oglas je poslan na odobrenje. Besplatan je jer imate plaćeni paket.');
      } else {
        const place = isListing ? 'stranici svih oglasa' : isHomepageBanner ? 'homepage banner poziciji' : 'homepage-u';
        setSuccess(`Oglas je poslan na odobrenje. Nakon odobrenja plaćate ${amount} KM za prikaz na ${place}.`);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška prilikom slanja oglasa.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-steel">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje...
      </div>
    );
  }

  const meta = destinationMeta[destination];
  const finalPrice = canUseIncluded || isFreeListing ? 0 : effectivePrice;
  const priceLabel = canUseIncluded
    ? 'Uključen u paket'
    : isFreeListing
    ? 'Besplatno'
    : `${finalPrice} KM`;

  return (
    <section className="animate-fade-in space-y-6">
      {/* Top stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-steel">Trenutni paket</p>
              <p className="font-bold text-gray-900 dark:text-white">{subscription?.plans?.name || 'Besplatno'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-steel">Uključeni homepage mini ovaj period</p>
              <p className="font-bold text-gray-900 dark:text-white">{includedRemaining} preostalo</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-steel">Najpopularnija pozicija</p>
              <p className="font-bold text-gray-900 dark:text-white">Homepage banner 49 KM/mj</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Wizard */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-sm overflow-hidden">
        {/* Stepper header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            {['Pozicija', 'Sadržaj', 'Vizual', 'Pregled'].map((label, idx) => {
              const stepNumber = idx + 1;
              const active = step === stepNumber;
              const done = step > stepNumber;
              return (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${
                      done
                        ? 'bg-green-500 text-white'
                        : active
                        ? 'bg-brand-orange text-white'
                        : 'bg-gray-100 dark:bg-ink-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {done ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative h-1 bg-gray-100 dark:bg-ink-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-brand-orange transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Odaberite poziciju oglasa</h3>
                <p className="text-sm text-steel">Svaka pozicija ima drugačiju vidljivost i cijenu.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {(Object.keys(destinationMeta) as Destination[]).map((key) => {
                  const d = destinationMeta[key];
                  const Icon = d.icon;
                  const selected = destination === key;
                  const isListingFree = key === 'listing' && hasPaidPlan;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDestination(key)}
                      className={`relative text-left rounded-2xl border p-5 transition-all ${
                        selected
                          ? 'border-brand-orange bg-orange-50 dark:bg-orange-500/10 ring-1 ring-brand-orange'
                          : 'border-gray-200 dark:border-ink-700 hover:border-gray-300 dark:hover:border-ink-600 bg-white dark:bg-ink-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selected ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-ink-800 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${selected ? 'text-brand-orange' : 'text-gray-900 dark:text-white'}`}>
                            {d.shortLabel}
                          </p>
                          <p className="text-xs text-steel">Omjer {d.aspect}</p>
                        </div>
                      </div>
                      <p className="text-xs text-steel mb-3">{d.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-steel">Preporučene dimenzije:</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{d.dimensions}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-ink-800 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {isListingFree ? 'Besplatno' : key === 'homepage' && includedRemaining > 0 ? `0 KM (još ${includedRemaining})` : `${d.price} KM`}
                        </span>
                        <span className="text-xs text-steel">
                          {key === 'homepage' ? '/ mjesečno' : key === 'homepage_banner' ? '/ mjesečno' : '/ oglas'}
                        </span>
                      </div>
                      {selected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sadržaj oglasa</h3>
                <p className="text-sm text-steel">Napišite jasnu ponudu ili potrebu koja privlači klikove.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Tip oglasa</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdType('promotion')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                      adType === 'promotion'
                        ? 'border-brand-orange bg-orange-50 text-brand-orange'
                        : 'border-gray-200 dark:border-ink-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> Promocija firme
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdType('worker_search')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                      adType === 'worker_search'
                        ? 'border-brand-orange bg-orange-50 text-brand-orange'
                        : 'border-gray-200 dark:border-ink-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-800'
                    }`}
                  >
                    <Users className="w-4 h-4" /> Tražim radnike
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Naslov oglasa</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={adType === 'promotion' ? 'npr. Kvalitetne adaptacije stanova' : 'npr. Tražimo majstore za ekipu'}
                  className="w-full rounded-xl border border-gray-200 dark:border-ink-700 px-4 py-3 text-sm bg-white dark:bg-ink-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Opis</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Opišite ponudu ili potrebu..."
                  className="w-full rounded-xl border border-gray-200 dark:border-ink-700 px-4 py-3 text-sm bg-white dark:bg-ink-900 text-gray-900 dark:text-white resize-none"
                />
                <p className="text-xs text-steel mt-1.5">Minimum 20 znakova.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dodajte vizual</h3>
                <p className="text-sm text-steel">
                  Za <strong>{meta.label}</strong> preporučujemo{' '}
                  <strong className="text-gray-900 dark:text-white">{meta.dimensions}</strong> (omjer {meta.aspect}).
                </p>
              </div>

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
                  className="w-full flex flex-col items-center justify-center gap-2 px-4 py-10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-ink-700 text-steel hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  <Upload className="w-8 h-8" />
                  <span className="text-sm font-medium">Kliknite da dodate banner</span>
                  <span className="text-xs text-steel">
                    Preporučeno: {meta.dimensions} · max 5MB · JPG, PNG ili WebP
                  </span>
                </button>
              ) : (
                <div className={`relative rounded-2xl overflow-hidden border border-gray-200 dark:border-ink-700 ${meta.aspectClass}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pregled i plaćanje</h3>
                <p className="text-sm text-steel">Provjerite detalje prije slanja na odobrenje.</p>
              </div>

              <div className="rounded-2xl border border-gray-100 dark:border-ink-800 bg-gray-50 dark:bg-ink-900/50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-steel">Pozicija</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <meta.icon className="w-4 h-4 text-brand-orange" />
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-steel">Tip</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {adType === 'promotion' ? 'Promocija firme' : 'Tražim radnike'}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-ink-800 pt-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</p>
                  <p className="text-sm text-steel line-clamp-3">{description}</p>
                </div>
                {bannerPreview && (
                  <div className={`relative rounded-xl overflow-hidden ${meta.aspectClass}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-ink-800 pt-4">
                  <span className="text-sm text-steel">Cijena</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{priceLabel}</span>
                </div>
                {!canUseIncluded && !isFreeListing && (
                  <p className="text-xs text-steel flex items-start gap-2">
                    <Wallet className="w-4 h-4 shrink-0" />
                    Nakon odobrenja oglasa od strane admina, dobijate uputstvo za uplatu {effectivePrice} KM. Oglas postaje aktivan nakon potvrde uplate.
                  </p>
                )}
              </div>

              <button
                onClick={submitAd}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                {canUseIncluded
                  ? 'Pošalji oglas (uključen u paket)'
                  : isFreeListing
                  ? 'Pošalji oglas (besplatno)'
                  : `Pošalji oglas i zatraži uputstvo za plaćanje`}
              </button>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-ink-800 flex items-center justify-between bg-gray-50/50 dark:bg-ink-900/30">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-steel hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Nazad
          </button>
          {step < 4 && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Dalje <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Ads list */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-ink-800 flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-orange" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vaši oglasi</h3>
        </div>
        {ads.length === 0 ? (
          <p className="p-6 text-sm text-steel text-center">Još nemate oglasa. Kreirajte prvi iznad.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-ink-800">
            {ads.map((ad) => (
              <div key={ad.id} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {ad.banner_url && (
                    <div className="relative w-full sm:w-40 h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-ink-800 shrink-0">
                      <NextImage
                        src={ad.banner_url}
                        alt={ad.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">{ad.title}</p>
                      {ad.status === 'pending' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">NA ČEKANJU</span>
                      )}
                      {ad.status === 'active' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">AKTIVAN</span>
                      )}
                      {ad.status === 'expired' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">ISTEKAO</span>
                      )}
                      {ad.status === 'rejected' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">ODBIJEN</span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ad.source === 'included'
                            ? 'bg-blue-100 text-blue-700'
                            : ad.amount === 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-brand-orange/10 text-brand-orange'
                        }`}
                      >
                        {ad.source === 'included' ? 'Uključen u paket' : ad.amount === 0 ? 'Besplatan' : `Plaćeno ${ad.amount} KM`}
                      </span>
                      {ad.destination && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {ad.destination === 'homepage'
                            ? 'Homepage mini'
                            : ad.destination === 'homepage_banner'
                            ? 'Homepage banner'
                            : 'Svi oglasi'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-steel line-clamp-2">{ad.description}</p>
                    <p className="text-xs text-steel mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ad.status === 'pending'
                        ? 'Čeka odobrenje admina'
                        : ad.ends_at
                        ? `Vrijedi do ${formatDate(ad.ends_at)}`
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
