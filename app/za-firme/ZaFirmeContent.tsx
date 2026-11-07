'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import PricingCTA from '@/components/PricingCTA';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/lib/jsonld';

import {
  CheckCircle,
  Users,
  Shield,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  BarChart3,
  Briefcase,
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
  ArrowRight,
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

const faqs = [
  {
    question: 'Koliko košta registracija firme ili majstora?',
    answer:
      'Sve je potpuno besplatno. Registracija, objava oglasa, slanje ponuda i komunikacija - ništa se ne naplaćuje.',
  },
  {
    question: 'Šta treba da uradim da mogu slati ponude?',
    answer:
      'Verifikujte profil - unesite ID broj firme i naš tim će ga provjeriti na companywall. Nakon verifikacije možete slati ponude, objavljivati oglase i komunicirati sa klijentima.',
  },
  {
    question: 'Kako funkcioniše verifikacija profila?',
    answer:
      'Unesite ID broj firme na profilu. Admin ga provjerava na companywall u BiH da firma stvarno postoji. Nakon odobrenja dobijate značku verifikacije i puni pristup.',
  },
  {
    question: 'Da li postoji provizija po dobijenom poslu?',
    answer:
      'Ne. Zaposli.ba ne naplaćuje ništa - ni pretplatu, ni proviziju. Platforma je potpuno besplatna za firme i majstore.',
  },
  {
    question: 'Koliko traje verifikacija?',
    answer:
      'Obično 1-2 radna dana. Čim admin provjeri vaš ID broj, dobijate obavještenje i profil postaje aktivan.',
  },
  {
    question: 'Šta ako nemam firma ID broj?',
    answer:
      'Firme i majstori koji nemaju registrovanu firmu (obrtnici, fizička lica) - kontaktirajte nas na info@zaposli.ba za poseban postupak verifikacije.',
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
        <section className="relative overflow-hidden pt-12 md:pt-16">
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

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-8 md:pb-12">
            <div className="grid grid-cols-[1.08fr_0.92fr] sm:grid-cols-2 gap-3 sm:gap-6 md:gap-12 items-center">
              <div>
                <Breadcrumbs dark bare items={[{ name: 'Za profesionalce' }]} />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wider text-white/80 mb-3 sm:mb-4 mt-3">
                  <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-orange" />
                  ZA PROFESIONALCE
                </span>
                <h1 className="text-[27px] leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
                  Vi radite posao.
                  <br />
                  <span className="text-brand-orange">Mi vam dovodimo klijente.</span>
                </h1>
                <p className="text-[13px] sm:text-sm md:text-lg text-white/70 leading-relaxed mb-4 sm:mb-5">
                  Dobijajte stvarne upite od klijenata koji aktivno traže vaše usluge u Bosni i
                  Hercegovini. Jednostavno, brzo i bez dodatnog marketinga.
                </p>
                <div className="mb-4">
                  <PricingCTA popular className="w-full px-5 py-3 text-sm sm:text-base">
                    Registrujte firmu besplatno
                  </PricingCTA>
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
                <div className="space-y-1.5 sm:space-y-2.5 mt-1 sm:mt-3">
                  {notifications.map((n) => (
                    <div
                      key={n.title}
                      className="rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 p-2 sm:p-3 shadow-xl"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-brand-orange/15 flex items-center justify-center shrink-0">
                          <n.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] sm:text-sm font-bold text-white leading-tight">
                            {n.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-white/60 leading-snug">
                            {n.service} · {n.city} · {n.time}
                          </p>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
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
        <section className="relative z-10 -mt-6 md:-mt-10 pb-8 md:pb-12">
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

        {/* Pricing - sve besplatno, samo verifikacija */}
        <section id="cijene" className="relative py-10 md:py-16 scroll-mt-20">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                Sve je potpuno besplatno
              </h2>
              <p className="text-white/60 text-sm md:text-base mb-4">
                Bez pretplata, bez provizija, bez skrivenih troškova. Jedini uvjet je verifikacija.
              </p>
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                0 KM - zauvijek besplatno
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {/* Besplatno */}
              <div className="relative rounded-2xl p-5 sm:p-6 bg-white/[0.04] border border-white/10 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-orange/10 flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Sve besplatno</h3>
                <div className="flex items-end justify-center gap-0.5 mb-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white leading-none">0</span>
                  <span className="text-white/60 font-semibold text-sm mb-0.5">KM</span>
                </div>
                <p className="text-xs text-white/60 mb-4">zauvijek, bez ograničenja</p>
                <ul className="space-y-2 text-left">
                  {['Neograničene ponude', 'Neograničeni oglasi', 'Direktna komunikacija', 'Sve funkcije platforme'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verifikacija */}
              <div className="relative rounded-2xl p-5 sm:p-6 bg-white/[0.07] backdrop-blur-md border border-brand-orange/60 shadow-xl shadow-brand-orange/20 text-center">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30">
                    Obavezno
                  </span>
                </div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-orange/10 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Verifikacija</h3>
                <p className="text-xs text-white/60 mb-4">ID broj firme - companywall provjera</p>
                <ul className="space-y-2 text-left">
                  {['Unesite ID broj firme', 'Admin provjerava na companywall', 'Odobrenje u 1-2 dana', 'Značka verifikacije na profilu'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/registracija/"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
                >
                  Registrujte firmu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Šta dobijate */}
              <div className="relative rounded-2xl p-5 sm:p-6 bg-white/[0.04] border border-white/10 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-orange/10 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Puni pristup</h3>
                <p className="text-xs text-white/60 mb-4">Nakon verifikacije dobijate sve</p>
                <ul className="space-y-2 text-left">
                  {['Slanje ponuda na poslove', 'Objava sponzoriranih oglasa', 'Direktna poruka klijentima', 'Verifikovana značka'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
                Svi oglasi su besplatni za firme i majstore. Premium članovi su automatski sticky na vrhu liste.
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-1 pt-4 pb-2 items-stretch md:justify-center">
              {/* Besplatni oglas */}
              <div className="relative snap-center shrink-0 w-[82%] sm:w-[340px] rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 p-4 sm:p-5 md:p-6 shadow-2xl shadow-black/40 flex flex-col text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-2 sm:mb-3">
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                </div>
                <h3 className="text-[13px] sm:text-base md:text-lg font-bold text-white mb-0.5">Sponzorirani oglas</h3>
                <p className="text-white/50 text-[11px] sm:text-sm mb-2">Stranica svih oglasa + homepage traka</p>
                <div className="flex items-end justify-center gap-0.5">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-none">0</span>
                  <span className="text-white/70 font-semibold text-[11px] sm:text-sm mb-0.5">KM</span>
                </div>
                <p className="text-[11px] sm:text-sm text-white/50 mt-0.5">zauvijek besplatno</p>
                <p className="text-[10px] sm:text-xs text-green-400 mt-1 mb-3">Premium = sticky vrh liste</p>
                <ul className="space-y-1.5 sm:space-y-2.5 mb-4 flex-1 text-left">
                  {['Prikaz na stranici svih oglasa', 'Dostupno svim korisnicima', 'Jednostavno i brzo'].map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span className="text-white/80 text-[11px] sm:text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kupi-oglas/"
                  className="w-full text-xs sm:text-sm inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                >
                  Kreiraj oglas
                </Link>
              </div>

              {/* Homepage banner - dogovor */}
              <div className="relative snap-center shrink-0 w-[82%] sm:w-[340px] rounded-xl sm:rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-brand-orange/40 p-4 sm:p-5 md:p-6 shadow-2xl shadow-black/40 flex flex-col text-center">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30 whitespace-nowrap">
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Najbolja vidljivost
                  </span>
                </div>
                <div className="text-center mb-2 sm:mb-3 pt-3 sm:pt-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-2 sm:mb-3">
                    <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-[13px] sm:text-base md:text-lg font-bold text-white mb-0.5">Homepage banner</h3>
                  <p className="text-white/50 text-[11px] sm:text-sm mb-2">Veliki banner na homepage-u</p>
                  <div className="flex items-end justify-center gap-0.5">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-none">Dogovor</span>
                  </div>
                  <p className="text-[11px] sm:text-sm text-white/50 mt-0.5">direktno sa nama</p>
                </div>
                <ul className="space-y-1.5 sm:space-y-2.5 mb-4 flex-1 text-left">
                  {['Dominantna pozicija na homepage-u', 'Vidljiv na svim uređajima', 'Banner, naslov, opis i CTA'].map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span className="text-white/80 text-[11px] sm:text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:info@zaposli.ba?subject=Homepage%20banner%20-%20upit"
                  className="w-full text-xs sm:text-sm inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                >
                  Kontaktirajte nas
                </a>
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
            { name: 'Za profesionalce', url: '/za-firme/' },
          ]),
          faqSchema(faqs),
        ]}
      />
    </div>
  );
}
