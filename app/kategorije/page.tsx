import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PageHero from '@/components/ui/PageHero';
import { categories, type Category } from '@/lib/data';
import { site } from '@/lib/site';
import { cities } from '@/lib/data';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  Users,
  Briefcase,
  CheckCircle,
  LayoutGrid,
} from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import EmergencyBottomBar from '@/components/EmergencyBottomBar';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

const seoCategories = categories.filter((c) => !c.noSeo);

export const metadata: Metadata = {
  title: `Kategorije usluga u BiH - ${seoCategories.length} struka | Pronađite majstora | Zaposli.ba`,
  description: `Pronađite majstore za sve vrste usluga u Bosni i Hercegovini. ${seoCategories.length} kategorija - od građevine, vodoinstalacije i električara do čišćenja, selidbi i hitnih intervencija 24/7.`,
  keywords: [
    'kategorije usluga BiH',
    'majstori kategorije',
    'građevinske usluge',
    'vodoinstalater',
    'električar',
    'keramičar',
    'hitne intervencije',
    'čišćenje',
    'selidbe',
  ],
  alternates: { canonical: `${site.url}/kategorije/` },
};

const trustBadges = [
  { icon: ShieldCheck, label: 'Provjerene firme', value: 'ID + reference' },
  { icon: Clock, label: 'Brze ponude', value: '24h prosjek' },
  { icon: Star, label: 'Recenzije', value: 'Od stvarnih klijenata' },
  { icon: Users, label: `${cities.length} gradova`, value: 'Širom BiH' },
];

export default function CategoriesPage() {
  const visible = categories.filter((c) => !c.noSeo);

  const groups: { name: string; cats: Category[] }[] = [];
  for (const c of visible.filter((c) => !c.featured)) {
    const g = groups.find((g) => g.name === c.group);
    if (g) g.cats.push(c);
    else groups.push({ name: c.group, cats: [c] });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Početna', url: '/' },
          { name: 'Kategorije', url: '/kategorije/' },
        ])}
      />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kategorije' }]} />

        <PageHero
          title="Kategorije usluga"
          subtitle={`Pronađite majstora u ${cities.length} gradova i ${visible.length} kategorija. Od građevine do čišćenja - sve na jednom mjestu.`}
          eyebrow="Sve usluge u BiH"
          icon={LayoutGrid}
          align="center"
          size="lg"
          image="/images/kategorije-hero.jpg"
        >
          <Link
            href="/objavi-projekat/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
          >
            Objavi posao besplatno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </PageHero>

        {/* Trust badges */}
        <section className="relative py-10 md:py-12 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {/* Grupe kategorija */}
        <section className="py-16 md:py-20 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Briefcase className="h-4 w-4" /> Kategorije
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Pretražite po struci
              </h2>
              <p className="text-steel text-lg">
                Odaberite oblast i pronađite majstore koji rade upravo ono što vam treba.
              </p>
            </div>

            <div className="space-y-10">
              {groups.map((group) => (
                <div key={group.name} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-card">
                  <h3 className="text-sm font-bold text-steel uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-orange" />
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
        <section className="relative py-16 md:py-20 bg-gradient-hero overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
                Ne pronalazite traženu kategoriju?
              </h2>
              <p className="text-white/70 text-base md:text-lg">
                Objavite posao i majstori će vam se javiti sa ponudama. Besplatno i neobavezujuće.
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

      <EmergencyBottomBar showOnScroll />

      <Footer />
    </div>
  );
}
