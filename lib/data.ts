export { categories, getCategory, getCategoryShortName } from './categories';
export type { Category } from './categories';

/* ---------------------------------- GRADOVI ---------------------------------- */

export interface City {
  name: string;
  slug: string;
  loc: string; // lokativ: "u gradu ..."
}

export const cities: City[] = [
  // Federacija BiH
  { name: 'Sarajevo', slug: 'sarajevo', loc: 'Sarajevu' },
  { name: 'Tuzla', slug: 'tuzla', loc: 'Tuzli' },
  { name: 'Kalesije', slug: 'kalesije', loc: 'Kalesijama' },
  { name: 'Kladanj', slug: 'kladan', loc: 'Kladnju' },
  { name: 'Zenica', slug: 'zenica', loc: 'Zenici' },
  { name: 'Mostar', slug: 'mostar', loc: 'Mostaru' },
  { name: 'Bihać', slug: 'bihac', loc: 'Bihaću' },
  { name: 'Cazin', slug: 'cazin', loc: 'Cazinu' },
  { name: 'Velika Kladuša', slug: 'velika-kladusa', loc: 'Velikoj Kladuši' },
  { name: 'Sanski Most', slug: 'sanski-most', loc: 'Sanskom Mostu' },
  { name: 'Bužim', slug: 'buzim', loc: 'Bužimu' },
  { name: 'Ključ', slug: 'kljuc', loc: 'Ključu' },
  { name: 'Bos. Petrovac', slug: 'bosanski-petrovac', loc: 'Bosanskom Petrovacu' },
  { name: 'Bos. Krupa', slug: 'bosanska-krupa', loc: 'Bosanskoj Krupi' },
  { name: 'Bos. Novi', slug: 'bosanski-novi', loc: 'Bosanskom Novom' },
  { name: 'Drvar', slug: 'drvar', loc: 'Drvaru' },
  { name: 'Travnik', slug: 'travnik', loc: 'Travniku' },
  { name: 'Jajce', slug: 'jajce', loc: 'Jajcu' },
  { name: 'Bugojno', slug: 'bugojno', loc: 'Bugojnu' },
  { name: 'Tešanj', slug: 'tesanj', loc: 'Tešnju' },
  { name: 'Kakanj', slug: 'kakanj', loc: 'Kaknju' },
  { name: 'Visoko', slug: 'visoko', loc: 'Visokom' },
  { name: 'Goražde', slug: 'gorazde', loc: 'Goraždu' },
  { name: 'Gračanica', slug: 'gracanica', loc: 'Gračanici' },
  { name: 'Živinice', slug: 'zivinice', loc: 'Živinicama' },
  { name: 'Lukavac', slug: 'lukavac', loc: 'Lukavcu' },
  { name: 'Konjic', slug: 'konjic', loc: 'Konjicu' },
  { name: 'Jablanica', slug: 'jablanica', loc: 'Jablanici' },
  { name: 'Livno', slug: 'livno', loc: 'Livnu' },
  { name: 'Tomislavgrad', slug: 'tomislavgrad', loc: 'Tomislavgradu' },
  { name: 'Široki Brijeg', slug: 'siroki-brijeg', loc: 'Širokom Brijegu' },
  { name: 'Ljubuški', slug: 'ljubuski', loc: 'Ljubuškom' },
  { name: 'Čapljina', slug: 'capljina', loc: 'Čapljini' },
  { name: 'Neum', slug: 'neum', loc: 'Neumu' },
  // Republika Srpska
  { name: 'Banja Luka', slug: 'banja-luka', loc: 'Banjoj Luci' },
  { name: 'Bijeljina', slug: 'bijeljina', loc: 'Bijeljini' },
  { name: 'Prijedor', slug: 'prijedor', loc: 'Prijedoru' },
  { name: 'Doboj', slug: 'doboj', loc: 'Doboju' },
  { name: 'Derventa', slug: 'derventa', loc: 'Derventi' },
  { name: 'Gradiška', slug: 'gradiska', loc: 'Gradišci' },
  { name: 'Zvornik', slug: 'zvornik', loc: 'Zvorniku' },
  { name: 'Srebrenica', slug: 'srebrenica', loc: 'Srebrenici' },
  { name: 'Istočno Sarajevo', slug: 'istocno-sarajevo', loc: 'Istočnom Sarajevu' },
  { name: 'Trebinje', slug: 'trebinje', loc: 'Trebinju' },
  { name: 'Foča', slug: 'foca', loc: 'Foči' },
  // Brčko distrikt
  { name: 'Brčko', slug: 'brcko', loc: 'Brčkom' },
];

/* ---------------------------------- FAQ ---------------------------------- */

export type FaqCategory = 'client' | 'firm' | 'general';

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

