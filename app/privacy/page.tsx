import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politika privatnosti. Zaposli.ba',
  description:
    'Kako Zaposli.ba prikuplja, koristi i štiti vaše lične podatke: kolačići, dijeljenje s firmama, vaša prava i rokovi čuvanja podataka.',
  alternates: { canonical: 'https://ocjenime.github.io/zaposli.ba/privacy/' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Politika privatnosti' }]} />
        <PageHero
          title="Politika privatnosti"
          subtitle="Kako prikupljamo, koristimo i štitimo vaše podatke"
        />

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-steel mb-10 pb-6 border-b border-gray-100">
              Posljednja izmjena: juli 2026.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">1. Koji podaci se prikupljaju</h2>
            <p className="text-steel leading-relaxed mb-4">
              Prilikom korištenja platforme Zaposli.ba prikupljamo samo podatke koji su neophodni za
              pružanje usluge:
            </p>
            <ul className="list-disc marker:text-brand-orange ml-5 mb-4 text-steel leading-relaxed space-y-1">
              <li><strong className="text-ink">Kontakt podaci</strong>: ime i prezime, email adresa i broj telefona prilikom registracije ili objave posla.</li>
              <li><strong className="text-ink">Podaci o poslu</strong>: opis radova, lokacija (grad), budžet i rokovi koje sami unesete.</li>
              <li><strong className="text-ink">Fotografije</strong>: slike prostora ili radova koje dobrovoljno priložite uz posao ili profil.</li>
              <li><strong className="text-ink">Tehnički podaci</strong>. IP adresa, tip preglednika i podaci o korištenju stranice, u anonimiziranom obliku za statistiku.</li>
            </ul>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">2. Zašto prikupljamo podatke</h2>
            <p className="text-steel leading-relaxed mb-4">
              Podatke koristimo isključivo radi pružanja usluge Platforme: objave i pokretanja
              poslova, dostavljanja ponuda firmama, omogućavanja komunikacije između klijenata i
              firmi, prikazivanja profila i recenzija, te poboljšanja funkcionalnosti Platforme.
              Podatke ne koristimo za profilisanje niti ih prodajemo trećim stranama.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">3. Čije su fotografije</h2>
            <p className="text-steel leading-relaxed mb-4">
              Fotografije koje objavite ostaju vaše vlasništvo. Objavom fotografije Platformi dajete
              ograničenu dozvolu da je prikazuje isključivo u svrhu pružanja usluge: uz vaš
              posao ili profil. Fotografije ne koristimo u marketinške svrhe bez vaše izričite
              saglasnosti. Odgovorni ste da na fotografijama nema podataka ili osoba za čije
              objavljivanje nemate pravo.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">4. Kolačići (cookies)</h2>
            <p className="text-steel leading-relaxed mb-4">
              Platforma koristi tehničke kolačiće neophodne za rad stranice (prijava, sigurnost) i
              anonimne analitičke kolačiće koji nam pomažu razumjeti kako se stranica koristi.
              Analitički kolačići ne sadrže lične podatke. Kolačiće možete u svakom trenutku
              obrisati ili blokirati u postavkama svog preglednika, uz napomenu da bez tehničkih
              kolačića pojedine funkcije Platforme neće raditi ispravno.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">5. Dijeljenje podataka sa trećim stranama</h2>
            <p className="text-steel leading-relaxed mb-4">
              Vaši kontakt podaci (ime, telefon, email) <strong className="text-ink">nisu javno
              vidljivi</strong> na Platformi. Firma vidi vaše kontakt podatke tek nakon što vi to
              odobrite: prihvatanjem ponude ili direktnom porukom firmi. Opis posla, grad i
              priložene fotografije vidljivi su registrovanim firmama radi pripreme ponude.
            </p>
            <p className="text-steel leading-relaxed mb-4">
              Podatke ne prodajemo niti iznajmljujemo trećim stranama. Pristup podacima imaju samo
              tehnički partneri neophodni za rad Platforme (hosting, email dostava), uz ugovorenu
              obavezu povjerljivosti, te nadležni organi kada to zahtijeva zakon.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">6. Vaša prava</h2>
            <p className="text-steel leading-relaxed mb-4">
              U skladu sa Zakonom o zaštiti ličnih podataka BiH i principima GDPR-a, imate pravo na:
            </p>
            <ul className="list-disc marker:text-brand-orange ml-5 mb-4 text-steel leading-relaxed space-y-1">
              <li><strong className="text-ink">Pristup</strong>: zatražiti uvid u sve podatke koje čuvamo o vama.</li>
              <li><strong className="text-ink">Ispravku</strong>: zatražiti ispravku netačnih ili nepotpunih podataka.</li>
              <li><strong className="text-ink">Brisanje</strong>: zatražiti brisanje računa i povezanih ličnih podataka.</li>
              <li><strong className="text-ink">Prigovor</strong>: prigovoriti obradi podataka u određene svrhe.</li>
            </ul>
            <p className="text-steel leading-relaxed mb-4">
              Za ostvarivanje bilo kojeg od ovih prava kontaktirajte nas na{' '}
              <a href="mailto:info@zaposli.ba" className="text-brand-orange hover:underline">
                info@zaposli.ba
              </a>
              . Na zahtjev odgovaramo u roku od 30 dana.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">7. Rok čuvanja podataka</h2>
            <p className="text-steel leading-relaxed mb-4">
              Lične podatke čuvamo dok je vaš račun aktivan ili dok je to potrebno za pružanje
              usluge. Nakon brisanja računa, lični podaci se brišu ili anonimiziraju u roku od 90
              dana, osim podataka koje smo zakonom dužni čuvati duže (npr. fiskalna dokumentacija o
              plaćenim pretplatama, koju čuvamo u skladu sa računovodstvenim propisima BiH).
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">8. Sigurnost podataka</h2>
            <p className="text-steel leading-relaxed mb-4">
              Podatke čuvamo na sigurnim serverima uz primjenu savremenih tehničkih i
              organizacijskih mjera zaštite: enkripciju prometa (HTTPS), ograničen pristup podacima
              samo ovlaštenim osobama i redovne sigurnosne provjere. Iako primjenjujemo najbolje
              prakse, nijedan sistem ne može garantovati apsolutnu sigurnost: o eventualnom
              sigurnosnom incidentu koji ugrožava vaše podatke bit ćete obaviješteni bez odlaganja.
            </p>

            <h2 className="text-2xl font-bold text-ink mt-10 mb-4">9. Kontakt</h2>
            <p className="text-steel leading-relaxed">
              Za sva pitanja o privatnosti i zaštiti podataka pišite nam na{' '}
              <a href="mailto:info@zaposli.ba" className="text-brand-orange hover:underline">
                info@zaposli.ba
              </a>{' '}
              ili putem stranice{' '}
              <Link href="/kontakt/" className="text-brand-orange hover:underline">
                Kontakt
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
