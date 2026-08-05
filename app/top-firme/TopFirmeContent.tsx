'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, ArrowRight, Shield, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import LogoDisplay from '@/components/ui/LogoDisplay';
import { supabase } from '@/lib/supabase';
import { getCategory } from '@/lib/data';
import { JsonLd, localBusinessListSchema } from '@/lib/jsonld';

interface Firm {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  verified: boolean;
  average_rating: number | null;
  review_count: number | null;
  description: string | null;
}

interface FirmCategory {
  firm_id: string;
  category_slug: string;
}

export default function TopFirmeContent() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFirms() {
      try {
        const { data: firmData } = await supabase
          .from('firms')
          .select('id, name, slug, city, logo_url, verified, average_rating, review_count, description')
          .order('average_rating', { ascending: false })
          .limit(50);

        if (!firmData || firmData.length === 0) return;

        const { data: catData } = await supabase
          .from('firm_categories')
          .select('firm_id, category_slug');

        const categoryMap = (catData || []).reduce<Record<string, string[]>>((acc, row: unknown) => {
          const fc = row as FirmCategory;
          acc[fc.firm_id] = acc[fc.firm_id] || [];
          acc[fc.firm_id].push(fc.category_slug);
          return acc;
        }, {});

        const firmsWithCategory = (firmData as unknown as Firm[]).map((f) => {
          const slugs = categoryMap[f.id] || [];
          const primarySlug = slugs[0];
          const category = primarySlug ? getCategory(primarySlug) : null;
          return { ...f, specialty: category?.name || 'Razne usluge' };
        });

        setFirms(firmsWithCategory as any);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }

    loadFirms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Top firme' }]} />
        {!loading && firms.length > 0 && (
          <JsonLd
            data={localBusinessListSchema(
              firms.map((f) => ({
                name: f.name,
                specialty: (f as any).specialty || 'Razne usluge',
                location: f.city || 'BiH',
                rating: f.average_rating || 0,
                reviews: f.review_count || 0,
                url: `/firma-profil/?slug=${f.slug}`,
                image: f.logo_url || undefined,
              }))
            )}
          />
        )}
        <PageHero
          title="Top firme"
          subtitle="Provjereni profesionalci sa najboljim ocjenama stvarnih klijenata na našoj platformi"
        />

        {/* Trust traka */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-steel">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-orange" />
                Svaki majstor je prošao verifikaciju identiteta
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                Ocjene isključivo od stvarnih klijenata
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-orange" />
                Sortirano prema ocjeni i broju poslova
              </span>
            </div>
          </div>
        </section>

        {/* Majstori */}
        <section className="py-14 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : firms.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Još nema registrovanih firmi</h2>
                <p className="text-steel mb-6 max-w-md mx-auto">
                  Prve firme će se uskoro pojaviti. Do tada, vi možete objaviti posao besplatno.
                </p>
                <Link
                  href="/objavi-projekat/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-6 py-3 rounded-xl font-bold"
                >
                  Objavi posao besplatno
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {firms.map((f) => (
                    <Link
                      key={f.id}
                      href={`/firma-profil/?slug=${f.slug}`}
                      className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-start justify-between mb-5">
                        <LogoDisplay
                          name={f.name}
                          src={f.logo_url}
                          alt={f.name}
                          size="md"
                          rounded="2xl"
                        />
                        {f.verified && <VerifiedBadge size="sm" />}
                      </div>

                      <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-brand-orange transition-colors mb-1">
                        {f.name}
                      </h2>
                      <p className="text-sm text-steel mb-4">
                        {(f as any).specialty}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.round((f.average_rating || 0)) ? 'text-brand-orange fill-brand-orange' : 'text-mist'}`}
                            />
                          ))}
                        </div>
                        <span className="font-extrabold text-gray-900">{(f.average_rating || 0).toFixed(1)}</span>
                        <span className="text-xs text-steel">({f.review_count || 0} recenzija)</span>
                      </div>

                      <p className="text-sm text-steel leading-relaxed mb-5 line-clamp-2">
                        {f.description || 'Firma još nije dodala opis.'}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                        <span className="flex items-center gap-1.5 text-xs text-steel">
                          <MapPin className="w-3.5 h-3.5" />
                          {f.city || 'BiH'}
                        </span>
                        <span className="text-xs font-semibold text-gray-900 bg-cloud px-2.5 py-1 rounded-lg">
                          Zatraži ponudu
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-14 bg-ink rounded-3xl p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-4">
                      Želite ovakvu firmu za vaš posao?
                    </h2>
                    <p className="text-[#ffffff]/60 mb-8 max-w-xl mx-auto">
                      Objavite posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.
                    </p>
                    <Link
                      href="/objavi-projekat/"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
                    >
                      Objavi posao besplatno
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
