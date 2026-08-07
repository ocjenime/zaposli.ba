import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { JsonLd, breadcrumbSchema, faqSchema, howToSchema } from '@/lib/jsonld';
import {
  Award,
  BadgeCheck,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  Hammer,
  HelpCircle,
  Home,
  Lightbulb,
  MessageSquare,
  Paintbrush,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
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

const categoryCards = [
  {
    icon: Paintbrush,
    title: 'Malterski i bojadžijski radovi',
    description: 'Molerski radovi, gletovanje, krečenje i bojenje enterijera.',
    gradient: 'from-orange-50 to-white border-orange-100',
  },
  {
    icon: Home,
    title: 'Renovacija kuhinja i stanova',
    description: 'Adaptacije, demontaža, postavljanje pločica i ugradnja elementa.',
    gradient: 'from-blue-50 to-white border-blue-100',
  },
  {
    icon: Hammer,
    title: 'Završni i građevinski radovi',
    description: 'Keramika, parket, instalacije, elektrika i vodoinstalateri.',
    gradient: 'from-stone-50 to-white border-stone-100',
  },
  {
    icon: Zap,
    title: 'Elektro i vodoinstalacije',
    description: 'Instalacije, rasvjeta, cijevi, bojleri i hitne intervencije.',
    gradient: 'from-amber-50 to-white border-amber-100',
  },
  {
    icon: Sparkles,
    title: 'Čišćenje i održavanje',
    description: 'Stanovi, kuće, poslovni prostori i dubinsko čišćenje.',
    gradient: 'from-emerald-50 to-white border-emerald-100',
  },
  {
    icon: Briefcase,
    title: 'Projektovanje i dizajn',
    description: 'Arhitektura, 3D vizualizacije i dizajn enterijera.',
    gradient: 'from-violet-50 to-white border-violet-100',
  },
];

const faqs = [
  {
    question: 'Ko može objaviti posao?',
    answer:
      'Svaki klijent koji ima potrebu za majstorom: stanovi, kuće, poslovni prostori, dvorišta i vozila. Objava je besplatna i neobavezujuća.',
  },
  {
    question: 'Da li firme plaćaju proviziju po dobijenom poslu?',
    answer:
      'Ne. Zaposli.ba ne naplaćuje proviziju po dobijenom poslu. Firme plaćaju fiksnu mjesečnu naknadu za svoj paket.',
  },
  {
    question: 'Koliko brzo dobijam ponude?',
    answer:
      'Većina poslova dobije prve ponude u roku od 24 sata. Hitne intervencije često dobiju ponude u nekoliko sati.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Kako funkcioniše Zaposli.ba?"
          subtitle="Jednostavan proces u 3 koraka do idealnog majstora za vaš posao."
          eyebrow="Brzo, besplatno i bez posrednika"
          icon={Lightbulb}
          align="center"
          size="lg"
        >
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
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
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-orange" />
              Bez provizije
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-orange" />
              Ponude u 24 sata
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-brand-orange" />
              Provjerene firme
            </span>
          </div>
        </PageHero>

        {/* Client steps - alternating timeline */}
        <section
          id="klijenti"
          className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-cloud via-slate-950 to-ink"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <Users className="h-4 w-4" /> Za klijente
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                Od ideje do gotovog posla
              </h2>
              <p className="text-white/70 text-lg">
                Objavite posao besplatno i neobavezujuće. Dobijte ponude, uporedite i odaberite.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-orange via-brand-orange/40 to-transparent" />

              {clientSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 ${
                    index !== clientSteps.length - 1 ? 'mb-16' : ''
                  }`}
                >
                  {index % 2 === 0 ? (
                    <>
                      <div className="lg:text-right">
                        <div className="ml-20 lg:ml-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="flex items-center gap-4 mb-4 lg:flex-row-reverse">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center shrink-0">
                              <step.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-white">{step.title}</h3>
                          </div>
                          <p className="text-white/70 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <div>
                        <div className="ml-20 lg:ml-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center shrink-0">
                              <step.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-white">{step.title}</h3>
                          </div>
                          <p className="text-white/70 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="absolute left-8 lg:left-1/2 top-0 -translate-x-1/2">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-brand-orange/30 border-4 border-slate-950">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/objavi-projekat/" className="btn-primary text-lg px-8 py-4">
                Objavi posao besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* Firm steps - vertical list */}
        <section id="firme" className="relative py-20 md:py-28 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <Briefcase className="h-4 w-4" /> Za firme i majstore
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Pronađite nove klijente bez marketinga
              </h2>
              <p className="text-steel text-lg">
                Registrujte se, pronađite poslove i širite klijentelu bez velikih ulaganja.
              </p>
            </div>

            <div className="relative space-y-6">
              {firmSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative group bg-cloud rounded-2xl border border-gray-100 p-6 md:p-8 shadow-card hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-brand-orange/20 group-hover:scale-105 transition-transform">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <step.icon className="w-5 h-5 text-brand-orange" strokeWidth={1.5} />
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-steel text-base leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  {index !== firmSteps.length - 1 && (
                    <div className="hidden sm:block absolute left-[3.25rem] top-full h-6 w-0.5 bg-gradient-to-b from-brand-orange/40 to-transparent" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/registracija/" className="btn-primary text-lg px-8 py-4">
                Registrujte firmu besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* Categories - bento grid */}
        <section className="relative py-20 md:py-28 bg-cloud overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Sparkles className="h-4 w-4" /> Stvarni majstori, stvarni poslovi
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Sve vrste radova na jednom mjestu
              </h2>
              <p className="text-steel text-lg">
                Na platformi svakodnevno pronalazite profesionalce za sve vrste radova u domu i poslovnom prostoru.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCards.map((card) => (
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
            </div>
          </div>
        </section>

        {/* Benefits - dark glass cards */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-slate-800" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <TrendingUp className="h-4 w-4" /> Zašto mi?
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
                Sigurnost, brzina i jednostavnost
              </h2>
              <p className="text-white/70 text-lg">
                Spoj sigurnosti, brzine i jednostavnosti: posao završen bez stresa.
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
                        <span className="text-brand-orange font-extrabold text-sm bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
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

        {/* FAQ */}
        <section className="relative py-20 md:py-28 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
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

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
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
      <Footer />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Kako funkcioniše', url: '/kako-radi/' },
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
    </div>
  );
}
