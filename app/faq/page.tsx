import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Clock,
  Star,
  Users,
  ArrowRight,
  User,
  Briefcase,
  Lock,
  MessageCircleQuestion,
} from 'lucide-react';
import { faqs, cities } from '@/lib/data';
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
  { icon: Users, label: `${cities.length} gradova`, value: 'Širom BiH' },
];

interface FaqGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: { question: string; answer: string }[];
}

const groups: FaqGroup[] = [
  {
    id: 'klijenti',
    label: 'Za klijente',
    icon: User,
    items: faqs.filter((f) =>
      [
        'Koliko košta korištenje Zaposli.ba za klijente?',
        'Jesam li obavezan odabrati neku ponudu?',
        'Šta ako nisam zadovoljan izvedenim radovima?',
        'Mogu li objaviti hitan posao?',
      ].includes(f.question)
    ),
  },
  {
    id: 'firme',
    label: 'Za firme',
    icon: Briefcase,
    items: faqs.filter((f) =>
      [
        'Kako funkcioniše verifikacija firmi?',
        'Kako firma dobija oznaku dobre reputacije?',
        'Kako se registrujem kao firma i koliko to košta?',
      ].includes(f.question)
    ),
  },
  {
    id: 'sigurnost',
    label: 'Sigurnost',
    icon: Lock,
    items: faqs.filter((f) =>
      ['Koliko brzo ću dobiti ponude?', 'Šta ako nisam zadovoljan izvedenim radovima?'].includes(
        f.question
      )
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Česta pitanja' }]} />
        <PageHero
          title="Česta pitanja"
          subtitle="Odgovori na pitanja koja nam klijenti i firme najčešće postavljaju. Brzo, jasno i bez sitnih slova."
          eyebrow="Podrška"
          icon={HelpCircle}
          align="center"
          size="lg"
          gradient="bg-gradient-to-br from-ink via-slate-900 to-slate-800"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/15 transition-colors"
              >
                <group.icon className="w-4 h-4 text-brand-orange" />
                {group.label}
              </a>
            ))}
          </div>
        </PageHero>

        <JsonLd data={faqSchema(faqs)} />

        {/* Trust badges */}
        <section className="py-12 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="group bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                    <badge.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{badge.value}</p>
                  <p className="text-xs text-steel">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ content with sticky sidebar */}
        <section className="py-16 md:py-24 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Sidebar */}
              <aside className="lg:col-span-4 xl:col-span-3">
                <div className="sticky top-28 space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Kategorije pitanja</h2>
                    <nav className="space-y-2">
                      {groups.map((group) => (
                        <a
                          key={group.id}
                          href={`#${group.id}`}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-cloud hover:text-brand-orange transition-colors"
                        >
                          <group.icon className="w-4 h-4 text-steel" />
                          {group.label}
                          <span className="ml-auto text-xs text-steel bg-cloud px-2 py-0.5 rounded-full">
                            {group.items.length}
                          </span>
                        </a>
                      ))}
                    </nav>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-6 text-white shadow-card">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
                    <div className="relative">
                      <HelpCircle className="w-8 h-8 text-brand-orange mb-3" />
                      <h3 className="text-base font-bold mb-1">Niste pronašli odgovor?</h3>
                      <p className="text-sm text-white/70 mb-4">
                        Naš tim vam rado pomaže. Odgovaramo u roku od jednog radnog dana.
                      </p>
                      <Link
                        href="/kontakt/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
                      >
                        Kontaktirajte nas <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Groups */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-14">
                {groups.map((group, groupIndex) => (
                  <div key={group.id} id={group.id} className="scroll-mt-28">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-orange-100 flex items-center justify-center">
                        <group.icon className="w-6 h-6 text-brand-orange" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{group.label}</h2>
                        <p className="text-sm text-steel">
                          {group.items.length} {group.items.length === 1 ? 'pitanje' : 'pitanja'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {group.items.map((faq, i) => (
                        <details
                          key={faq.question}
                          className="group bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden open:ring-1 open:ring-brand-orange/20 open:border-brand-orange/30 transition-all"
                        >
                          <summary className="flex items-start justify-between gap-4 cursor-pointer list-none px-6 py-5 hover:bg-cloud/60 transition-colors [&::-webkit-details-marker]:hidden">
                            <div className="flex items-start gap-4">
                              <span className="hidden sm:flex w-8 h-8 rounded-full bg-orange-50 text-brand-orange text-sm font-extrabold items-center justify-center shrink-0 mt-0.5">
                                {groupIndex + 1}.{i + 1}
                              </span>
                              <span className="font-semibold text-gray-900 text-base md:text-lg pr-4">
                                {faq.question}
                              </span>
                            </div>
                            <span className="shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-open:bg-brand-orange transition-colors mt-0.5">
                              <ChevronDown className="w-4 h-4 text-brand-orange group-open:text-white group-open:rotate-180 transition-all" />
                            </span>
                          </summary>
                          <div className="px-6 pb-6 pt-1 sm:pl-[4.5rem]">
                            <p className="text-steel leading-relaxed">{faq.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 bg-cloud">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-8 md:p-14 text-center shadow-float">
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
              <div className="relative">
                <div className="w-16 h-16 bg-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <MessageCircleQuestion className="w-8 h-8 text-brand-orange" />
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                  I dalje imate pitanja?
                </h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto text-lg">
                  Naš tim vam stoji na raspolaganju. Pošaljite nam poruku i odgovorit ćemo u najkraćem mogućem roku.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/kontakt/" className="btn-primary text-lg px-8 py-4">
                    Kontaktirajte nas
                  </Link>
                  <Link
                    href="/objavi-projekat/"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors"
                  >
                    Objavi posao
                    <ArrowRight className="w-5 h-5" />
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
