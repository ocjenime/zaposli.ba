import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { categories, cities } from '@/lib/data';
import { articles } from '@/lib/articles';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    '', '/kategorije', '/poslovi', '/kako-radi', '/za-firme', '/savjeti',
    '/faq', '/kontakt', '/o-nama', '/objavi-projekat', '/prijava', '/registracija',
    '/zaboravljena-lozinka', '/pravila', '/privacy', '/gradovi', '/top-firme',
  ].map((path) => ({
    url: `${site.url}${path}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Add OG cover image to the home page entry
  staticPages[0].images = [`${site.url}/images/og-cover.webp`];

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
    priority: 0.7,
  }));

  const servicePages = categories.filter((c) => !c.noSeo).flatMap((c) =>
    cities.map((city) => ({
      url: `${site.url}/usluge/${c.seoSlug}-${city.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  const articlePages = articles.map((a) => ({
    url: `${site.url}/savjeti/${a.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  let firmPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data } = await supabase.from('firms').select('slug,updated_at');
    const rows = (data as { slug: string; updated_at: string | null }[]) || [];
    firmPages = rows.map((f) => ({
      url: `${site.url}/firma-profil/${f.slug}/`,
      lastModified: f.updated_at ? new Date(f.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // If Supabase is unreachable during build, skip firm pages.
  }

  return [...staticPages, ...categoryPages, ...servicePages, ...cityPages, ...articlePages, ...firmPages];
}
