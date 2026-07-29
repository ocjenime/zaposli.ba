import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Siren } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories, type Category } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kategorije usluga: pronađite majstore | Zaposli.ba',
  description: 'Pronađite majstore za sve vrste usluga u Bosni i Hercegovini. 20 kategorija, od građevine i instalacija do čišćenja, selidbi i hitnih intervencija 24/7.',
  alternates: { canonical: `${site.url}/kategorije/` },
};

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/kategorije/${category.slug}/`}
      className="rounded-2xl p-6 border-2 bg-white text-ink border-gray-100 hover:border-brand-orange/40 group transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <category.icon className="w-7 h-7 text-brand-orange" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink mb-1 group-hover:text-brand-orange transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-steel mb-2">{category.description}</p>
          <p className="text-sm font-medium text-brand-orange">{category.count} firmi</p>
        </div>
      </div>
    </Link>
  );
}

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

        {/* Hero */}
        <section className="relative bg-cloud py-14 md:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-ink mb-4 tracking-tight">Kategorije usluga</h1>
            <p className="text-lg text-steel max-w-2xl mx-auto">
              Pronađite majstore za sve: od građevine i instalacija do čišćenja, selidbi i hitnih intervencija 24/7
            </p>
          </div>
        </section>

        {/* Featured: hitne intervencije 24/7 */}
        {featured.map((cat) => (
          <section key={cat.slug} className="pt-10 md:pt-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href={`/kategorije/${cat.slug}/`}
                className="group block rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 via-white to-white p-6 md:p-8 hover:border-red-400 hover:shadow-xl hover:shadow-red-100 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/25 group-hover:scale-110 transition-transform">
                      <Siren className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl font-extrabold text-ink group-hover:text-red-700 transition-colors">{cat.name}</h2>
                        <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          24/7
                        </span>
                      </div>
                      <p className="text-sm text-steel">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-red-700 font-semibold text-sm shrink-0">
                    {cat.count} firmi
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-5 md:pl-[4.5rem]">
                  {cat.services.map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-medium text-ink/80">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          </section>
        ))}

        {/* Grupe kategorija */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            {groups.map((group) => (
              <div key={group.name}>
                <div className="flex items-baseline gap-3 mb-5">
                  <h2 className="text-xl font-bold text-ink">{group.name}</h2>
                  <span className="text-sm text-steel">{group.cats.length} {group.cats.length === 1 ? 'kategorija' : 'kategorije'}</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.cats.map((category) => (
                    <CategoryCard key={category.slug} category={category} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Ne pronalazite traženu kategoriju?</h2>
            <p className="text-steel mb-6">Objavite posao i opišite šta vam je potrebno. Majstori će vam se javiti sa ponudama.</p>
            <Link href="/objavi-projekat/" className="btn-primary">
              Objavi posao
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
