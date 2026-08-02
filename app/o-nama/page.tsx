import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { ShieldCheck, MapPin, ThumbsUp, MessageSquare, Lock, HeartHandshake, Sparkles, Target, Rocket, Compass, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import LiveStatsSection from '@/components/ui/LiveStatsSection';

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
      'Platforma proširila svoju mrežu na 35 gradova i desetine kategorija usluga, od građevine do čišćenja.',
  },
  {
    icon: Sparkles,
    year: '2026',
    title: 'Nova generacija',
    description:
      'Nastavljamo razvijati alate za verifikaciju, recenzije i direktnu komunikaciju: cilj nam je ostati najpouzdanije tržište za majstore u BiH.',
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
        />

        {/* Misija */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gradient-to-br from-ink via-ink-800 to-ink-700 p-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <Compass className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Naša misija u brojevima</h3>
                    <ul className="space-y-3 text-white/70">
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center">
                          <Target className="w-3.5 h-3.5 text-brand-orange" />
                        </div>
                        Spojiti klijente i provjerene firme na jednom mjestu
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                        </div>
                        Smanjiti rizik od loših angažmana
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                        </div>
                        Podići standard usluga u građevinskoj industriji
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
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
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Zaposli.ba u brojevima</h2>
              <p className="text-steel">Realni podaci koji rastu svakim danom zahvaljujući korisnicima i firmama.</p>
            </div>
            <LiveStatsSection />
          </div>
        </section>

        {/* Kako je sve počelo */}
        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Kako je sve počelo</h2>
              <p className="text-steel">Od lične frustracije do najvećeg tržišta majstora u BiH.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-orange/30 before:to-transparent">
                {timeline.map((item, index) => (
                  <div key={item.year} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="hidden md:flex items-center justify-center w-5/12" />
                    <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-white border-2 border-brand-orange rounded-full flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10 shadow-md">
                      <item.icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-5/12 bg-white rounded-2xl border border-gray-100 p-6 shadow-card ml-12 md:ml-0">
                      <span className="inline-block text-xs font-bold text-brand-orange bg-primary-50 px-2.5 py-1 rounded-full mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-steel leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <p className="text-steel leading-relaxed">
                  Zaposli.ba je nastao u Sarajevu 2023. godine, iz sasvim lične frustracije. Naš
                  osnivač je renovirao stan i shvatio da je pronalaženje pouzdanog majstora bilo teže
                  od same adaptacije: preporuke preko poznanika, brojevi upisani na papir, majstori
                  koji se ne pojave na dogovoreni termin i cijene koje se mijenjaju iz dana u dan.
                </p>
                <p className="text-steel leading-relaxed mt-4">
                  Znali smo da problem nije u majstorima. BiH je puna vrhunskih majstora i
                  građevinskih firmi koje rade kvalitetno i pošteno. Problem je bio u tome što ih je
                  bilo gotovo nemoguće pronaći, uporediti i provjeriti. Informacije su bile razbacane
                  po oglasima, društvenim mrežama i usmenim preporukama.
                </p>
                <p className="text-steel leading-relaxed mt-4">
                  Tako je rođena ideja: jedna platforma na kojoj klijent opiše šta mu treba, a
                  provjerene firme se jave sa ponudama. Naš cilj ostaje isti: da svaki posao, od zamjene
                  slavine do kompletne adaptacije, počne sa pravim majstorom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vrijednosti */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Vrijednosti koje nas vode</h2>
              <p className="text-steel">Naš rad temeljimo na transparentnosti, sigurnosti i poštovanju prema svim korisnicima.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-xl transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
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
        <section className="pb-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-orange/5 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Spremni za vaš sljedeći posao?
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
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
