import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { cities, categories, workers } from '@/lib/data';
import { site } from '@/lib/site';
import CityCategoriesGrid from '@/components/CityCategoriesGrid';

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};
  return {
    title: `Majstori ${city.name}: sve kategorije | Zaposli.ba`,
    description: `Pronađite provjerene majstore i građevinske firme u gradu ${city.loc}. 20 kategorija usluga, besplatna objava posla, ponude u roku od 24 sata.`,
    alternates: { canonical: `${site.url}/gradovi/${city.slug}/` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const localWorkers = workers.filter((w) => w.location === city.name);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi', href: '/gradovi/' }, { name: city.name }]} />

        {/* Hero */}
        <section className="relative bg-cloud py-14 md:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span className="text-gray-900/80 text-sm font-medium">{city.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
              Majstori <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">{city.name}</span>
            </h1>
            <p className="text-lg text-steel max-w-2xl mb-4">
              Provjerene građevinske firme i majstore u gradu {city.loc}: objavite posao besplatno i primite ponude u roku od 24 sata.
            </p>
            <div className="flex flex-wrap gap-5 text-sm text-steel mb-8">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-brand-orange" /> Verificirane firme</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-orange" /> Prve ponude u 24h</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-brand-orange" /> Stvarne recenzije</span>
            </div>
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
            >
              Objavi posao besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Sve usluge u gradu */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sve usluge · {city.name}</h2>
            <p className="text-steel mb-8">Odaberite kategoriju i pronađite majstore u gradu {city.loc}</p>
            <CityCategoriesGrid slugs={categories.filter((cat) => !cat.noSeo).map((cat) => cat.slug)} citySlug={city.slug} />
          </div>
        </section>

        {/* Lokalni majstori */}
        {localWorkers.length > 0 && (
          <section className="py-14 bg-cloud">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Provjereni majstori u gradu {city.loc}</h2>
              <p className="text-steel mb-8">Ocjene i recenzije stvarnih klijenata</p>
              <div className="grid md:grid-cols-3 gap-5">
                {localWorkers.map((w) => (
                  <Link
                    key={w.id}
                    href={`/firma/${w.id}/`}
                    className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-extrabold text-lg shrink-0">
                        {w.initial}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-brand-orange transition-colors">{w.name}</h3>
                        <p className="text-xs text-steel">{w.specialty} · {w.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                      <span className="font-bold text-gray-900 text-sm">{w.rating}</span>
                      <span className="text-xs text-steel">({w.reviews} recenzija)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <VerifiedBadge size="sm" />
                      <span className="text-xs text-steel">{w.projects} poslova</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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
              href="/objavi-projekat/"
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
