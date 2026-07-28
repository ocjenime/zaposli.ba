import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

interface BreadcrumbsProps {
  items: { name: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = [
    { name: 'Početna', url: '/' },
    ...items
      .filter((i) => i.href)
      .map((i) => ({ name: i.name, url: i.href! })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-0">
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-steel">
        <li>
          <Link href="/" className="hover:text-brand-orange transition-colors">Početna</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-mist" />
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-orange transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-ink font-medium" aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
