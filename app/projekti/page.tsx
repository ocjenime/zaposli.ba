import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Clock, BadgeCheck, Flame, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { projects } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aktivni projekti — pronađite posao | Zaposli.ba',
  description: 'Pregledajte aktivne projekte kupaca širom BiH s budžetima i rokovima. Registrujte firmu besplatno i pošaljite ponudu.',
  alternates: { canonical: `${site.url}/projekti/` },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Projekti' }]} />
        <PageHero
          title="Aktivni projekti"
          subtitle="Stvarni projekti kupaca s budžetima i rokovima — registrujte firmu i pošaljite ponudu"
        />

        <section className="py-14 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-5 mb-12">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-brand-orange">
                        {p.category}
                      </span>
                      {p.urgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600">
                          <Flame className="w-3 h-3" /> Hitno
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-steel">{p.timeAgo}</span>
                  </div>

                  <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-brand-orange transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-steel text-sm mb-4 line-clamp-2">{p.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-steel mb-4">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{p.deadline}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="font-bold text-brand-orange text-sm">{p.budget}</div>
                    <div className="flex items-center gap-1.5 text-xs text-steel bg-cloud px-2.5 py-1 rounded-lg">
                      <BadgeCheck className="w-3.5 h-3.5 text-brand-orange" />
                      {p.bids} ponuda
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA za firme */}
            <div className="bg-ink rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Želite slati ponude na ove projekte?</h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  Registrujte firmu besplatno, pregledajte projekte u vašoj kategoriji i pošaljite prvu ponudu već danas.
                </p>
                <Link
                  href="/registracija/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
                >
                  Registrujte firmu besplatno
                  <ArrowRight className="w-5 h-5" />
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
