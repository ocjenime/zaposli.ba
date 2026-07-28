import type { MetadataRoute } from 'next';
import { categories, cities, workers } from '@/lib/data';
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

  const categoryPages = categories.map((c) => ({
    url: `${site.url}/kategorije/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const servicePages = categories.flatMap((c) =>
    cities.map((city) => ({
      url: `${site.url}/usluge/${c.seoSlug}-${city.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  const workerPages = workers.map((w) => ({
    url: `${site.url}/firma/${w.id}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...servicePages, ...cityPages, ...workerPages];
}
