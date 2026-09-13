import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, Shield, Clock, Star, Crown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PageHero from '@/components/ui/PageHero';
import LogoDisplay from '@/components/ui/LogoDisplay';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { cities, categories } from '@/lib/data';
import { site } from '@/lib/site';
import { plural } from '@/lib/plural';
import CityCategoriesGrid from '@/components/CityCategoriesGrid';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const revalidate = 60;

interface CityFirm {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  description: string | null;
  premium: boolean;
}

function score(f: CityFirm): number {
  return (f.average_rating || 0) + (f.verified ? 0.5 : 0) + (f.premium ? 0.25 : 0);
}

async function getVerifiedCityFirms(cityName: string): Promise<CityFirm[]> {
  try {
    const supabase = createServerSupabase();
    const [firmsRes, premiumRes] = await Promise.all([
      supabase
        .from('firms')
        .select('id, name, slug, city, logo_url, verified, average_rating, review_count, description')
        .ilike('city', cityName)
        .eq('verified', true)
        .not('slug', 'like', 'test-%'),
      supabase.from('public_firm_premium').select('firm_id'),
    ]);
    if (firmsRes.error) throw firmsRes.error;

    const premiumIds = new Set((premiumRes.data || []).map((r: { firm_id: string }) => r.firm_id));
    const typed = ((firmsRes.data || []) as Omit<CityFirm, 'premium'>[]).map((f) => ({
      ...f,
      premium: premiumIds.has(f.id),
    }));
    return typed.sort((a, b) => score(b) - score(a));
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};
  return {
    title: `Majstori i firme ${city.name} - sve kategorije usluga | Zaposli.ba`,
    description: `Pronađite provjerene majstore i građevinske firme u ${city.loc}. Sve kategorije usluga: vodoinstalateri, električari, keramičari i više. Besplatna objava posla, ponude u roku od 24 sata.`,
    keywords: [
      `majstori ${city.name.toLowerCase()}`,
      `firme ${city.name.toLowerCase()}`,
      `građevinske firme ${city.name.toLowerCase()}`,
      'objavi posao',
      'ponude majstora',
      'sve kategorije',
    ],
    alternates: { canonical: `${site.url}/gradovi/${city.slug}/` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const cityFirms = await getVerifiedCityFirms(city.name);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi', href: '/gradovi/' }, { name: city.name }]} />

        {/* Hero */}
        <PageHero
          title={`Majstori ${city.name}`}
          subtitle={`Provjerene građevinske firme i majstore u gradu ${city.loc}. Objavite posao besplatno i primite ponude u roku od 24 sata.`}
          eyebrow={`${city.name} · BiH`}
          icon={MapPin}
          gradient="bg-gradient-to-br from-ink via-blue-950 to-slate-900"
          size="lg"
        >
          <div className="flex flex-wrap gap-5 text-sm text-white/80 mb-8">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-brand-orange" /> Verificirane firme</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-orange" /> Prve ponude u 24h</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-brand-orange" /> Stvarne recenzije</span>
          </div>
          <Link
            href={`/objavi-projekat/?city=${encodeURIComponent(city.name)}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
          >
            Objavi posao besplatno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </PageHero>

        {/* Verifikovane firme iz grada */}
        {cityFirms.length > 0 && (
          <section className="py-14 bg-white border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
                    Verifikovane firme u gradu
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Majstori i firme {city.loc}
                  </h2>
                  <p className="text-sm text-steel mt-1">
                    Pronađeno {cityFirms.length} {plural(cityFirms.length, ['firma', 'firme', 'firmi'])} · sortirano po ocjeni
                  </p>
                </div>
                <Link
                  href="/objavi-projekat/"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
                >
                  Objavi posao
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {cityFirms.map((firm) => (
                  <Link
                    key={firm.id}
                    href={`/firma-profil/${firm.slug}/`}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 block"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <LogoDisplay name={firm.name} src={firm.logo_url} alt={firm.name} size="lg" rounded="2xl" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                          {firm.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-steel mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{firm.city || 'BiH'}</span>
                        </div>
                      </div>
                      {firm.premium && (
                        <span
                          className="shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-extrabold tracking-wide px-2 py-1 rounded-full shadow-sm"
                          title="Premium član"
                        >
                          <Crown className="w-3 h-3" />
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-steel line-clamp-2 mb-4 min-h-[2.5rem]">
                      {firm.description || 'Provjerena firma na Zaposli.ba.'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                        <span className="text-sm font-bold text-gray-900">
                          {(firm.average_rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-steel">
                          ({firm.review_count || 0} {plural(firm.review_count || 0, ['recenzija', 'recenzije', 'recenzija'])})
                        </span>
                      </div>
                      {firm.verified && <VerifiedBadge size="sm" />}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Istaknuti poslovi u gradu */}
        <FeaturedJobsSection city={city.name} />

        {/* Sve usluge u gradu */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sve usluge · {city.name}</h2>
            <p className="text-steel mb-8">Odaberite kategoriju i pronađite majstore u gradu {city.loc}</p>
            <CityCategoriesGrid slugs={categories.filter((cat) => !cat.noSeo).map((cat) => cat.slug)} citySlug={city.slug} />
          </div>
        </section>

        {/* Empty state for firms */}
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-cloud rounded-2xl p-8 md:p-10 text-center">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-brand-orange" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Tražite majstora u {city.loc}?</h2>
              <p className="text-steel max-w-xl mx-auto mb-6">
                Provjerene firme se aktivno registruju u vašem gradu. Objavite posao besplatno i prve ponude stižu u roku od 24 sata.
              </p>
              <Link
                href={`/objavi-projekat/?city=${encodeURIComponent(city.name)}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
              >
                Objavi posao besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-ink relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-4">
              Trebate majstora u gradu {city.loc}?
            </h2>
            <p className="text-[#ffffff]/60 mb-8 max-w-xl mx-auto">
              Objavite posao besplatno danas: prve ponude stižu u prosjeku u roku od 24 sata.
            </p>
            <Link
              href={`/objavi-projekat/?city=${encodeURIComponent(city.name)}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
            >
              Objavi posao besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
