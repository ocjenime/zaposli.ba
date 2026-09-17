'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Bid {
  created_at: string;
  jobs?: { title: string }[] | null;
  firms?: { name: string | null }[] | null;
}

interface ClientMiniChartProps {
  bids: Bid[];
}

export default function ClientMiniChart({ bids }: ClientMiniChartProps) {
  const days = 14;
  const dates: string[] = [];
  const counts: number[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dates.push(key);
    counts.push(bids.filter((b) => b.created_at.slice(0, 10) === key).length);
  }

  const total = bids.length;
  const max = Math.max(1, ...counts);

  const width = 300;
  const height = 110;
  const padding = 6;
  const points = counts.map((c, i) => {
    const x = padding + (i / (counts.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (c / max) * (height - padding * 2);
    return `${x},${y}`;
  });
  const areaPath = `M ${points[0].split(',')[0]},${height - padding} L ${points.join(' L ')} L ${points[points.length - 1].split(',')[0]},${height - padding} Z`;

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Aktivnost ponuda</h3>
        <span className="text-[10px] text-steel bg-gray-100 dark:bg-ink-800 px-2 py-1 rounded-full">
          Posljednjih 14 dana
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
        <span className="text-xs text-steel">ukupno ponuda</span>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#bidGradient)" />
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.join(' ')}
          />
          {counts.map((c, i) => {
            const [x, y] = points[i].split(',').map(Number);
            return <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#f97316" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-steel mt-1">
        {dates.filter((_, i) => i % 3 === 0).map((d) => (
          <span key={d}>{d.slice(5)}</span>
        ))}
      </div>
      <Link
        href="/dashboard/?tab=bids"
        className="mt-3 w-full inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-ink-800 text-gray-700 dark:text-white text-sm font-semibold hover:bg-gray-200 dark:hover:bg-ink-700 transition-colors"
      >
        Pogledaj sve ponude <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
