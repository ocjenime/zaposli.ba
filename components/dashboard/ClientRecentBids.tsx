'use client';

import Link from 'next/link';
import { Send, ArrowRight, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface Bid {
  id: string;
  job_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  jobs: { title: string }[] | null;
  firms: { name: string | null }[] | null;
}

interface ClientRecentBidsProps {
  bids: Bid[];
}

function statusLabel(status: Bid['status']) {
  switch (status) {
    case 'pending':
      return 'Na čekanju';
    case 'accepted':
      return 'Prihvaćeno';
    case 'rejected':
      return 'Odbijeno';
    default:
      return status;
  }
}

function statusClass(status: Bid['status']) {
  switch (status) {
    case 'accepted':
      return 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400 border-green-100 dark:border-green-500/20';
    case 'rejected':
      return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-100 dark:border-red-500/20';
    default:
      return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
  }
}

export default function ClientRecentBids({ bids }: ClientRecentBidsProps) {
  const recent = bids.slice(0, 3);

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Nove ponude</h3>
        <Link
          href="/dashboard/?tab=bids"
          className="text-xs font-semibold text-brand-orange flex items-center gap-0.5 hover:underline"
        >
          Sve ponude <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-2">
            <Send className="w-5 h-5 text-steel" />
          </div>
          <p className="text-sm text-steel">Još nema ponuda na vaše poslove.</p>
          <Link
            href="/objavi-projekat/"
            className="inline-block mt-2 text-xs font-semibold text-brand-orange hover:underline"
          >
            Objavi posao
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((bid) => (
            <Link
              key={bid.id}
              href={`/dashboard/poslovi/?id=${bid.job_id}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-ink-800 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 text-steel" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {bid.firms?.[0]?.name || 'Firma'}
                </p>
                <p className="text-xs text-steel truncate">{bid.jobs?.[0]?.title || 'Posao'}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass(bid.status)}`}>
                  {statusLabel(bid.status)}
                </span>
                <p className="text-[10px] text-steel mt-0.5">{bid.amount.toLocaleString('bs')} KM</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
