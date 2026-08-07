import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, ShieldCheck, Clock, Star, Users, CheckCircle, Building2 } from 'lucide-react';
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

export default function CitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <JsonLd data={breadcrumbSchema([{ name: 'Početna', url: '/' }, { name: 'Gradovi', url: '/gradovi/' }])} />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi' }]} />
        <PageHero
          title="Majstori po gradovima"
          subtitle={`Provjerene firme i majstori u ${cities.length} gradova širom Bosne i Hercegovine. Od Sarajeva do Banja Luke, Mostara i Tuzle.`}
          eyebrow="Svi gradovi u BiH"
          icon={MapPin}
          gradient="bg-gradient-to-br from-ink via-blue-950 to-slate-900"
          size="md"
        />

        {/* SEO intro + trust badges */}
        <section className="py-8 md:py-12 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center mb-8 md:mb-10">
              <div className="max-w-2xl">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  Pronađite majstora u svom gradu
                </h2>
                <p className="text-steel leading-relaxed text-sm md:text-base">
                  Zaposli.ba pokriva sve veće gradove u Bosni i Hercegovini: od Sarajeva, Banja Luke,
                  Mostara i Tuzle, preko Bijeljine, Zenice, Brčkog i Prijedora, do manjih sredina. Svaki
                  grad ima pristup istom tržištu provjerenih građevinskih firmi, majstora i uslužnih
                  djelatnosti. Objavite posao besplatno i dobijte ponude iz lokalne zajednice.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="bg-white rounded-xl border border-gray-100 p-3 md:p-4 shadow-sm flex items-center gap-3"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-50 to-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <badge.icon className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-[11px] md:text-xs text-steel leading-tight">{badge.label}</p>
                      <p className="text-xs md:text-sm font-bold text-gray-900">{badge.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-3">
              {[...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs')).map((city) => (
                <Link
                  key={city.slug}
                  href={`/gradovi/${city.slug}/`}
                  className="group relative bg-white rounded-xl border border-gray-100/80 shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all duration-200 active:scale-[0.98] flex items-center gap-2.5 md:gap-3 px-3 py-2.5 md:px-4 md:py-3 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-orange-100/0 group-hover:from-primary-50/70 group-hover:to-orange-100/50 transition-colors duration-200" />
                  <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-brand-orange" />
                  </div>
                  <span className="relative font-medium text-gray-800 group-hover:text-brand-orange transition-colors duration-200 text-sm leading-tight truncate">
                    {city.name}
                  </span>
                  <ArrowRight className="relative w-3.5 h-3.5 md:w-4 md:h-4 text-brand-orange opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ml-auto shrink-0 hidden md:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 md:pb-20 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-hero rounded-2xl p-6 md:p-10 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-brand-orange" />
                  <span className="text-sm font-semibold text-white/80">Bilo koji grad u BiH</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Koji god grad da ste: objavite posao</h2>
                <p className="text-white/60 text-sm md:text-base">
                  Firme iz vašeg kraja će se javiti s ponudama. Besplatno, bez obaveze i bez posrednika.
                </p>
              </div>
              <Link
                href="/objavi-projekat/"
                className="relative inline-flex items-center justify-center gap-2 bg-white text-brand-orange hover:bg-white/90 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold transition-colors shadow-lg shrink-0"
              >
                <CheckCircle className="w-4 h-4" />
                Objavi posao besplatno
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
