'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Star, ArrowLeft, Upload, AlertCircle, X, ImageIcon } from 'lucide-react';

interface JobRow {
  id: string;
  client_id: string;
  title: string;
  status: string;
}

interface FirmRow {
  id: string;
  name: string;
  owner_id?: string;
}

interface BidRow {
  id: string;
  firm_id: string;
  firms: FirmRow | null;
}

function ReviewPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');

  const [job, setJob] = useState<JobRow | null>(null);
  const [bid, setBid] = useState<BidRow | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadReviewData = useCallback(async () => {
    if (!jobId || !user) return;
    setLoading(true);
    setError('');

    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('id, client_id, title, status')
        .eq('id', jobId)
        .single();

      if (jobError || !jobData) {
        setError('Posao nije pronađen.');
        setLoading(false);
        return;
      }

      const typedJob = jobData as unknown as JobRow;
      setJob(typedJob);

      if (typedJob.client_id !== user.id) {
        setError('Samo vlasnik posla može ostaviti recenziju.');
        setLoading(false);
        return;
      }

      if (typedJob.status !== 'completed') {
        setError('Recenziju možete ostaviti tek nakon završetka posla.');
        setLoading(false);
        return;
      }

      const { data: existingReview, error: reviewError } = await supabase
        .from('reviews')
        .select('id')
        .eq('job_id', jobId)
        .maybeSingle();

      if (existingReview) {
        setError('Već ste ostavili recenziju za ovaj posao.');
        setLoading(false);
        return;
      }

      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('id, firm_id, firms(id, name, owner_id)')
        .eq('job_id', jobId)
        .eq('status', 'accepted')
        .maybeSingle();

      if (bidError || !bidData) {
        setError('Nema prihvaćene ponude za ovaj posao.');
        setLoading(false);
        return;
      }

      setBid(bidData as unknown as BidRow);
    } catch (err) {
      setError('Došlo je do greške pri učitavanju.');
    } finally {
      setLoading(false);
    }
  }, [user, jobId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/prijava/');
      return;
    }
    if (!jobId) {
      setLoading(false);
      setError('Nedostaje ID posla.');
      return;
    }
    loadReviewData();
  }, [authLoading, user, jobId, router, loadReviewData]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setError('');

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Dozvoljeni formati: JPG, PNG, WEBP.');
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Slika mora biti manja od 2MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!jobId || !user || !bid?.firms) {
      setError('Nedostaju podaci za slanje recenzije.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Odaberite ocjenu od 1 do 5 zvjezdica.');
      return;
    }

    if (!comment.trim()) {
      setError('Napišite komentar.');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const path = `${user.id}/${jobId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(path, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          setError('Greška pri otpremanju slike. Pokušajte ponovo.');
          setSubmitting(false);
          return;
        }

        const { data: publicUrl } = supabase.storage.from('review-images').getPublicUrl(path);
        imageUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase.from('reviews').insert({
        job_id: jobId,
        client_id: user.id,
        firm_id: bid.firms.id,
        rating,
        comment: comment.trim(),
        image_url: imageUrl,
        status: 'approved',
      });

      if (insertError) {
        setError('Greška pri spremanju recenzije.');
        setSubmitting(false);
        return;
      }

      if (bid?.firms?.owner_id) {
        await supabase.from('notifications').insert({
          user_id: bid.firms.owner_id,
          type: 'review',
          title: 'Nova recenzija',
          message: `Klijent je ostavio recenziju (${rating}/5) za posao "${job?.title || ''}".`,
          job_id: jobId,
        });
      }

      router.push('/dashboard/');
    } catch (err) {
      setError('Došlo je do neočekivane greške.');
      setSubmitting(false);
    }
  }

  if (authLoading || (!user && !error)) {
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
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/"
            className="inline-flex items-center gap-2 text-sm text-steel hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad na dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ostavite recenziju</h1>
            <p className="text-steel mb-6">
              {loading ? 'Učitavanje podataka...' : job?.title}
            </p>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error && !bid ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Recenzija nije dostupna</h2>
                <p className="text-steel">{error}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Vaša ocjena za {bid?.firms?.name}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none"
                        aria-label={`Ocjena ${star}`}
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-brand-orange fill-brand-orange'
                              : 'text-mist'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {rating > 0 ? `${rating} od 5` : 'Odaberite ocjenu'}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-900 mb-2">
                    Komentar
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    placeholder="Opišite svoje iskustvo..."
                    className="w-full bg-cloud border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-steel focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-steel mt-1 text-right">
                    {comment.length}/1000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Slika (opcionalno)
                  </label>
                  <p className="text-xs text-steel mb-3">
                    Maksimalno 2MB, formati: JPG, PNG, WEBP.
                  </p>

                  {imagePreview ? (
                    <div className="relative inline-block rounded-xl overflow-hidden border border-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Pregled fotografije za recenziju"
                        className="w-full max-w-xs h-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-[#ffffff]/90 rounded-full text-steel hover:text-red-500 shadow-sm"
                        aria-label="Ukloni sliku"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-3 bg-cloud border border-gray-200 rounded-xl text-sm text-steel hover:text-gray-900 hover:border-brand-orange transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Dodaj sliku
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
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
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Spremanje...' : 'Pošalji recenziju'}
                  </button>
                  <Link
                    href="/dashboard/"
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

export default function ReviewPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-cloud">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </main>
          <Footer />
        </div>
      }
    >
      <ReviewPage />
    </Suspense>
  );
}
