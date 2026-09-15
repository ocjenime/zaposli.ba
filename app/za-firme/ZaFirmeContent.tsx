'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PricingCTA from '@/components/PricingCTA';
import AdPricingCTA from '@/components/AdPricingCTA';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/lib/jsonld';
import { planFeatures } from '@/lib/plan-features';

import {
  CheckCircle,
  Users,
  Star,
  ArrowRight,
  Shield,
  Wallet,
  Headphones,
  Clock,
  UserPlus,
  Briefcase,
  Target,
  HelpCircle,
  Home,
  Monitor,
  LayoutGrid,
  Megaphone,
  Crown,
  Zap,
  TrendingUp,
  MapPin,
} from 'lucide-react';

const stats = [
  { value: '2.400+', label: 'Aktivnih firmi i majstora', icon: Users },
  { value: '50+', label: 'Kategorija poslova', icon: Target },
  { value: '48', label: 'Gradova u BiH', icon: MapPin },
  { value: '4.8 / 5', label: 'Prosječna ocjena', icon: Star },
];

const processSteps = [
  {
    icon: UserPlus,
    title: 'Kreirajte profil',
    description: 'Besplatna registracija u par minuta. Dodajte usluge, gradove i portfolio.',
  },
  {
    icon: Briefcase,
    title: 'Pronađite posao',
    description: 'Dobijajte upite od klijenata i šaljite ponude direktno iz platforme.',
  },
  {
    icon: Star,
    title: 'Gradite reputaciju',
    description: 'Skupljajte ocjene i recenzije koje vas ističu ispred konkurencije.',
  },
];

