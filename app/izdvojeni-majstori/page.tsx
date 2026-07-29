import Link from 'next/link';
import type { Metadata } from 'next';
import { Star, MapPin, ArrowRight, Shield, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { workers, getCategory } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Izdvojeni majstori: najbolje ocijenjeni | Zaposli.ba',
  description: 'Provjereni profesionalci sa najboljim ocjenama na platformi: vodoinstalateri, električari, keramičari, fasaderi i krovopokrivači širom BiH.',
  alternates: { canonical: `${site.url}/izdvojeni-majstori/` },
};

export default function FeaturedWorkersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Izdvojeni majstori' }]} />
        <PageHero
          title="Izdvojeni majstori"
          subtitle="Provjereni profesionalci sa najboljim ocjenama stvarnih kupaca na našoj platformi"
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
                Ocjene isključivo od stvarnih kupaca
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((w) => {
                const cat = getCategory(w.categorySlug);
                return (
                  <Link
                    key={w.id}
                    href={`/firma/${w.id}/`}
                    className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start justify-between mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-extrabold text-xl shadow-lg group-hover:scale-105 transition-transform">
                        {w.initial}
                      </div>
                      <VerifiedBadge size="sm" />
                    </div>

                    <h2 className="text-xl font-extrabold text-ink group-hover:text-brand-orange transition-colors mb-1">
                      {w.name}
                    </h2>
                    <p className="text-sm text-steel mb-4">
                      {w.specialty}
                      {cat && (
                        <>
                          {' · '}
                          <span className="text-brand-orange font-medium">{cat.name}</span>
                        </>
                      )}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(w.rating) ? 'text-brand-orange fill-brand-orange' : 'text-mist'}`}
                          />
                        ))}
                      </div>
                      <span className="font-extrabold text-ink">{w.rating}</span>
                      <span className="text-xs text-steel">({w.reviews} recenzija)</span>
                    </div>

                    <p className="text-sm text-steel leading-relaxed mb-5 line-clamp-2">{w.about}</p>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-xs text-steel">
                        <MapPin className="w-3.5 h-3.5" />
                        {w.location}
                      </span>
                      <span className="text-xs font-semibold text-ink bg-cloud px-2.5 py-1 rounded-lg">
                        {w.projects} poslova
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-14 bg-ink rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Želite ovakvog majstora za vaš posao?
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  Objavite posao besplatno i primite ponude od provjerenih firmi i zanatlija u roku od 24 sata.
                </p>
                <Link
                  href="/objavi-projekat/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
                >
                  Objavi posao besplatno
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
