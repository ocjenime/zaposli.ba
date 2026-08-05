import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { categories, type Category } from '@/lib/data';
import { site } from '@/lib/site';
import { cities } from '@/lib/data';
import { ArrowRight, Siren, ShieldCheck, Clock, Star, MapPin, Users, Briefcase, CheckCircle } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';

const seoCategories = categories.filter((c) => !c.noSeo);

export const metadata: Metadata = {
  title: 'Kategorije usluga: pronađite majstore | Zaposli.ba',
  description: `Pronađite majstore za sve vrste usluga u Bosni i Hercegovini. ${seoCategories.length} kategorija, od građevine i instalacija do čišćenja, selidbi i hitnih intervencija 24/7.`,
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

        {/* SEO intro + trust badges */}
        <section className="py-8 md:py-10 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Pronađite pouzdanog majstora za svaku potrebu</h2>
                <p className="text-steel leading-relaxed text-sm md:text-base">
                  Zaposli.ba okuplja provjerene građevinske firme, majstore i uslužne djelatnosti iz
                  cijele Bosne i Hercegovine. Bilo da vam treba vodoinstalater, električar, keramičar,
                  moler, bravar ili kompletna adaptacija: objavite posao besplatno i uporedite ponude
                  od firma iz vašeg grada.
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

        {/* Featured: hitne intervencije 24/7 */}
        <section className="pt-8 md:pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/kategorije/${featured[0]?.slug}/`}
              className="group flex items-center gap-4 rounded-xl border border-red-100 bg-red-50 px-5 py-4 hover:border-red-200 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <Siren className="w-6 h-6" />
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
                <h2 className="text-sm font-bold text-steel uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-orange" />
                  {group.name}
                </h2>
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
            <div className="bg-gradient-hero rounded-2xl p-6 md:p-10 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Ne pronalazite traženu kategoriju?</h2>
                <p className="text-white/60 text-sm md:text-base">
                  Objavite posao i majstori će vam se javiti sa ponudama. Besplatno i neobavezujuće.
                </p>
              </div>
              <Link
                href="/objavi-projekat/"
                className="relative inline-flex items-center justify-center gap-2 bg-white text-brand-orange hover:bg-white/90 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shrink-0"
              >
                <CheckCircle className="w-4 h-4" />
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
