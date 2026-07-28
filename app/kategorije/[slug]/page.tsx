import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, BadgeCheck, TrendingUp, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { JsonLd, breadcrumbSchema, serviceSchema } from '@/lib/jsonld';
import { categories, getCategory, cities, workers, projects } from '@/lib/data';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — ${cat.count} provjerenih firmi | Zaposli.ba`,
    description: `${cat.description}. Pronađite ${cat.profession.toLowerCase()} širom BiH — prosječne cijene: ${cat.priceRange}. Objavite projekat besplatno.`,
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
        <section className="relative bg-gradient-hero py-14 md:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-lg shrink-0">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{cat.name}</h1>
                <p className="text-white/60 mt-1">{cat.count} provjerenih firmi širom BiH</p>
              </div>
            </div>
            <p className="text-lg text-white/60 max-w-2xl mb-8">{cat.description}.</p>
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
            >
              Objavi projekat besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Cijene + gradovi */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 mb-14">
              <div className="bg-cloud rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-brand-orange" />
                  <h2 className="text-xl font-bold text-ink">Prosječne cijene</h2>
                </div>
                <div className="text-3xl font-extrabold text-ink mb-1">{cat.priceRange}</div>
                <p className="text-steel text-sm">{cat.priceNote}. Tačna cijena zavisi od obima posla — zato objavite projekat i uporedite stvarne ponude.</p>
              </div>
              <div className="bg-cloud rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-6 h-6 text-brand-orange" />
                  <h2 className="text-xl font-bold text-ink">Po gradovima</h2>
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

            {/* Majstori */}
            {catWorkers.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-ink mb-6">Provjereni majstori — {cat.name.toLowerCase()}</h2>
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
                          <h3 className="font-bold text-ink group-hover:text-brand-orange transition-colors">{w.name}</h3>
                          <p className="text-xs text-steel">{w.specialty} · {w.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                        <span className="font-bold text-ink text-sm">{w.rating}</span>
                        <span className="text-xs text-steel">({w.reviews} recenzija)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <VerifiedBadge size="sm" />
                        <span className="text-xs text-steel">{w.projects} projekata</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Projekti */}
            {catProjects.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-ink mb-6">Aktivni projekti — {cat.name.toLowerCase()}</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {catProjects.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-brand-orange">
                          {p.category}
                        </span>
                        <span className="text-xs text-steel">{p.timeAgo}</span>
                      </div>
                      <h3 className="text-lg font-bold text-ink mb-2">{p.title}</h3>
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
            <h2 className="text-2xl font-bold text-ink mb-3">Trebate {cat.profession.toLowerCase()}?</h2>
            <p className="text-steel mb-6 max-w-xl mx-auto">Objavite projekat besplatno i primite ponude od provjerenih firmi u roku od 24 sata.</p>
            <Link href="/objavi-projekat/" className="btn-primary">Objavi projekat besplatno</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
