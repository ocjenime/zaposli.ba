import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EmergencyProcessAnimation } from '@/components/EmergencyProcessAnimation';
import EmergencyBottomBar from '@/components/EmergencyBottomBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { JsonLd, serviceSchema } from '@/lib/jsonld';
import { categories, getCategory, cities } from '@/lib/data';
import { site } from '@/lib/site';
import { getGroupHeroStyle } from '@/lib/hero';
import CategoryHeroStats from '@/components/CategoryHeroStats';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import CategoryFirms from '@/components/CategoryFirms';

export function generateStaticParams() {
  return categories.filter((c) => !c.noSeo).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} u BiH - pronađite majstora ili objavite posao | Zaposli.ba`,
    description: `${cat.description}. Pronađite provjerenog ${cat.profession.toLowerCase()} širom BiH ili objavite posao besplatno i primite ponude od firmi i majstora.`,
    keywords: [
      `${cat.name.toLowerCase()} BiH`,
      `${cat.profession.toLowerCase()}`,
      'majstor BiH',
      'objavi posao',
      'ponude majstora',
      'građevinske firme',
    ],
    alternates: { canonical: `${site.url}/kategorije/${cat.slug}/` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const Icon = cat.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije', href: '/kategorije/' }, { name: cat.name }]} />
        <JsonLd data={serviceSchema({ name: cat.name, description: cat.description, area: 'Bosna i Hercegovina', url: `/kategorije/${cat.slug}/` })} />

        {/* Hero */}
        <section className="relative min-h-[380px] sm:min-h-[440px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/herozaposli.png"
              alt={`${cat.name} - majstor na gradilištu`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-ink-950/35 to-ink-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-ink-950/10 to-ink-950/15" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 sm:pb-8">
              <div className="max-w-2xl">
                <span
                  className={`inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 animate-fade-in ${
                    cat.featured ? 'text-red-400' : 'text-brand-orange'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.featured ? '24/7 · dostupno odmah' : getGroupHeroStyle(cat.group).eyebrow}
                </span>
                <h1 className="text-[28px] sm:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-2 animate-fade-in">
                  {cat.name}
                </h1>
                <p className="text-[13px] sm:text-base text-white/85 leading-snug mb-4 animate-fade-in">
                  {cat.description}. Pronađite provjerenog {cat.profession.toLowerCase()} širom BiH
                  ili objavite posao besplatno.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-white/80 mb-4 animate-fade-in">
                  <CategoryHeroStats slug={cat.slug} />
                </div>
                <div className="flex flex-wrap gap-2 mb-4 max-w-3xl animate-fade-in">
                  {cat.services.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white/10 backdrop-blur-md border border-white/10 text-white/90"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/objavi-projekat/?service=${encodeURIComponent(cat.name)}`}
                  className={`inline-flex items-center gap-2 text-[#ffffff] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:shadow-xl transition-all active:scale-95 animate-fade-in ${
                    cat.featured
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-600/25'
                      : 'bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:shadow-brand-orange/25'
                  }`}
                >
                  {cat.featured ? 'Objavi hitan posao besplatno' : 'Objavi posao besplatno'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* Firme u kategoriji - ranking: ocjena ključna + verifikacija + premium */}
        <CategoryFirms categorySlug={cat.slug} />

        {/* Istaknuti poslovi u kategoriji */}
        <FeaturedJobsSection categorySlug={cat.slug} />

        {/* Kako funkcioniše: samo za hitne intervencije */}
        {cat.featured && (
        <section className="py-8 md:py-10 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Kako funkcioniše hitna intervencija?</h2>
              <p className="text-steel">Tri koraka do majstora, u bilo koje doba dana ili noći.</p>
            </div>

            <div className="bg-red-50/40 border border-red-100 rounded-3xl p-6 md:p-8 mb-8">
              <EmergencyProcessAnimation />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { n: '01', title: 'Opišite kvar', text: 'Objavite hitan posao za 30 sekundi: šta se desilo i gdje se nalazite.' },
                { n: '02', title: 'Firme se javljaju odmah', text: 'Vaš posao dobija prioritet i firme za hitne intervencije u vašem gradu odmah šalju ponude.' },
                { n: '03', title: 'Majstor dolazi', text: 'Dogovorite dolazak, često isti dan. Dostupno vikendom, noću i za praznike.' },
              ].map((step) => (
                <div key={step.n} className="bg-red-50/60 border border-red-100 rounded-2xl p-6 text-center">
                  <div className="text-red-600 text-sm font-extrabold mb-2">{step.n}</div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-steel text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

            {/* Gradovi */}
            <section className="py-8 md:py-10 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {!cat.noSeo && (
                <div className="mb-14">
                  <div className="bg-cloud rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-brand-orange" />
                      <h2 className="text-xl font-bold text-gray-900">{cat.profession} po gradovima</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {[...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs')).map((city) => (
                        <Link
                          key={city.slug}
                          href={`/usluge/${cat.seoSlug}-${city.slug}/`}
                          className="flex items-center justify-between px-3 py-2 bg-white rounded-lg text-sm text-steel hover:text-brand-orange hover:border-brand-orange/30 hover:shadow-sm transition-all border border-gray-100"
                        >
                          <span>{city.name}</span>
                          <ArrowRight className="w-3 h-3 text-gray-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                )}

          </div>
        </section>

        {/* CTA */}
        <section className="py-8 md:py-10 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trebate {cat.profession.toLowerCase()}?</h2>
            <p className="text-steel mb-6 max-w-xl mx-auto">Objavite posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.</p>
            <Link href="/objavi-projekat/" className="btn-primary">Objavi posao besplatno</Link>
          </div>
        </section>

      </main>

        {cat.featured && (
          <EmergencyBottomBar position="corner" href={`/objavi-projekat/?service=${encodeURIComponent(cat.name)}`} />
        )}

      <Footer />
    </div>
  );
}
