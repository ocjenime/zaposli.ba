import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PageHero from '@/components/ui/PageHero';
import { cities, categories } from '@/lib/data';
import { site } from '@/lib/site';
import CityCategoriesGrid from '@/components/CityCategoriesGrid';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi', href: '/gradovi/' }, { name: city.name }]} />
        <JsonLd data={breadcrumbSchema([
          { name: 'Početna', url: '/' },
          { name: 'Gradovi', url: '/gradovi/' },
          { name: city.name },
        ])} />

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
