'use client';

import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  client_name?: string;
  firm_name?: string;
}

function getInitials(name: string | null | undefined) {
  if (!name) return 'K';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getCity(name: string | null | undefined) {
  if (!name) return 'Bosna i Hercegovina';
  // Try to extract city from role-like strings if available, otherwise just use name
  return 'Klijent';
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, profiles(full_name), firms(name)')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error || !data || data.length === 0) return;

        const mapped = (data as any[]).map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          client_name: r.profiles?.full_name || 'Klijent',
          firm_name: r.firms?.name || 'Firma',
        }));

        setReviews(mapped);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="hidden md:block py-10 md:py-14 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
            Naši korisnici
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Šta kažu naši korisnici?
          </h2>
          <p className="text-lg text-gray-500">
            Recenzije stvarnih klijenata koji su završili poslove preko Zaposli.ba
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 relative group ${
                loading ? 'opacity-70' : ''
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

              <Quote className="w-8 h-8 text-primary-100 mb-3" />

              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-brand-orange fill-brand-orange' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              <p className="text-steel text-sm mb-6 leading-relaxed line-clamp-4">{t.comment}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-bold text-xs shadow-lg">
                  {getInitials(t.client_name)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.client_name}</div>
                  <div className="text-xs text-steel">{t.firm_name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
