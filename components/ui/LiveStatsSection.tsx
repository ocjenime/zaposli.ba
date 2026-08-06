'use client';

import { useLiveStats } from '@/hooks/useLiveStats';

function formatRealCount(value: number | null): string {
  if (value === null || value === undefined || value < 0) return '-';
  return value.toLocaleString('bs');
}

function formatRealRating(value: number | null): string {
  if (value === null || value === undefined) return '-';
  return value.toFixed(1);
}

export default function LiveStatsSection() {
  const { firmsCount, clientsCount, completedJobsCount, averageRating, loading } = useLiveStats();

  const stats = [
    { value: formatRealCount(firmsCount), label: 'registrovanih firmi' },
    { value: formatRealCount(clientsCount), label: 'registrovanih klijenata' },
    { value: formatRealRating(averageRating), label: 'prosječna ocjena firmi' },
    { value: formatRealCount(completedJobsCount), label: 'završenih poslova' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-card ${
            loading ? 'opacity-70' : ''
          }`}
        >
          <div className="text-3xl md:text-4xl font-extrabold text-brand-orange mb-2">
            {loading ? <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" /> : stat.value}
          </div>
          <div className="text-sm text-steel">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
