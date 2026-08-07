'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import JobChat from '@/components/JobChat';
import NextImage from 'next/image';
import { formatDate } from '@/lib/date';
import {
  ArrowLeft,
  MapPin,
  Loader2,
  MessageSquare,
  CheckCircle,
  DollarSign,
  Calendar,
  ImageIcon,
  X,
  Star,
  Upload,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

interface Firm {
  id: string;
  name: string;
  city: string;
  logo_url: string | null;
  owner_id?: string;
}

interface Bid {
  id: string;
  firm_id: string;
  amount: number;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  firms: Firm;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  image_url: string | null;
  created_at: string;
}

type PrivateStatus = 'pending' | 'accepted' | 'in_progress' | 'done_pending' | 'completed' | 'declined' | 'cancelled';

interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  city: string;
  address: string | null;
  status: 'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  private_status: PrivateStatus | null;
  is_private: boolean;
  target_firm_id: string | null;
  client_question: string | null;
  problem_reported: boolean;
  problem_description: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
}

interface JobImage {
  id: string;
  image_url: string;
}

const publicStatusLabels: Record<Job['status'], string> = {
  open: 'Otvoren',
  bidding: 'U ponudama',
  in_progress: 'U toku',
  completed: 'Završen',
  cancelled: 'Otkazan',
};

