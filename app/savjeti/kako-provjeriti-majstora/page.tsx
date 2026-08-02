import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Hash, ShieldCheck, FileCheck, Wallet, FileText, HelpCircle, FileCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { JsonLd, articleSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Kako provjeriti majstora prije avansa | Zaposli.ba',
  description:
    'Kontrolna lista prije nego date avans majstoru: registracija firme, recenzije, fotografije radova, ugovor i plaćanje po fazama.',
  alternates: {
    canonical: `${site.url}/savjeti/kako-provjeriti-majstora/`,
  },
};

const toc = [
  { id: 'registracija', label: 'Provjerite registraciju firme' },
  { id: 'recenzije', label: 'Čitajte recenzije, ali pravilno' },
  { id: 'reference', label: 'Zatražite fotografije ranijih radova' },
  { id: 'ugovor', label: 'Potpišite ugovor' },
  { id: 'avans', label: 'Avans: maksimalno 30%' },
  { id: 'faze', label: 'Plaćajte po fazama' },
  { id: 'faq', label: 'Često pitanja' },
];

const relatedArticles = [
  {
    slug: 'cijena-adaptacije-kupatila',
    title: 'Koliko košta adaptacija kupatila',
    category: 'Cijene',
  },
  {
    slug: 'cijena-fasade-po-m2',
    title: 'Cijena fasade po m² u BiH',
    category: 'Cijene',
  },
];

const faqs = [
  {
    q: 'Gdje provjeriti ID broj firme?',
    a: 'Javni registri u BiH nude besplatnu provjeru identifikacionih brojeva. Firma koja izbjegava dati ID broj je crvena zastava.',
  },
  {
    q: 'Koliko avansa je sigurno platiti?',
    a: 'Preporučujemo maksimalno 30% avansa, najčešće za nabavku materijala. Za veće iznose uvijek zatražite potvrdu o uplati ili fiskalni isječak.',
  },
  {
    q: 'Šta ako majstor nema fotografije radova?',
    a: 'Ozbiljan majstor uvijek ima primjere svojih radova. Ako odbija pokazati bilo kakvu referencu, preporučujemo da nastavite tražiti dalje.',
  },
];

export default function KakoProvjeritiMajstoraPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs
          items={[
            { name: 'Savjeti', href: '/savjeti/' },
            { name: 'Kako provjeriti majstora prije nego što mu date avans' },
          ]}
        />
        <JsonLd
          data={articleSchema({
            title: 'Kako provjeriti majstora prije nego što mu date avans',
            description:
              'Kontrolna lista prije nego date avans majstoru: registracija firme, recenzije, fotografije radova, ugovor i plaćanje po fazama.',
            slug: 'kako-provjeriti-majstora',
            datePublished: '2026-07-10',
          })}
        />
        <PageHero
          title="Kako provjeriti majstora prije nego što mu date avans"
          subtitle="Kontrolna lista koja vas štiti od neprijatnih iznenađenja"
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
                Objavljeno: 10. juli 2026.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                5 min čitanja
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
              Većina loših iskustava sa majstorima ne počinje lošim radom: počinje avansom
              predanog pogrešnoj osobi. Dobra vijest je da se uz pola sata provjere većina rizika
              može otkloniti. Evo kontrolne liste koju preporučujemo svakom klijentu prije uplate
              bilo kakvog avansa.
            </p>

            <h2 id="registracija" className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Provjerite registraciju firme</h2>
            <p className="text-steel leading-relaxed mb-6">
              Tražite ID broj firme i provjerite ga u javnom registru: svaka legalno registrovana
              firma u BiH mora imati jedinstveni identifikacioni broj. Rad „na crno" ne znači samo
              poreznu prevaru: znači i da nemate nikakav pravni osnov za reklamaciju ako nešto krene
              po zlu. Firma koja izbjegava dati ID broj je crvena zastava.
            </p>

            <h2 id="recenzije" className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Čitajte recenzije, ali pravilno</h2>
            <p className="text-steel leading-relaxed mb-6">
              Ne gledajte samo prosječnu ocjenu. Čitajte tekstove recenzija i obratite pažnju na
              konkretne detalje: da li klijenti spominju poštovanje rokova, čistoću na gradilištu,
              drže li se dogovorene cijene. Sumnjiv znak je niz petica bez ikakvog teksta ili sve
              recenzije objavljene u kratkom periodu. Na Zaposli.ba ocjene mogu ostaviti isključivo
              klijenti kojima je firma stvarno radila posao preko platforme.
            </p>

            <h2 id="reference" className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Zatražite fotografije ranijih radova</h2>
            <p className="text-steel leading-relaxed mb-6">
              Ozbiljan majstor ima telefon pun fotografija svojih poslova. Zatražite slike
              radova <strong className="text-gray-900">sličnih vašem</strong>: ako adaptirate kupatilo,
              nije dovoljno da vam pokaže fasadu. Još bolje: pitajte možete li kontaktirati jednog
              ili dva ranija klijenta. Majstor koji odbija bilo kakvu referencu vjerovatno ima razlog.
            </p>

            <h2 id="ugovor" className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Potpišite ugovor, makar i jednostavan</h2>
            <p className="text-steel leading-relaxed mb-6">
              Ugovor ne mora biti komplikovan, ali mora pisano definisati: obim radova, ukupnu
              cijenu ili cijenu po jedinici mjere, rok početka i završetka, dinamiku plaćanja i šta
              se dešava pri kašnjenju. Usaglašavanje „kako se dogovorimo" je najčešći uzrok sporova.
              Ako firma ima obrazac ugovora: odličan znak profesionalnosti.
            </p>

            <h2 id="avans" className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Avans: maksimalno 30%</h2>
            <p className="text-steel leading-relaxed mb-6">
              Uobičajena i razumna praksa je avans od 10 do 30% ukupne cijene, najčešće za nabavku
              materijala. <strong className="text-gray-900">Nikada ne plaćajte više od 30% unaprijed</strong>,
              a za avans uvijek tražite potvrdu o uplati ili fiskalni isječak. Majstor koji traži
              50% ili više prije početka radova preuzima vaš rizik na sebe: odnosno, na vas.
            </p>

            <h2 id="faze" className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Plaćajte po fazama, ne unaprijed</h2>
            <p className="text-steel leading-relaxed mb-6">
              Najsigurniji model je plaćanje po završenim fazama: npr. 30% avans, 40% po završenim
              instalacijama, 30% po završetku svih radova i primopredaji. Tako obje strane imaju
              interes da posao teče po planu, a vi zadržavate kontrolu do samog kraja. Zadnju ratu
              isplatite tek nakon što lično pregledate radove i zabilježite eventualne nedostatke.
            </p>

            <div className="bg-gradient-to-br from-cloud to-white rounded-2xl border border-gray-100 p-6 mt-10 flex gap-4 shadow-card">
              <ShieldCheck className="w-8 h-8 text-brand-orange shrink-0" />
              <p className="text-sm text-steel leading-relaxed">
                <strong className="text-gray-900">Savjet:</strong> firme sa oznakom „Provjerena firma" na
                Zaposli.ba prošle su provjeru registracije, identiteta i referenci, što ne znači da
                preskačete ugovor, ali znači da je prva stavka sa liste već odrađena za vas.
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
                <h2 className="text-2xl font-bold text-white mb-3">Trebate majstora?</h2>
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
