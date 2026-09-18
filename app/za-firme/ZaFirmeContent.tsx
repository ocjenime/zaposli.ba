'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import PricingCTA from '@/components/PricingCTA';
import AdPricingCTA from '@/components/AdPricingCTA';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/lib/jsonld';
import { planFeatures } from '@/lib/plan-features';

import {
  CheckCircle,
  Users,
  Shield,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  BarChart3,
  Briefcase,
  Play,
  Home,
  LayoutGrid,
  Triangle,
  Target,
  Crown,
  Monitor,
  Megaphone,
  ChevronDown,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

const notifications = [
  {
    icon: Home,
    title: 'Novi upit za vašu uslugu',
    service: 'Adaptacija stana',
    city: 'Bihać',
    time: 'prije 5 min',
  },
  {
    icon: LayoutGrid,
    title: 'Novi projekat',
    service: 'Postavljanje keramike',
    city: 'Velika Kladuša',
    time: 'prije 18 min',
  },
  {
    icon: Triangle,
    title: 'Upit za ponudu',
    service: 'Krovopokrivački radovi',
    city: 'Cazin',
    time: 'prije 1 h',
  },
];

const benefits = [
  {
    icon: Users,
    title: 'Novi klijenti',
    description: 'Redovni upiti od ljudi koji traže vaše usluge.',
  },
  {
    icon: Shield,
    title: 'Više povjerenja',
    description: 'Profesionalan profil i recenzije grade vašu reputaciju.',
  },
  {
    icon: BarChart3,
    title: 'Manje praznog hoda',
    description: 'Stabilniji priliv posla i bolja iskorištenost kapaciteta.',
  },
];

const pricingPlans = [
  {
    name: 'Besplatno',
    slug: 'besplatno',
    price: '0',
    regularPrice: '0',
    cta: 'Počni besplatno',
    popular: false,
    launch: false,
  },
  {
    name: 'Start',
    slug: 'start',
    price: '19',
    regularPrice: '29',
    cta: 'Odaberi Start',
    popular: false,
    launch: true,
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: '49',
    regularPrice: '79',
    cta: 'Odaberi Pro',
    popular: true,
    launch: true,
  },
  {
    name: 'Premium',
    slug: 'premium',
    price: '99',
    regularPrice: '149',
    cta: 'Odaberi Premium',
    popular: false,
    launch: true,
  },
];

const faqs = [
  {
    question: 'Koliko košta registracija firme ili majstora?',
    answer:
      'Registracija je potpuno besplatna. Plaćate tek kada odlučite nadograditi paket radi više ponuda i dodatnih pogodnosti.',
  },
  {
    question: 'Šta znači "ponuda mjesečno"?',
    answer:
      'To je broj poslova na koje možete poslati ponudu u toku jednog kalendarskog mjeseca. Broj se resetuje prvog u mjesecu.',
  },
  {
    question: 'Mogu li otkazati pretplatu u bilo kom trenutku?',
    answer:
      'Da. Bez ugovorne obaveze i bez skrivenih naknadi. Pretplatu možete otkazati ili promijeniti iz svog dashboarda.',
  },
  {
    question: 'Kako funkcioniše verifikacija profila?',
    answer:
      'Verifikacija uključuje provjeru dokumentacije i kvaliteta prethodnih radova. Verifikovani profili dobijaju značku i bolju poziciju.',
  },
  {
    question: 'Da li postoji provizija po dobijenom poslu?',
    answer:
      'Ne. Zaposli.ba ne naplaćuje proviziju po dobijenom poslu. Plaćate samo fiksnu mjesečnu naknadu prema odabranom paketu.',
  },
  {
    question: 'Kako se plaćaju paketi?',
    answer:
      'Paketi se plaćaju mjesečno ili godišnje, a godišnje plaćanje donosi 10% popusta. Uplata se vrši bankovnom uplatom preko platnog naloga, a uputstvo dobijate odmah nakon odabira paketa.',
  },
];

const trustFooter = [
  { icon: Shield, label: 'Iz Bosne i Hercegovine za bolje majstore.' },
  { icon: ShieldCheck, label: 'Sigurno' },
  { icon: BadgeCheck, label: 'Pouzdano' },
  { icon: MapPin, label: 'Lokalno' },
];

export default function ZaFirmeContent() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Image
            src="/images/zafirme-hero.jpg"
            alt="Majstorski alat i gradilište"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/60" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
            <div className="grid grid-cols-[1.08fr_0.92fr] sm:grid-cols-2 gap-3 sm:gap-6 md:gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wider text-white/80 mb-3 sm:mb-4">
                  <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-orange" />
                  ZA FIRME I MAJSTORE
                </span>
                <h1 className="text-[27px] leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
                  Vi radite posao.
                  <br />
                  <span className="text-brand-orange">Mi vam dovodimo klijente.</span>
                </h1>
                <p className="text-[13px] sm:text-sm md:text-lg text-white/70 leading-relaxed mb-5 sm:mb-6">
                  Dobijajte stvarne upite od klijenata koji aktivno traže vaše usluge u Bosni i
                  Hercegovini. Jednostavno, brzo i bez dodatnog marketinga.
                </p>
                <div className="flex flex-col gap-2.5 mb-5">
                  <PricingCTA popular className="w-full px-5 py-3 text-sm sm:text-base">
                    Registrujte firmu besplatno
                  </PricingCTA>
                  <Link
                    href="/kako-funkcionise/"
                    className="inline-flex items-center justify-center gap-2.5 w-full bg-white/5 border border-white/15 text-white px-5 py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors duration-200"
                  >
                    <span className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center shrink-0">
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                    Pogledajte kako funkcioniše
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-sm text-white/70">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-orange shrink-0" />
                    Bez ugovorne obaveze
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-orange shrink-0" />
                    Brza registracija
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-orange shrink-0" />
                    Podrška na bosanskom
                  </span>
                </div>
              </div>

              {/* Notification cards */}
              <div className="relative">
                <p className="hidden sm:block absolute -top-9 right-1 rotate-6 font-serif italic text-white/50 text-base text-right leading-tight">
                  VI GRADITE
                  <br />
                  BOLJU BIH
                </p>
                <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-4">
                  {notifications.map((n) => (
                    <div
                      key={n.title}
                      className="rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 p-2.5 sm:p-3.5 shadow-xl"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-brand-orange/15 flex items-center justify-center shrink-0">
                          <n.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] sm:text-sm font-bold text-white leading-tight truncate">
                            {n.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-white/60 leading-tight truncate">
                            {n.service}
                          </p>
                          <p className="text-[10px] sm:text-xs text-white/40 leading-tight truncate">
                            {n.city}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                          <span className="text-[9px] sm:text-[11px] text-white/50 whitespace-nowrap">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-ink-950 to-transparent" />
        </section>

        {/* Benefits */}
        <section className="relative py-10 md:py-16">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 sm:p-5 md:p-6"
                >
                  <span className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-2 sm:mb-3">
                    <b.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-brand-orange" />
                  </span>
                  <h3 className="text-[13px] sm:text-base md:text-lg font-bold text-white leading-snug mb-1">
                    {b.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-white/60 leading-snug">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="cijene" className="relative py-10 md:py-16 scroll-mt-20">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                Jednostavni paketi za svaki biznis
              </h2>
              <p className="text-white/60 text-sm md:text-base mb-4">
                Pronađite paket koji odgovara vašim ciljevima.
              </p>
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                Godišnje plaćanje: 10% popusta
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-5 items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-5 md:p-6 flex flex-col text-center transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? 'bg-white/[0.07] backdrop-blur-md border border-brand-orange/60 shadow-2xl shadow-brand-orange/20'
                      : 'bg-white/[0.04] border border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center px-4 py-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30 whitespace-nowrap">
                        Najpopularniji
                      </span>
                    </div>
                  )}

                  <h3 className="text-base md:text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-extrabold text-white leading-none">
                      {plan.price}
                    </span>
                    <span className="text-white/60 font-semibold mb-1">KM</span>
                  </div>
                  <p className="text-sm text-white/50 mt-1 mb-1">/mjesečno</p>
                  {plan.launch && (
                    <div className="mb-1">
                      <p className="text-xs text-white/50">
                        <span className="line-through">{plan.regularPrice} KM/mj</span>
                        <span className="text-green-300 font-semibold"> · prvih 3 mjeseca</span>
                      </p>
                    </div>
                  )}

                  <ul className="space-y-2.5 my-5 flex-1 text-left">
                    {planFeatures[plan.slug].map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.popular ? 'bg-brand-orange text-white' : 'bg-white/10 text-brand-orange'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
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
          </div>
        </section>

        {/* Promoted ads pricing */}
        <section id="reklame" className="relative py-10 md:py-16 overflow-hidden scroll-mt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">
                <Megaphone className="w-4 h-4" />
                Reklamirajte se
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3 text-balance">
                Istaknite svoju{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  firmu na pravom mjestu.
                </span>
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
                Tri načina promocije. Izaberite onaj koji vam najviše odgovara — mini oglas, veliki banner ili pregled svih oglasa.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
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
                  <p className="text-xs text-white/40 mt-2">Pro uključuje 1 · Premium 3</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {['Prikaz u traci istaknutih oglasa', 'Brojčana pozicija 1–5', 'Logo, naziv i kratak opis'].map((f) => (
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
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30 whitespace-nowrap">
                    <Crown className="w-3 h-3" /> Najbolja vidljivost
                  </span>
                </div>
                <div className="text-center mb-6 pt-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-4">
                    <Monitor className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Homepage banner</h3>
                  <p className="text-white/50 text-sm mb-4">Veliki banner 1200 × 400 px</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-white leading-none">49</span>
                    <span className="text-white/70 font-semibold mb-1">KM/mj</span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">Nije uključen u pakete</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {['Dominantna pozicija na homepage-u', 'Dimenzije 1200 × 400 px', 'Banner, naslov, opis i CTA'].map((f) => (
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
        <section className="relative py-10 md:py-16">
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-xs font-semibold mb-3 border border-white/10">
                <HelpCircle className="h-4 w-4" /> FAQ
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2 text-balance">
                Često postavljana pitanja
              </h2>
              <p className="text-white/60 text-sm md:text-base">Sve što trebate znati prije registracije.</p>
            </div>

            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white/[0.04] rounded-2xl border border-white/10 overflow-hidden open:border-brand-orange/30 transition-all duration-300"
                >
                  <summary className="flex items-center gap-3 md:gap-4 cursor-pointer p-4 md:p-5 list-none">
                    <span className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-orange/15 text-brand-orange text-xs md:text-sm font-extrabold flex items-center justify-center">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-bold text-white text-[15px] md:text-lg">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 md:px-5 pb-4 md:pb-5 pl-[3.25rem] md:pl-[4.25rem] text-white/60 text-sm leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-10 md:py-16">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <span className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 md:w-7 md:h-7 text-brand-orange" />
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-3xl font-extrabold text-white mb-1.5">
                  Spremni ste da <span className="text-brand-orange">rastete?</span>
                </h2>
                <p className="text-white/60 text-sm md:text-base mb-4">
                  Registrujte firmu danas i počnite primati nove poslove već sutra.
                </p>
                <PricingCTA popular className="w-full sm:w-auto px-6 py-3.5">
                  Registrujte firmu besplatno
                </PricingCTA>
              </div>
              <div className="hidden sm:flex items-end gap-1.5 h-20 shrink-0" aria-hidden="true">
                {[35, 50, 42, 62, 55, 80].map((h, i, arr) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-4 rounded-t-md ${
                      i === arr.length - 1
                        ? 'bg-gradient-to-t from-brand-orange to-amber-400'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
                <TrendingUp className="w-6 h-6 text-brand-orange -ml-1 mb-14" />
              </div>
            </div>

            {/* Trust footer */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[13px] text-white/60">
              {trustFooter.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5">
                  <t.icon className="w-4 h-4 text-white/40" />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Za firme', url: '/za-firme/' },
          ]),
          faqSchema(faqs),
        ]}
      />
    </div>
  );
}
