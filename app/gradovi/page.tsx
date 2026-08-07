import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  Users,
  CheckCircle,
  Building2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cities } from '@/lib/data';
import { site } from '@/lib/site';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: `Majstori po gradovima - ${cities.length} gradova u BiH | Zaposli.ba`,
  description: `Pronađite provjerene majstore i građevinske firme u ${cities.length} gradova širom Bosne i Hercegovine. Sarajevo, Banja Luka, Mostar, Tuzla i ostali - objavite posao besplatno.`,
  keywords: [
    'majstori po gradovima',
    'građevinske firme BiH',
    'majstor Sarajevo',
    'majstor Banja Luka',
    'majstor Mostar',
    'majstor Tuzla',
    'objavi posao',
    'ponude majstora',
  ],
  alternates: { canonical: `${site.url}/gradovi/` },
};

const trustBadges = [
  { icon: ShieldCheck, label: 'Provjerene firme', value: 'ID + reference' },
  { icon: Clock, label: 'Brze ponude', value: '24h prosjek' },
  { icon: Star, label: 'Recenzije', value: 'Od stvarnih klijenata' },
  { icon: Users, label: `${cities.length} gradova`, value: 'Širom BiH' },
];

const cityGradients = [
  'from-orange-50 to-white border-orange-100',
  'from-blue-50 to-white border-blue-100',
  'from-stone-50 to-white border-stone-100',
  'from-amber-50 to-white border-amber-100',
  'from-emerald-50 to-white border-emerald-100',
  'from-violet-50 to-white border-violet-100',
];

export default function CitiesPage() {
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs'));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Početna', url: '/' },
          { name: 'Gradovi', url: '/gradovi/' },
        ])}
      />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi' }]} />

        <PageHero
          title="Majstori po gradovima"
          subtitle={`Provjerene firme i majstori u ${cities.length} gradova širom Bosne i Hercegovine. Od Sarajeva do Banja Luke, Mostara i Tuzle.`}
          eyebrow="Svi gradovi u BiH"
          icon={MapPin}
          image="/images/herozaposli.png"
          align="center"
          size="lg"
        >
          <Link
            href="/objavi-projekat/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
          >
            Objavi posao besplatno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </PageHero>

        {/* Trust intro */}
        <section className="relative py-16 md:py-20 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Building2 className="h-4 w-4" /> Lokalni majstori
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Pronađite majstora u svom gradu
              </h2>
              <p className="text-steel text-lg">
                Zaposli.ba pokriva sve veće gradove u Bosni i Hercegovini: od Sarajeva, Banja Luke, Mostara i Tuzle, preko
                Bijeljine, Zenice, Brčkog i Prijedora, do manjih sredina. Objavite posao besplatno i dobijte ponude iz lokalne zajednice.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center mb-3">
                    <badge.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <p className="font-bold text-gray-900">{badge.value}</p>
                  <p className="text-xs text-steel">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* City grid */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <MapPin className="h-4 w-4" /> Izaberite grad
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Svi gradovi u Bosni i Hercegovini
              </h2>
              <p className="text-steel text-lg">
                Kliknite na grad i pronađite provjerene majstori koji rade u vašem kraju.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedCities.map((city, index) => {
                const gradient = cityGradients[index % cityGradients.length];
                return (
                  <Link
                    key={city.slug}
                    href={`/gradovi/${city.slug}/`}
                    className={`group relative overflow-hidden rounded-2xl border p-5 shadow-card hover:shadow-xl transition-all duration-300 active:scale-[0.98] bg-gradient-to-br ${gradient}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-brand-orange transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-xs text-steel">Pogledajte majstore</p>
                      </div>
                    </div>
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 md:py-20 bg-gradient-hero overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-brand-orange" />
                <span className="text-sm font-semibold text-white/80">Bilo koji grad u BiH</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
                Koji god grad da ste: objavite posao
              </h2>
              <p className="text-white/70 text-base md:text-lg">
                Firme iz vašeg kraja će se javiti s ponudama. Besplatno, bez obaveze i bez posrednika.
              </p>
            </div>
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-orange hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shrink-0"
            >
              <CheckCircle className="w-5 h-5" />
              Objavi posao besplatno
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