export const faqs: FaqItem[] = [
  /* ------------------------------ ZA KLIJENTE ------------------------------ */
  {
    question: 'Koliko košta korištenje Zaposli.ba za klijente?',
    answer: 'Za klijente je korištenje platforme potpuno besplatno: objava posla, primanje ponuda i kontakt sa firmama ne plaćaju se. Platformu financiraju premium paketi za firme.',
    category: 'client',
  },
  {
    question: 'Kako objaviti posao na Zaposli.ba?',
    answer: 'Kliknite "Objavi posao besplatno", odaberite kategoriju radova, opišite šta vam treba, dodajte fotografije i navedite grad. U samo 2 minute vaš posao postaje vidljiv provjerenim firmama i majstorima u vašem području.',
    category: 'client',
  },
  {
    question: 'Koliko brzo ću dobiti ponude?',
    answer: 'Većina poslova dobije prve ponude u roku od 24 sata od objave. Poslovi u većim gradovima i hitni poslovi često dobiju ponude u roku od nekoliko sati.',
    category: 'client',
  },
  {
    question: 'Jesam li obavezan odabrati neku ponudu?',
    answer: 'Ne. Objava posla je neobavezujuća: ako vam nijedna ponuda ne odgovara, posao jednostavno zatvarate bez ikakvih troškova.',
    category: 'client',
  },
  {
    question: 'Kako odabrati najbolju ponudu?',
    answer: 'Pored cijene, obratite pažnju na ocjene i recenzije firme, broj završenih poslova, fotografije portfolija, detaljnost ponude i rok izvršenja. Preporučujemo kontakt s najmanje 2-3 firme prije konačne odluke.',
    category: 'client',
  },
  {
    question: 'Šta treba uključiti u opis posla?',
    answer: 'Navedite vrstu posla, kvadraturu, željeni rok, budžet ako ga imate, dostupnost lokacije, specifične materijale i dodajte jasne fotografije. Što je opširniji opis, to su ponude preciznije.',
    category: 'client',
  },
  {
    question: 'Mogu li objaviti hitan posao?',
    answer: 'Da. Prilikom objave označite da je posao hitan i firme u vašem gradu dobijaju prioritetnu notifikaciju. Hitni poslovi u prosjeku dobiju prvu ponudu u roku od nekoliko sati.',
    category: 'client',
  },
  {
    question: 'Kako funkcioniše plaćanje firmi?',
    answer: 'Plaćanje se dogovara direktno između vas i firme. Preporučujemo da se dogovorite o cijeni, načinu plaćanja i rokovima prije početka radova i da sve zadržite pisanim tragom putem platforme.',
    category: 'client',
  },
  {
    question: 'Da li trebam platiti avans firmi?',
    answer: 'To zavisi od vrste posla. Za manje poslove obično se plaća po završetku, a za veće može se dogovoriti avans za materijal. Preporučujemo da avans ne prelazi 30% i da uvijek zatražite račun.',
    category: 'client',
  },
  {
    question: 'Šta ako nisam zadovoljan izvedenim radovima?',
    answer: 'Preporučujemo da prije početka radova s firmom dogovorite sve detalje pisanim putem kroz platformu. U slučaju spora, naš tim pomaže u posredovanju, a vaša recenzija štiti druge klijente.',
    category: 'client',
  },
  {
    question: 'Kako ostaviti recenziju firmi?',
    answer: 'Nakon završetka posla, u svom dashboardu otvorite posao i kliknite "Ostavi recenziju". Ocjenjujete kvalitetu, rokove, komunikaciju i čistoću. Recenzije su javne i pomažu drugim klijentima.',
    category: 'client',
  },
  {
    question: 'Da li su firme osigurane?',
    answer: 'Prilikom verifikacije provjeravamo osnovne podatke o firmi, a premium firme dodatno potvrđuju osiguranje. Uvijek možete zatražiti od firme dokaz o važećem osiguranju prije početka radova.',
    category: 'client',
  },
  {
    question: 'Mogu li zatražiti ponudu bez objave posla?',
    answer: 'Da, putem stranice "Zatraži ponudu" možete direktno kontaktirati odabranu firmu ili majstora i zatražiti ponudu za svoj posao.',
    category: 'client',
  },

  /* ------------------------------ ZA FIRME I MAJSTORE ------------------------------ */
  {
    question: 'Kako se registrujem kao firma ili majstor?',
    answer: 'Kliknite "Registruj firmu besplatno", popunite osnovne podatke, dodajte logo, opis usluga i gradove u kojima radite. Nakon verifikacije profil postaje vidljiv klijentima.',
    category: 'firm',
  },
  {
    question: 'Koliko košta registracija i korištenje platforme za firme?',
    answer: 'Registracija je besplatna. Besplatni paket uključuje profil i ograničen broj odgovora mjesečno. Premium paketi počinju od 49 KM/mjesečno i nude neograničene odgovore, istaknuti profil i prioritetan prikaz.',
    category: 'firm',
  },
  {
    question: 'Kako funkcioniše verifikacija firmi?',
    answer: 'Svaka firma prolazi provjeru identiteta vlasnika, registracije firme (ID broj) i reference prije nego što profil postane javan. Firme koje prođu provjeru dobijaju oznaku "Provjerena firma" na profilu.',
    category: 'firm',
  },
  {
    question: 'Kako firma dobija oznaku dobre reputacije?',
    answer: 'Ocjena se računa isključivo od recenzija stvarnih klijenata kojima je firma radila posao preko platforme. Ocjene se ne mogu kupiti niti ukloniti na zahtjev firme.',
    category: 'firm',
  },
  {
    question: 'Kako dobiti više poslova?',
    answer: 'Odgovarajte brzo i detaljno, održavajte potpun profil s portfoliom, zatražite recenzije nakon svakog posla i razmislite o premium paketu koji vam daje veću vidljivost.',
    category: 'firm',
  },
  {
    question: 'Kako odgovoriti na posao?',
    answer: 'U dashboardu firme pregledajte dostupne poslove u vašem gradu i kategoriji. Kliknite "Pošalji ponudu", unesite cijenu, rok i kratku poruku. Klijent će dobiti obavještenje i može vas kontaktirati.',
    category: 'firm',
  },
  {
    question: 'Da li se plaća za svaku ponudu koju pošaljem?',
    answer: 'Ne. U besplatnom paketu imate ograničen broj ponuda mjesečno, a u premium paketima možete slati neograničen broj ponuda bez dodatne naknade po ponudi.',
    category: 'firm',
  },
  {
    question: 'Kako izgleda dobra ponuda?',
    answer: 'Dobra ponuda sadrži jasan opis obima rada, cijenu ili procjenu, rok izvršenja, informacije o materijalu, reference i pitanja za preciznije razumijevanje posla.',
    category: 'firm',
  },
  {
    question: 'Mogu li kao fizičko lice registrovati profil majstora?',
    answer: 'Da. Na Zaposli.ba možete registrovati se kao samostalni majstor bez obaveze osnivanja firme. Profil majstora funkcioniše isto kao i profil firme.',
    category: 'firm',
  },
  {
    question: 'Kako se računa rangiranje firmi?',
    answer: 'Rangiranje zavisi od prosječne ocjene, broja recenzija, brzine odgovora, potpunosti profila i statusa verifikacije/premium člana. Viša ocjena znači bolju poziciju na listi.',
    category: 'firm',
  },
  {
    question: 'Šta raditi ako klijent ne odgovori na ponudu?',
    answer: 'Klijenti ponekad trebaju vremena da uporede ponude. Ako nakon nekoliko dana ne dobijete odgovor, možete poslati jedan ljubazan podsjetnik putem platforme.',
    category: 'firm',
  },
  {
    question: 'Kako ažurirati portfolijo?',
    answer: 'U dashboardu firme idite na "Profesionalni profil" i dodajte fotografije završenih radova, opise projekata i reference. Profili s portfoliom dobijaju značajno više upita.',
    category: 'firm',
  },

  /* ------------------------------ OPĆA PITANJA ------------------------------ */
  {
    question: 'Koje gradove pokriva Zaposli.ba?',
    answer: 'Zaposli.ba pokriva sve veće gradove u Bosni i Hercegovini, uključujući Sarajevo, Banja Luku, Tuzlu, Mostar, Zenicu, Bijeljinu, Prijedor, Doboj, Brčko i mnoge druge.',
    category: 'general',
  },
  {
    question: 'Koje kategorije poslova su dostupne?',
    answer: 'Platforma pokriva više od 50 kategorija: građevinarstvo, električarski radovi, vodoinstalaterski radovi, molerski radovi, keramika, adaptacija kupatila i kuhinje, krovni radovi, stolarija, čišćenje, baštovanstvo i mnoge druge.',
    category: 'general',
  },
  {
    question: 'Kako Zaposli.ba štiti moje podatke?',
    answer: 'Vaši kontakt podaci dijele se samo s firmama koje ste vi odabrali. Ne prodajemo osobne podatke trećim stranama i koristimo industrijske standarde zaštite podataka.',
    category: 'general',
  },
  {
    question: 'Da li Zaposli.ba učestvuje u dogovoru između klijenta i firme?',
    answer: 'Zaposli.ba je platforma koja povezuje klijente i firme. Sam ugovor, plaćanje i izvršenje posla događaju se direktno između klijenta i firme, osim u slučaju reklamacije kada naš tim pomaže u posredovanju.',
    category: 'general',
  },
];
