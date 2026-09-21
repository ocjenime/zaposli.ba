'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { plural } from '@/lib/plural';
import Footer from '@/components/Footer';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getCategory } from '@/lib/data';
import { site } from '@/lib/site';
import Image from 'next/image';
import { formatDate, formatMonthYear } from '@/lib/date';
import { formatReviewerName } from '@/lib/reviewer-name';
import { JsonLd, localBusinessSchema } from '@/lib/jsonld';
import { isOnline, formatLastActive } from '@/lib/hooks/useFirmActivityHeartbeat';
import LogoDisplay from '@/components/ui/LogoDisplay';
import {
  MapPin,
  Star,
  ArrowRight,
  ChevronRight,
  Quote,
  AlertCircle,
  X,
  Hash,
  Calendar,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Receipt,
  List,
  Info,
  MessageCircle,
} from 'lucide-react';

interface ReviewerProfile {
  full_name: string | null;
}

interface ReviewRow {
  id: string;
  firm_id: string;
  client_id: string;
  rating: number;
  comment: string | null;
  image_url: string | null;
  reviewer_name?: string | null;
  images?: { url: string }[];
  status: 'pending' | 'approved' | 'rejected';
  reply: string | null;
  replied_at: string | null;
  created_at: string;
  profiles: ReviewerProfile | null;
}

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
  verification_notes: string | null;
  average_rating: number | null;
  review_count: number | null;
  registration_number: string | null;
  founded_at: string | null;
  last_active_at: string | null;
  created_at: string;
}

interface FirmCategoryRow {
  category_slug: string;
}

const TABS = [
  { id: 'pregled', label: 'Pregled' },
  { id: 'usluge', label: 'Usluge' },
  { id: 'o-firmi', label: 'O firmi' },
  { id: 'recenzije', label: 'Recenzije' },
];

