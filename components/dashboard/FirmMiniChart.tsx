'use client';

interface DailyVisit {
  date: string;
  count: number;
}

interface FirmMiniChartProps {
  data: DailyVisit[];
  total?: number;
  growth?: number;
}

export default function FirmMiniChart({ data, total, growth }: FirmMiniChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Statistika oglasa</h3>
        <p className="text-sm text-steel">Nema dovoljno podataka.</p>
      </div>
    );
  }

  const width = 300;
  const height = 120;
  const padding = 8;
  const max = Math.max(1, ...data.map((d) => d.count));
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (d.count / max) * (height - padding * 2);
    return `${x},${y}`;
  });
  const areaPath = `M ${points[0].split(',')[0]},${height - padding} L ${points.join(' L ')} L ${points[points.length - 1].split(',')[0]},${height - padding} Z`;

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Statistika oglasa</h3>
        <span className="text-[10px] text-steel bg-gray-100 dark:bg-ink-800 px-2 py-1 rounded-full">
          Posljednjih 30 dana
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{total?.toLocaleString('bs') || '0'}</p>
        {growth !== undefined && (
          <span className={`text-xs font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth >= 0 ? '↗' : '↘'} {Math.abs(growth)}%
          </span>
        )}
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#visitGradient)" />
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.join(' ')}
          />
          {data.map((d, i) => {
            const [x, y] = points[i].split(',').map(Number);
            return <circle key={d.date} cx={x} cy={y} r="3" fill="#fff" stroke="#f97316" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-steel mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 4) === 0).map((d) => (
          <span key={d.date}>{d.date.slice(0, 5)}</span>
        ))}
      </div>
    </div>
  );
}
