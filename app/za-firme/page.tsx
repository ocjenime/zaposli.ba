import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FirmProcessAnimation } from '@/components/FirmProcessAnimation';
import {
  CheckCircle, TrendingUp, Users, Star, ArrowRight,
  Shield, BadgeCheck, Clock, Wallet, Sparkles,
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Rastite sa nama',
    description: 'Dobijajte redovno nove poslove i klijente bez dodatnog ulaganja u marketing.',
    badge: 'Rast',
  },
  {
    icon: Users,
    title: 'Hiljade klijenata',
    description: 'Pristupite bazi od preko 12,000 zadovoljnih klijenata koji traže majstore.',
    badge: 'Tržište',
  },
  {
    icon: Star,
    title: 'Izgradite reputaciju',
    description: 'Skupljajte ocjene i recenzije koje vam pomažu da se istaknete od konkurencije.',
    badge: 'Povjerenje',
  },
  {
    icon: CheckCircle,
    title: 'Besplatna registracija',
    description: 'Registrujte firmu besplatno i počnite da primate poslove odmah.',
    badge: '0 KM',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '0',
    period: 'besplatno',
    description: 'Idealno za početak',
    emblem: 'Start',
    features: [
      'Profil firme',
      'Do 5 odgovora mjesečno',
      'Osnovni portfolio',
      'Kontakt sa klijentima',
    ],
    cta: 'Počnite besplatno',
    popular: false,
  },
  {
    name: 'Premium',
    price: '49',
    period: 'KM/mjesečno',
    description: 'Za aktivne firme',
    emblem: 'Najpopularniji',
    features: [
      'Neograničeni odgovori',
      'Istaknuti profil',
      'Napredni portfolio',
      'Prioritetni prikaz',
      'Statistika posjeta',
      'Email podrška',
    ],
    cta: 'Odaberite Premium',
    popular: true,
  },
  {
    name: 'Pro',
    price: '99',
    period: 'KM/mjesečno',
    description: 'Za najveće firme',
    emblem: 'Profesionalac',
    features: [
      'Sve iz Premium paketa',
      'Vlastiti logotip na profilu',
      'Napredna analitika',
      'Promovirani listingi',
      'Dedicated support',
      'API pristup',
    ],
    cta: 'Odaberite Pro',
    popular: false,
  },
];

export default function ForCompaniesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-cloud py-16 md:py-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Proširite svoje poslovanje sa <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">Zaposli.ba</span>
                </h1>
                <p className="text-lg text-steel mb-8">
                  Pridružite se hiljadama firmi i majstora koji redovno dobijaju nove poslove 
                  preko naše platforme. Besplatna registracija, plaćate samo kada dobijete posao.
                </p>
                <Link href="/registracija/" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all">
                  Registrujte firmu besplatno
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-2xl p-8 shadow-float border border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-brand-orange">2,800+</div>
                      <div className="text-sm text-gray-600">Firmi</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-brand-orange">25,000+</div>
                      <div className="text-sm text-gray-600">Poslova</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-brand-orange">4.8</div>
                      <div className="text-sm text-gray-600">Prosječna ocjena</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-brand-orange">95%</div>
                      <div className="text-sm text-gray-600">Zadovoljstvo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" /> Prednosti platforme
              </span>
              <h2 className="section-title">Zašto se pridružiti?</h2>
              <p className="text-steel mt-3">
                Platforma koja vam donosi klijente, pomaže da gradite reputaciju i rastete bez velikih početnih ulaganja.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-orange/20 transition-all duration-300"
                >
                  {/* Premium emblem badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md shadow-brand-orange/20 group-hover:scale-105 transition-transform">
                      {benefit.badge}
                    </span>
                  </div>

                  {/* Icon container with hover glow */}
                  <div className="relative w-16 h-16 mx-auto mb-4 mt-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 rounded-2xl rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    <div className="relative w-full h-full bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 flex items-center justify-center group-hover:border-brand-orange/30 transition-colors">
                      <benefit.icon className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-steel leading-relaxed">{benefit.description}</p>

                  {/* Decorative corner accent on hover */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-brand-orange/10 to-transparent rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works for professionals */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-12">Kako funkcioniše?</h2>
            <FirmProcessAnimation />
          </div>
        </section>

        {/* Pricing */}
        <section className="py-14 md:py-20 bg-cloud relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-3">
                <BadgeCheck className="w-4 h-4" /> Pretplate za firme
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Jednostavne cijene, bez iznenađenja
              </h2>
              <p className="text-steel max-w-xl mx-auto">
                Počnite besplatno. Nadogradite kada vidite da vam platforma donosi poslove.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`group relative bg-white rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                    plan.popular
                      ? 'ring-2 ring-brand-orange shadow-2xl shadow-brand-orange/15 md:-my-3 md:py-11 z-10 hover:shadow-brand-orange/25'
                      : 'border border-gray-100 hover:shadow-2xl hover:border-brand-orange/20 hover:ring-1 hover:ring-brand-orange/10'
                  }`}
                >
                  {/* Premium emblem */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[#ffffff] text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg transition-transform group-hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark shadow-brand-orange/30'
                        : 'bg-gradient-to-r from-gray-700 to-gray-900 shadow-gray-900/20'
                    }`}>
                      {plan.popular && <Star className="w-3 h-3" />}
                      {plan.emblem}
                    </span>
                  </div>

                  {/* Hover gradient sheen */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    plan.popular
                      ? 'bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-orange/5'
                      : 'bg-gradient-to-br from-orange-50/50 via-transparent to-orange-50/30'
                  }`} />

                  <div className="relative text-center mb-7">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                      plan.popular
                        ? 'bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white shadow-lg shadow-brand-orange/25'
                        : 'bg-orange-50 text-brand-orange'
                    }`}>
                      {plan.popular ? <Shield className="w-7 h-7" /> : <BadgeCheck className="w-7 h-7" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-steel mb-5">{plan.description}</p>
                    <div className="flex items-end justify-center gap-1.5">
                      <span className="text-5xl font-extrabold text-gray-900 leading-none">{plan.price}</span>
                      <span className="text-steel font-semibold mb-1">KM</span>
                    </div>
                    <p className="text-sm text-steel mt-1.5">{plan.period}</p>
                  </div>

                  <ul className="relative space-y-3.5 mb-8 flex-1">
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

                  <Link
                    href="/registracija/"
                    className={`relative block text-center px-6 py-3.5 rounded-xl font-bold transition-all duration-300 active:scale-95 overflow-hidden ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30 hover:scale-[1.02]'
                        : 'border-2 border-gray-200 text-gray-900 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/50 hover:scale-[1.02]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 text-sm text-steel">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-orange" /> Bez ugovorne obaveze</span>
              <span className="flex items-center gap-2"><Wallet className="w-4 h-4 text-brand-orange" /> Otkažite bilo kada</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-orange" /> Podrška na bosanskom</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 bg-ink overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#ffffff] mb-4">
              Spremni ste da rastete?
            </h2>
            <p className="text-lg text-[#ffffff]/60 mb-8 max-w-2xl mx-auto">
              Registrujte firmu danas i počnite da primate nove poslove već sutra.
            </p>
            <Link href="/registracija/" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all">
              Registrujte firmu besplatno
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}