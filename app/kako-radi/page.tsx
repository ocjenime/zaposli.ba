import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ClipboardList, Users, CheckCircle, Star, Shield, Clock, MessageSquare, Search, FileText, Award, Briefcase, Hammer, Paintbrush, Zap, Sparkles, Home, HelpCircle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kako funkcioniše Zaposli.ba | Zaposli.ba',
  description:
    'Jednostavan proces u 3 koraka: objavite posao besplatno, primite ponude od provjerenih firmi i odaberite najboljeg majstora u BiH.',
  alternates: { canonical: `${site.url}/kako-radi/` },
};

const clientSteps = [
  {
    icon: ClipboardList,
    title: 'Objavite posao',
    description:
      'Opišite šta vam je potrebno, dodajte fotografije i postavite budžet. Traje samo 2 minute i potpuno je besplatno.',
  },
  {
    icon: Users,
    title: 'Primite ponude',
    description:
      'Provjereni majstori i firme će vam poslati svoje ponude sa cijenama i rokovima. Obično u roku od 24 sata.',
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
    icon: Shield,
    title: 'Registrujte firmu',
    description:
      'Napravite profil vaše firme, dodajte portfolio i opišite usluge koje nudite.',
  },
  {
    icon: Search,
    title: 'Pregledajte poslove',
    description:
      'Pregledajte dostupne poslove u vašem okrugu i odaberite one koji vam odgovaraju.',
  },
  {
    icon: FileText,
    title: 'Pošaljite ponudu',
    description:
      'Pošaljite svoju ponudu sa cijenom i rokovima. Ako vas klijent odabere, dobijate posao!',
  },
];

const benefits = [
  {
    icon: Star,
    title: 'Ocjene i recenzije',
    description: 'Pročitajte iskustva drugih klijenata prije nego što odaberete firmu.',
  },
  {
    icon: Shield,
    title: 'Verificirane firme',
    description: 'Sve firme prolaze provjeru identiteta i poslovanja.',
  },
  {
    icon: Clock,
    title: 'Brze ponude',
    description: 'Primite ponude u roku od 24 sata od objave posla.',
  },
  {
    icon: MessageSquare,
    title: 'Direktna komunikacija',
    description: 'Komunicirajte direktno sa majstorima putem platforme.',
  },
];

const categoryCards = [
  {
    icon: Paintbrush,
    title: 'Malterski i bojadžijski radovi',
    description: 'Molerski radovi, gletovanje, krečenje i bojenje enterijera.',
  },
  {
    icon: Home,
    title: 'Renovacija kuhinja i stanova',
    description: 'Adaptacije, demontaža, postavljanje pločica i ugradnja elementa.',
  },
  {
    icon: Hammer,
    title: 'Završni i građevinski radovi',
    description: 'Keramika, parket, instalacije, elektrika i vodoinstalateri.',
  },
  {
    icon: Zap,
    title: 'Elektro i vodoinstalacije',
    description: 'Instalacije, rasvjeta, cijevi, bojleri i hitne intervencije.',
  },
  {
    icon: Sparkles,
    title: 'Čišćenje i održavanje',
    description: 'Stanovi, kuće, poslovni prostori i dubinsko čišćenje.',
  },
  {
    icon: Briefcase,
    title: 'Projektovanje i dizajn',
    description: 'Arhitektura, 3D vizualizacije i dizajn enterijera.',
  },
];

const faqs = [
  {
    q: 'Ko može objaviti posao?',
    a: 'Svaki klijent koji ima potrebu za majstorom: stanovi, kuće, poslovni prostori, dvorišta i vozila. Objava je besplatna i neobavezujuća.',
  },
  {
    q: 'Da li firme plaćaju proviziju po dobijenom poslu?',
    a: 'Ne. Zaposli.ba ne naplaćuje proviziju po dobijenom poslu. Firme plaćaju fiksnu mjesečnu naknadu za svoj paket.',
  },
  {
    q: 'Koliko brzo dobijam ponude?',
    a: 'Većina poslova dobije prve ponude u roku od 24 sata. Hitne intervencije često dobiju ponude u nekoliko sati.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-hero">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm border border-white/10 mb-6">
              <Award className="h-4 w-4 text-brand-orange" />
              Brzo, besplatno i bez posrednika
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Kako funkcioniše Zaposli.ba?</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Jednostavan proces u 3 koraka do idealnog majstora za vaš posao
            </p>
            <Link href="/objavi-projekat/" className="btn-primary text-lg">
              Objavi posao besplatno
            </Link>
          </div>
        </section>

        {/* Steps for Customers */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Za klijente</h2>
              <p className="text-steel">Objavite posao besplatno i neobavezujuće. Dobijte ponude, uporedite i odaberite.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-brand-orange/30 via-brand-orange/30 to-brand-orange/30" />
              {clientSteps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-white shadow-lg">
                    <step.icon className="w-8 h-8 text-brand-orange" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold -translate-y-1 z-20">
                    {index + 1}
                  </div>
                  <div className="text-sm font-bold text-brand-orange mb-2">KORAK {index + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-steel">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/objavi-projekat/" className="btn-primary text-lg">
                Objavi posao besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* Steps for Professionals */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Za firme i majstore</h2>
              <p className="text-steel">Registrujte se, pronađite poslove i širite klijentelu bez velikih ulaganja.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-brand-orange/30 via-brand-orange/30 to-brand-orange/30" />
              {firmSteps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-cloud shadow-lg">
                    <step.icon className="w-8 h-8 text-brand-orange" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold -translate-y-1 z-20">
                    {index + 1}
                  </div>
                  <div className="text-sm font-bold text-brand-orange mb-2">KORAK {index + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-steel">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/registracija/" className="btn-primary text-lg">
                Registrujte firmu besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* Category cards */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Stvarni majstori, stvarni poslovi</h2>
              <p className="text-steel text-lg">
                Na platformi svakodnevno pronalazite profesionalce za sve vrste radova u domu i poslovnom prostoru.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCards.map((card) => (
                <div
                  key={card.title}
                  className="group bg-gradient-to-br from-white to-cloud rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <card.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Zašto koristiti Zaposli.ba?</h2>
              <p className="text-steel">Spoj sigurnosti, brzine i jednostavnosti: posao završen bez stresa.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card text-center hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-steel">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Često pitanja</h2>
              <p className="text-steel">Sve što trebate znati prije nego što objavite prvi posao ili registrujete firmu.</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-cloud rounded-2xl border border-gray-100 overflow-hidden open:border-brand-orange/20 open:shadow-sm transition-all duration-200"
                >
                  <summary className="flex items-center gap-3 cursor-pointer p-6 list-none">
                    <HelpCircle className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="font-bold text-gray-900 flex-1">{faq.q}</span>
                    <ArrowRight className="w-4 h-4 text-steel flex-shrink-0 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6 pl-12 text-steel leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-orange/5 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Spremni početi?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Bez obzira tražite li majstora ili želite više poslova, Zaposli.ba je najbrži put do cilja.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/objavi-projekat/" className="btn-primary text-lg">
                Objavi posao besplatno
              </Link>
              <Link
                href="/registracija/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors"
              >
                Registruj firmu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
