import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Hash, ShieldCheck, ClipboardList, Wallet, HelpCircle, FileCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { JsonLd, articleSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Posao u BiH: kako brzo naći majstora ili objaviti posao | Zaposli.ba',
  description:
    'Trebate posao u Sarajevu, Banjoj Luci, Mostaru, Tuzli ili drugom gradu u BiH? Vodič kroz besplatnu objavu posla, poređenje ponuda i izbor provjerenog majstora.',
  alternates: {
    canonical: `${site.url}/blog/posao-u-bih-kako-naci-majstora/`,
  },
};

const toc = [
  { id: 'gdje-traziti', label: 'Gdje tražiti posao i majstore u BiH' },
  { id: 'objava', label: 'Kako objaviti posao besplatno' },
  { id: 'ponude', label: 'Kako uporediti ponude' },
  { id: 'gradovi', label: 'Posao po gradovima: Sarajevo, Banja Luka, Mostar, Tuzla' },
  { id: 'firme', label: 'Kako firme i majstori dolaze do posla' },
  { id: 'faq', label: 'Često pitanja' },
];

const relatedArticles = [
  {
    slug: 'kako-napisati-oglas-za-posao',
    title: 'Kako napisati oglas za posao koji privlači majstore',
    category: 'Savjeti',
  },
  {
    slug: 'kako-provjeriti-majstora',
    title: 'Kako provjeriti majstora prije nego što mu date avans',
    category: 'Vodiči',
  },
];

const faqs = [
  {
    q: 'Da li je objava posla na Zaposli.ba besplatna?',
    a: 'Da, za klijente je sve besplatno: objava posla, primanje ponuda i kontakt sa firmama se ne plaćaju. Platformu finansiraju paketi za firme i majstore.',
  },
  {
    q: 'Koliko brzo stižu ponude za posao?',
    a: 'Većina poslova dobije prve ponude u roku od 24 sata od objave. Poslovi u većim gradovima poput Sarajeva, Banje Luke, Mostara i Tuzle često dobiju ponude u roku od nekoliko sati.',
  },
  {
    q: 'Mogu li objaviti posao u manjem gradu?',
    a: 'Da, platforma pokriva cijelu BiH. Objavite posao sa tačnom lokacijom i vidjeće ga firme i majstori iz vašeg grada i šire okolice.',
  },
];

