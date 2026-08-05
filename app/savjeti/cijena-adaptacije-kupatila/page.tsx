import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Hash, Bath, Wallet, FileCheck, HelpCircle, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { JsonLd, articleSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Koliko košta adaptacija kupatila u 2026? | Zaposli.ba',
  description:
    'Cijena adaptacije kupatila u BiH 2026: demontaža, instalacije, keramika i sanitarije: realni rasponi u KM i savjeti za upoređivanje ponuda.',
  alternates: {
    canonical: 'https://zaposli.ba/savjeti/cijena-adaptacije-kupatila/',
  },
};

const priceRows = [
  { phase: 'Demontaža i odvoz šuta', range: '200-500 KM' },
  { phase: 'Vodovodne instalacije', range: '600-1.200 KM' },
  { phase: 'Elektroinstalacije', range: '200-500 KM' },
  { phase: 'Priprema zidova (malter, estrih)', range: '300-700 KM' },
  { phase: 'Keramika (rad, bez pločica)', range: '700-1.500 KM' },
  { phase: 'Sanitarije i montaža', range: '400-1.500 KM' },
  { phase: 'Završni radovi (silikoni, sitnice)', range: '100-300 KM' },
];

const toc = [
  { id: 'faze', label: 'Cijene po fazama radova' },
  { id: 'uticaj', label: 'Šta najviše utiče na cijenu' },
  { id: 'materijal', label: 'Materijal: koliko još treba dodati' },
  { id: 'ponude', label: 'Kako uporediti ponude' },
  { id: 'faq', label: 'Često pitanja' },
];

const relatedArticles = [
  {
    slug: 'kako-provjeriti-majstora',
    title: 'Kako provjeriti majstora prije avansa',
    category: 'Vodiči',
  },
  {
    slug: 'cijena-fasade-po-m2',
    title: 'Cijena fasade po m² u BiH',
    category: 'Cijene',
  },
];

const faqs = [
  {
    q: 'Koliko košta adaptacija kupatila u BiH 2026?',
    a: 'Za kupatilo od 3-5 m², kompletna adaptacija ključ u ruke košta između 2.500 i 6.000 KM, zavisno od obima radova i materijala.',
  },
  {
    q: 'Da li cijena uključuje pločice i sanitarije?',
    a: 'Cjenici u ovom vodiču pokrivaju rad. Materijal (pločice, sanitarije, ljepilo, hidroizolacija) se dodatno planira i obično čini 40-60% budžeta.',
  },
  {
    q: 'Koliko je sigurno platiti avans?',
    a: 'Preporučujemo avans do 30% ukupne cijene, najčešće za nabavku materijala. Uvijek zatražite potvrdu o uplati.',
  },
];

export default function CijenaAdaptacijeKupatilaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs
          items={[
            { name: 'Savjeti', href: '/savjeti/' },
            { name: 'Koliko košta adaptacija kupatila u 2026?' },
          ]}
        />
        <JsonLd
          data={articleSchema({
            title: 'Koliko košta adaptacija kupatila u 2026?',
            description:
              'Cijena adaptacije kupatila u BiH 2026: demontaža, instalacije, keramika i sanitarije: realni rasponi u KM i savjeti za upoređivanje ponuda.',
            slug: 'cijena-adaptacije-kupatila',
            datePublished: '2026-07-15',
            dateModified: '2026-07-30',
          })}
        />
        <PageHero
          title="Koliko košta adaptacija kupatila u 2026?"
          subtitle="Realne cijene po fazama radova i savjeti kako uporediti ponude"
        />

        <article className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-steel mb-6 pb-6 border-b border-gray-100">
              <span className="inline-flex items-center gap-1.5 bg-primary-50 px-3 py-1 rounded-full text-brand-orange font-semibold">
                <Bath className="w-3.5 h-3.5" />
                Cijene
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Objavljeno: 15. juli 2026.
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
              Adaptacija kupatila je jedan od najčešćih, a ujedno i najneizvjesnijih poslova kada su
              cijene u pitanju. Za standardno kupatilo od 3 do 5 m², kompletna adaptacija
              „ključ u ruke" u BiH u 2026. godini košta između <strong className="text-gray-900">2.500 i
              6.000 KM</strong>, zavisno od obima radova i izbora materijala. Evo kako se ta cijena
              raspoređuje po fazama.
            </p>

            <h2 id="faze" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijene po fazama radova</h2>
            <p className="text-steel leading-relaxed mb-4">
              Tabela prikazuje tipične raspona cijena za rad (bez materijala poput pločica i
              sanitarija, osim gdje je naznačeno) za kupatilo prosječne veličine:
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[280px]">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 font-semibold">Faza radova</th>
                      <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 font-semibold">Cijena (KM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceRows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cloud/50'}>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-gray-900">{row.phase}</td>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">
                          {row.range}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h2 id="uticaj" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Šta najviše utiče na cijenu</h2>
            <ul className="list-disc marker:text-brand-orange ml-5 mb-6 text-steel leading-relaxed space-y-2">
              <li>
                <strong className="text-gray-900">Stanje postojećih instalacija</strong>: u starijim
                zgradama često treba mijenjati kompletne cijevi do glavnog vertikala, što može
                dodati 500-1.000 KM.
              </li>
              <li>
                <strong className="text-gray-900">Veličina i format pločica</strong>: velikoformatne
                pločice (120×60 i veće) zahtijevaju iskusnijeg keramičara i skuplje lijepljenje,
                obično 30-50% više od standardnih formata.
              </li>
              <li>
                <strong className="text-gray-900">Premještanje sanitarija</strong>: svako pomjeranje WC
                školjke ili tuša znači nove instalacije i probijanje, a ne samo zamjenu.
              </li>
              <li>
                <strong className="text-gray-900">Podno grijanje</strong>: električno podno grijanje
                dodaje otprilike 60-100 KM/m², vodeno i više.
              </li>
              <li>
                <strong className="text-gray-900">Grad</strong>: cijene u Sarajevu su u prosjeku 10-20%
                više nego u manjim gradovima.
              </li>
            </ul>

            <h2 id="materijal" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Materijal: koliko još treba dodati</h2>
            <p className="text-steel leading-relaxed mb-6">
              Na cijene radova iz tabele dodajte materijal. Pločice srednje klase koštaju 25-60
              KM/m², sanitarije (WC, umivaonik, tuš kabina) od 800 KM za osnovni set do 3.000+ KM
              za višu klasu. Lijepilo, fugna, hidroizolacija i sitan materijal obično iznose još
              200-400 KM. Kao pravilo: <strong className="text-gray-900">materijal čini 40-60% ukupnog
              budžeta</strong>.
            </p>

            <h2 id="ponude" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako uporediti ponude</h2>
            <ul className="list-disc marker:text-brand-orange ml-5 mb-6 text-steel leading-relaxed space-y-2">
              <li>Tražite ponudu <strong className="text-gray-900">po fazama</strong>, ne samo ukupan zbroj: tako se vidi gdje su razlike.</li>
              <li>Provjerite da li je u cijenu uključen odvoz šuta i završno čišćenje.</li>
              <li>Pazite na preniske ponude: cijena ispod 2.000 KM za kompletnu adaptaciju obično znači preskočenu hidroizolaciju ili naknadne „nepredviđene" stavke.</li>
              <li>Dogovorite pisano šta se dešava ako se otkriju skriveni problemi (trule cijevi, vlažni zidovi).</li>
            </ul>
            <p className="text-steel leading-relaxed mb-6">
              Najpouzdaniji način da saznate stvarnu cijenu za vaše kupatilo je da prikupite tri
              konkretne ponude od provjerenih izvođača koji su vidjeli prostor ili detaljne
              fotografije.
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
                  Objavite posao besplatno i primite ponude od provjerenih firmi: obično u roku
                  od 24 sata.
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
