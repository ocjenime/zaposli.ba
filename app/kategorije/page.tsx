import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories, type Category } from '@/lib/data';
import { site } from '@/lib/site';
import CategoryCard from '@/components/CategoryCard';
import FeaturedCategoryCard from '@/components/FeaturedCategoryCard';

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

        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/zaposli.ba/images/farbanje-zid.jpg"
              alt="Majstor farba zid"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-ink/65" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Kategorije usluga</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Pronađite majstore za sve: od građevine i instalacija do čišćenja, selidbi i hitnih intervencija 24/7
            </p>
          </div>
        </section>

        {/* Featured: hitne intervencije 24/7 */}
        {featured.map((cat) => (
          <FeaturedCategoryCard key={cat.slug} slug={cat.slug} />
        ))}

        {/* Grupe kategorija */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            {groups.map((group) => (
              <div key={group.name}>
                <div className="flex items-baseline gap-3 mb-5">
                  <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
                  <span className="text-sm text-steel">{group.cats.length} {group.cats.length === 1 ? 'kategorija' : 'kategorije'}</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.cats.map((category) => (
                    <CategoryCard key={category.slug} slug={category.slug} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ne pronalazite traženu kategoriju?</h2>
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
