'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import {
  Users,
  Briefcase,
  ClipboardList,
  Search,
  CheckCircle,
  Shield,
  FileText,
  Star,
  Clock,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  Award,
  BadgeCheck,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema, howToSchema } from '@/lib/jsonld';

const clientSteps = [
  {
    icon: ClipboardList,
    title: 'Objavite posao',
    description:
      'Opišite šta vam je potrebno, dodajte fotografije i navedite grad. Traje samo 2 minute i potpuno je besplatno.',
  },
  {
    icon: Search,
    title: 'Primite ponude',
    description:
      'Provjereni majstori i firme šalju ponude sa cijenama i rokovima. Obično u roku od 24 sata.',
  },
  {
    icon: CheckCircle,
    title: 'Odaberite majstora',
    description:
      'Uporedite ponude, pročitajte recenzije i odaberite najboljeg izvođača za vaš posao.',
  },
];

const firmSteps = [
  {
    icon: Briefcase,
    title: 'Registrujte profil',
    description:
      'Napravite profil firme ili majstora, dodajte portfolio i opišite usluge koje nudite.',
  },
  {
    icon: Search,
    title: 'Pregledajte poslove',
    description:
      'Pregledajte dostupne poslove u vašem gradu i kategoriji i odaberite one koji vam odgovaraju.',
  },
  {
    icon: FileText,
    title: 'Pošaljite ponudu',
    description:
      'Pošaljite svoju ponudu sa cijenom i rokovima. Ako vas klijent odabere, dobijate posao.',
  },
];

const benefits = [
  {
    icon: Star,
    title: 'Ocjene i recenzije',
    description: 'Pročitajte iskustva drugih klijenata prije nego što odaberete firmu.',
    stat: '4.8 / 5',
  },
  {
    icon: Shield,
    title: 'Verificirane firme',
    description: 'Sve firme prolaze provjeru identiteta i poslovanja prije nego što dobiju značku.',
    stat: '100% provjera',
  },
  {
    icon: Clock,
    title: 'Brze ponude',
    description: 'Primite ponude u roku od 24 sata od objave posla. Hitne intervencije i brže.',
    stat: '< 24h',
  },
  {
    icon: MessageSquare,
    title: 'Direktna komunikacija',
    description: 'Komunicirajte direktno sa majstorima putem platforme - bez posrednika.',
    stat: '0% provizije',
  },
];

const faqs = [
  {
    question: 'Ko može objaviti posao?',
    answer:
      'Svaki klijent koji ima potrebu za majstorom: stanovi, kuće, poslovni prostori, dvorišta i vozila. Objava je besplatna i neobavezujuća.',
  },
  {
    question: 'Da li firme plaćaju proviziju po dobijenom poslu?',
    answer:
      'Ne. Zaposli.ba ne naplaćuje proviziju po dobijenom poslu. Firme i majstori plaćaju fiksnu mjesečnu naknadu za svoj paket.',
  },
  {
    question: 'Koliko brzo dobijam ponude?',
    answer:
      'Većina poslova dobije prve ponude u roku od 24 sata. Hitne intervencije često dobiju ponude u nekoliko sati.',
  },
];

type Role = 'client' | 'firm';

