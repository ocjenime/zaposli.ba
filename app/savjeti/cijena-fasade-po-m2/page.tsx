import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Hash, Shield, Wallet, FileCheck, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { JsonLd, articleSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Cijena fasade po m² u BiH: vodič za 2026. | Zaposli.ba',
  description:
    'Koliko košta fasada po m² u BiH 2026: stiropor vs kamena vuna, cijene po sistemu, šta ulazi u cijenu i greške koje poskupljuju radove.',
  alternates: {
    canonical: `${site.url}/savjeti/cijena-fasade-po-m2/`,
  },
};

const priceRows = [
  { system: 'Stiropor (EPS) 5 cm', range: '35-50 KM/m²' },
  { system: 'Stiropor (EPS) 10 cm', range: '40-55 KM/m²' },
  { system: 'Kamena vuna 10 cm', range: '55-80 KM/m²' },
  { system: 'Dekorativna fasada (bavalit, mozaik)', range: '+5-15 KM/m²' },
  { system: 'Samostojeća skele (ako nema)', range: '+5-10 KM/m²' },
];

const toc = [
  { id: 'sistem', label: 'Stiropor ili kamena vuna?' },
  { id: 'cijene', label: 'Cijene po sistemu' },
  { id: 'cijena-ulazi', label: 'Šta mora ući u cijenu' },
  { id: 'greske', label: 'Greške koje poskupljuju fasadu' },
  { id: 'faq', label: 'Često pitanja' },
];

const relatedArticles = [
  {
    slug: 'cijena-adaptacije-kupatila',
    title: 'Koliko košta adaptacija kupatila',
    category: 'Cijene',
  },
  {
    slug: 'kako-provjeriti-majstora',
    title: 'Kako provjeriti majstora prije avansa',
    category: 'Vodiči',
  },
];

const faqs = [
  {
    q: 'Koliko košta termo fasada u BiH 2026?',
    a: 'Kompletna termo fasada sa materijalom i radom košta između 35 i 80 KM po m², zavisno od izolacije (stiropor ili kamena vuna) i završnog sloja.',
  },
  {
    q: 'Šta je bolje: stiropor ili kamena vuna?',
    a: 'Stiropor je jeftiniji i pruža odličnu toplotnu izolaciju. Kamena vuna ne gori, propušta paru i bolje prigušuje buku, pa je idealna za višespratnice i vlažne zidove.',
  },
  {
    q: 'Koje vremenske uvjete treba izbjegavati?',
    a: 'Fasadu ne treba raditi po kiši, magli ili temperaturama ispod +5°C: ljepilo se neće pravilno osušiti, a završni sloj može pucati.',
  },
];

