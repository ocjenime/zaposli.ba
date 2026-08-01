'use client';

import { useLiveStats, formatCount, formatRating } from '@/hooks/useLiveStats';

export default function LiveStatsSection() {
  const { firmsCount, clientsCount, completedJobsCount, averageRating, loading } = useLiveStats();

  const stats = [
    { value: formatCount(firmsCount, '2.800+'), label: 'verificiranih firmi' },
    { value: formatCount(clientsCount, '12.500+'), label: 'registrovanih klijenata' },
    { value: formatRating(averageRating, '4,8'), label: 'prosječna ocjena firmi' },
    { value: formatCount(completedJobsCount, '25.000+'), label: 'realiziranih poslova' },
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
            {stat.value}
          </div>
          <div className="text-sm text-steel">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