const publicStatusColors: Record<Job['status'], string> = {
  open: 'bg-blue-50 text-blue-700',
  bidding: 'bg-orange-50 text-brand-orange',
  in_progress: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const privateStatusLabels: Record<PrivateStatus, string> = {
  pending: 'Zahtjev poslan',
  accepted: 'Ponuda prihvaćena',
  in_progress: 'Rad u toku',
  done_pending: 'Gotovo - čeka potvrdu',
  completed: 'Završen',
  declined: 'Odbijeno',
  cancelled: 'Otkazano',
};

const privateStatusColors: Record<PrivateStatus, string> = {
  pending: 'bg-blue-50 text-blue-700',
  accepted: 'bg-green-50 text-green-700',
  in_progress: 'bg-yellow-50 text-yellow-700',
  done_pending: 'bg-orange-50 text-brand-orange',
  completed: 'bg-green-50 text-green-700',
  declined: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-600',
};

const progressSteps: PrivateStatus[] = ['pending', 'accepted', 'in_progress', 'done_pending', 'completed'];

function JobDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, loading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [targetFirm, setTargetFirm] = useState<Firm | null>(null);
  const [images, setImages] = useState<JobImage[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewPreviews, setReviewPreviews] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Problem report
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemText, setProblemText] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/prijava/');
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    if (!id || !user) return;
    setLoadingData(true);
    setError('');

    const { data: jobData, error: jobErr } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('client_id', user.id)
      .single();

    if (jobErr || !jobData) {
      setError('Posao nije pronađen ili nemate pristup.');
      setLoadingData(false);
      return;
    }
    const typedJob = jobData as Job;
    setJob(typedJob);

    const [{ data: bidsData }, { data: imagesData }, { data: firmData }, { data: reviewData }] = await Promise.all([
      supabase
        .from('bids')
        .select('*, firms(id,name,city,logo_url,owner_id)')
        .eq('job_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('job_images')
        .select('id, image_url')
        .eq('job_id', id)
        .order('created_at', { ascending: true }),
      typedJob.is_private && typedJob.target_firm_id
        ? supabase.from('firms').select('id,name,city,logo_url').eq('id', typedJob.target_firm_id).single()
        : Promise.resolve({ data: null }),
      supabase.from('reviews').select('id,rating,comment,image_url,created_at').eq('job_id', id).maybeSingle(),
    ]);

    setBids((bidsData as Bid[]) || []);
    setImages((imagesData as JobImage[]) || []);
    setTargetFirm((firmData as Firm) || null);
    setReview((reviewData as Review) || null);

    setLoadingData(false);
  }, [id, user]);

  useEffect(() => {
    if (id && user) fetchData();
  }, [id, user, fetchData]);

  async function acceptBid(bidId: string) {
    if (!job) return;
    setActionId(bidId);
    setError('');

    await supabase.from('bids').update({ status: 'rejected' }).eq('job_id', job.id).neq('id', bidId);
    await supabase.from('bids').update({ status: 'accepted' }).eq('id', bidId);
    await supabase.from('jobs').update({ status: 'in_progress', updated_at: new Date().toISOString() }).eq('id', job.id);

    const acceptedBid = bids.find((b) => b.id === bidId);
    if (acceptedBid?.firms?.owner_id) {
      await supabase.from('notifications').insert({
        user_id: acceptedBid.firms.owner_id,
        type: 'bid_accepted',
        title: 'Vaša ponuda je prihvaćena',
        message: `Klijent je prihvatio vašu ponudu od ${acceptedBid.amount.toLocaleString('bs-BA')} KM za "${job.title}".`,
        job_id: job.id,
      });
    }

    setActionId(null);
    await fetchData();
  }

  async function completeJob() {
    if (!job) return;
    setActionId('complete');
    await supabase
      .from('jobs')
      .update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', job.id);
    setActionId(null);
    await fetchData();
    setShowReviewForm(true);
  }

  async function confirmPrivateComplete() {
    if (!job) return;
    setActionId('confirm');
    await supabase
      .from('jobs')
      .update({
        private_status: 'completed',
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    setActionId(null);
    await fetchData();
    setShowReviewForm(true);
  }

  async function reportProblem() {
    if (!job || !problemText.trim()) return;
    setActionId('problem');
    await supabase
      .from('jobs')
      .update({
        problem_reported: true,
        problem_description: problemText.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    setActionId(null);
    setShowProblemForm(false);
    setProblemText('');
    await fetchData();
  }

  async function cancelPrivateJob() {
    if (!job) return;
    if (!confirm('Da li ste sigurni da želite otkazati ovaj zahtjev?')) return;
    setActionId('cancel');
    await supabase
      .from('jobs')
      .update({
        private_status: 'cancelled',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    setActionId(null);
    await fetchData();
  }

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          const name = file.name.replace(/\.[^.]+$/, '.jpg') || 'image.jpg';
          resolve(new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => reject(new Error('Greška prilikom učitavanja slike.'));
      img.src = url;
    });
  };

  const handleReviewImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!selected.every((f) => allowedTypes.includes(f.type))) {
      setError('Dozvoljeni formati: JPG, PNG, WEBP.');
      return;
    }
    const maxSize = 2 * 1024 * 1024;
    const files = selected.slice(0, 3 - reviewImages.length);
    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const compressed = await compressImage(file);
          if (compressed.size > maxSize) {
            throw new Error(`Slika „${file.name}” ima ${(compressed.size / 1024 / 1024).toFixed(1)} MB. Maksimalno 2 MB.`);
          }
          return compressed;
        })
      );
      setReviewImages((prev) => [...prev, ...processed]);
      setReviewPreviews((prev) => [...prev, ...processed.map((f) => URL.createObjectURL(f))]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška.');
    }
  };

  const removeReviewImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
    setReviewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function submitReview() {
    if (!job || !targetFirm || rating === 0) return;
    setSubmittingReview(true);
    setError('');

    const { data: reviewData, error: reviewErr } = await supabase
      .from('reviews')
      .insert({
        job_id: job.id,
        client_id: user!.id,
        firm_id: targetFirm.id,
        rating,
        comment: comment.trim() || null,
      })
      .select('id')
      .single();

    if (reviewErr || !reviewData) {
      setError(reviewErr?.message || 'Greška prilikom spremanja recenzije.');
      setSubmittingReview(false);
      return;
    }

    const reviewId = reviewData.id;

    for (const file of reviewImages) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `reviews/${reviewId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('review-images').upload(path, file);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('review-images').getPublicUrl(path);
        if (urlData?.publicUrl) {
          await supabase.from('review_images').insert({
            review_id: reviewId,
            image_url: urlData.publicUrl,
            storage_path: path,
          });
        }
      }
    }

    setSubmittingReview(false);
    setReviewSuccess(true);
    await fetchData();
  }

  function renderProgressTimeline() {
    if (!job || !job.is_private || !job.private_status) return null;
    const currentIndex = progressSteps.indexOf(job.private_status);
    return (
      <div className="mt-5 mb-2">
        <div className="flex items-center justify-between">
          {progressSteps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={step} className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                    isCurrent
                      ? 'bg-brand-orange text-[#ffffff] ring-4 ring-brand-orange/20'
                      : isActive
                      ? 'bg-green-500 text-[#ffffff]'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isActive ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`text-[10px] mt-2 text-center leading-tight ${
                    isCurrent ? 'text-brand-orange font-semibold' : isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {privateStatusLabels[step]}
                </span>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-0.5 ${
                      index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ transform: 'translateX(50%)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderPrivateActions() {
    if (!job || !job.is_private) return null;
    const ps = job.private_status;

    if (ps === 'pending') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-steel mb-3">Čeka se odgovor firme.</p>
          <button
            onClick={cancelPrivateJob}
            disabled={actionId === 'cancel'}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {actionId === 'cancel' ? 'Obrada...' : 'Otkaži zahtjev'}
          </button>
        </div>
      );
    }

    if (ps === 'accepted') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-steel">Firma je prihvatila zahtjev. Čeka se da započne rad.</p>
        </div>
      );
    }

    if (ps === 'in_progress') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-steel">Rad je u toku. Možete komunicirati s firmom putem chat-a.</p>
        </div>
      );
    }

    if (ps === 'done_pending') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {job.problem_reported ? (
            <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-3">
              <p className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Prijavljen problem
              </p>
              <p className="mt-1">{job.problem_description}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-steel mb-3">Firma je označila posao kao gotov. Potvrdite završetak ili prijavite problem.</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={confirmPrivateComplete}
                  disabled={actionId === 'confirm'}
                  className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {actionId === 'confirm' ? 'Obrada...' : 'Potvrdi završetak'}
                </button>
                <button
                  onClick={() => setShowProblemForm(true)}
                  className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" /> Prijavi problem
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    if (ps === 'completed') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-green-700 text-sm font-medium flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4" /> Posao je uspješno završen.
          </p>
          {!review && !reviewSuccess && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"
            >
              <Star className="w-4 h-4" /> Ostavi recenziju
            </button>
          )}
          {(review || reviewSuccess) && (
            <p className="text-sm text-steel">Hvala na recenziji. Objavljena je na profilu firme.</p>
          )}
        </div>
      );
    }

    if (ps === 'declined') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">Firma je odbila vaš zahtjev. Možete poslati novi zahtjev drugoj firmi ili objaviti posao javno.</p>
        </div>
      );
    }

    if (ps === 'cancelled') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">Zahtjev je otkazan.</p>
        </div>
      );
    }

    return null;
  }

  function renderPublicActions() {
    if (!job || job.is_private) return null;

    if (job.status === 'in_progress') {
      return (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={completeJob}
            disabled={actionId === 'complete'}
            className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {actionId === 'complete' ? 'Obrada...' : 'Označi kao završen'}
          </button>
        </div>
      );
    }

    if (job.status === 'completed') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-green-700 text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Posao je uspješno završen.
          </p>
        </div>
      );
    }

    return null;
  }

  function renderReviewForm() {
    if (!showReviewForm || !job || !targetFirm) return null;
    if (reviewSuccess) {
      return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Hvala na recenziji</h3>
            <p className="text-sm text-steel">Vaša recenzija je objavljena na profilu firme {targetFirm.name}.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ostavite recenziju</h3>
        <p className="text-sm text-steel mb-4">Kako ste zadovoljni uslugom firme {targetFirm.name}?</p>

        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
              aria-label={`${star} zvjezdica`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-brand-orange fill-brand-orange'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Napišite komentar (opcionalno)"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none mb-4"
        />

        <div className="mb-4">
          <input
            ref={fileInputRef}
            id="review-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleReviewImageChange}
            className="hidden"
            disabled={reviewImages.length >= 3}
          />
          <label
            htmlFor="review-images"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              reviewImages.length >= 3 ? 'text-gray-400 cursor-not-allowed' : 'text-brand-orange cursor-pointer'
            }`}
          >
            <Upload className="w-4 h-4" /> Dodaj fotografije (opcionalno, max 3)
          </label>
          {reviewPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
              {reviewPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview} alt={`Recenzija ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeReviewImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={submitReview}
            disabled={rating === 0 || submittingReview}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
            Objavi recenziju
          </button>
          <button
            onClick={() => setShowReviewForm(false)}
            className="btn-secondary text-sm py-2 px-4"
          >
            Preskoči
          </button>
        </div>
      </div>
    );
  }

  function renderProblemForm() {
    if (!showProblemForm) return null;
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Prijavite problem</h3>
        <p className="text-sm text-steel mb-4">Objasnite što nije u redu s izvedenim radom.</p>
        <textarea
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          rows={3}
          placeholder="Opišite problem..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none mb-4"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={reportProblem}
            disabled={!problemText.trim() || actionId === 'problem'}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {actionId === 'problem' ? 'Obrada...' : 'Pošalji prijavu'}
          </button>
          <button
            onClick={() => setShowProblemForm(false)}
            className="btn-secondary text-sm py-2 px-4"
          >
            Odustani
          </button>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">Učitavanje...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow pt-24 pb-10 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-steel">ID posla nije naveden.</p>
            <Link href="/dashboard/" className="btn-primary mt-4 inline-block">Nazad na dashboard</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/dashboard/" className="inline-flex items-center text-sm text-steel hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Nazad na poslove
          </Link>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {loadingData ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje...
            </div>
          ) : !job ? (
            <p className="text-steel">Posao nije pronađen.</p>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left column: details and actions */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                    <div className="flex items-center gap-2">
                      {(job.status === 'open' || job.status === 'bidding') && (
                        <Link
                          href={`/dashboard/?editJobId=${job.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orange-dark bg-orange-50 px-2.5 py-1 rounded-full transition-colors"
                        >
                          Uredi posao
                        </Link>
                      )}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          job.is_private && job.private_status
                            ? privateStatusColors[job.private_status]
                            : publicStatusColors[job.status]
                        }`}
                      >
                        {job.is_private && job.private_status
                          ? privateStatusLabels[job.private_status]
                          : publicStatusLabels[job.status]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-steel mb-4">
                    <MapPin className="w-4 h-4" /> {job.city}
                    {job.address ? `, ${job.address}` : ''}
                    <span className="w-1 h-1 bg-steel rounded-full" />
                    <span>{job.is_private ? 'Privatni zahtjev' : 'Javni oglas'} · {formatDate(job.created_at)}</span>
                  </div>

                  {job.is_private && targetFirm && (
                    <div className="flex items-center gap-3 bg-cloud rounded-xl p-3 mb-4">
                      {targetFirm.logo_url ? (
                        <div className="relative w-12 h-12 shrink-0">
                          <NextImage
                            src={targetFirm.logo_url}
                            alt={targetFirm.name}
                            fill
                            unoptimized
                            sizes="48px"
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-lg">
                          {targetFirm.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{targetFirm.name}</p>
                        <p className="text-xs text-steel">{targetFirm.city}</p>
                      </div>
                    </div>
                  )}

                  {job.client_question && (
                    <div className="bg-blue-50 text-blue-800 rounded-lg p-3 text-sm mb-4">
                      <p className="font-semibold mb-1">Vaše pitanje:</p>
                      <p>{job.client_question}</p>
                    </div>
                  )}

                  <p className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm mt-4">
                    <span className="inline-flex items-center gap-1.5 text-steel bg-cloud rounded-lg px-3 py-1.5">
                      <DollarSign className="w-4 h-4 text-brand-orange" />
                      {job.budget_mode === 'open'
                        ? 'Majstori predlažu cijenu'
                        : job.budget_min != null && job.budget_max != null
                        ? `${job.budget_min} - ${job.budget_max} KM`
                        : job.budget_min != null
                        ? `od ${job.budget_min} KM`
                        : job.budget_max != null
                        ? `do ${job.budget_max} KM`
                        : 'Budžet po dogovoru'}
                    </span>
                    {job.deadline && (
                      <span className="inline-flex items-center gap-1.5 text-steel bg-cloud rounded-lg px-3 py-1.5">
                        <Calendar className="w-4 h-4 text-brand-orange" />
                        Rok: {formatDate(job.deadline)}
                      </span>
                    )}
                  </div>

                  {images.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Fotografije posla
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {images.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => setSelectedImage(img.image_url)}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand-orange transition"
                          >
                            <NextImage
                              src={img.image_url}
                              alt=""
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 33vw, 25vw"
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.is_private && renderProgressTimeline()}
                  {job.is_private ? renderPrivateActions() : renderPublicActions()}
                </div>

                {!job.is_private && (
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Ponude {bids.length > 0 && <span className="text-steel font-normal text-sm">({bids.length})</span>}
                    </h2>
                    {bids.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-steel text-sm">Još uvijek nema ponuda za ovaj posao.</p>
                        <p className="text-steel text-xs mt-1">Prve ponude obično stižu u roku od 24 sata.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {bids.map((bid) => (
                          <div key={bid.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div>
                                <h3 className="font-bold text-gray-900">{bid.firms?.name || 'Firma'}</h3>
                                <p className="text-xs text-steel">{bid.firms?.city}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-brand-orange">{bid.amount} KM</p>
                                <p className={`text-xs font-medium ${bid.status === 'accepted' ? 'text-green-700' : bid.status === 'rejected' ? 'text-gray-500' : 'text-steel'}`}>
                                  {bid.status === 'pending' && 'Na čekanju'}
                                  {bid.status === 'accepted' && 'Prihvaćena'}
                                  {bid.status === 'rejected' && 'Odbijena'}
                                </p>
                              </div>
                            </div>
                            {bid.message && <p className="text-sm text-gray-900 mt-2 bg-cloud rounded-lg p-3">{bid.message}</p>}
                            <p className="text-xs text-steel mt-2">Poslato {formatDate(bid.created_at)}</p>
                            {(job.status === 'open' || job.status === 'bidding') && bid.status === 'pending' && (
                              <button
                                onClick={() => acceptBid(bid.id)}
                                disabled={actionId === bid.id}
                                className="mt-3 btn-primary text-sm py-2 px-4 disabled:opacity-50"
                              >
                                {actionId === bid.id ? 'Obrada...' : 'Prihvati ponudu'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {renderProblemForm()}
                {renderReviewForm()}
              </div>

              {/* Right column: chat */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-orange" /> Razgovor
                </h2>
                {job.is_private && targetFirm ? (
                  <JobChat
                    jobId={job.id}
                    userId={user.id}
                    role="client"
                    partnerName={targetFirm.name}
                    partnerIsAdmin={false}
                  />
                ) : (
                  <p className="text-steel text-sm">Razgovor je dostupan nakon prihvaćanja ponude.</p>
                )}
              </div>
            </div>
          )}

          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Zatvori"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                <div className="relative max-w-full max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
                  <NextImage
                    src={selectedImage}
                    alt=""
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-cloud">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </main>
          <Footer />
        </div>
      }
    >
      <JobDetail />
    </Suspense>
  );
}
