'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
import { faqs } from '@/lib/data';

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

type Role = 'client' | 'firm';

export default function HowItWorksContent() {
  const [role, setRole] = useState<Role>('client');
  const [faqCategory, setFaqCategory] = useState<'all' | 'client' | 'firm'>('all');
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    stepsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = role === 'client' ? clientSteps : firmSteps;
  const roleLabel = role === 'client' ? 'Za klijente' : 'Za firme i majstore';
  const ctaHref = role === 'client' ? '/objavi-projekat/' : '/registracija/';
  const ctaLabel = role === 'client' ? 'Objavi posao besplatno' : 'Registruj firmu besplatno';

  const filteredFaqs =
    faqCategory === 'all' ? faqs : faqs.filter((f) => f.category === faqCategory);
  const visibleFaqs = showAllFaqs ? filteredFaqs : filteredFaqs.slice(0, 6);
  const hasMoreFaqs = filteredFaqs.length > 6;

  return (
    <>
      <main className="flex-grow">
        {/* Shared Higgsfield background wrapper: one continuous canvas for hero + steps */}
        <div className="relative">
          {/* Continuous gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-900 via-ink-800 via-ink-950 to-cloud" />

          {/* Subtle mesh/noise pattern spanning both sections */}
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.5),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(251,191,36,0.4),transparent_35%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_40%)]" />

          {/* Animated gradient orbs spanning both sections */}
          {mounted && (
            <>
              <div className="pointer-events-none absolute -left-20 top-[10%] h-[28rem] w-[28rem] rounded-full bg-brand-orange/15 blur-[120px] animate-float-orb" />
              <div className="pointer-events-none absolute right-0 top-[5%] h-[24rem] w-[24rem] rounded-full bg-brand-amber/10 blur-[100px] animate-float-orb-slow" style={{ animationDelay: '-5s' }} />
              <div className="pointer-events-none absolute top-[45%] left-1/3 h-[32rem] w-[32rem] rounded-full bg-orange-600/10 blur-[140px] animate-float-orb-reverse" style={{ animationDelay: '-10s' }} />
              <div className="pointer-events-none absolute top-[35%] right-1/4 h-64 w-64 rounded-full bg-amber-500/8 blur-[90px] animate-float-orb" style={{ animationDelay: '-15s' }} />
            </>
          )}

          {/* Cinematic vignette overlays spanning both sections */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,17,23,0.6)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/40" />

          {/* Animated Higgsfield hero with role selector */}
          <section className="relative min-h-[840px] lg:min-h-[900px] flex flex-col overflow-hidden bg-transparent">

            {/* Hero content */}
            <div className="relative z-20 flex-1 flex items-center">
              <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12">
                <div className="max-w-3xl mx-auto text-center">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-white/90 mb-6 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                    Jednostavan proces u 3 koraka
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in">
                    Kako funkcioniše
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                      Zaposli.ba?
                    </span>
                  </h1>

                  {/* Subheadline */}
                  <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in">
                    Birajte svoju ulogu i pogledajte korake prilagođene vama. Brzo, besplatno i bez posrednika.
                  </p>

                  {/* Trust signals */}
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-white/80 mb-12 animate-fade-in">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-brand-orange" />
                      Bez provizije
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-5 h-5 text-brand-orange" />
                      Ponude u 24 sata
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-brand-orange" />
                      Provjerene firme
                    </span>
                  </div>
                </div>

                {/* Glassmorphic role selector cards */}
                <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto animate-fade-in">
                  {/* Client card */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('client')}
                    className={`group relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-left transition-all duration-300 ${
                      role === 'client'
                        ? 'border-brand-orange/50 bg-white/10 backdrop-blur-xl shadow-2xl shadow-brand-orange/15'
                        : 'border-white/10 bg-white/5 backdrop-blur-md hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-orange/10 blur-[60px] opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex flex-col h-full">
                      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange ring-1 ring-inset ring-brand-orange/20">
                        <Users className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Tražim majstora</h3>
                      <p className="text-white/60 leading-relaxed mb-5 flex-grow text-sm sm:text-base">
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
                    className={`group relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-left transition-all duration-300 ${
                      role === 'firm'
                        ? 'border-brand-amber/50 bg-white/10 backdrop-blur-xl shadow-2xl shadow-brand-amber/15'
                        : 'border-white/10 bg-white/5 backdrop-blur-md hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-amber/50 to-transparent" />
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-amber/10 blur-[60px] opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex flex-col h-full">
                      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-amber/20 to-brand-amber/5 text-brand-amber ring-1 ring-inset ring-brand-amber/20">
                        <Briefcase className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Nudim usluge</h3>
                      <p className="text-white/60 leading-relaxed mb-5 flex-grow text-sm sm:text-base">
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
                <div className="mt-8 flex justify-center animate-fade-in">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
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
            </div>
          </section>

          {/* Steps - transparent so shared background flows through */}
          <section
            ref={stepsRef}
            id="koraci"
            className="relative py-20 md:py-28 overflow-hidden bg-transparent"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
        </div>

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
            <div className="text-center max-w-2xl mx-auto mb-10">
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

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {[
                { id: 'all', label: 'Sva pitanja', icon: HelpCircle },
                { id: 'client', label: 'Za klijente', icon: Users },
                { id: 'firm', label: 'Za firme', icon: Briefcase },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFaqCategory(tab.id as 'all' | 'client' | 'firm');
                    setShowAllFaqs(false);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    faqCategory === tab.id
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                      : 'bg-cloud text-gray-700 hover:bg-orange-50 hover:text-brand-orange'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {visibleFaqs.map((faq, index) => (
                <details
                  key={faq.question}
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              {hasMoreFaqs && (
                <button
                  type="button"
                  onClick={() => setShowAllFaqs((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all bg-cloud text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                >
                  {showAllFaqs ? 'Prikaži manje' : `Prikaži još ${filteredFaqs.length - 6}`}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAllFaqs ? 'rotate-180' : ''}`} />
                </button>
              )}
              <Link
                href="/faq/"
                className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors"
              >
                Pogledaj sva pitanja
                <ArrowRight className="w-4 h-4" />
              </Link>
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
