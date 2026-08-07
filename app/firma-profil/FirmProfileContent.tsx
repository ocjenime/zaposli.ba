'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PageHero from '@/components/ui/PageHero';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getCategory } from '@/lib/data';
import { site } from '@/lib/site';
import Image from 'next/image';
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
  Phone,
  Mail,
  ShieldCheck,
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

export default function FirmProfileContent({ slug: propSlug }: { slug?: string }) {
  const searchParams = useSearchParams();
  const slug = propSlug || searchParams.get('slug') || '';
  const { user } = useAuth();

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [firmCategories, setFirmCategories] = useState<FirmCategoryRow[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFirm = useCallback(async () => {
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="relative overflow-hidden bg-gradient-to-br from-ink via-slate-900 to-slate-800 py-20 md:py-28">
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.3),transparent_40%)]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-10 md:h-14 w-2/3 bg-white/10 rounded-2xl animate-pulse mb-4" />
              <div className="h-5 md:h-6 w-1/2 bg-white/10 rounded-xl animate-pulse mb-8" />
              <div className="h-12 w-56 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
          <section className="py-12 md:py-20 bg-cloud">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 h-48 animate-pulse" />
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 h-64 animate-pulse" />
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 h-40 animate-pulse" />
                </div>
                <div className="bg-ink rounded-3xl h-[540px] animate-pulse shadow-card" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Breadcrumbs items={[{ name: 'Profil firme' }]} />
          <PageHero
            title="Profil nije pronađen"
            subtitle={error || 'Tražena firma ne postoji u našem sustavu.'}
            icon={AlertCircle}
            align="center"
            size="md"
            gradient="bg-gradient-to-br from-ink via-slate-900 to-slate-800"
          >
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/top-firme/"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                Pogledaj top firme
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/objavi-projekat/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors"
              >
                Objavi posao
              </Link>
            </div>
          </PageHero>
        </main>
        <Footer />
      </div>
    );
  }

  const onlineNow = isOnline(firm.last_active_at);
  const onlineText = onlineNow
    ? 'Online sada'
    : `Zadnji put online: ${formatLastActive(firm.last_active_at)}`;

  return (
    <div className="min-h-screen flex flex-col">
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

        <PageHero
          title={firm.name}
          subtitle={categoryNames.length > 0 ? categoryNames.join(', ') : 'Razne usluge'}
          eyebrow={firm.city ? `${firm.city} - Profil firme` : 'Profil firme'}
          align="left"
          size="md"
          gradient="bg-gradient-to-br from-ink via-slate-900 to-slate-800"
        >
          <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
            <div className="shrink-0">
              <LogoDisplay
                name={firm.name}
                src={firm.logo_url}
                alt={firm.name}
                size="xl"
                rounded="2xl"
                className="shadow-2xl border-2 border-white/10"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {firm.verified && <VerifiedBadge size="md" />}
                {isPremium && <PremiumBadge />}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      onlineNow ? 'bg-green-400 animate-pulse' : 'bg-white/40'
                    }`}
                  />
                  {onlineText}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1">
                  <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <span className="font-bold text-white">{rating.toFixed(1)}</span>
                  <span>({reviewCount} recenzija)</span>
                </span>
                {firm.city && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1">
                    <MapPin className="w-4 h-4 text-brand-orange" />
                    {firm.city}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                >
                  Zatraži ponudu od {firm.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/zatrazi-ponudu/?firm_id=${firm.id}&ask=1`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/15 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  Pitaj prije ponude
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/60">
                Želiš ponude i od drugih firmi?{' '}
                <Link
                  href="/objavi-projekat/"
                  className="text-brand-orange hover:underline font-medium"
                >
                  Objavi javni projekat
                </Link>
              </p>
            </div>
          </div>
        </PageHero>

        <section className="py-12 md:py-20 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">O firmi</h2>
                  <p className="text-steel leading-relaxed mb-6">
                    {firm.description || 'Firma još nije dodala opis.'}
                  </p>
                  {categoryNames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categoryNames.map((name) => (
                        <span
                          key={name}
                          className="px-4 py-2 bg-cloud rounded-xl text-sm font-medium text-gray-900 border border-gray-100"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Poslovni podaci</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      {
                        icon: Calendar,
                        label: 'Godina osnivanja',
                        value: firm.founded_at ? formatYear(firm.founded_at) : 'Nije navedeno',
                      },
                      {
                        icon: Hash,
                        label: 'Registracijski broj',
                        value: firm.registration_number || 'Nije navedeno',
                      },
                      {
                        icon: Clock,
                        label: 'Član Zaposli.ba',
                        value: formatMonthYear(firm.created_at) || '-',
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-cloud border border-gray-100 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <p className="text-xs text-steel">{item.label}</p>
                          <p className="font-bold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {portfolioImages.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-5">Portfolio</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {portfolioImages.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPortfolioImage(url)}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 hover:ring-2 hover:ring-brand-orange transition group"
                        >
                          <Image
                            src={url}
                            alt={`Portfolio firme ${firm.name} - fotografija ${index + 1}`}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Recenzije klijenata</h2>
                  {reviews.length === 0 ? (
                    <div className="bg-cloud rounded-2xl p-6 text-center border border-gray-100">
                      <p className="text-steel">Još nema recenzija za ovu firmu.</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-cloud rounded-2xl p-5 border border-gray-100 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                          <div className="text-center sm:text-left">
                            <div className="text-4xl font-extrabold text-gray-900">
                              {rating.toFixed(1)}
                            </div>
                            <div className="flex gap-0.5 justify-center sm:justify-start my-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(rating)
                                      ? 'text-brand-orange fill-brand-orange'
                                      : 'text-mist'
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
                          <div
                            key={review.id}
                            className="bg-cloud rounded-2xl p-5 border border-gray-100"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-bold text-xs">
                                  {(review.profiles?.full_name || 'K').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">
                                    {review.profiles?.full_name || 'Klijent'}
                                  </div>
                                  <div className="text-xs text-steel">
                                    {formatDate(review.created_at)}
                                  </div>
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
                                    <span className="font-normal text-steel ml-2">
                                      {formatDate(review.replied_at)}
                                    </span>
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
              </div>

              <aside>
                <div className="sticky top-28 relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-slate-900 to-slate-800 backdrop-blur-sm p-6 md:p-8 text-white shadow-2xl border border-white/10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
                  <div className="relative">
                    <h3 className="text-lg font-bold mb-5">Ukratko</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Star className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <p className="text-xs text-white/50">Ocjena</p>
                          <p className="font-bold">{rating.toFixed(1)} / 5</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <p className="text-xs text-white/50">Recenzija</p>
                          <p className="font-bold">{reviewCount}</p>
                        </div>
                      </div>
                      {firm.city && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-brand-orange" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">Lokacija</p>
                            <p className="font-bold">{firm.city}</p>
                          </div>
                        </div>
                      )}
                      {firm.phone && (
                        <a
                          href={`tel:${firm.phone.replace(/\s/g, '')}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                            <Phone className="w-5 h-5 text-brand-orange" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">Telefon</p>
                            <p className="font-bold text-sm">{firm.phone}</p>
                          </div>
                        </a>
                      )}
                      {firm.email && (
                        <a
                          href={`mailto:${firm.email}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                            <Mail className="w-5 h-5 text-brand-orange" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-white/50">Email</p>
                            <p className="font-bold text-sm break-all">{firm.email}</p>
                          </div>
                        </a>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <p className="text-xs text-white/50">Status</p>
                          {firm.verification_status === 'verified' ? (
                            <VerifiedBadge size="sm" />
                          ) : firm.verification_status === 'pending' ? (
                            <span className="text-sm text-accent-400">Na čekanju</span>
                          ) : firm.verification_status === 'rejected' ? (
                            <span className="text-sm text-red-400">Odbijeno</span>
                          ) : (
                            <span className="text-sm text-white/70">U provjeri</span>
                          )}
                        </div>
                      </div>
                      {firm.founded_at && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-brand-orange" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">Godina osnivanja</p>
                            <p className="font-bold text-sm">{formatYear(firm.founded_at)}</p>
                          </div>
                        </div>
                      )}
                      {firm.registration_number && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Hash className="w-5 h-5 text-brand-orange" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">Reg. broj</p>
                            <p className="font-bold text-sm">{firm.registration_number}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <p className="text-xs text-white/50">Član od</p>
                          <p className="font-bold text-sm">{formatMonthYear(firm.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/zatrazi-ponudu/?firm_id=${firm.id}`}
                      className="block w-full text-center mt-6 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                    >
                      Zatraži ponudu od {firm.name}
                    </Link>
                    <Link
                      href={`/zatrazi-ponudu/?firm_id=${firm.id}&ask=1`}
                      className="block w-full text-center mt-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all active:scale-95"
                    >
                      Pitaj prije ponude
                    </Link>
                    <p className="text-white/40 text-xs text-center mt-3">
                      Privatni zahtjev - vidi ga samo {firm.name}
                    </p>
                  </div>
                </div>
              </aside>
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
      </main>
      <Footer />
    </div>
  );
}
