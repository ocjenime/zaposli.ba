import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  },
  {
    icon: MapPin,
    title: 'Lokalno',
    description:
      'Radimo isključivo sa firmama i majstorima iz Bosne i Hercegovine: podržavamo lokalnu ekonomiju.',
  },
  {
    icon: ThumbsUp,
    title: 'Preporučeno',
    description:
      'Ocjene i recenzije pišu isključivo stvarni klijenti kojima je firma radila posao preko platforme.',
  },
  {
    icon: MessageSquare,
    title: 'Brza komunikacija',
    description:
      'Direktan kontakt sa firmama kroz platformu: bez čekanja, bez posrednika, bez skrivenih brojeva.',
  },
  {
    icon: Lock,
    title: 'Sigurno',
    description:
      'Vaši podaci su zaštićeni, a kontakt informacije dijelimo samo uz vaše odobrenje.',
  },
  {
    icon: HeartHandshake,
    title: 'Pošteno',
    description:
      'Transparentne cijene, bez skrivenih provizija i bez posrednika koji uzimaju procenat.',
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

        {/* Hero - cinematic with logo */}
        <section className="relative overflow-hidden bg-gradient-hero pt-28 md:pt-44 pb-20 md:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.3),transparent_40%)]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-brand-orange/30 rounded-full blur-3xl animate-pulse-slow" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center p-5 shadow-2xl">
                <Image
                  src="/images/logo-mark.png"
                  alt="Zaposli.ba logo"
                  width={120}
                  height={120}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6 text-balance">
              Svaki posao zaslužuje pravog majstora
            </h1>
            <p className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-10">
              Zaposli.ba spaja klijente i provjerene građevinske firme u Bosni i Hercegovini na jednom jednostavnom
              mjestu.
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:text-base text-white/70">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand-orange" />
                Verificirane firme
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-orange" />
                Cijela BiH
              </span>
              <span className="inline-flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-brand-orange" />
                Stvarne recenzije
              </span>
            </div>
          </div>
        </section>

        {/* Logo trust mark */}
        <section className="relative py-24 md:py-32 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-10 md:p-16 shadow-2xl border border-white/10 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="relative inline-flex mb-8">
                  <div className="absolute inset-0 bg-brand-orange/40 rounded-full blur-3xl" />
                  <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-5 shadow-2xl flex items-center justify-center">
                    <Image
                      src="/images/logo-mark.png"
                      alt="Zaposli.ba značka kvaliteta"
                      width={140}
                      height={140}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                  <Award className="h-4 w-4" /> Značka kvaliteta
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5 text-balance">
                  Kad vidite ovaj znak, znate da je firma provjerena
                </h2>
                <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  Verifikovani profili na Zaposli.ba prošli su provjeru identiteta, referenci i kvaliteta rada. Klijenti
                  ostavljaju stvarne recenzije, a vaši podaci su zaštićeni.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {trustPillars.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
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

        {/* Mission manifesto */}
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-6 border border-orange-100">
              <Compass className="h-4 w-4" /> Naša misija
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 text-balance leading-[1.1]">
              Pronalaženje majstora ne smije biti lutrija
            </h2>
            <p className="text-lg md:text-xl text-steel leading-relaxed mb-12 max-w-3xl mx-auto">
              Vjerujemo da svaki posao, od zamjene slavine do kompletne adaptacije, počinje sa pravim majstorom. Bez
              preporuka preko poznanika, bez brojeva na papiru i bez cijena koje se mijenjaju iz dana u dan.
            </p>

            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {[
                { icon: Target, title: 'Jednostavno', desc: 'Objavite posao i uporedite ponude' },
                { icon: ShieldCheck, title: 'Bez rizika', desc: 'Firme su provjerene prije ulaska' },
                { icon: HeartHandshake, title: 'Pošteno', desc: 'Bez skrivenih provizija' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-cloud rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center mb-3">
                    <item.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-steel">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-slate-800" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange text-sm font-semibold mb-4 border border-white/10">
                <Rocket className="h-4 w-4" /> Naš put
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Od ideje do tržišta
              </h2>
              <p className="text-white/70 text-lg">
                Zaposli.ba je nastao iz lične frustracije i raste svakim danom zahvaljujući korisnicima i firmama.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
              {timeline.map((item) => (
                <div key={item.year} className="relative pl-16 md:pl-20">
                  <span className="absolute left-0 top-0 text-5xl md:text-6xl font-extrabold text-brand-orange/10 select-none leading-none">
                    {item.year}
                  </span>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center mb-4">
                      <item.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <span className="inline-block text-xs font-extrabold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-2 border border-brand-orange/20">
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative py-24 md:py-32 bg-cloud overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <HeartHandshake className="h-4 w-4" /> Vrijednosti
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Načela koja nas vode
              </h2>
              <p className="text-steel text-lg">
                Naš rad temeljimo na transparentnosti, sigurnosti i poštovanju prema svim korisnicima.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-card hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-steel leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 md:py-32 bg-gradient-hero overflow-hidden">
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
