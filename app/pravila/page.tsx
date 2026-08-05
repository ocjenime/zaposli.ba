import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pravila. Zaposli.ba',
  description:
    'Pravila korištenja platforme Zaposli.ba: prava i obaveze korisnika i firmi, plaćanje, odgovornost platforme i mjerodavno pravo BiH.',
  alternates: { canonical: 'https://zaposli.ba/pravila/' },
};

const sections = [
  {
    title: '1. Opšte odredbe',
    paragraphs: [
      'Ovi Uslovi korištenja (u daljem tekstu: "Uslovi") uređuju odnos između platforme Zaposli.ba (u daljem tekstu: "Platforma") i svih korisnika koji pristupaju ili koriste Platformu, bilo kao klijenti koji objavljuju poslove, bilo kao firme i majstori koji šalju ponude. Korištenjem Platforme smatra se da ste pročitali, razumjeli i u cijelosti prihvatili ove Uslove.',
      'Platforma zadržava pravo da odbije registraciju ili ukloni korisnički račun koji krši ove Uslove, važeće propise Bosne i Hercegovine ili dobre poslovne običaje, uz prethodnu najavu kada je to moguće.',
    ],
  },
  {
    title: '2. Opis usluge',
    paragraphs: [
      'Zaposli.ba je onlajn tržište koje klijentima omogućava besplatnu objavu građevinskih i zanatskih poslova, a registrovanim firmama i majstorima omogućava slanje ponuda za te poslove. Platforma pruža alate za komunikaciju, upoređivanje ponuda, pregled profila firmi, ocjena i recenzija.',
      'Platforma nije izvođač radova, ne zapošljava firme niti majstore i nije strana u ugovoru koji klijent i firma eventualno zaključe. Uloga Platforme je isključivo posrednička: povezivanje ponude i potražnje.',
    ],
  },
  {
    title: '3. Obaveze korisnika (klijenata)',
    paragraphs: [
      'Klijent se obavezuje da prilikom objave posla navodi tačne i istinite podatke o obimu radova, lokaciji i budžetu, te da ne objavljuje poslove čija je svrha protuzakonita, obmanjujuća ili u suprotnosti sa ovim Uslovima. Objava posla je neobavezujuća: klijent nije dužan odabrati nijednu ponudu.',
      'Klijent snosi isključivu odgovornost za provjeru referenci, licence i stručnosti firme prije zaključenja ugovora o izvođenju radova, kao i za sadržaj sporazuma koji sa firmom sklopi. Preporučujemo da svi dogovori budu sačinjeni u pisanoj formi.',
    ],
  },
  {
    title: '4. Obaveze firmi',
    paragraphs: [
      'Firme i majstori obavezuju se da su podaci o registraciji, djelatnosti, referencama i portfoliju istiniti i ažurni. Firma mora posjedovati sve dozvole i registracije propisane zakonodavstvom Bosne i Hercegovine za djelatnost koju obavlja. Ponude moraju biti jasne, sa naznačenim obimom radova, cijenom i rokom izvođenja.',
      'Zabranjeno je kontaktirati klijente izvan Platforme u cilju zaobilaženja pravila Platforme, slati neistinite ili obmanjujuće ponude, te objavljivati tuđe fotografije radova. Kršenje ovih pravila može rezultirati trajnim uklanjanjem profila.',
    ],
  },
  {
    title: '5. Plaćanje i premium paketi',
    paragraphs: [
      'Korištenje Platforme je za klijente potpuno besplatno. Firmama je dostupan besplatni osnovni paket, dok premium paketi (istaknuti profil, neograničeni odgovori, prioritetan prikaz) podliježu plaćanju prema cjenovniku objavljenom na Platformi. Cijene su izražene u konvertibilnim markama (KM) i uključuju PDV, osim ako nije drugačije naznačeno.',
      'Premium pretplata se obnavlja automatski na mjesečnom nivou i može se otkazati u svakom trenutku, s dejstvom od kraja tekućeg obračunskog perioda. Iznosi plaćeni za započeti obračunski period ne refundiraju se, osim u slučajevima propisanim zakonom.',
    ],
  },
  {
    title: '6. Odgovornost platforme',
    paragraphs: [
      'Platforma djeluje isključivo kao posrednik između klijenata i firmi te ne odgovara za kvalitet, rokove, cijene ili izvođenje radova, niti za štetu nastalu iz ugovornog odnosa klijenta i firme. Verifikacija firmi na Platformi predstavlja provjeru dostavljenih dokumenata u trenutku registracije i ne predstavlja garanciju kvaliteta usluga.',
      'Platforma ne odgovara za privremenu nedostupnost usluge zbog tehničkih razloga, održavanja ili okolnosti na koje ne može uticati. U slučaju spora između klijenta i firme, tim Platforme može poželjno posredovati, ali nema ovlaštenje niti obavezu rješavanja spora.',
    ],
  },
  {
    title: '7. Intelektualna svojina',
    paragraphs: [
      'Svi sadržaji Platforme: uključujući logo, dizajn, tekstove, bazu podataka i programski kod: vlasništvo su Platforme ili su korišteni uz dozvolu i zaštićeni su propisima o intelektualnoj svojini. Zabranjeno je njihovo kopiranje, distribucija ili komercijalna upotreba bez pisane saglasnosti.',
      'Korisnici koji objavljuju fotografije, opise poslova i recenzije zadržavaju svoja prava, ali Platformi daju neisključivu, neograničenu dozvolu za prikazivanje tog sadržaja u svrhu pružanja usluge. Korisnik garantuje da posjeduje prava na sav sadržaj koji objavi.',
    ],
  },
  {
    title: '8. Raskid',
    paragraphs: [
      'Korisnik može u svakom trenutku zatvoriti svoj račun slanjem zahtjeva na info@zaposli.ba, čime prestaje njegovo pravo korištenja Platforme. Aktivni poslovi i komunikacija mogu ostati vidljivi učesnicima do njihovog završetka.',
      'Platforma može suspendovati ili trajno ukinuti račun koji krši ove Uslove, uz obavještenje korisniku. Odredbe o odgovornosti, intelektualnoj svojini i mjerodavnom pravu ostaju na snazi i nakon raskida.',
    ],
  },
  {
    title: '9. Izmjene uslova',
    paragraphs: [
      'Platforma zadržava pravo izmjene ovih Uslova. O svakoj bitnoj izmjeni korisnici će biti obaviješteni putem emaila ili istaknute najave na Platformi najmanje 15 dana prije stupanja izmjena na snagu.',
      'Nastavak korištenja Platforme nakon stupanja izmjena na snagu smatra se prihvatanjem izmijenjenih Uslova. Ako se korisnik ne slaže sa izmjenama, dužan je prestati koristiti Platformu i zatvoriti račun.',
    ],
  },
  {
    title: '10. Mjerodavno pravo',
    paragraphs: [
      'Na ove Uslove primjenjuje se pravo Bosne i Hercegovine. Za sve sporove koji proizidu iz korištenja Platforme nadležan je stvarno i mjesno nadležni sud u Sarajevu, Bosna i Hercegovina.',
      'Ako bilo koja odredba ovih Uslova bude proglašena nevažećom, ostale odredbe ostaju u punoj snazi. Pitanja u vezi sa Uslovima možete uputiti na info@zaposli.ba.',
    ],
  },
];

export default function PravilaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Pravila' }]} />
        <PageHero
          title="Pravila"
          subtitle="Pravila korištenja platforme Zaposli.ba za klijente i firme"
        />

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-steel mb-10 pb-6 border-b border-gray-100">
              Posljednja izmjena: juli 2026.
            </p>
            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-steel leading-relaxed mb-4 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
