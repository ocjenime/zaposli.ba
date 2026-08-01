import type { MetadataRoute } from 'next';
import { categories, cities } from '@/lib/data';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    '', '/kategorije', '/projekti', '/kako-radi', '/za-firme', '/savjeti',
    '/faq', '/kontakt', '/o-nama', '/objavi-projekat', '/prijava', '/registracija',
    '/uslovi-koristenja', '/privacy', '/gradovi', '/izdvojeni-majstori',
  ].map((path) => ({
    url: `${site.url}${path}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const cityPages = cities.map((city) => ({
    url: `${site.url}/gradovi/${city.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryPages = categories.filter((c) => !c.noSeo).map((c) => ({
    url: `${site.url}/kategorije/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const servicePages = categories.filter((c) => !c.noSeo).flatMap((c) =>
    cities.map((city) => ({
      url: `${site.url}/usluge/${c.seoSlug}-${city.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...categoryPages, ...servicePages, ...cityPages];
}
