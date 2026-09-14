import { LucideIcon } from 'lucide-react';

export interface DashboardStatProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tone?: 'neutral' | 'orange' | 'red' | 'green';
  isLoading?: boolean;
}

const toneStyles = {
  neutral: {
    iconBg: 'bg-ink-800',
    iconColor: 'text-white/70',
  },
  orange: {
    iconBg: 'bg-brand-orange/10',
    iconColor: 'text-brand-orange',
  },
  red: {
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
  },
  green: {
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
  },
};

export default function DashboardStat({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'neutral',
  isLoading,
}: DashboardStatProps) {
  const style = toneStyles[tone];

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-ink-800 bg-ink-900/60 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${style.iconBg}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 rounded-full border-2 border-ink-700 border-t-brand-orange animate-spin" />
        ) : (
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/70 uppercase tracking-wider">{label}</p>
        <p className="text-base font-bold text-white truncate">
          {isLoading ? 'Učitavanje...' : value}
        </p>
        {sub && <p className="text-xs text-white/70 truncate">{sub}</p>}
      </div>
    </div>
  );
}
