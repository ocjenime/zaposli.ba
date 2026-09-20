import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Zap,
  Users,
  MapPin,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { JsonLd, organizationSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'O nama | Zaposli.ba',
  description:
    'Zaposli.ba je platforma koja spaja klijente i provjerene građevinske firme u BiH. Saznajte kako je sve počelo i koje vrijednosti nas vode.',
  alternates: { canonical: `${site.url}/o-nama/` },
};

const miniValues = [
  {
    icon: ShieldCheck,
    title: 'Povjerenje',
    description: 'Profili, verifikacija i recenzije.',
  },
  {
    icon: Zap,
    title: 'Jednostavno',
    description: 'Objavi, primi ponude i odaberi.',
  },
  {
    icon: Users,
    title: 'Direktno',
    description: 'Klijenti i firme povezani na platformi.',
  },
  {
    icon: MapPin,
    title: 'BiH',
    description: 'Napravljen za ljude i firme u našoj zemlji.',
  },
];

export default function ONamaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'O nama' }]} />

        {/* Hero */}
        <section className="relative min-h-[480px] sm:min-h-[540px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/herozaposli.png"
              alt="Majstor sa Zaposli.ba oznakom na gradilištu u sumrak"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/40 to-ink-950/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-ink-950/15 to-ink-950/20" />
          </div>

          <div className="relative z-20 flex-1 flex flex-col justify-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pb-10">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/70 mb-4">
                <Link href="/" className="hover:text-white transition-colors">
                  Početna
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium" aria-current="page">
                  O nama
                </span>
              </nav>

              <div className="max-w-2xl">
                <p className="text-brand-orange text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 animate-fade-in">
                  O nama
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-3 animate-fade-in">
                  Svaki projekat počinje{' '}
                  <span className="text-brand-orange">pravim ljudima.</span>
                </h1>
                <p className="text-sm sm:text-lg text-white/85 leading-relaxed mb-5 max-w-xl animate-fade-in">
                  Zaposli.ba povezuje ljude kojima treba posao sa provjerenim majstorima i firmama
                  širom Bosne i Hercegovine.
                </p>
                <Link
                  href="/objavi-projekat/"
                  className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 shadow-lg shadow-brand-orange/30 animate-fade-in"
                >
                  Objavi posao besplatno
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 rotate-3 max-w-[150px] text-right font-serif italic text-white/90 text-xl leading-snug">
                  Bolja BiH počinje kod kuće.
                  <span className="block mt-1 h-0.5 w-16 bg-brand-orange rounded-full ml-auto" />
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* Zašto smo napravili */}
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
              <div>
                <p className="text-brand-orange text-xs sm:text-sm font-bold tracking-[0.18em] uppercase mb-2">
                  Zašto smo napravili Zaposli.ba
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
                  Pronaći dobrog majstora trebalo bi biti jednostavno.
                </h2>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                  Znamo koliko pronalazak pouzdanog majstora može biti težak. Zato smo napravili
                  Zaposli.ba – platformu koja taj proces čini jednostavnijim, transparentnijim i
                  sigurnijim.
                </p>
              </div>
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[280px] shadow-lg">
                <Image
                  src="/images/trazim-majstora-card.jpg"
                  alt="Renoviranje enterijera u toku"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                  <span className="block w-8 h-1 bg-brand-orange rounded-full mb-1.5" />
                  <p className="text-white font-bold text-base sm:text-lg leading-snug">
                    Od ideje
                    <br />
                    do gotovog projekta.
                  </p>
                </div>
              </div>
            </div>

            {/* Mini values */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 md:mt-8">
              {miniValues.map((v) => (
                <div
                  key={v.title}
                  className="bg-gray-50 rounded-2xl border border-gray-100 p-2.5 sm:p-5 text-center"
                >
                  <v.icon className="w-6 h-6 sm:w-8 sm:h-8 text-brand-orange mx-auto mb-1.5 sm:mb-2" />
                  <h3 className="text-[11px] sm:text-base font-bold text-gray-900 leading-tight mb-0.5 sm:mb-1">
                    {v.title}
                  </h3>
                  <p className="text-[10px] sm:text-sm text-gray-500 leading-snug">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Naša ideja */}
        <section className="pb-8 md:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[300px] shadow-lg order-1">
                <Image
                  src="/images/kontakt-hero.png"
                  alt="Pogled na grad u zalazak sunca"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                  <span className="block w-8 h-1 bg-brand-orange rounded-full mb-1.5" />
                  <p className="text-white font-bold text-base sm:text-lg leading-snug">
                    Za ljude koji
                    <br />
                    grade bolju budućnost.
                  </p>
                </div>
              </div>
              <div className="order-2">
                <p className="text-brand-orange text-xs sm:text-sm font-bold tracking-[0.18em] uppercase mb-2">
                  Naša ideja
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
                  Da dobar majstor bude lakše pronaći.
                </h2>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-3">
                  Zaposli.ba je nastao iz jednostavne potrebe: da povežemo ljude, olakšamo pronalazak
                  kvalitetnih majstora i firmi, i pomognemo da se projekti realizuju brže, sigurnije
                  i bez stresa.
                </p>
                <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                  Ne želimo biti samo još jedan oglasnik.
                  <br />
                  Želimo izgraditi mjesto kojem ljudi vjeruju.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tek smo počeli */}
        <section className="pb-8 md:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gray-50 rounded-3xl border border-gray-100 p-5 sm:p-8 md:p-10 overflow-hidden">
              <div className="max-w-2xl">
                <p className="text-brand-orange text-xs sm:text-sm font-bold tracking-[0.18em] uppercase mb-2">
                  Tek smo počeli
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  Korak po korak, zajedno.
                </h2>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                  Zaposli.ba razvijamo uz podršku korisnika, majstora i firmi koji nam svakodnevno
                  daju ideje i povratne informacije. Naš cilj nije izgledati veliko — naš cilj je
                  napraviti nešto vrijedno za ljude u Bosni i Hercegovini.
                </p>
              </div>
              <p className="md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 md:rotate-3 mt-4 md:mt-0 md:max-w-[150px] md:text-right font-serif italic text-gray-900 text-xl leading-snug">
                Isti ljudi. Veće mogućnosti.
                <span className="block mt-1 h-0.5 w-16 bg-brand-orange rounded-full md:ml-auto" />
              </p>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl min-h-[190px] sm:min-h-[220px] flex items-center">
              <Image
                src="/images/zafirme-hero.jpg"
                alt="Majstorski alat na gradilištu"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/20" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full p-5 sm:p-8">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1.5">
                    Tvoj projekat. <span className="text-brand-orange">Pravi majstori.</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    Objavi šta ti treba i dopusti pravim profesionalcima da ti se jave.
                  </p>
                </div>
                <Link
                  href="/objavi-projekat/"
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 shadow-lg shadow-brand-orange/25 shrink-0"
                >
                  Objavi posao besplatno
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <JsonLd data={organizationSchema()} />
    </div>
  );
}
