import { Crown } from 'lucide-react';

export interface DashboardHeaderProps {
  label: string;
  title: string;
  email: string;
  planName?: string;
  planFeatured?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function DashboardHeader({
  label,
  title,
  email,
  planName,
  planFeatured,
  actions,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-gray-100 dark:border-ink-800 shadow-card overflow-hidden animate-fade-in">
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-full translate-x-1/3 -translate-y-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-steel mb-1">{label}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 text-steel">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                {email}
              </span>
              {planName && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 px-2.5 py-1 text-xs font-semibold text-brand-orange-dark dark:text-orange-300">
                  <Crown className={`w-3 h-3 ${planFeatured ? 'text-brand-orange' : 'text-steel'}`} />
                  {planName}
                </span>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      </div>
      {children && (
        <div className="border-t border-gray-100 dark:border-ink-800 px-6 md:px-8 py-4 bg-cloud/40 dark:bg-ink-950/50">
          {children}
        </div>
      )}
    </div>
  );
}
