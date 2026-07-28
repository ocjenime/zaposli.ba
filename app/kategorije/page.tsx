import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kategorije usluga — pronađite majstore | Zaposli.ba',
  description: 'Pronađite majstore za sve vrste građevinskih i zanatskih radova u Bosni i Hercegovini — 13 kategorija, 2,800+ provjerenih firmi.',
  alternates: { canonical: `${site.url}/kategorije/` },
};

export default function CategoriesPage() {
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
              Pronađite majstore za sve vrste građevinskih i zanatskih radova u Bosni i Hercegovini
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/kategorije/${category.slug}/`}
                  className="rounded-2xl p-6 border-2 bg-white text-ink border-gray-100 hover:border-brand-orange/40 group transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <category.icon className="w-7 h-7 text-brand-orange" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-ink mb-1 group-hover:text-brand-orange transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm text-steel mb-2">{category.description}</p>
                      <p className="text-sm font-medium text-brand-orange">{category.count} firmi</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Ne pronalazite traženu kategoriju?</h2>
            <p className="text-steel mb-6">Objavite projekat i opišite šta vam je potrebno. Majstori će vam se javiti sa ponudama.</p>
            <Link href="/objavi-projekat/" className="btn-primary">
              Objavi projekat
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
