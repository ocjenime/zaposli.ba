import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories, cities, type Category } from '@/lib/data';
import { site } from '@/lib/site';
import CategoryCard from '@/components/CategoryCard';
import FeaturedCategoryCard from '@/components/FeaturedCategoryCard';
import { ArrowRight, Search } from 'lucide-react';

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

  const totalCategories = visible.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije' }]} />

        {/* Hero */}
        <section className="relative overflow-hidden bg-ink">
          <div className="absolute inset-0">
            <Image
              src="/zaposli.ba/images/farbanje-zid.jpg"
              alt="Majstor farba zid"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/70" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange md:text-base">
                {totalCategories} kategorij{totalCategories === 1 ? 'a' : 'e'} usluga
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Pronađite majstora za svaki posao
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/80 md:text-xl">
                Od građevine i instalacija do čišćenja, selidbi i hitnih intervencija 24/7 — povezujemo vas sa provjerenim izvođačima širom Bosne i Hercegovine.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/objavi-projekat/"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Objavite posao besplatno
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projekti/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
                >
                  <Search className="h-4 w-4" />
                  Pretraži projekte
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-white/70">
                <div>
                  <span className="block text-2xl font-bold text-white md:text-3xl">{totalCategories}</span>
                  <span className="text-sm">kategorija</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white md:text-3xl">{cities.length}</span>
                  <span className="text-sm">gradova</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white md:text-3xl">0 KM</span>
                  <span className="text-sm">za klijente</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured: hitne intervencije 24/7 */}
        {featured.map((cat) => (
          <FeaturedCategoryCard key={cat.slug} slug={cat.slug} />
        ))}

        {/* Grupe kategorija */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 md:mb-14">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Sve kategorije usluga
              </h2>
              <p className="mt-2 max-w-2xl text-steel">
                Izaberite oblast i pronađite majstore, građevinske firme i specijalizovane izvođače u vašem gradu.
              </p>
            </div>

            <div className="space-y-14 md:space-y-16">
              {groups.map((group) => (
                <div key={group.name}>
                  <div className="mb-5 flex items-baseline gap-3 border-b border-gray-200 pb-3">
                    <h2 className="text-lg font-bold text-gray-900 md:text-xl">{group.name}</h2>
                    <span className="text-sm text-steel">
                      {group.cats.length} {group.cats.length === 1 ? 'kategorija' : 'kategorije'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {group.cats.map((category) => (
                      <CategoryCard key={category.slug} slug={category.slug} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-ink py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-950" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
              Ne pronalazite traženu kategoriju?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
              Objavite posao i opišite šta vam je potrebno. Provjereni majstori i firme iz cijele BiH javit će vam se sa ponudama.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/objavi-projekat/" className="btn-primary inline-flex items-center gap-2">
                Objavite posao
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/kako-radi/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                Kako funkcioniše
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
