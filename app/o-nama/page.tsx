import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  MapPin,
  ThumbsUp,
  MessageSquare,
  Lock,
  HeartHandshake,
  Sparkles,
  Target,
  Rocket,
  Compass,
  Lightbulb,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import LiveStatsSection from '@/components/ui/LiveStatsSection';
import { JsonLd, organizationSchema, breadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'O nama | Zaposli.ba',
  description:
    'Zaposli.ba je platforma koja spaja klijente i provjerene građevinske firme u BiH. Saznajte kako je sve počelo i koje vrijednosti nas vode.',
  alternates: { canonical: `${site.url}/o-nama/` },
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Provjereno',
    description:
      'Svaka firma prolazi provjeru registracije, identiteta i referenci prije nego što se pojavi na platformi.',
    gradient: 'from-orange-50 to-white border-orange-100',
  },
  {
    icon: MapPin,
    title: 'Lokalno',
    description:
      'Radimo isključivo sa firmama i majstorima iz Bosne i Hercegovine: podržavamo lokalnu ekonomiju.',
    gradient: 'from-blue-50 to-white border-blue-100',
  },
  {
    icon: ThumbsUp,
    title: 'Preporučeno',
    description:
      'Ocjene i recenzije pišu isključivo stvarni klijenti kojima je firma radila posao preko platforme.',
    gradient: 'from-emerald-50 to-white border-emerald-100',
  },
  {
    icon: MessageSquare,
    title: 'Brza komunikacija',
    description:
      'Direktan kontakt sa firmama kroz platformu: bez čekanja, bez posrednika, bez skrivenih brojeva.',
    gradient: 'from-amber-50 to-white border-amber-100',
  },
  {
    icon: Lock,
    title: 'Sigurno',
    description:
      'Vaši podaci su zaštićeni, a kontakt informacije dijelimo samo uz vaše odobrenje.',
    gradient: 'from-stone-50 to-white border-stone-100',
  },
  {
    icon: HeartHandshake,
    title: 'Pošteno',
    description:
      'Transparentne cijene, bez skrivenih provizija i bez posrednika koji uzimaju procenat.',
    gradient: 'from-violet-50 to-white border-violet-100',
  },
];

const timeline = [
  {
    icon: Lightbulb,
    year: '2023',
    title: 'Ideja se rodila',
    description:
      'Nakon vlastite frustracije prilikom renoviranja stana u Sarajevu, osnovali smo ideju da pronađemo pouzdane majstore trebalo biti jednostavno kao naručiti hranu.',
  },
  {
    icon: Rocket,
    year: '2024',
    title: 'Platforma uživo',
    description:
      'Prva verzija Zaposli.ba objavljena je sa desetak kategorija i nekoliko provjerenih firmi iz Sarajeva.',
  },
  {
    icon: Target,
    year: '2025',
    title: 'Rast širom BiH',
    description:
      'Platforma proširila svoju mrežu na desetine gradova i kategorija usluga, od građevine do čišćenja.',
  },
  {
    icon: Sparkles,
    year: '2026',
    title: 'Nova generacija',
    description:
      'Nastavljamo razvijati alate za verifikaciju, recenzije i direktnu komunikaciju: cilj nam je ostati najpouzdanije tržište za majstore u BiH.',
  },
];

const trustPillars = [
  { icon: ShieldCheck, title: 'Verifikacija', description: 'ID firme i reference' },
  { icon: Star, title: 'Ocjene', description: 'Od stvarnih klijenata' },
  { icon: Lock, title: 'Sigurnost', description: 'Zaštićeni podaci' },
];

