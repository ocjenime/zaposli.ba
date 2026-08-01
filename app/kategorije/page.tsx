import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories, type Category } from '@/lib/data';
import { site } from '@/lib/site';
import { cities } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';

export const metadata: Metadata = {
  title: 'Kategorije usluga: pronađite majstore | Zaposli.ba',
  description: 'Pronađite majstore za sve vrste usluga u Bosni i Hercegovini. 20 kategorija, od građevine i instalacija do čišćenja, selidbi i hitnih intervencija 24/7.',
  alternates: { canonical: `${site.url}/kategorije/` },
};

export default function CategoriesPage() {
  const visible = categories.filter((c) => !c.noSeo);
  const featured = visible.filter((c) => c.featured);

  const groups: { name: string; cats: Category[] }[] = [];
  for (const c of visible.filter((c) => !c.featured)) {
    const g = groups.find((g) => g.name === c.group);
    if (g) g.cats.push(c);
    else groups.push({ name: c.group, cats: [c] });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije' }]} />

        {/* Compact header */}
        <section className="pt-8 pb-6 md:pt-12 md:pb-8 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Kategorije usluga</h1>
                <p className="text-steel text-sm md:text-base">
                  Pronađite majstora u {cities.length} gradova i {visible.length} kategorija
                </p>
              </div>
              <Link
                href="/objavi-projekat/"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-brand-orange/20"
              >
                Objavi posao
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured: hitne intervencije 24/7 */}
        <section className="pt-8 md:pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/kategorije/${featured[0]?.slug}/`}
              className="group flex items-center gap-4 rounded-xl border border-red-100 bg-red-50 px-5 py-4 hover:border-red-200 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Hitne intervencije</h2>
                  <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    24/7
                  </span>
                </div>
                <p className="text-sm text-steel truncate">Vodoinstalater, električar i bravar dostupni odmah</p>
              </div>
              <ArrowRight className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>
        </section>

        {/* Grupe kategorija */}
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            {groups.map((group) => (
              <div key={group.name}>
                <h2 className="text-sm font-bold text-steel uppercase tracking-wider mb-3">{group.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {group.cats.map((category) => (
                    <CategoryCard key={category.slug} slug={category.slug} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white border border-gray-100 p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Ne pronalazite traženu kategoriju?</h2>
                <p className="text-sm text-steel">Objavite posao i majstori će vam se javiti sa ponudama.</p>
              </div>
              <Link href="/objavi-projekat/" className="btn-primary text-sm whitespace-nowrap">
                Objavi posao
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
