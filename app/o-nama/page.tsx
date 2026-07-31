import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, MapPin, ThumbsUp, MessageSquare, Lock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O nama. Zaposli.ba',
  description:
    'Zaposli.ba je platforma koja spaja klijente i provjerene građevinske firme u BiH. Saznajte kako je sve počelo i koje vrijednosti nas vode.',
  alternates: { canonical: 'https://ocjenime.github.io/zaposli.ba/o-nama/' },
};

const stats = [
  { value: '2.800+', label: 'verificiranih firmi' },
  { value: '12.500+', label: 'registrovanih klijenata' },
  { value: '4,8', label: 'prosječna ocjena firmi' },
  { value: '25.000+', label: 'realiziranih poslova' },
];

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
];

export default function ONamaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'O nama' }]} />
        <PageHero
          title="O nama"
          subtitle="Platforma koja spaja klijente i provjerene građevinske firme u Bosni i Hercegovini"
          image="/zaposli.ba/images/renovacija-enterijer.jpg"
        />

        {/* Misija */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 order-2 md:order-1">
                <Image
                  src="/zaposli.ba/images/majstor-hero.jpg"
                  alt="Provjereni majstor u domu"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Naša misija</h2>
                <p className="text-lg text-steel leading-relaxed mb-6">
                  Vjerujemo da pronalaženje pouzdanog majstora ne smije biti lutrija. Zaposli.ba spaja
                  klijente i provjerene građevinske firme u BiH na jednom mjestu: klijent besplatno objavi
                  posao, a provjerene firme se javljaju sa svojim ponudama.
                </p>
                <p className="text-lg text-steel leading-relaxed">
                  Transparentno, brzo i bez posrednika koji uzimaju procenat. Naš cilj je da svaki posao,
                  od zamjene slavine do kompletne adaptacije, počne sa pravim majstorom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistike */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-card"
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-brand-orange mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-steel">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kako je sve počelo */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kako je sve počelo</h2>
            <div className="space-y-5 text-steel leading-relaxed">
              <p>
                Zaposli.ba je nastao u Sarajevu 2023. godine, iz sasvim lične frustracije. Naš
                osnivač je renovirao stan i shvatio da je pronalaženje pouzdanog majstora bilo teže
                od same adaptacije: preporuke preko poznanika, brojevi upisani na papir, majstori
                koji se ne pojave na dogovoreni termin i cijene koje se mijenjaju iz dana u dan.
              </p>
              <p>
                Znali smo da problem nije u majstorima. BiH je puna vrhunskih majstora i
                građevinskih firmi koje rade kvalitetno i pošteno. Problem je bio u tome što ih je
                bilo gotovo nemoguće pronaći, uporediti i provjeriti. Informacije su bile razbacane
                po oglasima, društvenim mrežama i usmenim preporukama.
              </p>
              <p>
                Tako je rođena ideja: jedna platforma na kojoj klijent opiše šta mu treba, a
                provjerene firme se jave sa ponudama. Danas Zaposli.ba koriste hiljade klijenata
                širom Bosne i Hercegovine, a naš cilj ostaje isti: da svaki posao, od zamjene
                slavine do kompletne adaptacije, počne sa pravim majstorom.
              </p>
            </div>
          </div>
        </section>

        {/* Vrijednosti */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Vrijednosti koje nas vode</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card text-center"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-steel leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-3">
                  Spremni za vaš sljedeći posao?
                </h2>
                <p className="text-[#ffffff]/60 mb-8 max-w-lg mx-auto">
                  Objavite posao besplatno i primite ponude od provjerenih firmi: obično u roku
                  od 24 sata.
                </p>
                <Link href="/objavi-projekat/" className="btn-primary text-lg">
                  Objavi posao besplatno
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
