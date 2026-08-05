export { categories, getCategory } from './categories';
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

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Koliko košta korištenje Zaposli.ba za klijente?',
    answer: 'Za klijente je korištenje platforme potpuno besplatno: objava posla, primanje ponuda i kontakt sa firmama ne plaćaju se. Platformu financiraju premium paketi za firme.',
  },
  {
    question: 'Kako funkcioniše verifikacija firmi?',
    answer: 'Svaka firma prolazi provjeru identiteta vlasnika, registracije firme (ID broj) i reference prije nego što profil postane javan. Firme koje prođu provjeru dobijaju oznaku "Provjerena firma" na profilu.',
  },
  {
    question: 'Koliko brzo ću dobiti ponude?',
    answer: 'Većina poslova dobije prve ponude u roku od 24 sata od objave. Poslovi u većim gradovima i hitni poslovi često dobiju ponude u roku od nekoliko sati.',
  },
  {
    question: 'Jesam li obavezan odabrati neku ponudu?',
    answer: 'Ne. Objava posla je neobavezujuća: ako vam nijedna ponuda ne odgovara, posao jednostavno zatvarate bez ikakvih troškova.',
  },
  {
    question: 'Šta ako nisam zadovoljan izvedenim radovima?',
    answer: 'Preporučujemo da prije početka radova s firmom dogovorite sve detalje pisanim putem kroz platformu. U slučaju spora, naš tim pomaže u posredovanju, a vaša recenzija štiti druge klijente.',
  },
  {
    question: 'Kako firma dobija oznaku dobre reputacije?',
    answer: 'Ocjena se računa isključivo od recenzija stvarnih klijenata kojima je firma radila posao preko platforme. Ocjene se ne mogu kupiti niti ukloniti na zahtjev firme.',
  },
  {
    question: 'Mogu li objaviti hitan posao?',
    answer: 'Da. Prilikom objave označite da je posao hitan i firme u vašem gradu dobijaju prioritetnu notifikaciju. Hitni poslovi u prosjeku dobiju prvu ponudu u roku od nekoliko sati.',
  },
  {
    question: 'Kako se registrujem kao firma i koliko to košta?',
    answer: 'Registracija firme je besplatna i traje 5 minuta. Besplatni paket uključuje profil i do 5 odgovora mjesečno. Premium paketi (od 49 KM/mjesečno) nude neograničene odgovore, istaknuti profil i prioritetan prikaz.',
  },
];
