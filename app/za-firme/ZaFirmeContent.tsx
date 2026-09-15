'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PricingCTA from '@/components/PricingCTA';
import AdPricingCTA from '@/components/AdPricingCTA';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/lib/jsonld';
import { categories } from '@/lib/data';
import { planFeatures } from '@/lib/plan-features';

import {
  CheckCircle,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Shield,
  BadgeCheck,
  Clock,
  Wallet,
  Building2,
  Target,
  Headphones,
  ChevronDown,
  HelpCircle,
  Phone,
  Paintbrush,
  Home,
  Hammer,
  Zap,
  Sparkles,
  Briefcase,
  Rocket,
  Award,
  BarChart3,
  UserPlus,
  LayoutGrid,
  Megaphone,
  Crown,
  Eye,
  MousePointerClick,
  Monitor,
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Rastite bez marketinga',
    description:
      'Dobijajte redovne upite za posao bez dodatnog ulaganja u oglase i dru┼ítvene mre┼że.',
    stat: 'Bez pla─çanja po kliku',
  },
  {
    icon: Users,
    title: 'Marketplace u BiH',
    description:
      'Pristupite bazi klijenata u Bosni i Hercegovini koji aktivno tra┼że majstore i firme.',
    stat: '50+ kategorija',
  },
  {
    icon: Star,
    title: 'Izgradite reputaciju',
    description: 'Skupljajte ocjene i recenzije koje vas isti─Źu ispred konkurencije.',
    stat: '4.8 / 5 prosjek',
  },
  {
    icon: Shield,
    title: 'Verifikacija profila',
    description: 'Verifikovani profil dobija zna─Źku povjerenja i bolju poziciju u listi.',
    stat: 'Zna─Źka povjerenja',
  },
];

const trustSignals = [
  {
    icon: BadgeCheck,
    title: 'Verifikovani profili',
    description: 'Svaki profil mo┼że pro─çi provjeru identiteta i kvaliteta rada.',
  },
  {
    icon: Wallet,
    title: 'Bez skrivenih tro┼íkova',
    description: 'Pla─çate fiksnu mjese─Źnu naknadu. Bez provizija po dobijenom poslu.',
  },
  {
    icon: Headphones,
    title: 'Podr┼íka na bosanskom',
    description: 'Na┼í tim dostupan je putem emaila, chata i telefona.',
  },
  {
    icon: Clock,
    title: 'Otkazivanje u svakom trenutku',
    description: 'Nema ugovorne obaveze. Mijenjajte ili otka┼żite paket kad god ┼żelite.',
  },
];

const processSteps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Kreirajte profil',
    description: 'Besplatna registracija firme ili majstora u par minuta. Dodajte usluge, gradove i portfolio.',
  },
  {
    number: '02',
    icon: Briefcase,
    title: 'Prona─Ĺite i odradite posao',
    description: 'Dobijajte upite, ┼íaljite ponude i rje┼íavajte projekte u svom okrugu.',
  },
  {
    number: '03',
    icon: Wallet,
    title: 'Naplatite i gradite reputaciju',
    description: 'Primajte uplatu direktno od klijenta i skupljajte ocjene koje donose nove poslove.',
  },
];

const projectCards = [
  {
    icon: Paintbrush,
    title: 'Malterski i bojad┼żijski radovi',
    description: 'Molerski radovi, gletovanje, kre─Źenje i bojenje enterijera.',
    gradient: 'from-orange-50 to-white border-orange-100',
  },
  {
    icon: Home,
    title: 'Renovacija kuhinja i stanova',
    description: 'Adaptacije, demonta┼ża, postavljanje plo─Źica i ugradnja elementa.',
    gradient: 'from-blue-50 to-white border-blue-100',
  },
  {
    icon: Hammer,
    title: 'Zavr┼íni i gra─Ĺevinski radovi',
    description: 'Keramika, parket, instalacije, elektrika i vodoinstalateri.',
    gradient: 'from-stone-50 to-white border-stone-100',
  },
  {
    icon: Zap,
    title: 'Elektro i vodoinstalacije',
    description: 'Rasvjeta, struja, cijevi, bojleri i hitne intervencije.',
    gradient: 'from-amber-50 to-white border-amber-100',
  },
  {
    icon: Sparkles,
    title: '─îi┼í─çenje i odr┼żavanje',
    description: 'Stanovi, ku─çe, poslovni prostori i dubinsko ─Źi┼í─çenje.',
    gradient: 'from-emerald-50 to-white border-emerald-100',
  },
  {
    icon: Briefcase,
    title: 'Projektovanje i dizajn',
    description: 'Arhitektura, 3D vizualizacije i dizajn enterijera.',
    gradient: 'from-violet-50 to-white border-violet-100',
  },
];

