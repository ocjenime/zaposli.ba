'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import {
  MapPin,
  Star,
  MessageSquare,
  ArrowRight,
  Quote,
  AlertCircle,
  ImageIcon,
  X,
} from 'lucide-react';

interface ReviewerProfile {
  full_name: string | null;
}

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  image_url: string | null;
  created_at: string;
  profiles: ReviewerProfile | null;
}

interface FirmRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  created_at: string;
}

interface FirmCategoryRow {
  category_slug: string;
}

export default function FirmProfileContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [firmCategories, setFirmCategories] = useState<FirmCategoryRow[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);
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
          'id, name, slug, description, email, phone, city, logo_url, verified, average_rating, review_count, created_at, reviews(id, rating, comment, image_url, created_at, profiles(full_name))'
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
      setReviews(typedFirm.reviews || []);

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
    } catch (err) {
      setError('Došlo je do greške pri učitavanju profila.');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('bs-BA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const categoryNames = firmCategories
    .map((c) => getCategory(c.category_slug)?.name)
    .filter(Boolean) as string[];

  const rating = firm?.average_rating || 0;
  const reviewCount = firm?.review_count || 0;

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
              href="/projekti/"
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
      <main className="flex-grow">
        <Breadcrumbs
          items={[
            { name: 'Firme', href: '/projekti/' },
            { name: firm.name },
          ]}
        />
        <section className="relative bg-cloud py-10 md:py-14 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
              {firm.logo_url ? (
                <img
                  src={firm.logo_url}
                  alt={firm.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-100 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-extrabold text-3xl shrink-0 shadow-lg">
                  {firm.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {firm.name}
                  </h1>
                  {firm.verified && <VerifiedBadge />}
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
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/objavi-projekat/?firm_id=${firm.id}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
              >
                Zatraži ponudu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/objavi-projekat/?firm_id=${firm.id}&message=1`}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-orange border-2 border-brand-orange px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                Pošalji poruku
              </Link>
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
                      </div>
                    ))}
                  </div>
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
                      {firm.verified ? (
                        <VerifiedBadge size="sm" />
                      ) : (
                        <span className="text-sm text-[#ffffff]/70">U provjeri</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/objavi-projekat/?firm_id=${firm.id}`}
                    className="block w-full text-center mt-6 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                  >
                    Zatraži ponudu
                  </Link>
                  <p className="text-[#ffffff]/40 text-xs text-center mt-3">Besplatno i neobavezujuće</p>
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
