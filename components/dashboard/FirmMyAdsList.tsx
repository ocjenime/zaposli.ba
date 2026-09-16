'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Megaphone, MoreVertical, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAdTypeLabel } from '@/lib/promoted-ads';

interface Ad {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'expired' | 'rejected';
  created_at: string;
  image_url: string | null;
  ad_type: 'promotion' | 'worker_search';
}

function statusLabel(status: Ad['status']) {
  switch (status) {
    case 'active':
      return 'Aktivan';
    case 'pending':
      return 'Na čekanju';
    case 'rejected':
      return 'Odbijen';
    case 'expired':
      return 'Istekao';
    default:
      return status;
  }
}

function statusClass(status: Ad['status']) {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400 border-green-100 dark:border-green-500/20';
    case 'pending':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
    case 'rejected':
      return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-100 dark:border-red-500/20';
    case 'expired':
      return 'bg-gray-100 text-gray-700 dark:bg-ink-800 dark:text-white/60 border-gray-200 dark:border-ink-700';
  }
}

interface FirmMyAdsListProps {
  firmId: string;
}

export default function FirmMyAdsList({ firmId }: FirmMyAdsListProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('promoted_ads')
        .select('id,title,status,created_at,image_url,ad_type')
        .eq('firm_id', firmId)
        .order('created_at', { ascending: false })
        .limit(3);
      if (!error) setAds((data as Ad[]) || []);
      setLoading(false);
    }
    load();
  }, [firmId]);

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Moji oglasi</h3>
        <Link
          href="/dashboard/firma/?tab=ads"
          className="text-xs font-semibold text-brand-orange flex items-center gap-0.5 hover:underline"
        >
          Svi oglasi <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-steel" />
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-2">
            <Megaphone className="w-5 h-5 text-steel" />
          </div>
          <p className="text-sm text-steel">Još nemate oglasa.</p>
          <Link
            href="/dashboard/firma/?tab=ads"
            className="inline-block mt-2 text-xs font-semibold text-brand-orange hover:underline"
          >
            Objavi prvi oglas
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <Link
              key={ad.id}
              href={`/izdvojeni-oglasi/${ad.id}/`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-ink-950 shrink-0">
                {ad.image_url ? (
                  <Image src={ad.image_url} alt={ad.title} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-steel" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ad.title}</p>
                <p className="text-xs text-steel">{getAdTypeLabel(ad.ad_type)}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass(ad.status)}`}
              >
                {statusLabel(ad.status)}
              </span>
              <MoreVertical className="w-4 h-4 text-gray-300 dark:text-white/20" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