export default function PosaoUBiHPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs
          items={[
            { name: 'Blog', href: '/blog/' },
            { name: 'Posao u BiH: kako brzo naći majstora ili objaviti posao' },
          ]}
        />
        <JsonLd
          data={articleSchema({
            title: 'Posao u BiH: kako brzo naći majstora ili objaviti posao',
            description:
              'Trebate posao u Sarajevu, Banjoj Luci, Mostaru, Tuzli ili drugom gradu u BiH? Vodič kroz besplatnu objavu posla, poređenje ponuda i izbor provjerenog majstora.',
            slug: 'posao-u-bih-kako-naci-majstora',
            datePublished: '2026-09-22',
            dateModified: '2026-09-22',
          })}
        />
        <PageHero
          title="Posao u BiH: kako brzo naći majstora ili objaviti posao"
          subtitle="Sve što trebate znati o traženju i objavi posla u Bosni i Hercegovini"
        />

        <article className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-steel mb-6 pb-6 border-b border-gray-100">
              <span className="inline-flex items-center gap-1.5 bg-primary-50 px-3 py-1 rounded-full text-brand-orange font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vodiči
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Objavljeno: 22. septembar 2026.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                5 min čitanja
              </span>
            </div>

            {/* Table of contents */}
            <div className="bg-cloud rounded-2xl border border-gray-100 p-6 mb-10">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4 text-brand-orange" />
                Sadržaj
              </h3>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-steel hover:text-brand-orange hover:underline transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-steel leading-relaxed mb-6">
              Bilo da vam treba <strong className="text-gray-900">posao u Sarajevu</strong>, majstor
              u Banjoj Luci ili keramičar u Mostaru, princip je isti: što preciznije opišete šta vam
              treba, to brže dobijate dobre ponude. Ovaj vodič objašnjava kako da za nekoliko minuta
              objavite posao i izaberete pravog izvođača bilo gdje u BiH.
            </p>

            <h2 id="gdje-traziti" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Gdje tražiti posao i majstore u BiH</h2>
            <p className="text-steel leading-relaxed mb-6">
              Za građevinske i majstorske usluge opšte oglasne table su prepune zastarjelih i
              neprovjerenih oglasa. Specijalizovana platforma poput Zaposli.ba rješava najveći
              problem: svaka firma prolazi verifikaciju, a ocjene mogu ostaviti samo klijenti kojima
              je firma stvarno radila posao. Umjesto da zovete deset brojeva sa oglasa, objavite
              jedan posao i pustite da se majstori jave vama.
            </p>

            <h2 id="objava" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako objaviti posao besplatno</h2>
            <p className="text-steel leading-relaxed mb-6">
              Objava traje oko 2 minute: izaberete kategoriju (npr. vodoinstalacije, elektroinstalacije,
              keramičarski radovi), opišete posao, dodate fotografije i navedete grad. Što je opis
              detaljniji - kvadratura, rok, budžet, dostupnost lokacije - to su ponude preciznije.
              Objava je neobavezujuća: ako vam nijedna ponuda ne odgovara, posao jednostavno zatvorite
              bez ikakvih troškova.
            </p>

            <h2 id="ponude" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako uporediti ponude</h2>
            <p className="text-steel leading-relaxed mb-6">
              Ne birajte samo najnižu cijenu. Uporedite ocjene i recenzije firme, broj završenih
              poslova, fotografije portfolija, detaljnost ponude i ponuđeni rok. Preporučujemo kontakt
              sa najmanje dvije do tri firme prije konačne odluke, a dogovor o cijeni, načinu plaćanja
              i rokovima sačuvajte pisanim tragom kroz poruke na platformi.
            </p>

            <h2 id="gradovi" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Posao po gradovima: Sarajevo, Banja Luka, Mostar, Tuzla</h2>
            <p className="text-steel leading-relaxed mb-6">
              Najviše poslova objavljuje se u <strong className="text-gray-900">Sarajevu</strong>,{' '}
              <strong className="text-gray-900">Banjoj Luci</strong>,{' '}
              <strong className="text-gray-900">Mostaru</strong>,{' '}
              <strong className="text-gray-900">Tuzli</strong> i{' '}
              <strong className="text-gray-900">Zenici</strong>, pa tamo ponude stižu najbrže, često
              u roku od nekoliko sati. Ali platforma pokriva cijelu BiH: posao u manjem gradu vide
              firme iz tog grada i šire okolice. Ako hitno trebate majstora, označite posao kao hitan
              i firme iz vašeg grada dobijaju prioritetnu notifikaciju.
            </p>

            <h2 id="firme" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako firme i majstori dolaze do posla</h2>
            <p className="text-steel leading-relaxed mb-6">
              Ako ste majstor ili firma, registrujte profil, dodajte grad i kategorije usluga i
              uključite obavještenja o novim poslovima. Svaki novi posao iz vaše struke i vašeg
              područja stiže vam direktno, a prva dobra ponuda često dobija posao. Verifikovan profil
              sa fotografijama radova i recenzijama dobija višestruko više prihvaćenih ponuda.
            </p>

            <div className="bg-gradient-to-br from-cloud to-white rounded-2xl border border-gray-100 p-6 mt-10 flex gap-4 shadow-card">
              <ClipboardList className="w-8 h-8 text-brand-orange shrink-0" />
              <p className="text-sm text-steel leading-relaxed">
                <strong className="text-gray-900">Savjet:</strong> posao objavljen radnim danom ujutro
                u prosjeku dobije prvu ponudu najbrže, jer su tada majstori najaktivniji na platformi.
              </p>
            </div>

            {/* FAQ */}
            <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Često pitanja</h2>
            <div className="space-y-3 mb-10">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                >
                  <summary className="flex items-center gap-3 cursor-pointer list-none px-5 py-4 hover:bg-cloud/60 transition-colors">
                    <HelpCircle className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                  </summary>
                  <div className="px-5 pb-5 pl-12 text-steel leading-relaxed text-sm">{faq.a}</div>
                </details>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-hero rounded-2xl p-8 text-center relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Wallet className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Trebate posao ili majstora?</h2>
                <p className="text-white/60 mb-6">
                  Objavite posao besplatno i birajte između ponuda provjerenih firmi sa stvarnim
                  recenzijama.
                </p>
                <Link href="/objavi-projekat/" className="btn-primary">
                  Objavi posao besplatno
                </Link>
              </div>
            </div>

            {/* Related articles */}
            <div className="border-t border-gray-100 pt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheckIcon className="w-5 h-5 text-brand-orange" />
                Povezani savjeti
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}/`}
                    className="group flex items-center gap-3 bg-cloud rounded-xl border border-gray-100 p-4 hover:border-brand-orange/30 hover:shadow-card transition-all"
                  >
                    <span className="text-xs font-semibold bg-primary-50 text-brand-orange px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-900 group-hover:text-brand-orange transition-colors">
                      {article.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-steel group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