export default function FirmProfileContent({ slug: propSlug }: { slug?: string }) {
  const searchParams = useSearchParams();
  const slug = propSlug || searchParams.get('slug') || '';
  const { user } = useAuth();

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [firmCategories, setFirmCategories] = useState<FirmCategoryRow[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pregled');
  const [showAllServices, setShowAllServices] = useState(false);

  const loadFirm = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      setError('Nedostaje naziv firme.');
      return;
    }

    try {
      const { data, error: firmError } = await supabase
        .from('firms')
        .select(
          'id, owner_id, name, slug, description, email, phone, city, logo_url, verified, verification_status, verification_notes, average_rating, review_count, registration_number, founded_at, last_active_at, created_at, reviews(id, firm_id, client_id, rating, comment, image_url, reviewer_name, status, reply, replied_at, created_at, profiles(full_name))'
        )
        .eq('slug', slug)
        .single();

      if (firmError || !data) {
        setError('Firma nije pronađena.');
        setLoading(false);
        return;
      }

      const typedFirm = data as unknown as FirmRow & { reviews: ReviewRow[] };
      setFirm(typedFirm);
      const approvedReviews = (typedFirm.reviews || []).filter((r) => r.status === 'approved');

      const reviewIds = approvedReviews.map((r) => r.id);
      let reviewImages: { review_id: string; url: string }[] = [];
      if (reviewIds.length > 0) {
        const { data: reviewImagesData, error: reviewImagesError } = await supabase
          .from('review_images')
          .select('review_id, url')
          .in('review_id', reviewIds);
        if (!reviewImagesError) {
          reviewImages = (reviewImagesData || []) as { review_id: string; url: string }[];
        }
      }

      setReviews(
        approvedReviews.map((r) => ({
          ...r,
          images: reviewImages.filter((img) => img.review_id === r.id),
        }))
      );

      const { data: catData } = await supabase
        .from('firm_categories')
        .select('category_slug')
        .eq('firm_id', typedFirm.id);

      setFirmCategories((catData as unknown as FirmCategoryRow[]) || []);

      const { data: portfolioData } = await supabase
        .from('portfolio_images')
        .select('image_url')
        .eq('firm_id', typedFirm.id)
        .order('created_at', { ascending: true });
      setPortfolioImages((portfolioData || []).map((row: { image_url: string }) => row.image_url));

      const { data: premiumData } = await supabase
        .from('public_firm_premium')
        .select('firm_id')
        .eq('firm_id', typedFirm.id)
        .maybeSingle();
      setIsPremium(!!premiumData);
    } catch (err) {
      setError('Došlo je do greške pri učitavanju profila.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Nedostaje naziv firme.');
      return;
    }
    loadFirm();
  }, [slug, loadFirm]);

  function formatYear(date: string | null) {
    if (!date) return null;
    return new Date(date).getFullYear().toString();
  }

  function ReviewReplyForm({
    reviewId,
    onReply,
  }: {
    reviewId: string;
    onReply: (id: string, reply: string) => void;
  }) {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [replyError, setReplyError] = useState('');

    async function submitReply(e: React.FormEvent) {
      e.preventDefault();
      if (!text.trim()) return;
      setSubmitting(true);
      setReplyError('');
      const trimmed = text.trim();
      const { error } = await supabase
        .from('reviews')
        .update({ reply: trimmed })
        .eq('id', reviewId);
      if (error) {
        setReplyError('Greška pri spremanju odgovora. Pokušajte ponovo.');
      } else {
        onReply(reviewId, trimmed);
      }
      setSubmitting(false);
    }

    return (
      <form onSubmit={submitReply} className="mt-4">
        <label htmlFor={`reply-${reviewId}`} className="sr-only">
          Vaš odgovor na recenziju
        </label>
        <textarea
          id={`reply-${reviewId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Napišite odgovor na ovu recenziju..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-steel">{text.length}/1000</span>
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-ink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Spremanje...' : 'Odgovori'}
          </button>
        </div>
        {replyError && (
          <p className="text-xs text-red-600 mt-2">{replyError}</p>
        )}
      </form>
    );
  }

  function PremiumBadge() {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full font-bold text-[11px] px-2.5 py-1 border border-purple-200/50 bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700"
        title="Aktivna premium pretplata sa istaknutim profilom."
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z"
            fill="url(#premium-gradient)"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="premium-gradient" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>
          </defs>
        </svg>
        Premium partner
      </span>
    );
  }

  const categoryNames = firmCategories
    .map((c) => getCategory(c.category_slug)?.name)
    .filter(Boolean) as string[];

  // Display values are derived from the actually loaded approved reviews first,
  // so the profile is correct even if the firms.average_rating / review_count
  // aggregate columns are stale (e.g. rating trigger not applied in production).
  const loadedCount = reviews.length;
  const loadedAvg =
    loadedCount > 0 ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / loadedCount : 0;
  const rating = loadedAvg > 0 ? loadedAvg : firm?.average_rating || 0;
  const reviewCount = loadedCount > 0 ? loadedCount : firm?.review_count || 0;
  const isFirmOwner = !!user && firm?.owner_id === user.id;
  const primaryCategory = firmCategories[0]
    ? getCategory(firmCategories[0].category_slug)
    : null;

  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const maxHistogramCount = Math.max(1, ...histogram.map((h) => h.count));

  function handleReviewReply(reviewId: string, reply: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, reply, replied_at: new Date().toISOString() } : r
      )
    );
  }

  function scrollToSection(id: string, tab: string) {
    setActiveTab(tab);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <div className="relative overflow-hidden bg-ink-950 min-h-[280px] animate-pulse" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 -mt-10 relative z-20 animate-pulse">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 -mt-14 mb-3" />
              <div className="h-7 w-2/3 bg-gray-100 rounded-xl mb-2" />
              <div className="h-4 w-1/3 bg-gray-100 rounded-lg mb-4" />
              <div className="h-12 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <Breadcrumbs items={[{ name: 'Profil firme' }]} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-brand-orange" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Profil nije pronađen
            </h1>
            <p className="text-steel mb-8">{error || 'Tražena firma ne postoji u našem sustavu.'}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/top-firme/"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Pogledaj top firme
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/objavi-projekat/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Objavi posao
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const onlineNow = isOnline(firm.last_active_at);
  const onlineText = onlineNow
    ? 'Online sada'
    : `Zadnji put online: ${formatLastActive(firm.last_active_at)}`;

  const visibleServices = showAllServices ? categoryNames : categoryNames.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <JsonLd
          data={localBusinessSchema({
            name: firm.name,
            specialty: categoryNames.length > 0 ? categoryNames.join(', ') : 'Razne usluge',
            location: firm.city || 'BiH',
            rating,
            reviews: reviewCount,
            url: `/firma-profil/${firm.slug}/`,
            image: firm.logo_url || `${site.url}/images/logo-mark.png`,
            telephone: firm.phone,
            email: firm.email,
            priceRange: primaryCategory?.priceRange || undefined,
          })}
        />
        <Breadcrumbs
          items={[
            { name: 'Top firme', href: '/top-firme/' },
            { name: firm.name },
          ]}
        />

        {/* Hero */}
        <section className="relative min-h-[280px] sm:min-h-[360px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/zafirme-hero.jpg"
              alt="Majstorski alat na gradilištu"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/40 to-ink-950/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-ink-950/15 to-ink-950/20" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-14 sm:pb-16">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1.5 animate-fade-in">
                  Pouzdani majstori
                  <br />
                  za svaki projekat.
                </h2>
                <p className="text-sm sm:text-base text-white/80 animate-fade-in">
                  Kvalitetni radovi. Zadovoljni klijenti.
                </p>
                <span className="block w-10 h-1 bg-brand-orange rounded-full mt-3 animate-fade-in" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* Profile card */}
        <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 px-5 pb-5 pt-0 sm:p-6 sm:pt-0">
              <div className="w-fit -mt-10 mb-3">
                <LogoDisplay
                  name={firm.name}
                  src={firm.logo_url}
                  alt={firm.name}
                  size="lg"
                  rounded="2xl"
                  className="border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {firm.name}
                </h1>
                {firm.verified && <VerifiedBadge size="md" showLabel={false} className="shrink-0" />}
              </div>

              {firm.city && (
                <p className="flex items-center gap-1.5 text-gray-500 text-sm sm:text-base mt-1">
                  <MapPin className="w-4 h-4" />
                  {firm.city}
                </p>
              )}

              {categoryNames.length > 0 && (
                <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed mt-1.5">
                  {categoryNames.slice(0, 6).join(', ')}
                  {categoryNames.length > 6 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection('usluge', 'usluge')}
                      className="text-brand-orange font-semibold whitespace-nowrap"
                    >
                      {' '}
                      +{categoryNames.length - 6} još
                    </button>
                  )}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {firm.verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100 text-brand-orange text-xs sm:text-sm font-bold px-3 py-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Provjerena firma
                  </span>
                )}
                {isPremium && <PremiumBadge />}
              </div>
              <p className="flex items-center gap-1.5 text-xs text-steel mt-2">
                <span
                  className={`w-2 h-2 rounded-full ${onlineNow ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}
                />
                {onlineText}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-brand-orange fill-brand-orange" />
                  <strong className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    {rating.toFixed(1)}
                  </strong>
                  <span className="text-sm text-gray-400">
                    ({reviewCount} {plural(reviewCount, ['recenzija', 'recenzije', 'recenzija'])})
                  </span>
                </span>
                {firm.city && (
                  <>
                    <span className="w-px h-6 bg-gray-200" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1.5 text-sm sm:text-base text-gray-500">
                      <MapPin className="w-4 h-4 text-brand-orange" />
                      {firm.city}
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-2.5 mt-4">
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-base rounded-xl px-6 py-3.5 transition-all active:scale-[0.99] shadow-lg shadow-brand-orange/25 min-h-[52px]"
                >
                  <Receipt className="w-5 h-5" />
                  Zatraži ponudu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}&ask=1`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 font-bold text-base rounded-xl px-6 py-3.5 transition-colors hover:bg-gray-50 min-h-[52px]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Pošalji poruku
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-12 md:top-16 z-30 bg-white/95 backdrop-blur border-b border-gray-100 mt-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-5 md:gap-7 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => scrollToSection(t.id, t.id)}
                className={`py-3 text-sm md:text-[15px] whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === t.id
                    ? 'font-bold text-brand-orange border-brand-orange'
                    : 'font-medium text-gray-400 border-transparent hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div id="pregled" className="scroll-mt-32" />

        {/* Usluge */}
        <section id="usluge" className="py-5 md:py-7 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-gray-900">
                  <List className="w-5 h-5" />
                  Usluge
                </h2>
                {categoryNames.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllServices((v) => !v)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange"
                  >
                    {showAllServices ? 'Prikaži manje' : 'Pogledaj sve'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {visibleServices.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {visibleServices.map((name) => (
                    <span
                      key={name}
                      className="bg-gray-100 text-gray-800 rounded-xl px-3 py-2.5 text-[13px] sm:text-sm font-medium leading-snug"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-steel">Firma još nije dodala usluge.</p>
              )}
            </div>
          </div>
        </section>

        {/* O firmi */}
        <section id="o-firmi" className="pb-5 md:pb-7 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-gray-900 mb-2">
                <Info className="w-5 h-5" />O firmi
              </h2>
              <p className="text-sm sm:text-[15px] text-steel leading-relaxed mb-4">
                {firm.description || 'Firma još nije dodala opis.'}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-gray-100 text-sm">
                {firm.city && (
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-steel">Grad</p>
                      <p className="font-bold text-gray-900 truncate">{firm.city}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-steel">Član od</p>
                    <p className="font-bold text-gray-900 truncate">
                      {formatMonthYear(firm.created_at) || '-'}
                    </p>
                  </div>
                </div>
                {firm.founded_at && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-steel">Osnovano</p>
                      <p className="font-bold text-gray-900 truncate">{formatYear(firm.founded_at)}</p>
                    </div>
                  </div>
                )}
                {firm.registration_number && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="w-4 h-4 text-brand-orange shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-steel">Reg. broj</p>
                      <p className="font-bold text-gray-900 truncate">{firm.registration_number}</p>
                    </div>
                  </div>
                )}
                {firm.phone && (
                  <a href={`tel:${firm.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 min-w-0">
                    <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-steel">Telefon</p>
                      <p className="font-bold text-gray-900 truncate">{firm.phone}</p>
                    </div>
                  </a>
                )}
                {firm.email && (
                  <a href={`mailto:${firm.email}`} className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-steel">Email</p>
                      <p className="font-bold text-gray-900 truncate">{firm.email}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio */}
        {portfolioImages.length > 0 && (
          <section className="pb-5 md:pb-7">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3">Portfolio</h2>
                <div className="grid grid-cols-3 gap-2">
                  {portfolioImages.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPortfolioImage(url)}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 hover:ring-2 hover:ring-brand-orange transition group"
                      aria-label={`Fotografija radova ${index + 1}`}
                    >
                      <Image
                        src={url}
                        alt={`Portfolio firme ${firm.name} - fotografija ${index + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recenzije */}
        <section id="recenzije" className="pb-10 md:pb-14 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Recenzije klijenata
                </h2>
                <span className="text-sm text-steel">
                  {reviewCount} {plural(reviewCount, ['recenzija', 'recenzije', 'recenzija'])}
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <p className="text-steel text-sm">Još nema recenzija za ovu firmu.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-4xl font-extrabold text-gray-900">{rating.toFixed(1)}</div>
                    <div className="flex-1">
                      <div className="flex gap-0.5 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(rating)
                                ? 'text-brand-orange fill-brand-orange'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="space-y-1">
                        {histogram.map(({ star, count }) => (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-3 font-semibold text-gray-900">{star}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-orange rounded-full"
                                style={{ width: `${(count / maxHistogramCount) * 100}%` }}
                              />
                            </div>
                            <span className="w-6 text-right text-steel">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const displayName =
                        review.reviewer_name || formatReviewerName(review.profiles?.full_name);
                      return (
                        <div
                          key={review.id}
                          className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                        >
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className="w-9 h-9 rounded-full bg-ink text-brand-orange font-bold text-xs flex items-center justify-center shrink-0">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {displayName}
                              </p>
                              <p className="text-xs text-steel">{formatDate(review.created_at)}</p>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating
                                      ? 'text-brand-orange fill-brand-orange'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <div className="flex gap-2 mb-2.5">
                              <Quote className="w-3.5 h-3.5 text-brand-orange/50 shrink-0 mt-0.5" />
                              <p className="text-steel text-sm leading-relaxed">{review.comment}</p>
                            </div>
                          )}
                          {(review.images?.length
                            ? review.images
                            : review.image_url
                              ? [{ url: review.image_url }]
                              : []
                          ).length > 0 && (
                            <div className="mt-2.5">
                              <div className="grid grid-cols-4 gap-2">
                                {(review.images?.length
                                  ? review.images
                                  : review.image_url
                                    ? [{ url: review.image_url }]
                                    : []
                                ).map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedReviewImage(img.url)}
                                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 hover:ring-2 hover:ring-brand-orange transition group"
                                    aria-label={`Fotografija recenzije ${idx + 1}`}
                                  >
                                    <Image
                                      src={img.url}
                                      alt={`Fotografija recenzije ${idx + 1}`}
                                      fill
                                      unoptimized
                                      sizes="25vw"
                                      className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {review.reply && (
                            <div className="mt-3 bg-white rounded-xl p-3.5 border border-gray-100">
                              <p className="text-xs font-semibold text-gray-900 mb-1">
                                Odgovor firme
                                {review.replied_at && (
                                  <span className="font-normal text-steel ml-2">
                                    {formatDate(review.replied_at)}
                                  </span>
                                )}
                              </p>
                              <p className="text-steel text-sm leading-relaxed">{review.reply}</p>
                            </div>
                          )}
                          {isFirmOwner && !review.reply && (
                            <ReviewReplyForm reviewId={review.id} onReply={handleReviewReply} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {selectedPortfolioImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedPortfolioImage(null)}
          >
            <button
              onClick={() => setSelectedPortfolioImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
              <div
                className="relative max-w-full max-h-[85vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedPortfolioImage}
                  alt={`Uvećana fotografija portfolioa firme ${firm.name}`}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        )}

        {selectedReviewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedReviewImage(null)}
          >
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
              <div
                className="relative max-w-full max-h-[85vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedReviewImage}
                  alt="Uvećana fotografija recenzije"
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
