import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { faqs } from '@/lib/data';
import { JsonLd, faqSchema } from '@/lib/jsonld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Česta pitanja. Zaposli.ba',
  description:
    'Odgovori na najčešća pitanja o Zaposli.ba: cijene, verifikacija firmi, ponude, recenzije i registracija. Sve što trebate znati na jednom mjestu.',
  alternates: { canonical: 'https://ocjenime.github.io/zaposli.ba/faq/' },
};

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
                    <span className="font-semibold text-ink text-base md:text-lg">
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
                <Link href="/kontakt/" className="btn-primary text-lg">
                  Kontaktirajte nas
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
