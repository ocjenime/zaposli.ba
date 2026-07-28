import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Star, CheckCircle, ArrowRight, Quote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { JsonLd, localBusinessSchema } from '@/lib/jsonld';
import { workers, getWorker, getCategory } from '@/lib/data';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return workers.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const w = getWorker(id);
  if (!w) return {};
  return {
    title: `${w.name} — ${w.specialty} ${w.location} | Zaposli.ba`,
    description: `${w.name}, ${w.specialty.toLowerCase()} u gradu ${w.location}. Ocjena ${w.rating} od ${w.reviews} recenzija, ${w.projects} završenih projekata. Provjerena firma na Zaposli.ba.`,
    alternates: { canonical: `${site.url}/firma/${w.id}/` },
  };
}

export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const w = getWorker(id);
  if (!w) notFound();
  const cat = getCategory(w.categorySlug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[
          { name: 'Kategorije', href: '/kategorije/' },
          ...(cat ? [{ name: cat.name, href: `/kategorije/${cat.slug}/` }] : []),
          { name: w.name },
        ]} />
        <JsonLd data={localBusinessSchema({ name: w.name, specialty: w.specialty, location: w.location, rating: w.rating, reviews: w.reviews, url: `/firma/${w.id}/` })} />

        {/* Profil hero */}
        <section className="relative bg-cloud py-14 md:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-extrabold text-3xl shrink-0 shadow-lg">
                {w.initial}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">{w.name}</h1>
                  <VerifiedBadge />
                </div>
                <p className="text-steel text-lg mb-3">{w.specialty}</p>
                <div className="flex flex-wrap items-center gap-5 text-sm text-steel">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                    <b className="text-ink">{w.rating}</b> ({w.reviews} recenzija)
                  </span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{w.location}</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-brand-orange" />{w.projects} završenih projekata</span>
                </div>
              </div>
            </div>
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
            >
              Zatraži ponudu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Lijevo: o firmi + usluge */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-ink mb-4">O firmi</h2>
                <p className="text-steel leading-relaxed mb-10">{w.about}</p>

                <h2 className="text-2xl font-bold text-ink mb-4">Usluge</h2>
                <div className="flex flex-wrap gap-2 mb-10">
                  {w.services.map((s) => (
                    <span key={s} className="px-4 py-2 bg-cloud rounded-xl text-sm font-medium text-ink border border-gray-100">
                      {s}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-ink mb-6">Recenzije kupaca</h2>
                <div className="space-y-5">
                  {w.reviewList.map((r) => (
                    <div key={r.author} className="bg-cloud rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-bold text-xs">
                            {r.author.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-ink text-sm">{r.author}</div>
                            <div className="text-xs text-steel">{r.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-brand-orange fill-brand-orange' : 'text-mist'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Quote className="w-4 h-4 text-primary-200 shrink-0 mt-0.5" />
                        <p className="text-steel text-sm leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desno: statistika kartica */}
              <div>
                <div className="bg-ink rounded-3xl p-8 text-white sticky top-28">
                  <h3 className="text-lg font-bold mb-6">Ukratko</h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">Ocjena</span>
                      <span className="font-extrabold text-brand-orange text-xl">{w.rating}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">Recenzija</span>
                      <span className="font-bold">{w.reviews}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">Projekata</span>
                      <span className="font-bold">{w.projects}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">Lokacija</span>
                      <span className="font-bold">{w.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Status</span>
                      <VerifiedBadge size="sm" />
                    </div>
                  </div>
                  <Link
                    href="/objavi-projekat/"
                    className="block w-full text-center mt-8 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                  >
                    Zatraži ponudu
                  </Link>
                  <p className="text-white/40 text-xs text-center mt-3">Besplatno i neobavezujuće</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
