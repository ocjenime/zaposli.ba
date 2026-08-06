import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import FirmProfileContent from '../FirmProfileContent';
import { site } from '@/lib/site';
import type { Metadata } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface FirmMeta {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  description: string | null;
  average_rating: number | null;
  review_count: number | null;
}

function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function generateStaticParams() {
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase.from('firms').select('slug');
    return ((data as { slug: string }[]) || []).map((f) => ({ slug: f.slug }));
  } catch {
    return [];
  }
}

async function fetchFirmMeta(slug: string): Promise<FirmMeta | null> {
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('firms')
      .select('id, name, slug, city, description, average_rating, review_count')
      .eq('slug', slug)
      .single();
    return (data as FirmMeta | null) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const firm = await fetchFirmMeta(slug);

  if (!firm) {
    return {
      title: 'Profil firme nije pronađen | Zaposli.ba',
      alternates: { canonical: `${site.url}/firma-profil/${slug}/` },
      robots: { index: false, follow: true },
    };
  }

  const location = firm.city || 'BiH';
  const ratingText = firm.average_rating
    ? ` - ocjena ${firm.average_rating.toFixed(1)}/5`
    : '';

  return {
    title: `${firm.name}${ratingText} - majstor / firma ${location} | Zaposli.ba`,
    description:
      firm.description?.trim() ||
      `Pogledajte profil, usluge, portfolio i recenzije firme ${firm.name} iz ${location}. Zatražite ponudu besplatno na Zaposli.ba.`,
    keywords: [
      firm.name,
      `majstor ${location}`,
      `firma ${location}`,
      'ocjene majstora',
      'recenzije firmi',
      'zatraži ponudu',
      'građevinske firme BiH',
    ],
    alternates: { canonical: `${site.url}/firma-profil/${firm.slug}/` },
    openGraph: {
      title: `${firm.name} - majstor / firma ${location}`,
      description:
        firm.description?.trim() ||
        `Profil, usluge i recenzije firme ${firm.name} iz ${location}.`,
      url: `${site.url}/firma-profil/${firm.slug}/`,
      siteName: site.name,
      locale: 'bs_BA',
      type: 'profile',
    },
  };
}

export default async function FirmProfileSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const firm = await fetchFirmMeta(slug);
  if (!firm) notFound();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Učitavanje...</p>
        </div>
      }
    >
      <FirmProfileContent slug={slug} />
    </Suspense>
  );
}
