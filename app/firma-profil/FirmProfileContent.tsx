'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { plural } from '@/lib/plural';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getCategory, getCategoryShortName } from '@/lib/data';
import { site } from '@/lib/site';
import Image from 'next/image';
import { formatDate, formatMonthYear } from '@/lib/date';
import { formatReviewerName } from '@/lib/reviewer-name';
import { JsonLd, localBusinessSchema } from '@/lib/jsonld';
import { isOnline, formatLastActive } from '@/lib/hooks/useFirmActivityHeartbeat';
import { isCompanyName } from '@/lib/firm-utils';
import LogoDisplay from '@/components/ui/LogoDisplay';
import {
  MapPin,
  Star,
  ArrowRight,
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
  MessageCircle,
  Crown,
  FileText,
  Users,
  Handshake,
  ChevronLeft,
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
  { id: 'o-firmi', label: 'O firmi' },
  { id: 'usluge', label: 'Usluge' },
  { id: 'fotografije', label: 'Fotografije' },
  { id: 'recenzije', label: 'Recenzije' },
  { id: 'kontakt', label: 'Kontakt' },
];

export default function FirmProfileContent({ slug: propSlug }: { slug?: string }) {
  const searchParams = useSearchParams();
  const slug = propSlug || searchParams.get('slug') || '';
  const { user } = useAuth();

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [firmCategories, setFirmCategories] = useState<FirmCategoryRow[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState<number | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [acceptedBids, setAcceptedBids] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('o-firmi');
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

      try {
        const { count } = await supabase
          .from('bids')
          .select('id', { count: 'exact', head: true })
          .eq('firm_id', typedFirm.id)
          .eq('status', 'accepted');
        if (typeof count === 'number') setAcceptedBids(count);
      } catch {
        setAcceptedBids(null);
      }
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

  const categoryNames = firmCategories
    .map((c) => getCategory(c.category_slug)?.name)
    .filter(Boolean) as string[];

  const serviceTiles = firmCategories
    .map((c) => getCategory(c.category_slug))
    .filter((c): c is NonNullable<typeof c> => !!c);

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
          <div className="relative overflow-hidden bg-gray-100 h-[220px] sm:h-[300px] animate-pulse" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl p-4 -mt-14 relative z-20 animate-pulse">
              <div className="w-[88px] h-[88px] rounded-2xl bg-gray-100 -mt-12 mb-3" />
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
  const onlineText = onlineNow ? 'Online sada' : formatLastActive(firm.last_active_at);
  const company = isCompanyName(firm.name);
  const coverImage = portfolioImages[0] || '/images/zafirme-hero.jpg';
  const completedCount = acceptedBids ?? reviewCount;
  const visibleTiles = showAllServices ? serviceTiles : serviceTiles.slice(0, 6);
  const visiblePhotos = showAllPhotos ? portfolioImages : portfolioImages.slice(0, 4);
  const remainingPhotos = portfolioImages.length - visiblePhotos.length;

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

        {/* Cover */}
        <section className="relative h-[220px] sm:h-[300px] overflow-hidden">
          <Image
            src={coverImage}
            alt={`${firm.name} - radovi`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
          <div className="absolute inset-0">
            <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 pb-10">
              <div className="max-w-[62%] sm:max-w-md">
                <h2 className="text-[24px] sm:text-4xl font-extrabold text-white leading-[1.1] tracking-tight">
                  Kvalitetni radovi, zadovoljni klijenti.
                </h2>
                <span className="block w-12 h-1.5 bg-brand-orange rounded-full mt-2.5" />
                <p className="text-white/90 text-[13px] sm:text-base mt-2">
                  Vaš partner za svaki projekat.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md rounded-xl px-3 py-2.5 max-w-[150px] sm:max-w-[220px] shrink-0">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                <p className="text-white text-[12px] sm:text-sm font-medium leading-snug">
                  Pouzdani majstori za bolji dom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Profilna kartica */}
        <section className="relative z-20 px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.07] px-4 pb-4 pt-0 sm:p-5 sm:pt-0">
              <div className="flex gap-3.5">
                <div className="w-[88px] sm:w-24 shrink-0 -mt-8 sm:-mt-10">
                  <LogoDisplay
                    name={firm.name}
                    src={firm.logo_url}
                    alt={firm.name}
                    size="lg"
                    rounded="2xl"
                    className="border-4 border-white shadow-lg !w-[88px] !h-[88px] sm:!w-24 sm:!h-24"
                  />
                </div>
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-start justify-between gap-2">
                    <h1 className="flex items-center gap-1.5 text-[22px] sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight min-w-0">
                      <span className="truncate">{firm.name}</span>
                      {firm.verified && (
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0" title="Verificiran profil">
                          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-orange" />
                        </span>
                      )}
                    </h1>
                    <div className="text-right shrink-0">
                      <p className="flex items-center justify-end gap-1">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange fill-brand-orange" />
                        <strong className="text-lg sm:text-2xl font-extrabold text-gray-900">
                          {rating.toFixed(1)}
                        </strong>
                      </p>
                      <p className="text-[12px] sm:text-sm text-steel">
                        ({reviewCount} {plural(reviewCount, ['recenzija', 'recenzije', 'recenzija'])})
                      </p>
                    </div>
                  </div>
                  {firm.city && (
                    <p className="flex items-center gap-1 text-steel text-[13px] sm:text-[15px] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {firm.city}
                    </p>
                  )}
                </div>
              </div>

              {categoryNames.length > 0 && (
                <p className="text-[13px] sm:text-[15px] text-steel leading-snug mt-2.5">
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

              <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {firm.verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 text-brand-orange text-[12px] sm:text-[13px] font-bold px-3 py-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      {company ? 'Provjerena firma' : 'Provjereni majstor'}
                    </span>
                  )}
                  {isPremium && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 text-[12px] sm:text-[13px] font-bold px-3 py-1.5"
                      title="Aktivna premium pretplata sa istaknutim profilom."
                    >
                      <Crown className="w-4 h-4" />
                      Premium partner
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-right">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${onlineNow ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-steel">
                    Zadnji put online:<br className="sm:hidden" />
                    <span className="text-gray-900 font-medium"> {onlineText}</span>
                  </span>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:shadow-xl hover:shadow-brand-orange/25 text-white font-bold text-[15px] sm:text-base rounded-xl px-6 py-3.5 transition-all active:scale-[0.99] min-h-[52px]"
                >
                  <Receipt className="w-5 h-5" />
                  Zatraži ponudu
                </Link>
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}&ask=1`}
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 font-bold text-[15px] sm:text-base rounded-xl px-6 py-3.5 transition-colors hover:bg-gray-50 min-h-[52px]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Pošalji poruku
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Statistika */}
        <section className="px-4 sm:px-6 lg:px-8 mt-3">
          <div className="mx-auto max-w-7xl">
            <div className="bg-[#f7f6f4] rounded-2xl px-2 py-4 grid grid-cols-4 gap-1">
              <div className="flex items-start justify-center gap-1.5 px-1">
                <FileText className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-gray-900 text-[13px] sm:text-base leading-tight">{completedCount}+</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight">Završenih projekata</p>
                </div>
              </div>
              <div className="flex items-start justify-center gap-1.5 px-1 sm:border-l sm:border-gray-200">
                <Users className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-gray-900 text-[13px] sm:text-base leading-tight">Zadovoljni</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight">klijenti</p>
                </div>
              </div>
              <div className="flex items-start justify-center gap-1.5 px-1 sm:border-l sm:border-gray-200">
                <Clock className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-gray-900 text-[13px] sm:text-base leading-tight">Brz odgovor</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight">Obično unutar 1 h</p>
                </div>
              </div>
              <div className="flex items-start justify-center gap-1.5 px-1 sm:border-l sm:border-gray-200">
                <MapPin className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-gray-900 text-[13px] sm:text-base leading-tight truncate">{firm.city || 'BiH'}</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight">i šira okolica</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabovi */}
        <div className="sticky top-12 md:top-16 z-30 bg-white/95 backdrop-blur border-b border-gray-100 mt-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-5 md:gap-7 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => scrollToSection(t.id, t.id)}
                className={`py-3 text-sm md:text-[15px] whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === t.id
                    ? 'font-bold text-gray-900 border-brand-orange'
                    : 'font-medium text-gray-500 border-transparent hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* O firmi */}
        <section id="o-firmi" className="pt-4 md:pt-6 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-[#f7f6f4] rounded-2xl p-4 sm:p-5">
              <div className="grid grid-cols-[1fr_132px] sm:grid-cols-[1fr_200px] gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-1.5">O firmi</h2>
                  <p className="text-[13px] sm:text-[15px] text-gray-600 leading-relaxed">
                    {firm.description || 'Firma još nije dodala opis.'}
                  </p>
                </div>
                <div className="bg-white/70 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 self-start">
                  <Handshake className="w-7 h-7 text-brand-orange" />
                  <p className="font-extrabold text-gray-900 text-[12px] sm:text-sm leading-snug">
                    Vaše povjerenje naš je najveći uspjeh.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 pt-4 mt-4 border-t border-gray-200/70 text-sm">
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

        {/* Usluge */}
        <section id="usluge" className="pt-5 md:pt-7 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Usluge</h2>
              {serviceTiles.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllServices((v) => !v)}
                  className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-brand-orange"
                >
                  {showAllServices ? 'Prikaži manje' : 'Prikaži sve'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            {visibleTiles.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {visibleTiles.map((cat) => {
                  const TileIcon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/kategorije/${cat.slug}/`}
                      className="bg-white rounded-xl border border-gray-100 px-1.5 py-3 flex flex-col items-center justify-center gap-1.5 text-center hover:border-brand-orange/40 hover:shadow-md transition-all min-h-[86px]"
                    >
                      <TileIcon className="w-6 h-6 text-gray-800" />
                      <span className="text-[11px] sm:text-xs font-medium text-gray-800 leading-tight">
                        {getCategoryShortName(cat)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-steel">Firma još nije dodala usluge.</p>
            )}
          </div>
        </section>

        {/* Fotografije radova */}
        {portfolioImages.length > 0 && (
          <section id="fotografije" className="pt-5 md:pt-7 scroll-mt-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Fotografije radova</h2>
                {portfolioImages.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllPhotos((v) => !v)}
                    className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-brand-orange"
                  >
                    {showAllPhotos ? 'Prikaži manje' : 'Prikaži sve'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {showAllPhotos ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {portfolioImages.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPortfolioIndex(index)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-orange transition group"
                      aria-label={`Fotografija radova ${index + 1}`}
                    >
                      <Image
                        src={url}
                        alt={`Radovi firme ${firm.name} - fotografija ${index + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {visiblePhotos.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPortfolioIndex(index)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-orange transition group"
                      aria-label={`Fotografija radova ${index + 1}`}
                    >
                      <Image
                        src={url}
                        alt={`Radovi firme ${firm.name} - fotografija ${index + 1}`}
                        fill
                        unoptimized
                        sizes="20vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </button>
                  ))}
                  {remainingPhotos > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedPortfolioIndex(visiblePhotos.length)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/85 hover:bg-black/75 transition flex items-center justify-center"
                      aria-label={`Prikaži još ${remainingPhotos} fotografija`}
                    >
                      {portfolioImages[visiblePhotos.length] && (
                        <Image
                          src={portfolioImages[visiblePhotos.length]}
                          alt=""
                          fill
                          unoptimized
                          sizes="20vw"
                          className="object-cover opacity-30"
                        />
                      )}
                      <span className="relative text-white text-lg sm:text-xl font-extrabold">
                        +{remainingPhotos}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recenzije */}
        <section id="recenzije" className="pt-5 md:pt-7 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Recenzije</h2>
              <span className="text-[13px] sm:text-sm text-steel">
                {reviewCount} {plural(reviewCount, ['recenzija', 'recenzije', 'recenzija'])}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-[#f7f6f4] rounded-2xl p-6 text-center">
                <p className="text-steel text-sm">Još nema recenzija za ovu firmu.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#f7f6f4] rounded-2xl p-4 flex items-center gap-4 mb-3">
                  <div className="text-4xl font-extrabold text-gray-900">{rating.toFixed(1)}</div>
                  <div className="flex-1">
                    <div className="flex gap-0.5 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(rating)
                              ? 'text-brand-orange fill-brand-orange'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      {histogram.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3 font-semibold text-gray-900">{star}</span>
                          <div className="flex-1 h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
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

                <div className="space-y-3">
                  {reviews.map((review) => {
                    const displayName =
                      review.reviewer_name || formatReviewerName(review.profiles?.full_name);
                    return (
                      <div
                        key={review.id}
                        className="bg-[#f7f6f4] rounded-2xl p-4"
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
                                    : 'text-gray-300'
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
                                  className="relative aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-orange transition group"
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
                          <div className="mt-3 bg-white rounded-xl p-3.5">
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
        </section>

        {/* Kontakt */}
        <section id="kontakt" className="py-5 md:py-7 scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3">Kontakt</h2>
            <div className="bg-[#f7f6f4] rounded-2xl p-4 sm:p-5">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {firm.phone && (
                  <a
                    href={`tel:${firm.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-md transition-shadow"
                  >
                    <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-brand-orange" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] text-steel">Telefon</span>
                      <span className="block font-bold text-gray-900 text-sm truncate">{firm.phone}</span>
                    </span>
                  </a>
                )}
                {firm.email && (
                  <a
                    href={`mailto:${firm.email}`}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-md transition-shadow"
                  >
                    <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-brand-orange" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] text-steel">Email</span>
                      <span className="block font-bold text-gray-900 text-sm truncate">{firm.email}</span>
                    </span>
                  </a>
                )}
                {firm.city && (
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                    <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-orange" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] text-steel">Područje</span>
                      <span className="block font-bold text-gray-900 text-sm truncate">{firm.city} i šira okolica</span>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                  <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-orange" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] text-steel">Dostupnost</span>
                    <span className="block font-bold text-gray-900 text-sm truncate">{onlineText}</span>
                  </span>
                </div>
              </div>
              <Link
                href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-bold text-[15px] rounded-xl px-6 py-3.5 transition-all hover:shadow-xl hover:shadow-brand-orange/25 active:scale-[0.99] min-h-[52px]"
              >
                <Receipt className="w-5 h-5" />
                Zatraži ponudu
              </Link>
            </div>
          </div>
        </section>

        {selectedPortfolioIndex !== null && portfolioImages[selectedPortfolioIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedPortfolioIndex(null)}
          >
            <button
              onClick={() => setSelectedPortfolioIndex(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5" />
            </button>
            {portfolioImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPortfolioIndex((i) =>
                      i === null ? null : (i - 1 + portfolioImages.length) % portfolioImages.length
                    );
                  }}
                  className="absolute left-2 sm:left-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Prethodna fotografija"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPortfolioIndex((i) =>
                      i === null ? null : (i + 1) % portfolioImages.length
                    );
                  }}
                  className="absolute right-2 sm:right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Sljedeća fotografija"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
              <div
                className="relative max-w-full max-h-[85vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={portfolioImages[selectedPortfolioIndex]}
                  alt={`Uvećana fotografija radova firme ${firm.name} (${selectedPortfolioIndex + 1}/${portfolioImages.length})`}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
            {portfolioImages.length > 1 && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {selectedPortfolioIndex + 1} / {portfolioImages.length}
              </p>
            )}
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
