import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { ChevronDown, MessageCircleQuestion, ShieldCheck, Clock, Star, Users, ArrowRight } from 'lucide-react';
import { faqs } from '@/lib/data';
import { JsonLd, faqSchema } from '@/lib/jsonld';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Česta pitanja | Zaposli.ba',
  description:
    'Odgovori na najčešća pitanja o Zaposli.ba: cijene, verifikacija firmi, ponude, recenzije i registracija. Sve što trebate znati na jednom mjestu.',
  alternates: { canonical: `${site.url}/faq/` },
};

const trustBadges = [
  { icon: ShieldCheck, label: 'Provjerene firme', value: 'ID + reference' },
  { icon: Clock, label: 'Brze ponude', value: '24h prosjek' },
  { icon: Star, label: 'Recenzije', value: 'Stvarni klijenti' },
  { icon: Users, label: '35 gradova', value: 'Širom BiH' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Česta pitanja' }]} />
        <PageHero
          title="Česta pitanja"
          subtitle="Odgovori na pitanja koja nam klijenti i firme najčešće postavljaju"
        />
        <JsonLd data={faqSchema(faqs)} />

        {/* SEO intro + trust badges */}
        <section className="py-10 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-steel leading-relaxed">
                Zaposli.ba je tržište majstora i građevinskih firmi u Bosni i Hercegovini. Klijenti
                objavljuju posao besplatno, a firme šalju ponude. Ispod su odgovori na najčešća
                pitanja o korištenju platforme, verifikaciji, cijenama i sigurnosti.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-card"
                >
                  <badge.icon className="w-6 h-6 text-brand-orange mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{badge.value}</p>
                  <p className="text-xs text-steel">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ lista */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 hover:bg-cloud/60 transition-colors [&::-webkit-details-marker]:hidden">
                    <span className="font-semibold text-gray-900 text-base md:text-lg pr-4">
                      {faq.question}
                    </span>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center group-open:bg-brand-orange transition-colors">
                      <ChevronDown className="w-4 h-4 text-brand-orange group-open:text-white group-open:rotate-180 transition-all" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-1">
                    <p className="text-steel leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-orange/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <MessageCircleQuestion className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Niste pronašli odgovor?
                </h2>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Naš tim vam stoji na raspolaganju: pošaljite nam poruku i odgovorit ćemo u najkraćem mogućem roku.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/kontakt/" className="btn-primary text-lg">
                    Kontaktirajte nas
                  </Link>
                  <Link
                    href="/objavi-projekat/"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors"
                  >
                    Objavi posao
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