const categoryCount = categories.filter((c) => !c.noSeo).length;

const pricingPlans = [
  {
    name: 'Besplatno',
    slug: 'besplatno',
    price: '0',
    regularPrice: '0',
    period: 'KM/mj',
    description: 'Idealno za po─Źetak i testiranje tr┼żi┼íta.',
    cta: 'Po─Źnite besplatno',
    popular: false,
    launch: false,
  },
  {
    name: 'Start',
    slug: 'start',
    price: '19',
    regularPrice: '29',
    period: 'KM/mj',
    description: 'Za po─Źetnike koji ┼żele vi┼íe poslova.',
    cta: 'Odaberite Start',
    popular: false,
    launch: true,
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: '49',
    regularPrice: '79',
    period: 'KM/mj',
    description: 'Za aktivne firme i majstore koji ┼żele rasti.',
    cta: 'Odaberite Pro',
    popular: true,
    launch: true,
  },
  {
    name: 'Premium',
    slug: 'premium',
    price: '99',
    regularPrice: '149',
    period: 'KM/mj',
    description: 'Za najzahtjevnije profesionalce i firme.',
    cta: 'Odaberite Premium',
    popular: false,
    launch: true,
  },
];

const faqs = [
  {
    question: 'Koliko ko┼íta registracija firme ili majstora?',
    answer:
      'Registracija je potpuno besplatna. Pla─çate tek kada odlu─Źite nadograditi paket radi vi┼íe ponuda i dodatnih pogodnosti.',
  },
  {
    question: '┼áta zna─Źi "ponuda mjese─Źno"?',
    answer:
      'To je broj poslova na koje mo┼żete poslati ponudu u toku jednog kalendarskog mjeseca. Broj se resetuje prvog u mjesecu.',
  },
  {
    question: 'Mogu li otkazati pretplatu u bilo kom trenutku?',
    answer:
      'Da. Bez ugovorne obaveze i bez skrivenih naknadi. Pretplatu mo┼żete otkazati ili promijeniti iz svog dashboarda.',
  },
  {
    question: 'Kako funkcioni┼íe verifikacija profila?',
    answer:
      'Verifikacija uklju─Źuje provjeru dokumentacije i kvaliteta prethodnih radova. Verifikovani profili dobijaju zna─Źku i bolju poziciju.',
  },
  {
    question: 'Da li postoji provizija po dobijenom poslu?',
    answer:
      'Ne. Zaposli.ba ne napla─çuje proviziju po dobijenom poslu. Pla─çate samo fiksnu mjese─Źnu naknadu prema odabranom paketu.',
  },
  {
    question: 'Kako se pla─çaju paketi?',
    answer:
      'Paketi se pla─çaju mjese─Źno ili godi┼ínje, a godi┼ínje pla─çanje donosi 10% popusta. Uplata se vr┼íi bankovnom uplatom preko platnog naloga, a uputstvo dobijate odmah nakon odabira paketa.',
  },
];

