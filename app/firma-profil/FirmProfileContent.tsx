'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getCategory } from '@/lib/data';
import { site } from '@/lib/site';
import { formatDate, formatMonthYear } from '@/lib/date';
import { JsonLd, localBusinessSchema } from '@/lib/jsonld';
import { isOnline, formatLastActive } from '@/lib/hooks/useFirmActivityHeartbeat';
import LogoDisplay from '@/components/ui/LogoDisplay';
import {
  MapPin,
  Star,
  MessageSquare,
  ArrowRight,
  Quote,
  AlertCircle,
  ImageIcon,
  X,
  Hash,
  Calendar,
  Clock,
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

export default function FirmProfileContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';
  const { user } = useAuth();

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [firmCategories, setFirmCategories] = useState<FirmCategoryRow[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Nedostaje naziv firme.');
      return;
    }
    loadFirm();
  }, [slug]);

  async function loadFirm() {
    setLoading(true);
    setError('');

    try {
      const { data, error: firmError } = await supabase
        .from('firms')
        .select(
          'id, owner_id, name, slug, description, email, phone, city, logo_url, verified, verification_status, verification_notes, average_rating, review_count, registration_number, founded_at, last_active_at, created_at, reviews(id, firm_id, client_id, rating, comment, image_url, status, reply, replied_at, created_at, profiles(full_name))'
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
      setReviews((typedFirm.reviews || []).filter((r) => r.status === 'approved'));

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
  }

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
            className="bg-ink text-[#ffffff] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-ink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

  const rating = firm?.average_rating || 0;
  const reviewCount = firm?.review_count || 0;
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl h-48 md:h-64 animate-pulse mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-2/3" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                </div>
                <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div className="bg-ink rounded-3xl h-96 animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil nije pronađen</h1>
            <p className="text-steel mb-6">{error || 'Tražena firma ne postoji.'}</p>
            <Link
              href="/poslovi/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-semibold"
            >
              Pogledaj poslove
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <JsonLd
        data={localBusinessSchema({
          name: firm.name,
          specialty: categoryNames.length > 0 ? categoryNames.join(', ') : 'Razne usluge',
          location: firm.city || 'BiH',
          rating,
          reviews: reviewCount,
          url: `/firma-profil/?slug=${firm.slug}`,
          image: firm.logo_url || `${site.url}/images/logo-mark.png`,
          telephone: firm.phone,
          email: firm.email,
          priceRange: primaryCategory?.priceRange || undefined,
        })}
      />
      <main className="flex-grow">
        <Breadcrumbs
          items={[
            { name: 'Top firme', href: '/top-firme/' },
            { name: firm.name },
          ]}
        />
        <section className="relative bg-cloud py-10 md:py-14 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
              <LogoDisplay
                name={firm.name}
                src={firm.logo_url}
                alt={firm.name}
                size="lg"
                rounded="2xl"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {firm.name}
                  </h1>
                  {firm.verified && (
                    <span
                      title="Ova firma je lično provjerena od strane Zaposli.ba tima."
                      className="cursor-help"
                    >
                      <VerifiedBadge />
                    </span>
                  )}
                  {isPremium && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full font-bold text-[11px] px-2.5 py-1 border border-purple-200/50 bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700"
                      title="Aktivna premium pretplata sa istaknutim profilom."
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" fill="url(#premium-gradient)" stroke="currentColor" strokeWidth="0.5" />
                        <defs>
                          <linearGradient id="premium-gradient" x1="0" y1="0" x2="24" y2="24">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#c026d3" />
                          </linearGradient>
                        </defs>
                      </svg>
                      Premium partner
                    </span>
                  )}
                </div>
                <p className="text-steel mb-3">
                  {categoryNames.length > 0 ? categoryNames.join(', ') : 'Razne usluge'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-steel">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                    <b className="text-gray-900">{rating.toFixed(1)}</b> ({reviewCount} recenzija)
                  </span>
                  {firm.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {firm.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOnline(firm.last_active_at) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`}
                    />
                    {isOnline(firm.last_active_at)
                      ? 'Online sada'
                      : `Zadnji put online: ${formatLastActive(firm.last_active_at)}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                >
                  Zatraži ponudu od {firm.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}&ask=1`}
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-orange border-2 border-brand-orange px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  Pitaj prije ponude
                </Link>
              </div>
              <p className="text-sm text-steel">
                Želiš ponude i od drugih firmi?{' '}
                <Link href="/objavi-projekat/" className="text-brand-orange hover:underline font-medium">
                  Objavi javni projekat
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">O firmi</h2>
                <p className="text-steel leading-relaxed mb-8">
                  {firm.description || 'Firma još nije dodala opis.'}
                </p>

                {categoryNames.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Kategorije</h2>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {categoryNames.map((name) => (
                        <span
                          key={name}
                          className="px-4 py-2 bg-cloud rounded-xl text-sm font-medium text-gray-900 border border-gray-100"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className="bg-cloud rounded-2xl p-5 border border-gray-100 mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Poslovni podaci</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-xs text-steel">Godina osnivanja</p>
                        <p className="font-bold text-gray-900">
                          {firm.founded_at ? formatYear(firm.founded_at) : 'Nije navedeno'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                        <Hash className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-xs text-steel">Registracijski broj</p>
                        <p className="font-bold text-gray-900">
                          {firm.registration_number || 'Nije navedeno'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-xs text-steel">Član Zaposli.ba</p>
                        <p className="font-bold text-gray-900">{formatMonthYear(firm.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {portfolioImages.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                      {portfolioImages.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPortfolioImage(url)}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 hover:ring-2 hover:ring-brand-orange transition group"
                        >
                          <img
                            src={url}
                            alt={`Portfolio firme ${firm.name} - fotografija ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <h2 className="text-xl font-bold text-gray-900 mb-4">Recenzije klijenata</h2>
                {reviews.length === 0 ? (
                  <div className="bg-cloud rounded-2xl p-6 text-center border border-gray-100">
                    <p className="text-steel">Još nema recenzija za ovu firmu.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-cloud rounded-2xl p-5 border border-gray-100 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="text-center sm:text-left">
                          <div className="text-4xl font-extrabold text-gray-900">{rating.toFixed(1)}</div>
                          <div className="flex gap-0.5 justify-center sm:justify-start my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(rating) ? 'text-brand-orange fill-brand-orange' : 'text-mist'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-steel">{reviewCount} recenzija</div>
                        </div>
                        <div className="flex-1 space-y-2">
                          {histogram.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-3 text-sm">
                              <span className="w-4 font-semibold text-gray-900">{star}</span>
                              <Star className="w-3 h-3 text-brand-orange fill-brand-orange" />
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-brand-orange rounded-full"
                                  style={{ width: `${(count / maxHistogramCount) * 100}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-steel text-xs">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-cloud rounded-2xl p-5 border border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-bold text-xs">
                                {(review.profiles?.full_name || 'K').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {review.profiles?.full_name || 'Klijent'}
                                </div>
                                <div className="text-xs text-steel">{formatDate(review.created_at)}</div>
                              </div>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-brand-orange fill-brand-orange'
                                      : 'text-mist'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <div className="flex gap-2 mb-3">
                              <Quote className="w-4 h-4 text-primary-200 shrink-0 mt-0.5" />
                              <p className="text-steel text-sm leading-relaxed">{review.comment}</p>
                            </div>
                          )}
                          {review.image_url && (
                            <a
                              href={review.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-brand-orange hover:underline"
                            >
                              <ImageIcon className="w-4 h-4" />
                              Pogledaj sliku
                            </a>
                          )}
                          {review.reply && (
                            <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100">
                              <div className="text-xs font-semibold text-gray-900 mb-1">
                                Odgovor firme
                                {review.replied_at && (
                                  <span className="font-normal text-steel ml-2">{formatDate(review.replied_at)}</span>
                                )}
                              </div>
                              <p className="text-steel text-sm leading-relaxed">{review.reply}</p>
                            </div>
                          )}
                          {isFirmOwner && !review.reply && (
                            <ReviewReplyForm reviewId={review.id} onReply={handleReviewReply} />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <div className="bg-ink rounded-3xl p-6 text-[#ffffff] sticky top-28">
                  <h3 className="text-lg font-bold mb-5">Ukratko</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-[#ffffff]/10">
                      <span className="text-[#ffffff]/60 text-sm">Ocjena</span>
                      <span className="font-extrabold text-brand-orange text-xl">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#ffffff]/10">
                      <span className="text-[#ffffff]/60 text-sm">Recenzija</span>
                      <span className="font-bold">{reviewCount}</span>
                    </div>
                    {firm.city && (
                      <div className="flex justify-between items-center pb-4 border-b border-[#ffffff]/10">
                        <span className="text-[#ffffff]/60 text-sm">Lokacija</span>
                        <span className="font-bold">{firm.city}</span>
                      </div>
                    )}
                    {firm.phone && (
                      <div className="flex justify-between items-center pb-4 border-b border-[#ffffff]/10">
                        <span className="text-[#ffffff]/60 text-sm">Telefon</span>
                        <span className="font-bold text-sm">{firm.phone}</span>
                      </div>
                    )}
                    {firm.email && (
                      <div className="flex justify-between items-center pb-4 border-b border-[#ffffff]/10">
                        <span className="text-[#ffffff]/60 text-sm">Email</span>
                        <span className="font-bold text-sm break-all">{firm.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[#ffffff]/60 text-sm">Status</span>
                      {firm.verification_status === 'verified' ? (
                        <VerifiedBadge size="sm" />
                      ) : firm.verification_status === 'pending' ? (
                        <span className="text-sm text-accent-400">Na čekanju</span>
                      ) : firm.verification_status === 'rejected' ? (
                        <span className="text-sm text-red-400">Odbijeno</span>
                      ) : (
                        <span className="text-sm text-[#ffffff]/70">U provjeri</span>
                      )}
                    </div>

                    {firm.founded_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#ffffff]/60 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Godina osnivanja
                        </span>
                        <span className="font-bold text-sm">{formatYear(firm.founded_at)}</span>
                      </div>
                    )}

                    {firm.registration_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#ffffff]/60 text-sm flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Reg. broj
                        </span>
                        <span className="font-bold text-sm">{firm.registration_number}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-[#ffffff]/60 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Član od
                      </span>
                      <span className="font-bold text-sm">{formatMonthYear(firm.created_at)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                    className="block w-full text-center mt-6 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                  >
                    Zatraži ponudu od {firm.name}
                  </Link>
                  <Link
                    href={`/zatrazi-ponudu/?firm_id=${firm.id}&ask=1`}
                    className="block w-full text-center mt-3 bg-white/10 backdrop-blur-sm text-[#ffffff] border border-[#ffffff]/30 px-6 py-3 rounded-xl font-bold hover:bg-[#ffffff]/20 transition-all active:scale-95"
                  >
                    Pitaj prije ponude
                  </Link>
                  <p className="text-[#ffffff]/40 text-xs text-center mt-3">
                    Privatni zahtjev - vidi ga samo {firm.name}
                  </p>
                </div>
              </div>
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
              <img
                src={selectedPortfolioImage}
                alt={`Uvećana fotografija portfolioa firme ${firm.name}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