export default function CijenaFasadePoM2Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs
          items={[
            { name: 'Savjeti', href: '/savjeti/' },
            { name: 'Cijena fasade po m² u BiH: vodič za 2026.' },
          ]}
        />
        <JsonLd
          data={articleSchema({
            title: 'Cijena fasade po m² u BiH: vodič za 2026.',
            description:
              'Koliko košta fasada po m² u BiH 2026: stiropor vs kamena vuna, cijene po sistemu, šta ulazi u cijenu i greške koje poskupljuju radove.',
            slug: 'cijena-fasade-po-m2',
            datePublished: '2026-07-05',
          })}
        />
        <PageHero
          title="Cijena fasade po m² u BiH: vodič za 2026."
          subtitle="Stiropor ili kamena vuna, stvarne cijene po sistemu i najčešće greške"
        />

        <article className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-steel mb-6 pb-6 border-b border-gray-100">
              <span className="inline-flex items-center gap-1.5 bg-primary-50 px-3 py-1 rounded-full text-brand-orange font-semibold">
                <Shield className="w-3.5 h-3.5" />
                Cijene
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Objavljeno: 5. juli 2026.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                6 min čitanja
              </span>
              <span>Ažurirano: 30. juli 2026.</span>
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
              Termo fasada je jedna od najisplativijih investicija u kuću: smanjuje račune za
              grijanje i do 40% i štiti zidove od vlage. U 2026. godini kompletna demit fasada u BiH
              košta između <strong className="text-gray-900">35 i 80 KM po kvadratnom metru</strong>, sa
              materijalom i radom, zavisno od izabranog sistema. Evo detaljnog pregleda.
            </p>

            <h2 id="sistem" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Stiropor ili kamena vuna?</h2>
            <p className="text-steel leading-relaxed mb-4">
              <strong className="text-gray-900">Stiropor (EPS)</strong> je najčešći izbor: jeftiniji je,
              lakše se obrađuje i daje odličnu toplotnu izolaciju. Za većinu porodičnih kuća u BiH
              debljina od 10 cm je danas standard: ušteda u grijanju lako pokrije malu razliku u
              cijeni prema 5 cm.
            </p>
            <p className="text-steel leading-relaxed mb-6">
              <strong className="text-gray-900">Kamena vuna</strong> košta 40-60% više, ali ima dvije
              velike prednosti: ne gori (klasa A1 protupožarne zaštite) i propušta paru, pa je bolji
              izbor za višespratnice, stare vlažne zidove i objekte uz prometne saobraćajnice jer
              odlično prigušuje buku.
            </p>

            <h2 id="cijene" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijene po sistemu (materijal + rad)</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[280px]">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 font-semibold">Sistem fasade</th>
                      <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 font-semibold">Cijena (KM/m²)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceRows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cloud/50'}>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-gray-900">{row.system}</td>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">
                          {row.range}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-steel leading-relaxed mb-6">
              Za kuću sa 150 m² fasadne površine, stiropor 10 cm iznosi otprilike 6.000-8.200 KM,
              a kamena vuna 8.200-12.000 KM: uključujući materijal, rad i osnovnu završnicu.
            </p>

            <h2 id="cijena-ulazi" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Šta mora ući u cijenu</h2>
            <ul className="list-disc marker:text-brand-orange ml-5 mb-4 text-steel leading-relaxed space-y-2">
              <li>Priprema podloge (čišćenje, grundiranje)</li>
              <li>Lijepljenje ploča i tiplovi (klinovi za učvršćenje)</li>
              <li>Armatura: osnovni sloj ljepila + mrežica, uključujući ugaone letvice i kape</li>
              <li>Završni sloj (bavalit, silikonska ili akrilna malta) u boji po želji</li>
              <li>Obračun otvora: prozori i vrata se obično ne odbijaju u cijelosti od kvadrature</li>
            </ul>
            <p className="text-steel leading-relaxed mb-6">
              Ako ponuda ne navodi armaturu ili završni sloj kao posebne stavke, tražite pojašnjenje
              : to su najčešće „zaboravljene" stavke koje se kasnije dodaju na fakturu.
            </p>

            <h2 id="greske" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Greške koje poskupljuju fasadu</h2>
            <ul className="list-disc marker:text-brand-orange ml-5 mb-6 text-steel leading-relaxed space-y-2">
              <li>
                <strong className="text-gray-900">Preskakanje grunda</strong>: štedi 1-2 KM/m², a
                povećava rizik od odvajanja cijelog sistema.
              </li>
              <li>
                <strong className="text-gray-900">Premalo tiplova</strong>: propisano je 4-6 tiplova po
                m², a na uglovima i više; štednja tu znači ploče koje „puštaju" nakon par zima.
              </li>
              <li>
                <strong className="text-gray-900">Jeftina završna malta</strong>: akrilna malta je
                najjeftinija, ali na sunčanim južnim stranama brzo puca i skuplja prašinu;
                silikonska košta više, ali traje duplo duže.
              </li>
              <li>
                <strong className="text-gray-900">Rad po vlažnom ili prehladnom vremenu</strong>: radovi
                ispod +5°C ili po kiši zahtijevaju presvlačenje i dvostruko koštaju.
              </li>
              <li>
                <strong className="text-gray-900">Zaboravljena skela</strong>: ako firma nema vlastitu,
                iznajmljivanje dodaje 5-10 KM/m²; provjerite je li uključena u ponudu.
              </li>
            </ul>

            <p className="text-steel leading-relaxed mb-6">
              Zadnji savjet: fasadu uvijek ugovarajte s cjenikom <strong className="text-gray-900">po
              kvadratu sa jasno navedenim sistemom</strong>, a ne „za cijelu kuću": razlike u
              obračunu otvora i uglova znaju iznositi i do 15% ukupne cijene.
            </p>

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
                <h2 className="text-2xl font-bold text-white mb-3">Trebate majstora?</h2>
                <p className="text-white/60 mb-6">
                  Objavite posao besplatno i primite ponude od provjerenih fasadera iz vašeg
                  grada.
                </p>
                <Link href="/objavi-projekat/" className="btn-primary">
                  Objavi posao besplatno
                </Link>
              </div>
            </div>

            {/* Related articles */}
            <div className="border-t border-gray-100 pt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-orange" />
                Povezani savjeti
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/savjeti/${article.slug}/`}
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
