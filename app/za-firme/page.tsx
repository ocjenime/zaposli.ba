'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FirmProcessAnimation } from '@/components/FirmProcessAnimation';
import PricingCTA from '@/components/PricingCTA';
import { useLiveStats, formatCount, formatRating } from '@/hooks/useLiveStats';
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
  Sparkles,
  Building2,
  Target,
  Headphones,
  Zap,
  ChevronDown,
  Award,
  Phone,
  HelpCircle,
} from 'lucide-react';

function FloatingOpenJobsBadge() {
  const { openJobsCount, loading } = useLiveStats();
  return (
    <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-center">
      <div className={`text-2xl font-extrabold text-brand-orange ${loading ? 'opacity-70' : ''}`}>
        {formatCount(openJobsCount, '25.000+')}
      </div>
      <div className="text-xs text-steel">aktivnih poslova</div>
    </div>
  );
}

function StatsSection() {
  const { firmsCount, completedJobsCount, averageRating, loading, error } = useLiveStats();
  const positiveRate = 95; // fallback, možemo kasnije izračunati iz recenzija

  const stats = [
    { value: formatCount(firmsCount, '2,800+'), label: 'Registrovanih majstora' },
    { value: formatCount(completedJobsCount, '25,000+'), label: 'Završenih poslova' },
    { value: formatRating(averageRating, '4.8'), label: 'Prosječna ocjena' },
    { value: `${loading && !error ? '...' : positiveRate}%`, label: 'Zadovoljnih klijenata' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`text-3xl md:text-4xl font-bold text-ink ${loading ? 'opacity-70' : ''}`}>
            {stat.value}
          </div>
          <div className="mt-1 text-sm text-steel">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

const benefits = [
  {
    icon: TrendingUp,
    title: 'Rastite bez marketinga',
    description: 'Dobijajte redovne upite za posao bez dodatnog ulaganja u oglase i društvene mreže.',
    badge: 'Rast',
  },
  {
    icon: Users,
    title: 'Hiljade klijenata',
    description: 'Pristupite najvećoj bazi klijenata u BiH koji aktivno traže majstore i firme.',
    badge: 'Tržište',
  },
  {
    icon: Star,
    title: 'Izgradite reputaciju',
    description: 'Skupljajte ocjene i recenzije koje vas ističu ispred konkurencije.',
    badge: 'Povjerenje',
  },
  {
    icon: Shield,
    title: 'Verifikacija profila',
    description: 'Verifikovani profil dobija značku povjerenja i bolju poziciju u listi.',
    badge: 'Sigurnost',
  },
];

const trustSignals = [
  {
    icon: BadgeCheck,
    title: 'Verifikovani profili',
    description: 'Svaki profil može proći provjeru identiteta i kvaliteta rada.',
  },
  {
    icon: Wallet,
    title: 'Bez skrivenih troškova',
    description: 'Plaćate fiksnu mjesečnu naknadu. Bez provizija po dobijenom poslu.',
  },
  {
    icon: Headphones,
    title: 'Podrška na bosanskom',
    description: 'Naš tim dostupan je putem emaila, chata i telefona.',
  },
  {
    icon: Clock,
    title: 'Otkazivanje u svakom trenutku',
    description: 'Nema ugovorne obaveze. Mijenjajte ili otkažite paket kad god želite.',
  },
];

const pricingPlans = [
  {
    name: 'Besplatno',
    price: '0',
    period: 'KM/mj',
    description: 'Idealno za početak i testiranje tržišta.',
    emblem: 'Start',
    features: [
      'Profil firme / majstora',
      '5 ponuda mjesečno',
      'Direktan kontakt sa klijentima',
      'Osnovni portfolio',
    ],
    cta: 'Počnite besplatno',
    popular: false,
  },
  {
    name: 'Start',
    price: '29',
    period: 'KM/mj',
    description: 'Za početnike koji žele više poslova.',
    emblem: 'Rast',
    features: [
      '10 ponuda mjesečno',
      'Verifikacija profila',
      'Istaknuti kontakt',
      'Prioritet u listi',
      'Email podrška',
    ],
    cta: 'Odaberite Start',
    popular: false,
  },
  {
    name: 'Pro',
    price: '79',
    period: 'KM/mj',
    description: 'Za aktivne firme i majstore koji žele rasti.',
    emblem: 'Preporučeno',
    features: [
      '30 ponuda mjesečno',
      'Istaknuti profil',
      'Verifikacija profila',
      'Prioritetna podrška',
      'Statistika posjeta',
      'Promovirani listingi',
    ],
    cta: 'Odaberite Pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: '149',
    period: 'KM/mj',
    description: 'Za najzahtjevnije profesionalce i firme.',
    emblem: 'Premium',
    features: [
      'Neograničene ponude',
      'Premium istaknutost',
      'Verifikacija profila',
      '24/7 podrška',
      'Napredna analitika',
      'Vlastiti logotip na profilu',
    ],
    cta: 'Odaberite Premium',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Koliko košta registracija firme ili majstora?',
    answer: 'Registracija je potpuno besplatna. Plaćate tek kada odlučite nadograditi paket radi više ponuda i dodatnih pogodnosti.',
  },
  {
    question: 'Šta znači "ponuda mjesečno"?',
    answer: 'To je broj poslova na koje možete poslati ponudu u toku jednog kalendarskog mjeseca. Broj se resetuje prvog u mjesecu.',
  },
  {
    question: 'Mogu li otkazati pretplatu u bilo kom trenutku?',
    answer: 'Da. Bez ugovorne obaveze i bez skrivenih naknadi. Pretplatu možete otkazati ili promijeniti iz svog dashboarda.',
  },
  {
    question: 'Kako funkcioniše verifikacija profila?',
    answer: 'Verifikacija uključuje provjeru dokumentacije i kvaliteta prethodnih radova. Verifikovani profili dobijaju značku i bolju poziciju.',
  },
  {
    question: 'Da li postoji provizija po dobijenom poslu?',
    answer: 'Ne. Zaposli.ba ne naplaćuje proviziju po dobijenom poslu. Plaćate samo fiksnu mjesečnu naknadu prema odabranom paketu.',
  },
  {
    question: 'Kako se plaćaju paketi?',
    answer: 'Paketi se plaćaju mjesečno ili godišnje. Godišnje plaćanje donosi 10% popusta. Dostupni su Stripe, PayPal i bankovna uplata.',
  },
];

export default function ForCompaniesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
                  <Sparkles className="h-4 w-4 text-brand-orange" />
                  #1 bh. marketplace za majstore i firme
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 text-balance">
                  Novi poslovi, direktno u vaš inbox
                </h1>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
                  Pridružite se najvećem tržištu za majstore i građevinske firme u Bosni i Hercegovini.
                  Dobijajte upite, šaljite ponude i rastite bez velikih početnih ulaganja.
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
                <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-orange" />
                    Bez ugovorne obaveze
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-orange" />
                    5 besplatnih ponuda mjesečno
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-orange" />
                    Podrška na bosanskom
                  </span>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/10">
                  <Image
                    src="/zaposli.ba/images/majstor-cekic.jpg"
                    alt="Majstor sa čekićem tokom renovacije"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Verifikovani profili</div>
                    <div className="text-xs text-steel">Povjerenje klijenata</div>
                  </div>
                </div>
                {/* Floating stat */}
                <FloatingOpenJobsBadge />
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <StatsSection />
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4">
                <Award className="h-4 w-4" /> Prednosti platforme
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Zašto se profesionalci pridružuju Zaposli.ba?
              </h2>
              <p className="text-steel text-lg">
                Platforma koja vam donosi klijente, pomaže da gradite reputaciju i rastete bez velikih početnih ulaganja.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="relative bg-white rounded-2xl border border-gray-100 p-7 text-center shadow-sm hover:shadow-card transition-shadow duration-200"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {benefit.badge}
                    </span>
                  </div>
                  <div className="w-14 h-14 mx-auto mb-4 mt-2 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-24 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <Building2 className="h-4 w-4" /> Kako radi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Od registracije do zarade u 4 koraka
              </h2>
              <p className="text-steel text-lg">
                Besplatno se registrujte, pronađite poslove u vašoj oblasti i šaljite ponude klijentima.
              </p>
            </div>
            <FirmProcessAnimation />

            <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-3">
              {[
                'Besplatna registracija',
                'Bez provizije od posla',
                'Prve ponude u 24h',
                '20+ kategorija',
                'Verifikacija profila',
                'Podrška na bosanskom',
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 text-brand-orange" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Real project showcase */}
        <section className="py-20 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4">
                <Building2 className="h-4 w-4" /> Stvarni poslovi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Pronađite projekte u svojoj oblasti
              </h2>
              <p className="text-steel text-lg">
                Od adaptacija stanova do kuhinja, kupatila, farbanja i završnih radova. Klijenti svakodnevno objavljuju nove poslove.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-card transition-all duration-200">
                <Image
                  src="/zaposli.ba/images/farbanje-zid.jpg"
                  alt="Majstor farba zid profesionalnom opremom"
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">Malterski i bojadžijski radovi</h3>
                  <p className="text-sm text-steel">Molerski radovi, gletovanje, krečenje i bojenje enterijera.</p>
                </div>
              </div>
              <div className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-card transition-all duration-200">
                <Image
                  src="/zaposli.ba/images/kuhinja-renovacija.jpg"
                  alt="Kuhinja u toku renovacije"
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">Renovacija kuhinja i stanova</h3>
                  <p className="text-sm text-steel">Adaptacije, demontaža, postavljanje pločica i ugradnja elementa.</p>
                </div>
              </div>
              <div className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-card transition-all duration-200">
                <Image
                  src="/zaposli.ba/images/majstor-cekic.jpg"
                  alt="Majstor sa čekićem na gradilištu"
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">Završni i građevinski radovi</h3>
                  <p className="text-sm text-steel">Keramika, parket, instalacije, elektrika i vodoinstalateri.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="py-20 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-100">
                  <Image
                    src="/zaposli.ba/images/renovacija-enterijer.jpg"
                    alt="Renovacija enterijera u toku"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">M</div>
                      <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">A</div>
                      <div className="w-7 h-7 rounded-full bg-steel text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">S</div>
                    </div>
                    <span className="text-xs font-bold text-gray-900">+2.800 kolega</span>
                  </div>
                  <p className="text-xs text-steel">Pridružite se mreži provjerenih majstora i firmi.</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4">
                  <Shield className="h-4 w-4" /> Sigurnost i transparentnost
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Izgradite povjerenje klijenata
                </h2>
                <p className="text-steel text-lg mb-8">
                  Zaposli.ba je dizajniran da klijentima pruži sigurnost i profesionalcima transparentan model rasta.
                  Bez skrivenih troškova, bez provizija, bez komplikacija.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {trustSignals.map((signal) => (
                    <div key={signal.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                        <signal.icon className="w-6 h-6 text-brand-orange" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{signal.title}</h3>
                        <p className="text-sm text-steel leading-relaxed">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="cijene" className="py-20 md:py-24 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <Wallet className="h-4 w-4" /> Cijene
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Jednostavne cijene, bez iznenađenja
              </h2>
              <p className="text-steel text-lg mb-4">
                Počnite besplatno. Nadogradite kada platforma počne da vam donosi poslove.
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" /> Godišnje plaćanje: 10% popusta
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-3xl p-7 flex flex-col transition-shadow duration-200 ${
                    plan.popular
                      ? 'ring-2 ring-brand-orange shadow-card-hover'
                      : 'border border-gray-100 shadow-sm hover:shadow-card'
                  }`}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark'
                        : 'bg-gray-800'
                    }`}>
                      {plan.popular && <Star className="w-3 h-3" />}
                      {plan.emblem}
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      plan.popular
                        ? 'bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white shadow-md shadow-brand-orange/20'
                        : 'bg-orange-50 text-brand-orange'
                    }`}>
                      {plan.popular ? <Zap className="w-7 h-7" /> : <BadgeCheck className="w-7 h-7" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-steel mb-5">{plan.description}</p>
                    <div className="flex items-end justify-center gap-1.5">
                      <span className="text-4xl font-extrabold text-gray-900 leading-none">{plan.price}</span>
                      <span className="text-steel font-semibold mb-1">KM</span>
                    </div>
                    <p className="text-sm text-steel mt-1">{plan.period}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.popular ? 'bg-brand-orange text-white' : 'bg-orange-100 text-brand-orange'
                        }`}>
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-gray-900/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PricingCTA popular={plan.popular} className="w-full">
                    {plan.cta}
                  </PricingCTA>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 text-sm text-steel">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" /> Bez ugovorne obaveze
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-orange" /> Otkažite bilo kada
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange" /> Podrška na bosanskom
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4">
                <HelpCircle className="h-4 w-4" /> FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Često postavljana pitanja
              </h2>
              <p className="text-steel text-lg">
                Sve što trebate znati prije registracije.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden open:border-brand-orange/20 open:shadow-sm transition-all duration-200"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer p-6 list-none">
                    <span className="font-bold text-gray-900">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-steel flex-shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 text-steel leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 md:py-24 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
              <Target className="h-4 w-4 text-brand-orange" />
              Počnite već danas
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Spremni ste da rastete?
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Registrujte firmu besplatno i počnite da primate nove poslove već sutra. 
              Bez rizika, bez ugovorne obaveze.
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
    </div>
  );
}
