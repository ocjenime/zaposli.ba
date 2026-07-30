import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, BadgeCheck, Star, Siren } from 'lucide-react';
import { EmergencyProcessAnimation } from '@/components/EmergencyProcessAnimation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { JsonLd, breadcrumbSchema, serviceSchema } from '@/lib/jsonld';
import { categories, getCategory, cities, workers, projects } from '@/lib/data';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return categories.filter((c) => !c.noSeo).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name}: ${cat.count} provjerenih firmi | Zaposli.ba`,
    description: `${cat.description}. Pronađite ${cat.profession.toLowerCase()} širom BiH. Objavite posao besplatno i primite ponude.`,
    alternates: { canonical: `${site.url}/kategorije/${cat.slug}/` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const catWorkers = workers.filter((w) => w.categorySlug === cat.slug);
  const catProjects = projects.filter((p) => p.categorySlug === cat.slug);
  const Icon = cat.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije', href: '/kategorije/' }, { name: cat.name }]} />
        <JsonLd data={serviceSchema({ name: cat.name, description: cat.description, area: 'Bosna i Hercegovina', url: `/kategorije/${cat.slug}/`, providerCount: cat.count })} />

        {/* Hero */}
        <section className="relative bg-cloud py-14 md:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
                cat.featured
                  ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-red-600/25'
                  : 'bg-gradient-to-br from-brand-orange to-brand-orange-dark shadow-brand-orange/25'
              }`}>
                <Icon className="w-8 h-8 text-[#ffffff]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{cat.name}</h1>
                  {cat.featured && (
                    <span className="inline-flex items-center gap-1.5 bg-red-600 text-[#ffffff] text-xs font-bold px-3 py-1 rounded-full">
                      <Siren className="w-3.5 h-3.5" />
                      24/7 · dostupno odmah
                    </span>
                  )}
                </div>
                <p className="text-steel mt-1">{cat.count} provjerenih firmi širom BiH</p>
              </div>
            </div>
            <p className="text-lg text-steel max-w-2xl mb-6">{cat.description}.</p>

            {/* Usluge u kategoriji */}
            <div className="flex flex-wrap gap-2 mb-8">
              {cat.services.map((s) => (
                <span
                  key={s}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${
                    cat.featured
                      ? 'bg-red-50 border-red-100 text-red-800'
                      : 'bg-white border-gray-100 text-gray-900/80'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
            <Link
              href="/objavi-projekat/"
              className={`inline-flex items-center gap-2 bg-gradient-to-r text-[#ffffff] px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95 ${
                cat.featured
                  ? 'from-red-600 to-red-700 hover:shadow-red-600/25'
                  : 'from-brand-orange to-brand-orange-dark hover:shadow-brand-orange/25'
              }`}
            >
              {cat.featured ? 'Objavi hitan posao besplatno' : 'Objavi posao besplatno'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Kako funkcioniše: samo za hitne intervencije */}
        {cat.featured && (
        <section className="py-12 md:py-16 bg-white border-b border-gray-100">
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
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!cat.noSeo && (
            <div className="mb-14">
              <div className="bg-cloud rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-6 h-6 text-brand-orange" />
                  <h2 className="text-xl font-bold text-gray-900">Po gradovima</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities.slice(0, 10).map((city) => (
                    <Link
                      key={city.slug}
                      href={`/usluge/${cat.seoSlug}-${city.slug}/`}
                      className="px-3 py-1.5 bg-white rounded-lg text-sm text-steel hover:text-brand-orange hover:shadow-md transition-all border border-gray-100"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Majstori */}
            {catWorkers.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Provjereni majstori Â· {cat.name.toLowerCase()}</h2>
                <div className="grid md:grid-cols-3 gap-5 mb-14">
                  {catWorkers.map((w) => (
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
              </>
            )}

            {/* Poslovi */}
            {catProjects.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivni poslovi Â· {cat.name.toLowerCase()}</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {catProjects.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-brand-orange">
                          {p.category}
                        </span>
                        <span className="text-xs text-steel">{p.timeAgo}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                      <p className="text-steel text-sm mb-4 line-clamp-2">{p.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-steel mb-4">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="font-bold text-brand-orange text-sm">{p.budget}</div>
                        <div className="flex items-center gap-1.5 text-xs text-steel">
                          <BadgeCheck className="w-3.5 h-3.5 text-brand-orange" />
                          {p.bids} ponuda
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trebate {cat.profession.toLowerCase()}?</h2>
            <p className="text-steel mb-6 max-w-xl mx-auto">Objavite posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.</p>
            <Link href="/objavi-projekat/" className="btn-primary">Objavi posao besplatno</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
