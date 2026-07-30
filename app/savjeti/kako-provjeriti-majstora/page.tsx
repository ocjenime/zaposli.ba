import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kako provjeriti majstora prije avansa | Zaposli.ba',
  description:
    'Kontrolna lista prije nego date avans majstoru: registracija firme, recenzije, fotografije radova, ugovor i plaćanje po fazama.',
  alternates: {
    canonical: 'https://ocjenime.github.io/zaposli.ba/savjeti/kako-provjeriti-majstora/',
  },
};

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
        <PageHero
          title="Kako provjeriti majstora prije nego što mu date avans"
          subtitle="Kontrolna lista koja vas štiti od neprijatnih iznenađenja"
        />

        <article className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-steel mb-10 pb-6 border-b border-gray-100">
              Tim Zaposli.ba · 10. juli 2026. · 5 min čitanja
            </p>

            <p className="text-steel leading-relaxed mb-4">
              Većina loših iskustava sa majstorima ne počinje lošim radom: počinje avansom
              predanom pogrešnoj osobi. Dobra vijest je da se uz pola sata provjere većina rizika
              može otkloniti. Evo kontrolne liste koju preporučujemo svakom kupcu prije uplate
              bilo kakvog avansa.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">1. Provjerite registraciju firme</h2>
            <p className="text-steel leading-relaxed mb-4">
              Tražite ID broj firme i provjerite ga u javnom registru: svaka legalno registrovana
              firma u BiH mora imati jedinstveni identifikacioni broj. Rad „na crno" ne znači samo
              poreznu prevaru: znači i da nemate nikakav pravni osnov za reklamaciju ako nešto krene
              po zlu. Firma koja izbjegava dati ID broj je crvena zastava.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">2. Čitajte recenzije, ali pravilno</h2>
            <p className="text-steel leading-relaxed mb-4">
              Ne gledajte samo prosječnu ocjenu. Čitajte tekstove recenzija i obratite pažnju na
              konkretne detalje: da li kupci spominju poštovanje rokova, čistoću na gradilištu,
              drže li se dogovorene cijene. Sumnjiv znak je niz petica bez ikakvog teksta ili sve
              recenzije objavljene u kratkom periodu. Na Zaposli.ba ocjene mogu ostaviti isključivo
              kupci kojima je firma stvarno radila posao preko platforme.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">3. Zatražite fotografije ranijih radova</h2>
            <p className="text-steel leading-relaxed mb-4">
              Ozbiljan majstor ima telefon pun fotografija svojih poslova. Zatražite slike
              radova <strong className="text-ink">sličnih vašem</strong>: ako adaptirate kupatilo,
              nije dovoljno da vam pokaže fasadu. Još bolje: pitajte možete li kontaktirati jednog
              ili dva ranija kupca. Majstor koji odbija bilo kakvu referencu vjerovatno ima razlog.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">4. Potpišite ugovor, makar i jednostavan</h2>
            <p className="text-steel leading-relaxed mb-4">
              Ugovor ne mora biti komplikovan, ali mora pisano definisati: obim radova, ukupnu
              cijenu ili cijenu po jedinici mjere, rok početka i završetka, dinamiku plaćanja i šta
              se dešava pri kašnjenju. Usaglašavanje „kako se dogovorimo" je najčešći uzrok sporova.
              Ako firma ima obrazac ugovora: odličan znak profesionalnosti.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">5. Avans: maksimalno 30%</h2>
            <p className="text-steel leading-relaxed mb-4">
              Uobičajena i razumna praksa je avans od 10 do 30% ukupne cijene, najčešće za nabavku
              materijala. <strong className="text-ink">Nikada ne plaćajte više od 30% unaprijed</strong>,
              a za avans uvijek tražite potvrdu o uplati ili fiskalni isječak. Majstor koji traži
              50% ili više prije početka radova preuzima vaš rizik na sebe: odnosno, na vas.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">6. Plaćajte po fazama, ne unaprijed</h2>
            <p className="text-steel leading-relaxed mb-4">
              Najsigurniji model je plaćanje po završenim fazama: npr. 30% avans, 40% po završenim
              instalacijama, 30% po završetku svih radova i primopredaji. Tako obje strane imaju
              interes da posao teče po planu, a vi zadržavate kontrolu do samog kraja. Zadnju ratu
              isplatite tek nakon što lično pregledate radove i zabilježite eventualne nedostatke.
            </p>

            <div className="bg-cloud rounded-2xl border border-gray-100 p-6 mt-10 flex gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-orange shrink-0" />
              <p className="text-sm text-steel leading-relaxed">
                <strong className="text-ink">Savjet:</strong> firme sa oznakom „Provjerena firma" na
                Zaposli.ba prošle su provjeru registracije, identiteta i referenci, što ne znači da
                preskačete ugovor, ali znači da je prva stavka sa liste već odrađena za vas.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-hero rounded-2xl p-8 mt-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
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
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