export default function HowItWorksContent() {
  const [role, setRole] = useState<Role>('client');
  const stepsRef = useRef<HTMLDivElement>(null);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    stepsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = role === 'client' ? clientSteps : firmSteps;
  const roleLabel = role === 'client' ? 'Za klijente' : 'Za firme i majstore';
  const ctaHref = role === 'client' ? '/objavi-projekat/' : '/registracija/';
  const ctaLabel = role === 'client' ? 'Objavi posao besplatno' : 'Registruj firmu besplatno';

  return (
    <>
      <main className="flex-grow">
        <PageHero
          title="Kako funkcioniše Zaposli.ba?"
          subtitle="Birajte svoju ulogu i pogledajte kako platforma radi za vas."
          eyebrow="Jednostavan proces u 3 koraka"
          icon={HelpCircle}
          align="center"
          size="lg"
        >
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-orange" />
              Bez provizije
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-orange" />
              Ponude u 24 sata
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-brand-orange" />
              Provjerene firme
            </span>
          </div>
        </PageHero>

        {/* Role selector */}
        <section className="relative py-16 md:py-24 bg-ink-950 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-amber/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-brand-orange text-sm font-semibold mb-4">
                <Users className="h-4 w-4" /> Izaberite ulogu
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                Za koga je Zaposli.ba?
              </h2>
              <p className="text-white/60 text-lg">
                Kliknite na svoju ulogu i pogledajte korake prilagođene vama.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {/* Client card */}
              <button
                type="button"
                onClick={() => handleRoleChange('client')}
                className={`group relative overflow-hidden rounded-3xl border p-8 text-left transition-all duration-300 ${
                  role === 'client'
                    ? 'border-brand-orange/50 bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 shadow-lg shadow-brand-orange/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />
                <div className="flex flex-col h-full">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange ring-1 ring-inset ring-brand-orange/20">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tražim majstora</h3>
                  <p className="text-white/60 leading-relaxed mb-6 flex-grow">
                    Objavite posao besplatno i primite ponude od provjerenih firmi i majstora u vašem gradu.
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${
                      role === 'client' ? 'text-brand-orange' : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    Pogledaj korake
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>

              {/* Firm card */}
              <button
                type="button"
                onClick={() => handleRoleChange('firm')}
                className={`group relative overflow-hidden rounded-3xl border p-8 text-left transition-all duration-300 ${
                  role === 'firm'
                    ? 'border-brand-amber/50 bg-gradient-to-br from-brand-amber/20 to-brand-amber/5 shadow-lg shadow-brand-amber/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-amber/40 to-transparent" />
                <div className="flex flex-col h-full">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-amber/20 to-brand-amber/5 text-brand-amber ring-1 ring-inset ring-brand-amber/20">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Nudim usluge</h3>
                  <p className="text-white/60 leading-relaxed mb-6 flex-grow">
                    Registrujte se kao firma ili majstor, pronađite nove poslove i širite klijentelu.
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${
                      role === 'firm' ? 'text-brand-amber' : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    Pogledaj korake
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            </div>

            {/* Inline role switcher */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    role === 'client'
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Klijent
                </button>
                <button
                  type="button"
                  onClick={() => setRole('firm')}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    role === 'firm'
                      ? 'bg-brand-amber text-white shadow-md shadow-brand-amber/20'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Firma / Majstor
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section
          ref={stepsRef}
          id="koraci"
          className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-ink via-slate-950 to-cloud"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold mb-4 ${
                  role === 'client' ? 'text-brand-orange' : 'text-brand-amber'
                }`}
              >
                {role === 'client' ? <Users className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                {roleLabel}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                {role === 'client' ? 'Od ideje do gotovog posla' : 'Pronađite nove klijente'}
              </h2>
              <p className="text-white/70 text-lg">
                {role === 'client'
                  ? 'Objavite posao besplatno i neobavezujuće. Dobijte ponude, uporedite i odaberite.'
                  : 'Registrujte se, pronađite poslove i širite klijentelu bez velikih ulaganja.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-orange/5 blur-[50px] transition-opacity group-hover:opacity-70" />

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center shrink-0">
                        <step.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                      </div>
                      <span className="text-4xl font-extrabold text-white/10">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/60 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={ctaHref}
                className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 ${
                  role === 'client'
                    ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:shadow-brand-orange/30'
                    : 'bg-gradient-to-r from-brand-amber to-amber-600 hover:shadow-amber-500/30'
                }`}
              >
                {ctaLabel}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-cloud">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <TrendingUp className="h-4 w-4" /> Zašto mi?
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Sigurnost, brzina i jednostavnost
              </h2>
              <p className="text-steel text-lg">
                Spoj sigurnosti, brzine i jednostavnosti: posao završen bez stresa.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-card hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
                        <span className="text-brand-orange font-extrabold text-sm bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shrink-0">
                          {benefit.stat}
                        </span>
                      </div>
                      <p className="text-steel leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-20 md:py-28 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <HelpCircle className="h-4 w-4" /> FAQ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Često postavljana pitanja
              </h2>
              <p className="text-steel text-lg">
                Sve što trebate znati prije nego što objavite prvi posao ili registrujete firmu.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-cloud rounded-2xl border border-gray-100 overflow-hidden open:border-brand-orange/30 open:shadow-lg transition-all duration-300"
                >
                  <summary className="flex items-center gap-4 cursor-pointer p-6 list-none">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 text-brand-orange text-sm font-extrabold flex items-center justify-center">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-bold text-gray-900 text-lg">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-steel flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 pl-[4.5rem] text-steel leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 md:py-28 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.4),transparent_40%),radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.2),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
              <Award className="h-4 w-4 text-brand-orange" />
              Spremni početi?
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 text-balance">
              Bez obzira tražite li majstora ili želite više poslova
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Zaposli.ba je najbrži put do cilja. Besplatno je za objavu posla i registraciju firme.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/objavi-projekat/" className="btn-primary text-lg px-8 py-4">
                Objavi posao besplatno
              </Link>
              <Link
                href="/registracija/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors duration-200"
              >
                Registruj firmu
              </Link>
            </div>
          </div>
        </section>
      </main>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Kako funkcioniše', url: '/kako-funkcionise/' },
          ]),
          howToSchema({
            title: 'Kako objaviti posao na Zaposli.ba',
            description:
              'Jednostavan proces u 3 koraka: objavite posao besplatno, primite ponude od provjerenih firmi i odaberite najboljeg majstora u BiH.',
            steps: clientSteps.map((s) => ({ name: s.title, text: s.description })),
          }),
          faqSchema(faqs),
        ]}
      />
    </>
  );
}
