import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { JsonLd, serviceSchema, faqSchema } from '@/lib/jsonld';
import { categories, cities, type Category, type City } from '@/lib/data';
import { site } from '@/lib/site';
import ServiceCityFirms from '@/components/ServiceCityFirms';

function parseSlug(slug: string): { cat: Category; city: City } | null {
  for (const city of cities) {
    if (slug.endsWith(`-${city.slug}`)) {
      const catSlug = slug.slice(0, -(city.slug.length + 1));
      const cat = categories.find((c) => c.seoSlug === catSlug);
      if (cat) return { cat, city };
    }
  }
  return null;
}

export function generateStaticParams() {
  return categories
    .filter((c) => !c.noSeo)
    .flatMap((c) => cities.map((city) => ({ slug: `${c.seoSlug}-${city.slug}` })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const { cat, city } = parsed;
  return {
    title: `${cat.profession} ${city.name}: provjerene firme | Zaposli.ba`,
    description: `Tražite ${cat.profession.toLowerCase()} u gradu ${city.loc}? Pronađite provjerene firme. Objavite posao besplatno i uporedite ponude.`,
    alternates: { canonical: `${site.url}/usluge/${slug}/` },
  };
}

export default async function ServiceCityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { cat, city } = parsed;
  const Icon = cat.icon;

  const faqItems = [
    {
      question: `Koliko košta ${cat.profession.toLowerCase()} u gradu ${city.loc}?`,
      answer: `Cijena zavisi od obima posla i materijala. Tačnu cijenu dobijate kroz ponude: objavite posao besplatno i firme iz vašeg grada će vam poslati svoje cijene.`,
    },
    {
      question: `Koliko brzo mogu dobiti majstora u gradu ${city.loc}?`,
      answer: `Većina poslova u gradu ${city.loc} dobije prve ponude u roku od 24 sata. Za hitne poslove firme često odgovore u roku od nekoliko sati.`,
    },
    {
      question: `Kako znam da je firma iz vašeg grada pouzdana?`,
      answer: `Svaka firma na platformi prolazi verifikaciju identiteta i poslovanja. Dodatno, za svaku firmu vidite ocjene i recenzije stvarnih klijenata iz vašeg grada i okoline.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[
          { name: 'Kategorije', href: '/kategorije/' },
          { name: cat.name, href: `/kategorije/${cat.slug}/` },
          { name: city.name },
        ]} />
        <JsonLd data={serviceSchema({ name: `${cat.profession} ${city.name}`, description: cat.description, area: city.name, url: `/usluge/${slug}/` })} />
        <JsonLd data={faqSchema(faqItems)} />

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
              {cat.profession} <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">{city.name}</span>
            </h1>
            <p className="text-lg text-steel max-w-2xl mb-4">
              {cat.description} u gradu {city.name}. Objavite posao besplatno i primite ponude od provjerenih firmi iz vašeg grada.
            </p>
            <div className="flex flex-wrap gap-5 text-sm text-steel mb-8">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-brand-orange" /> Verificirane firme</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-orange" /> Prve ponude u 24h</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-brand-orange" /> Stvarne recenzije</span>
            </div>
            <Link
              href={`/objavi-projekat/?service=${encodeURIComponent(cat.name)}&city=${encodeURIComponent(city.name)}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
            >
              Objavi posao besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Firme iz kategorije i grada */}
        <ServiceCityFirms
          categorySlug={cat.slug}
          cityName={city.name}
          profession={cat.profession}
        />

        {/* FAQ */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Česta pitanja</h2>
            <div className="space-y-4">
              {faqItems.map((f) => (
                <details key={f.question} className="group bg-cloud rounded-2xl px-6 py-5 open:bg-white open:border open:border-gray-100 open:shadow-md transition-all">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center gap-4">
                    {f.question}
                    <span className="text-brand-orange text-xl font-bold shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-steel text-sm mt-3 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-ink relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-4">
              Tražite {cat.profession.toLowerCase()} u gradu {city.name}?
            </h2>
            <p className="text-[#ffffff]/60 mb-8 max-w-xl mx-auto">
              Objavite posao besplatno danas: prve ponude stižu u prosjeku u roku od 24 sata.
            </p>
            <Link
              href={`/objavi-projekat/?service=${encodeURIComponent(cat.name)}&city=${encodeURIComponent(city.name)}`}
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
