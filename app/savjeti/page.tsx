import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Savjeti. Zaposli.ba',
  description:
    'Praktični savjeti za renoviranje i građevinske radove u BiH: cijene adaptacija i fasada, provjera majstora i upoređivanje ponuda.',
  alternates: { canonical: 'https://ocjenime.github.io/zaposli.ba/savjeti/' },
};

const articles = [
  {
    slug: 'cijena-adaptacije-kupatila',
    category: 'Cijene',
    title: 'Koliko košta adaptacija kupatila u 2026?',
    excerpt:
      'Detaljan prikaz cijena adaptacije kupatila u BiH: od demontaže i instalacija do keramike i sanitarija, sa realnim rasponima u KM.',
    readTime: '6 min čitanja',
    date: '15. juli 2026.',
  },
  {
    slug: 'kako-provjeriti-majstora',
    category: 'Vodiči',
    title: 'Kako provjeriti majstora prije nego što mu date avans',
    excerpt:
      'Praktična kontrolna lista: registracija firme, recenzije, fotografije radova, ugovor i pravila sigurnog plaćanja po fazama.',
    readTime: '5 min čitanja',
    date: '10. juli 2026.',
  },
  {
    slug: 'cijena-fasade-po-m2',
    category: 'Cijene',
    title: 'Cijena fasade po m² u BiH: vodič za 2026.',
    excerpt:
      'Stiropor ili kamena vuna? Koliko košta fasada po kvadratu, šta ulazi u cijenu i koje greške najviše poskupljuju radove.',
    readTime: '6 min čitanja',
    date: '5. juli 2026.',
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
          subtitle="Praktični vodiči i stvarne cijene za vaše građevinske poslove u BiH"
        />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/savjeti/${article.slug}/`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <span className="inline-block self-start text-xs font-semibold text-brand-orange bg-primary-50 px-3 py-1 rounded-full mb-4">
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
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-3">
                  Imate posao na umu?
                </h2>
                <p className="text-[#ffffff]/60 mb-8 max-w-lg mx-auto">
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
