import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cities } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Majstori po gradovima — cijela BiH | Zaposli.ba',
  description: 'Pronađite provjerene majstore i građevinske firme u 35 gradova širom Bosne i Hercegovine — Federacija, Republika Srpska i Brčko distrikt.',
  alternates: { canonical: `${site.url}/gradovi/` },
};

export default function CitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi' }]} />
        <PageHero
          title="Majstori po gradovima"
          subtitle="Provjerene firme i zanatlije u 35 gradova širom Bosne i Hercegovine"
        />

        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/gradovi/${city.slug}/`}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-orange/40 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-brand-orange" />
                  </div>
                  <span className="font-semibold text-ink group-hover:text-brand-orange transition-colors text-sm">
                    {city.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-steel mb-6">Koji god grad da ste — objavite posao i firme iz vašeg kraja će se javiti s ponudama.</p>
              <Link href="/objavi-projekat/" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95">
                Objavi posao besplatno
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