export default function ONamaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'O nama' }]} />

        <PageHero
          title="O nama"
          subtitle="Platforma koja spaja klijente i provjerene građevinske firme u Bosni i Hercegovini."
          eyebrow="Naša priča"
          icon={Compass}
          align="center"
          size="lg"
        >
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-orange" />
              Verificirane firme
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-orange" />
              Cijela BiH
            </span>
            <span className="inline-flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-brand-orange" />
              Stvarne recenzije
            </span>
          </div>
        </PageHero>

        {/* Logo trust mark */}
        <section className="relative py-20 md:py-28 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-8 md:p-14 shadow-2xl border border-white/10 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="w-28 h-28 mx-auto bg-white rounded-3xl p-4 shadow-xl mb-8">
                  <Image
                    src="/images/logo-mark.png"
                    alt="Zaposli.ba logo"
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                  <Award className="h-4 w-4" /> Značka kvaliteta
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 text-balance">
                  Kad vidite ovaj znak, znate da je firma provjerena
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
                  Naš logo je simbol povjerenja. Verifikovani profili na Zaposli.ba prošli su provjeru identiteta,
                  referenci i kvaliteta rada, klijenti ostavljaju stvarne recenzije, a vaši podaci su zaštićeni.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {trustPillars.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center mb-3">
                        <pillar.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-bold text-white mb-1">{pillar.title}</h3>
                      <p className="text-sm text-white/60">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="relative py-20 md:py-28 bg-white overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                  <Target className="h-4 w-4" /> Naša misija
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 text-balance">
                  Jednostavno do pravog majstora
                </h2>
                <p className="text-lg text-steel leading-relaxed mb-6">
                  Vjerujemo da pronalaženje pouzdanog majstora ne smije biti lutrija. Zaposli.ba spaja klijente i
                  provjerene građevinske firme u BiH na jednom mjestu: klijent besplatno objavi posao, a provjerene
                  firme se javljaju sa svojim ponudama.
                </p>
                <p className="text-lg text-steel leading-relaxed mb-8">
                  Transparentno, brzo i bez posrednika koji uzimaju procenat. Naš cilj je da svaki posao, od zamjene
                  slavine do kompletne adaptacije, počne sa pravim majstorom.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/objavi-projekat/" className="btn-primary text-lg inline-flex items-center justify-center gap-2">
                    Objavi posao besplatno
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/kako-radi/"
                    className="inline-flex items-center justify-center gap-2 bg-white text-brand-orange border-2 border-brand-orange px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200"
                  >
                    Kako funkcioniše
                  </Link>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-700 to-ink-600 p-8 md:p-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="mb-8">
                    <Image
                      src="/images/logo-full-white.webp"
                      alt="Zaposli.ba"
                      width={200}
                      height={60}
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">Zašto postojimo?</h3>
                  <ul className="space-y-4">
                    {[
                      'Spojiti klijente i provjerene firme na jednom mjestu',
                      'Smanjiti rizik od loših angažmana',
                      'Podići standard usluga u građevinskoj industriji',
                      'Omogućiti fer tržište bez skrivenih naknada',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-orange" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative py-20 md:py-28 bg-cloud overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Users className="h-4 w-4" /> Zaposli.ba u brojevima
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                Rastemo zajedno sa korisnicima
              </h2>
              <p className="text-steel text-lg">
                Realni podaci koji rastu svakim danom zahvaljujući korisnicima i firmama.
              </p>
            </div>
            <LiveStatsSection />
          </div>
        </section>

        {/* Timeline */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-slate-800" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <Rocket className="h-4 w-4" /> Naš put
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                Kako je sve počelo
              </h2>
              <p className="text-white/70 text-lg">
                Od lične frustracije do najvećeg tržišta majstora u BiH.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-orange/40 before:to-transparent">
                {timeline.map((item) => (
                  <div
                    key={item.year}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="hidden md:flex items-center justify-center w-5/12" />
                    <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-orange-dark border-4 border-ink rounded-full flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10 shadow-lg shadow-brand-orange/20 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-5/12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 ml-14 md:ml-0 hover:bg-white/10 transition-colors duration-300">
                      <span className="inline-block text-xs font-extrabold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-2 border border-brand-orange/20">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/70 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
                <p className="text-white/80 leading-relaxed">
                  Zaposli.ba je nastao u Sarajevu 2023. godine, iz sasvim lične frustracije. Naš osnivač je renovirao
                  stan i shvatio da je pronalaženje pouzdanog majstora bilo teže od same adaptacije: preporuke preko
                  poznanika, brojevi upisani na papir, majstori koji se ne pojave na dogovoreni termin i cijene koje se
                  mijenjaju iz dana u dan.
                </p>
                <p className="text-white/80 leading-relaxed mt-4">
                  Znali smo da problem nije u majstorima. BiH je puna vrhunskih majstora i građevinskih firmi koje rade
                  kvalitetno i pošteno. Problem je bio u tome što ih je bilo gotovo nemoguće pronaći, uporediti i
                  provjeriti. Tako je rođena ideja: jedna platforma na kojoj klijent opiše šta mu treba, a provjerene
                  firme se jave sa ponudama.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative py-20 md:py-28 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <HeartHandshake className="h-4 w-4" /> Vrijednosti
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Vrijednosti koje nas vode
              </h2>
              <p className="text-steel text-lg">
                Naš rad temeljimo na transparentnosti, sigurnosti i poštovanju prema svim korisnicima.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className={`group bg-gradient-to-br ${value.gradient} rounded-2xl border p-6 shadow-card hover:shadow-xl transition-all duration-300`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{value.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{value.description}</p>
                </div>
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
              <Sparkles className="h-4 w-4 text-brand-orange" />
              Spremni početi?
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 text-balance">
              Pridružite se najvećem tržištu majstora u BiH
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Objavite posao besplatno ili registrujte firmu i počnite da primate nove upite već sutra.
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
            { name: 'O nama', url: '/o-nama/' },
          ]),
          organizationSchema(),
        ]}
      />
    </div>
  );
}
