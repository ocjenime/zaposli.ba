import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

interface BreadcrumbsProps {
  items: { name: string; href?: string }[];
  dark?: boolean;
  /** Bez vanjskog offseta - za ubacivanje direktno u hero sekciju. */
  bare?: boolean;
}

export default function Breadcrumbs({ items, dark, bare }: BreadcrumbsProps) {
  const schemaItems = [
    { name: 'Početna', url: '/' },
    ...items.map((i) => ({ name: i.name, url: i.href })),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        bare
          ? `${dark ? '[text-shadow:0_1px_8px_rgba(0,0,0,0.55)]' : ''}`
          : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 pt-2.5 pb-2.5'
      }
    >
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <ol
        className={`flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap overflow-x-auto no-scrollbar ${
          dark ? 'text-white/60' : 'text-steel dark:text-[#ffffff]/70'
        }`}
      >
        <li className="shrink-0">
          <Link
            href="/"
            className={`${dark ? 'hover:text-white' : 'hover:text-brand-orange dark:hover:text-[#ffffff]'} transition-colors`}
          >
            Početna
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className={`w-3.5 h-3.5 ${dark ? 'text-white/30' : 'text-mist dark:text-[#ffffff]/40'}`} />
            {item.href ? (
              <Link
                href={item.href}
                className={`${dark ? 'hover:text-white' : 'hover:text-brand-orange dark:hover:text-[#ffffff]'} transition-colors`}
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={`${dark ? 'text-white' : 'text-gray-900 dark:text-[#ffffff]'} font-medium`}
                aria-current="page"
              >
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
