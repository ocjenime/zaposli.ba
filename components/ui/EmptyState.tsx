import Link from 'next/link';
import { SearchX, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({ title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-ink-900/60 rounded-2xl border border-ink-800">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink-800 mb-5">
        <SearchX className="w-8 h-8 text-brand-orange" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70 max-w-md mx-auto mb-6">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
