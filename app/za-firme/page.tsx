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
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Proširite svoje poslovanje sa Zaposli.ba
                </h1>
                <p className="text-lg text-blue-100 mb-8">
                  Pridružite se hiljadama firmi i majstora koji redovno dobijaju nove projekte 
                  preko naše platforme. Besplatna registracija, plaćate samo kada dobijete posao.
                </p>
                <Link href="/registracija-firme" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Registrujte firmu besplatno
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-primary-600">2,800+</div>
                      <div className="text-sm text-gray-600">Firmi</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-success-600">25,000+</div>
                      <div className="text-sm text-gray-600">Projekata</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-accent-500">4.8</div>
                      <div className="text-sm text-gray-600">Prosječna ocjena</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">95%</div>
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
        <section className="py-16 bg-gray-50">
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
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-4">Cijene</h2>
            <p className="section-subtitle text-center">Odaberite paket koji vam odgovara</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`card relative ${
                    plan.popular ? 'border-2 border-primary-500 shadow-xl' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                        NAJPOPULARNIJI
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">KM</span>
                    </div>
                    <p className="text-sm text-gray-500">{plan.period}</p>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/registracija-firme"
                    className={`block text-center ${
                      plan.popular ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Spremni ste da rastete?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Registrujte firmu danas i počnite da primate nove projekte već sutra.
            </p>
            <Link href="/registracija-firme" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
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