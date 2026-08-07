import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, BookOpen, TrendingUp, ShieldCheck, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { articles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Savjeti za renoviranje i građevinske radove | Zaposli.ba',
  description:
    'Praktični savjeti za renoviranje i građevinske radove u BiH: cijene adaptacija i fasada, provjera majstora i upoređivanje ponuda.',
  alternates: { canonical: `${site.url}/savjeti/` },
};

const benefits = [
  {
    icon: BookOpen,
    title: 'Provjereni vodiči',
    description: 'Svaki savjet temeljimo na iskustvu firmi i klijenata na Zaposli.ba platformi.',
  },
  {
    icon: TrendingUp,
    title: 'Stvarne cijene',
    description: 'Cjenici za 2026. godinu: rasponi u KM koji odražavaju realno tržište u BiH.',
  },
  {
    icon: ShieldCheck,
    title: 'Bez rizika',
    description: 'Naučite kako prepoznati pouzdane izvođače i izbjeći uobičajene prevaru.',
  },
  {
    icon: Lightbulb,
    title: 'Praktični savjeti',
    description: 'Odaberite pravu tehnologiju, materijale i dinamiku plaćanja za vaš posao.',
  },
];

export default function SavjetiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Savjeti' }]} />
        <PageHero
          title="Savjeti"
          subtitle="Praktični vodiči i stvarne cijene za vaše građevinske poslove u BiH. Naučite kako odabrati majstora i platiti poštenu cijenu."
          eyebrow="Blog i cjenici"
          gradient="bg-gradient-to-br from-ink via-slate-900 to-slate-800"
          size="md"
        />

        {/* SEO intro + value cards */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-lg text-steel leading-relaxed">
                Na Zaposli.ba blogu objavljujemo praktične vodiče i stvarne cijene građevinskih i
                zanatskih radova u Bosni i Hercegovini. Bilo da renovirate kupatilo, fasadirate kuću
                ili prvi put angažujete majstora: naš cilj je da donesete informisanu odluku i
                platite poštenu cijenu.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Najnoviji savjeti</h2>
              <span className="text-sm text-steel">{articles.length} vodiča</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/savjeti/${article.slug}/`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <span className="inline-block self-start text-xs font-semibold text-brand-orange bg-orange-50 px-3 py-1 rounded-full mb-4">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-orange transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-steel leading-relaxed mb-6 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-steel pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-orange/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Lightbulb className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Imate posao na umu?
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Objavite ga besplatno i primite ponude od provjerenih firmi iz vašeg grada.
                </p>
                <Link href="/objavi-projekat/" className="btn-primary text-lg">
                  Objavi posao besplatno
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