const pricingPlans = [
  {
    name: 'Besplatno',
    slug: 'besplatno',
    price: '0',
    regularPrice: '0',
    period: 'KM/mj',
    description: 'Za početak i testiranje tržišta.',
    cta: 'Počnite besplatno',
    popular: false,
    launch: false,
  },
  {
    name: 'Start',
    slug: 'start',
    price: '19',
    regularPrice: '29',
    period: 'KM/mj',
    description: 'Za početnike koji žele više poslova.',
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
    description: 'Za aktivne firme i majstore koji žele rasti.',
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

const adProducts = [
  {
    icon: Home,
    title: 'Homepage mini',
    price: '19',
    unit: 'KM/mj',
    note: 'Pro uključuje 1 · Premium 3',
    features: ['Istaknuta kartica na homepage-u', 'Brojčana pozicija 1–5', 'Logo, naziv i kratak opis'],
    destination: 'homepage' as const,
    cta: 'Kreiraj mini oglas',
    variant: 'primary' as const,
  },
  {
    icon: Monitor,
    title: 'Homepage banner',
    price: '49',
    unit: 'KM/mj',
    note: 'Nije uključen u pakete',
    features: ['Dominantna pozicija na homepage-u', 'Dimenzije 1200 × 400 px', 'Banner, naslov, opis i CTA'],
    destination: 'homepage_banner' as const,
    cta: 'Kreiraj banner',
    variant: 'primary' as const,
    featured: true,
  },
  {
    icon: LayoutGrid,
    title: 'Stranica oglasa',
    price: '5',
    unit: 'KM',
    note: 'Besplatno za Start, Pro i Premium',
    features: ['Prikaz na /izdvojeni-oglasi/', 'Dostupno svim korisnicima', 'Jednostavno i brzo'],
    destination: 'listing' as const,
    cta: 'Kreiraj oglas',
    variant: 'secondary' as const,
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
    question: 'Da li postoji provizija po dobijenom poslu?',
    answer:
      'Ne. Zaposli.ba ne naplaćuje proviziju po dobijenom poslu. Plaćate samo fiksnu mjesečnu naknadu prema odabranom paketu.',
  },
];

export default function ZaFirmeContent() {
  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-hero pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
                <Zap className="h-4 w-4 text-brand-orange" />
                Marketplace za majstore i firme u BiH
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 text-balance">
                Vaši sljedeći poslovi{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  čekaju ovdje
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                Registrujte firmu ili majstorski profil, primajte upite od klijenata i rastite bez velikih početnih ulaganja.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <PricingCTA
                  popular
                  className="px-8 py-4 text-base shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30"
                >
                  Registruj se besplatno
                </PricingCTA>
                <Link
                  href="#cijene"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors"
                >
                  Pogledaj pakete
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
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
                  Bez provizije po poslu
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="relative bg-ink-950 border-y border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 via-transparent to-brand-orange/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 md:justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-lg leading-none">{stat.value}</p>
                    <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-16 md:py-24 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Target className="h-4 w-4" /> Kako funkcioniše
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 text-balance">
                Tri koraka do novih klijenata
              </h2>
              <p className="text-steel">Bez komplikacija. Bez skrivenih troškova.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {processSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-xl transition-all duration-300"
                >
                  <span className="absolute top-4 right-4 text-4xl font-extrabold text-gray-100">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="cijene" className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-slate-800" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <Wallet className="h-4 w-4" /> Cijene
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 text-balance">
                Jednostavne cijene, bez iznenađenja
              </h2>
              <p className="text-white/70">Počnite besplatno. Nadogradite kada platforma počne da vam donosi poslove.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? 'bg-white/10 backdrop-blur-md border border-brand-orange/50 shadow-2xl shadow-brand-orange/20'
                      : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30">
                        Preporučeno
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-5">
                    <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-white/60 mb-3">{plan.description}</p>
                    {plan.launch && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[10px] font-bold uppercase tracking-wide mb-2">
                        Launch ponuda
                      </span>
                    )}
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-3xl font-extrabold text-white leading-none">{plan.price}</span>
                      <span className="text-white/60 font-semibold mb-0.5 text-sm">KM</span>
                    </div>
                    {plan.launch ? (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-white/50 line-through">{plan.regularPrice} KM/mj</p>
                        <p className="text-xs text-green-300 font-medium">Prvih 3 mj · zatim {plan.regularPrice} KM/mj</p>
                      </div>
                    ) : (
                      <p className="text-xs text-white/50 mt-1">{plan.period}</p>
                    )}
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {planFeatures[plan.slug].slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div
                          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.popular ? 'bg-brand-orange text-white' : 'bg-white/10 text-brand-orange'
                          }`}
                        >
                          <CheckCircle className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-white/80 text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PricingCTA popular={plan.popular} className="w-full text-sm py-2.5">
                    {plan.cta}
                  </PricingCTA>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" /> Bez ugovorne obaveze
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-orange" /> Otkažite bilo kada
              </span>
              <span className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-brand-orange" /> Podrška na bosanskom
              </span>
            </div>
          </div>
        </section>

        {/* Promoted ads */}
        <section id="reklame" className="relative py-16 md:py-24 bg-gradient-to-b from-cloud to-ink-950 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm font-bold text-brand-orange uppercase tracking-wider mb-4">
                <Megaphone className="w-4 h-4" />
                Reklamirajte se
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 text-balance">
                Istaknite svoju{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  firmu na pravom mjestu
                </span>
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">Tri načina promocije. Izaberite onaj koji vam najviše odgovara.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {adProducts.map((product) => (
                <div
                  key={product.title}
                  className={`relative rounded-2xl p-6 flex flex-col ${
                    product.featured
                      ? 'bg-gradient-to-b from-ink-900 to-ink-950 border border-brand-orange/40 shadow-2xl shadow-black/40'
                      : 'bg-ink-900/90 backdrop-blur-xl border border-ink-800'
                  }`}
                >
                  {product.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg shadow-brand-orange/30">
                        <Crown className="w-3 h-3" /> Najbolja vidljivost
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-5">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-brand-orange/10 flex items-center justify-center mb-3">
                      <product.icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{product.title}</h3>
                    <p className="text-white/50 text-xs mb-3">{product.note}</p>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-3xl font-extrabold text-white leading-none">{product.price}</span>
                      <span className="text-white/70 font-semibold mb-0.5 text-sm">{product.unit}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                        <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <AdPricingCTA destination={product.destination} variant={product.variant} className="w-full text-sm py-2.5">
                    {product.cta}
                  </AdPricingCTA>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-16 md:py-24 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <HelpCircle className="h-4 w-4" /> FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 text-balance">
                Često postavljana pitanja
              </h2>
              <p className="text-steel">Sve što trebate znati prije registracije.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden open:border-brand-orange/30 open:shadow-lg transition-all duration-300"
                >
                  <summary className="flex items-center gap-4 cursor-pointer p-5 list-none">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-50 text-brand-orange text-sm font-extrabold flex items-center justify-center">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-bold text-gray-900 text-base">{faq.question}</span>
                  </summary>
                  <div className="px-5 pb-5 pl-[4rem] text-sm text-steel leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-16 md:py-24 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
              <Shield className="h-4 w-4 text-brand-orange" />
              Počnite već danas
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 text-balance">
              Spremni ste da{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                rastete?
              </span>
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Registrujte firmu besplatno i počnite da primate nove poslove već sutra. Bez rizika, bez ugovorne obaveze.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <PricingCTA
                popular
                className="px-8 py-4 text-base shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30"
              >
                Registruj se besplatno
              </PricingCTA>
              <Link
                href="/faq/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors"
              >
                Pogledaj FAQ
              </Link>
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