export default function ZaFirmeContent() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-hero pt-28 pb-20 md:pt-40 md:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.3),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
                  <Building2 className="h-4 w-4 text-brand-orange" />
                  Marketplace za majstore i firme u BiH
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 text-balance">
                  Novi poslovi,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                    direktno u va┼í inbox
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
                  Pridru┼żite se najve─çem tr┼żi┼ítu za majstore i gra─Ĺevinske firme u Bosni i
                  Hercegovini. Dobijajte upite, ┼íaljite ponude i rastite bez velikih po─Źetnih
                  ulaganja.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <PricingCTA
                    popular
                    className="px-8 py-4 text-base shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30"
                  >
                    Registrujte firmu besplatno
                  </PricingCTA>
                  <Link
                    href="#cijene"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors duration-200"
                  >
                    Pogledajte pakete
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-orange" />
                    Bez ugovorne obaveze
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-orange" />
                    5 besplatnih ponuda mjese─Źno
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-orange" />
                    Podr┼íka na bosanskom
                  </span>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg xl:max-w-xl rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 bg-gradient-to-br from-ink-800 via-ink-700 to-ink-600 p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <Rocket className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Za┼íto firme rastu na Zaposli.ba?</h3>
                    <ul className="space-y-4">
                      {[
                        'Nema pla─çanja po kliku ili po ogledu',
                        'Direktan kontakt sa klijentom',
                        'Recenzije koje grade dugoro─Źni ugled',
                        'Alati za upravljanje ponudama',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/70">
                          <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-orange" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">4.8 / 5</p>
                        <p className="text-white/60 text-sm">Prosje─Źna ocjena verifikovanih firmi</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stat pills */}
                <div className="absolute -top-4 -right-2 md:top-4 md:-right-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">2.400+</p>
                      <p className="text-white/60 text-xs">Aktivnih firmi</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-2 md:bottom-8 md:-right-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Svakodnevno</p>
                      <p className="text-white/60 text-xs">Novi poslovi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits - 2x2 dark glass cards */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-slate-800" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <Building2 className="h-4 w-4" /> Prednosti platforme
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                Za┼íto se profesionalci pridru┼żuju Zaposli.ba?
              </h2>
              <p className="text-white/70 text-lg">
                Platforma koja vam donosi klijente, poma┼że da gradite reputaciju i rastete bez velikih po─Źetnih ulaganja.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                        <span className="text-brand-orange font-extrabold text-xs bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20 whitespace-nowrap">
                          {benefit.stat}
                        </span>
                      </div>
                      <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works - vertical timeline */}
        <section className="relative py-20 md:py-28 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Target className="h-4 w-4" /> Kako funkcioni┼íe
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Tri koraka do novih klijenata
              </h2>
              <p className="text-steel text-lg">
                Registrujte se, prona─Ĺite posao i gradite reputaciju bez komplikacija.
              </p>
            </div>

            <div className="relative space-y-6">
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-orange via-brand-orange/40 to-transparent" />

              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 ${
                    index !== processSteps.length - 1 ? 'mb-16' : ''
                  }`}
                >
                  {index % 2 === 0 ? (
                    <>
                      <div className="lg:text-right">
                        <div className="ml-20 lg:ml-0 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-card hover:shadow-xl transition-all duration-300 text-left">
                          <div className="flex items-center gap-4 mb-4 lg:flex-row-reverse">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center shrink-0">
                              <step.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-steel leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <div>
                        <div className="ml-20 lg:ml-0 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-card hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center shrink-0">
                              <step.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-steel leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="absolute left-8 lg:left-1/2 top-0 -translate-x-1/2">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-brand-orange/30 border-4 border-cloud">
                      {step.number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project showcase - bento grid */}
        <section className="relative py-20 md:py-28 bg-white overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <Briefcase className="h-4 w-4" /> Kategorije poslova
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Prona─Ĺite projekte u svojoj oblasti
              </h2>
              <p className="text-steel text-lg">
                Klijenti svakodnevno objavljuju nove poslove u {categoryCount} kategorija. Od adaptacija stanova do kuhinja,
                kupatila, farbanja, zavr┼ínih radova i mnogih drugi usluga.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectCards.map((card) => (
                <div
                  key={card.title}
                  className={`group bg-gradient-to-br ${card.gradient} rounded-2xl border p-6 shadow-card hover:shadow-xl transition-all duration-300`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <card.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{card.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{card.description}</p>
                </div>
              ))}
              <Link
                href="/kategorije/"
                className="group md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <LayoutGrid className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Ostale kategorije</h3>
                    <p className="text-sm text-steel leading-relaxed">
                      Jo┼í {categoryCount - projectCards.length} oblasti - selidbe, ─Źi┼í─çenje, hidroizolacija, energetska obnova,
                      dizajn eksterijera i mnoge druge.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-brand-orange shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-ink" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-700 to-ink-600 p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <Award className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Zna─Źka kvaliteta</h3>
                    <p className="text-white/70 leading-relaxed mb-6">
                      Verifikovani profili dobijaju zna─Źku &ldquo;Provjerena firma&rdquo; i bolju poziciju u listi.
                      Klijenti vi┼íe vjeruju firmama koje su pro┼íle provjeru, ┼íto direktno uti─Źe na stopu odabira.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {['ID broj firme', 'Reference', 'Portfolio', 'Ocjene klijenata'].map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full border border-white/10"
                        >
                          <BadgeCheck className="w-3.5 h-3.5 text-brand-orange" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                  <Shield className="h-4 w-4" /> Sigurnost i transparentnost
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                  Izgradite povjerenje klijenata
                </h2>
                <p className="text-white/70 text-lg mb-8">
                  Zaposli.ba je dizajniran da klijentima pru┼żi sigurnost i profesionalcima transparentan model rasta.
                  Bez skrivenih tro┼íkova, bez provizija, bez komplikacija.
                </p>
                <div className="space-y-4">
                  {trustSignals.map((signal) => (
                    <div
                      key={signal.title}
                      className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <signal.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1">{signal.title}</h3>
                        <p className="text-sm text-white/70 leading-relaxed">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="cijene" className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-slate-800" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <Wallet className="h-4 w-4" /> Cijene
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                Jednostavne cijene, bez iznena─Ĺenja
              </h2>
              <p className="text-white/70 text-lg mb-6">
                Po─Źnite besplatno. Nadogradite kada platforma po─Źne da vam donosi poslove.
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                Godi┼ínje pla─çanje: 10% popusta
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? 'bg-white/10 backdrop-blur-md border border-brand-orange/50 shadow-2xl shadow-brand-orange/20 scale-[1.02]'
                      : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30">
                        Preporu─Źeno
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-white/60 mb-4">{plan.description}</p>
                    {plan.launch && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wide mb-3">
                        Launch ponuda
                      </span>
                    )}
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-extrabold text-white leading-none">
                        {plan.price}
                      </span>
                      <span className="text-white/60 font-semibold mb-1">KM</span>
                    </div>
                    {plan.launch ? (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-sm text-white/60 line-through">
                          {plan.regularPrice} KM/mj
                        </p>
                        <p className="text-sm text-green-300 font-medium">
                          Prvih 3 mjeseca ┬Ě zatim {plan.regularPrice} KM/mj
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-white/60 mt-1">{plan.period}</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {planFeatures[plan.slug].map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.popular ? 'bg-brand-orange text-white' : 'bg-white/10 text-brand-orange'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PricingCTA popular={plan.popular} className="w-full">
                    {plan.cta}
                  </PricingCTA>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" /> Bez ugovorne obaveze
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-orange" /> Otka┼żite bilo kada
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange" /> Podr┼íka na bosanskom
              </span>
            </div>
          </div>
        </section>

        {/* Promoted ads pricing */}
        <section id="reklame" className="relative py-20 md:py-28 bg-gradient-to-b from-cloud to-ink-950 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm font-bold text-brand-orange uppercase tracking-wider mb-6">
                <Megaphone className="w-4 h-4" />
                Reklamirajte se
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 text-balance">
                Istaknite svoju{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  firmu na pravom mjestu.
                </span>
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Tri na─Źina promocije. Izaberite onaj koji vam najvi┼íe odgovara ÔÇö mini oglas, veliki banner ili pregled svih oglasa.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Homepage mini */}
              <div className="relative rounded-3xl bg-ink-900/90 backdrop-blur-xl border border-ink-800 p-6 md:p-8 shadow-2xl shadow-black/40 flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-4">
                    <Home className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Homepage mini oglas</h3>
                  <p className="text-white/50 text-sm mb-4">Kompaktna kartica u traci</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-white leading-none">19</span>
                    <span className="text-white/70 font-semibold mb-1">KM/mj</span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">Pro uklju─Źuje 1 ┬Ě Premium 3</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {['Prikaz u traci istaknutih oglasa', 'Broj─Źana pozicija 1ÔÇô5', 'Logo, naziv i kratak opis'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <AdPricingCTA destination="homepage" variant="primary" className="w-full">
                  Kreiraj oglas
                </AdPricingCTA>
              </div>

              {/* Homepage banner */}
              <div className="relative rounded-3xl bg-gradient-to-b from-ink-900 to-ink-950 backdrop-blur-xl border border-brand-orange/40 p-6 md:p-8 shadow-2xl shadow-black/40 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30">
                    <Crown className="w-3 h-3" /> Najbolja vidljivost
                  </span>
                </div>
                <div className="text-center mb-6 pt-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-4">
                    <Monitor className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Homepage banner</h3>
                  <p className="text-white/50 text-sm mb-4">Veliki banner 1200 ├Ś 400 px</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-white leading-none">49</span>
                    <span className="text-white/70 font-semibold mb-1">KM/mj</span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">Nije uklju─Źen u pakete</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {['Dominantna pozicija na homepage-u', 'Dimenzije 1200 ├Ś 400 px', 'Banner, naslov, opis i CTA'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <AdPricingCTA destination="homepage_banner" variant="primary" className="w-full">
                  Kreiraj banner
                </AdPricingCTA>
              </div>

              {/* Listing ad */}
              <div className="relative rounded-3xl bg-ink-900/90 backdrop-blur-xl border border-ink-800 p-6 md:p-8 shadow-2xl shadow-black/40 flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-4">
                    <LayoutGrid className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Stranica svih oglasa</h3>
                  <p className="text-white/50 text-sm mb-4">/izdvojeni-oglasi/</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-white leading-none">5</span>
                    <span className="text-white/70 font-semibold mb-1">KM</span>
                  </div>
                  <p className="text-xs text-green-400 mt-2">Besplatno za Start, Pro i Premium</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {['Prikaz na stranici svih oglasa', 'Dostupno svim korisnicima', 'Jednostavno i brzo'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <AdPricingCTA destination="listing" variant="secondary" className="w-full">
                  Kreiraj oglas
                </AdPricingCTA>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-20 md:py-28 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <HelpCircle className="h-4 w-4" /> FAQ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                ─îesto postavljana pitanja
              </h2>
              <p className="text-steel text-lg">Sve ┼íto trebate znati prije registracije.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden open:border-brand-orange/30 open:shadow-lg transition-all duration-300"
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

        {/* Final CTA */}
        <section className="relative py-20 md:py-28 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.4),transparent_40%),radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.2),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
              <Target className="h-4 w-4 text-brand-orange" />
              Po─Źnite ve─ç danas
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 text-balance">
              Spremni ste da{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                rastete?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Registrujte firmu besplatno i po─Źnite da primate nove poslove ve─ç sutra. Bez rizika, bez ugovorne obaveze.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <PricingCTA
                popular
                className="px-8 py-4 text-base shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30"
              >
                Registrujte firmu besplatno
              </PricingCTA>
              <Link
                href="/faq/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors duration-200"
              >
                Pogledajte FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Po─Źetna', url: '/' },
            { name: 'Za firme', url: '/za-firme/' },
          ]),
          faqSchema(faqs),
        ]}
      />
    </div>
  );
}
