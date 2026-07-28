import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Rastite sa nama',
    description: 'Dobijajte redovno nove projekte i klijente bez dodatnog ulaganja u marketing.',
  },
  {
    icon: Users,
    title: 'Hiljade kupaca',
    description: 'Pristupite bazi od preko 12,000 zadovoljnih kupaca koji traže majstore.',
  },
  {
    icon: Star,
    title: 'Izgradite reputaciju',
    description: 'Skupljajte ocjene i recenzije koje vam pomažu da se istaknete od konkurencije.',
  },
  {
    icon: CheckCircle,
    title: 'Besplatna registracija',
    description: 'Registrujte firmu besplatno i počnite da primate projekte odmah.',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '0',
    period: 'besplatno',
    description: 'Idealno za početak',
    features: [
      'Profil firme',
      'Do 5 odgovora mjesečno',
      'Osnovni portfolio',
      'Kontakt sa kupcima',
    ],
    cta: 'Počnite besplatno',
    popular: false,
  },
  {
    name: 'Premium',
    price: '49',
    period: 'KM/mjesečno',
    description: 'Za aktivne firme',
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
                <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-6 tracking-tight">
                  Proširite svoje poslovanje sa <span className="bg-gradient-to-r from-brand-amber via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">Zaposli.ba</span>
                </h1>
                <p className="text-lg text-steel mb-8">
                  Pridružite se hiljadama firmi i majstora koji redovno dobijaju nove projekte 
                  preko naše platforme. Besplatna registracija, plaćate samo kada dobijete posao.
                </p>
                <Link href="/registracija-firme" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all">
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
                      <div className="text-sm text-gray-600">Projekata</div>
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
            <h2 className="section-title text-center mb-12">Zašto se pridružiti?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works for professionals */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-12">Kako funkcioniše?</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Registrujte se</h3>
                <p className="text-sm text-gray-600">Napravite profil firme za 5 minuta</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Pregledajte projekte</h3>
                <p className="text-sm text-gray-600">Pronađite projekte koji vam odgovaraju</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Pošaljite ponudu</h3>
                <p className="text-sm text-gray-600">Opišite svoju ponudu i cijenu</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dobijte posao</h3>
                <p className="text-sm text-gray-600">Ako vas kupac odabere, započinjete saradnju</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-14 md:py-20 bg-cloud relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-3">
                Pretplate za firme
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 tracking-tight">
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
                  className={`relative bg-white rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                    plan.popular
                      ? 'ring-2 ring-brand-orange shadow-2xl shadow-brand-orange/15 md:-my-3 md:py-11 z-10'
                      : 'border border-gray-100 hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-md shadow-brand-orange/25 tracking-wide">
                        NAJPOPULARNIJI
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-7">
                    <h3 className="text-lg font-bold text-ink mb-1">{plan.name}</h3>
                    <p className="text-sm text-steel mb-5">{plan.description}</p>
                    <div className="flex items-end justify-center gap-1.5">
                      <span className="text-5xl font-extrabold text-ink leading-none">{plan.price}</span>
                      <span className="text-steel font-semibold mb-1">KM</span>
                    </div>
                    <p className="text-sm text-steel mt-1.5">{plan.period}</p>
                  </div>

                  <ul className="space-y-3.5 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span className="text-ink/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/registracija/"
                    className={`block text-center px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white hover:shadow-lg hover:shadow-brand-orange/30'
                        : 'border-2 border-ink/10 text-ink hover:border-brand-orange hover:text-brand-orange'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 text-sm text-steel">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-orange" /> Bez ugovorne obaveze</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-orange" /> Otkažite bilo kada</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-orange" /> Podrška na bosanskom</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 bg-ink overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Spremni ste da rastete?
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              Registrujte firmu danas i počnite da primate nove projekte već sutra.
            </p>
            <Link href="/registracija-firme" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-orange/25 transition-all">
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