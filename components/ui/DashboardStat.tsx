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
    iconBg: 'bg-cloud dark:bg-ink-800',
    iconColor: 'text-steel',
  },
  orange: {
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-brand-orange',
  },
  red: {
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
  },
  green: {
    iconBg: 'bg-success-50 dark:bg-success-900/20',
    iconColor: 'text-success-600',
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
    <div className="group flex items-center gap-4 rounded-xl border border-gray-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${style.iconBg}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-brand-orange animate-spin" />
        ) : (
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-steel uppercase tracking-wider">{label}</p>
        <p className="text-base font-bold text-gray-900 dark:text-white truncate">
          {isLoading ? 'Učitavanje...' : value}
        </p>
        {sub && <p className="text-xs text-steel truncate">{sub}</p>}
      </div>
    </div>
  );
}
