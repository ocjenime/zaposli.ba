import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, ArrowRight, ShieldCheck, Clock, Star, Users, CheckCircle, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cities } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Majstori po gradovima: cijela BiH | Zaposli.ba',
  description: 'Pronađite provjerene majstore i građevinske firme u 35 gradova širom Bosne i Hercegovine. Federacija, Republika Srpska i Brčko distrikt.',
  alternates: { canonical: `${site.url}/gradovi/` },
};

const trustBadges = [
  { icon: ShieldCheck, label: 'Provjerene firme', value: 'ID + reference' },
  { icon: Clock, label: 'Brze ponude', value: '24h prosjek' },
  { icon: Star, label: 'Recenzije', value: 'Od stvarnih klijenata' },
  { icon: Users, label: '35 gradova', value: 'Širom BiH' },
];

export default function CitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi' }]} />
        <PageHero
          title="Majstori po gradovima"
          subtitle="Provjerene firme i majstori u 35 gradova širom Bosne i Hercegovine"
        />

        {/* SEO intro + trust badges */}
        <section className="py-10 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Pronađite majstora u svom gradu</h2>
                <p className="text-steel leading-relaxed text-sm md:text-base">
                  Zaposli.ba pokriva sve veće gradove u Bosni i Hercegovini: od Sarajeva, Banja Luke,
                  Mostara i Tuzle, preko Bijeljine, Zenice, Brčkog i Prijedora, do manjih sredina. Svaki
                  grad ima pristup istom tržištu provjerenih građevinskih firmi, majstora i uslužnih
                  djelatnosti. Objavite posao besplatno i dobijte ponude iz lokalne zajednice.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="bg-white rounded-xl border border-gray-100 p-4 shadow-card flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <badge.icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs text-steel">{badge.label}</p>
                      <p className="text-sm font-bold text-gray-900">{badge.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/gradovi/${city.slug}/`}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-orange/40 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-brand-orange" />
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-brand-orange transition-colors text-sm">
                    {city.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 bg-cloud">
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
                className="relative inline-flex items-center justify-center gap-2 bg-white text-brand-orange hover:bg-white/90 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shrink-0"
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
