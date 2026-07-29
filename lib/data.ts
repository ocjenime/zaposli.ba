import {
  BrickWall, Droplets, Zap, Paintbrush, Home, Hammer, TreePine,
  Shovel, Thermometer, Shield, Sparkles, Siren, Layers, KeySquare,
  Wifi, Armchair, Truck, Car, HelpCircle, type LucideIcon,
} from 'lucide-react';

/* ---------------------------------- KATEGORIJE ---------------------------------- */

export interface Category {
  name: string;
  slug: string;
  seoSlug: string;        // za /usluge/[seoSlug]-[grad]
  profession: string;     // "Vodoinstalater"
  icon: LucideIcon;
  description: string;
  count: number;
  priceRange: string;
  priceNote: string;
  group: string;          // grupa za prikaz na /kategorije/
  services: string[];     // pod-usluge
  featured?: boolean;     // hitne intervencije — izdvojeni stil
  noSeo?: boolean;        // bez programatskih stranica (npr. Ostale usluge)
}

export const categories: Category[] = [
  // HITNO 24/7 — izdvojena kategorija
  {
    name: 'Hitne intervencije', slug: 'hitne-intervencije', seoSlug: 'hitne-intervencije',
    profession: 'Hitne intervencije 24/7', icon: Siren,
    description: 'Vodoinstalater, električar i bravar 24/7 — dolazak u najkraćem roku',
    count: 320, priceRange: '50 – 120 KM', priceNote: 'po intervenciji',
    group: 'Hitno 24/7', featured: true,
    services: ['Vodoinstalater 24/7', 'Električar 24/7', 'Bravar — zaključana vrata', 'Servis bojlera', 'Odštopavanje odvoda', 'Kvar grijanja', 'Kvar klime'],
  },
  // Građevina i završni radovi
  {
    name: 'Građevinarstvo', slug: 'gradjevinarstvo', seoSlug: 'gradjevinske-firme',
    profession: 'Građevinske firme', icon: BrickWall,
    description: 'Temelji, konstrukcije, zidarski radovi, betoniranje',
    count: 850, priceRange: '45 – 90 KM/m²', priceNote: 'zavisno od vrste radova',
    group: 'Građevina i završni radovi',
    services: ['Temelji i betoniranje', 'Zidarski radovi', 'Konstrukcije', 'Nadogradnja'],
  },
  {
    name: 'Adaptacije', slug: 'adaptacije', seoSlug: 'adaptacije',
    profession: 'Majstor za adaptacije', icon: Home,
    description: 'Kompletne adaptacije stanova i kuća',
    count: 720, priceRange: '150 – 400 KM/m²', priceNote: 'ključ u ruke',
    group: 'Građevina i završni radovi',
    services: ['Adaptacije stanova', 'Adaptacije kuća', 'Kupatila ključ u ruke', 'Stan za izdavanje'],
  },
  {
    name: 'Završni radovi', slug: 'zavrsni-radovi', seoSlug: 'zavrsni-radovi',
    profession: 'Majstor završnih radova', icon: Layers,
    description: 'Gipsani ukrasi, epoksidni podovi, dekorativni zidovi, mikrocement',
    count: 260, priceRange: '10 – 40 KM/m²', priceNote: 'zavisno od tehnike',
    group: 'Građevina i završni radovi',
    services: ['Gipsani ukrasi', 'Epoksidni podovi', 'Dekorativni zidovi', 'Mikrocement'],
  },
  {
    name: 'Molerski radovi', slug: 'molerski-radovi', seoSlug: 'soboslikar',
    profession: 'Soboslikar', icon: Paintbrush,
    description: 'Molerski radovi, bojanje zidova i fasada',
    count: 480, priceRange: '4 – 9 KM/m²', priceNote: 'sa ili bez materijala',
    group: 'Građevina i završni radovi',
    services: ['Bojanje zidova', 'Bojanje fasada', 'Gletovanje', 'Dekorativne tehnike'],
  },
  {
    name: 'Keramičarski radovi', slug: 'keramicarski-radovi', seoSlug: 'keramicar',
    profession: 'Keramičar', icon: Hammer,
    description: 'Postavljanje keramike, laminata i parketa',
    count: 420, priceRange: '15 – 35 KM/m²', priceNote: 'postavljanje',
    group: 'Građevina i završni radovi',
    services: ['Keramika', 'Velike pločice', 'Laminat i parket', 'Podno grijanje'],
  },
  {
    name: 'Krovopokrivanje', slug: 'krovopokrivanje', seoSlug: 'krovopokrivac',
    profession: 'Krovopokrivač', icon: Home,
    description: 'Izrada i popravke krovova, oluci, hidroizolacija',
    count: 390, priceRange: '25 – 55 KM/m²', priceNote: 'zavisno od pokrivača',
    group: 'Građevina i završni radovi',
    services: ['Limeni krovovi', 'Crijep', 'Ravni krovovi', 'Oluci i žljebovi'],
  },
  {
    name: 'Izolacija', slug: 'izolacija', seoSlug: 'izolacija-fasade',
    profession: 'Fasader / Izolater', icon: Shield,
    description: 'Termo izolacija, zvučna izolacija, hidroizolacija',
    count: 280, priceRange: '20 – 45 KM/m²', priceNote: 'sa materijalom',
    group: 'Građevina i završni radovi',
    services: ['Termo fasade', 'Kamena vuna', 'Hidroizolacija', 'Zvučna izolacija'],
  },
  {
    name: 'Rušenje i odvoz', slug: 'rusenje', seoSlug: 'rusenje',
    profession: 'Firma za rušenje', icon: Shovel,
    description: 'Rušenje objekata, odvoz šuta i čišćenje gradilišta',
    count: 180, priceRange: '10 – 30 KM/m³', priceNote: 'sa odvozom',
    group: 'Građevina i završni radovi',
    services: ['Rušenje objekata', 'Odvoz šuta', 'Čišćenje gradilišta', 'Rušenje stabala'],
  },
  // Instalacije
  {
    name: 'Vodoinstalacije', slug: 'vodoinstalacije', seoSlug: 'vodoinstalater',
    profession: 'Vodoinstalater', icon: Droplets,
    description: 'Instalacije vode, kanalizacije, sanitarije',
    count: 620, priceRange: '30 – 60 KM/h', priceNote: 'ili po poslu',
    group: 'Instalacije',
    services: ['Vodovodne instalacije', 'Sanitarije', 'Odštopavanje odvoda', 'Servis bojlera'],
  },
  {
    name: 'Elektroinstalacije', slug: 'elektroinstalacije', seoSlug: 'elektricar',
    profession: 'Električar', icon: Zap,
    description: 'Rasvjeta, struja, automatske sklopke',
    count: 540, priceRange: '30 – 60 KM/h', priceNote: 'ili po tački',
    group: 'Instalacije',
    services: ['Elektroinstalacije', 'Pametna kuća', 'Razvodni ormari', 'Rasvjeta'],
  },
  {
    name: 'Grijanje i hlađenje', slug: 'grijanje-i-hladjenje', seoSlug: 'grijanje-i-klima',
    profession: 'Tehničar grijanja i klime', icon: Thermometer,
    description: 'Centralno grijanje, klimatizacija, toplotne pumpe',
    count: 310, priceRange: '40 – 80 KM/h', priceNote: 'servis i montaža',
    group: 'Instalacije',
    services: ['Montaža klime', 'Centralno grijanje', 'Toplotne pumpe', 'Servis klime'],
  },
  // Dom i održavanje
  {
    name: 'Čišćenje i održavanje', slug: 'ciscenje', seoSlug: 'ciscenje',
    profession: 'Agencija za čišćenje', icon: Sparkles,
    description: 'Čišćenje stanova i kuća, dubinsko čišćenje, pranje prozora, dimnjačar',
    count: 290, priceRange: '3 – 8 KM/m²', priceNote: 'ili po satu',
    group: 'Dom i održavanje',
    services: ['Čišćenje stanova i kuća', 'Dubinsko čišćenje namještaja', 'Pranje prozora', 'Održavanje zgrada', 'Dimnjačar'],
  },
  {
    name: 'Sigurnost', slug: 'sigurnost', seoSlug: 'bravar',
    profession: 'Bravar', icon: KeySquare,
    description: 'Bravar, video nadzor, alarmni sistemi, interfoni',
    count: 190, priceRange: '30 – 70 KM/h', priceNote: 'ili po poslu',
    group: 'Dom i održavanje',
    services: ['Otključavanje vrata', 'Video nadzor', 'Alarmni sistemi', 'Interfoni'],
  },
  {
    name: 'Tehnologija', slug: 'tehnologija', seoSlug: 'it-tehnicar',
    profession: 'IT tehničar', icon: Wifi,
    description: 'WiFi mreže, servis računara i laptopa, Smart Home, montaža TV-a',
    count: 160, priceRange: '30 – 70 KM/h', priceNote: 'ili po poslu',
    group: 'Dom i održavanje',
    services: ['Postavljanje WiFi mreže', 'Servis računara', 'Servis laptopa', 'Smart Home', 'Montaža TV-a'],
  },
  // Namještaj
  {
    name: 'Stolarija i namještaj', slug: 'stolarija', seoSlug: 'stolar',
    profession: 'Stolar', icon: Armchair,
    description: 'Namještaj po mjeri, sklapanje IKEA namještaja, restauracija, prozori i vrata',
    count: 260, priceRange: 'po ponudi', priceNote: 'zavisno od mjere',
    group: 'Namještaj',
    services: ['Namještaj po mjeri', 'Sklapanje IKEA namještaja', 'Restauracija namještaja', 'Prozori i vrata'],
  },
  // Dvorište
  {
    name: 'Vrtlarstvo i dvorište', slug: 'vrtlarstvo', seoSlug: 'vrtlar',
    profession: 'Vrtlar', icon: TreePine,
    description: 'Košenje trave, orezivanje voća, sadnja i uređenje vrta, navodnjavanje',
    count: 350, priceRange: '20 – 45 KM/h', priceNote: 'ili po poslu',
    group: 'Dvorište',
    services: ['Košenje trave', 'Orezivanje voća', 'Rušenje stabala', 'Sadnja i uređenje vrta', 'Navodnjavanje'],
  },
  // Selidbe i prevoz
  {
    name: 'Selidbe i kombi prevoz', slug: 'selidbe', seoSlug: 'selidbe',
    profession: 'Firma za selidbe', icon: Truck,
    description: 'Selidbe, odvoz starog namještaja, kombi prevoz robe',
    count: 140, priceRange: '50 – 150 KM', priceNote: 'po selidbi/vožnji',
    group: 'Selidbe i prevoz',
    services: ['Selidbe stanova i kuća', 'Odvoz starog namještaja', 'Kombi prevoz', 'Pakovanje i utovar'],
  },
  // Auto usluge
  {
    name: 'Auto usluge', slug: 'auto-usluge', seoSlug: 'auto-majstor',
    profession: 'Auto majstor', icon: Car,
    description: 'Autoelektričar, dijagnostika, limarija i lakiranje, vulkanizer, detailing',
    count: 210, priceRange: '20 – 80 KM/h', priceNote: 'ili po usluzi',
    group: 'Auto usluge',
    services: ['Autoelektričar', 'Auto dijagnostika', 'Limarija i lakiranje', 'Vulkanizer', 'Auto detailing', 'Pranje vozila'],
  },
  // Ostale usluge — free text, bez SEO stranica
  {
    name: 'Ostale usluge', slug: 'ostale-usluge', seoSlug: 'ostale-usluge',
    profession: 'Majstor za sve', icon: HelpCircle,
    description: 'Sastavljanje kreveta, vješanje TV-a, odnošenje frižidera — bilo šta',
    count: 500, priceRange: 'po dogovoru', priceNote: 'opširnije u poslu',
    group: 'Ostalo', noSeo: true,
    services: ['Sastavljanje namještaja', 'Vješanje TV-a i polica', 'Odnošenje starih stvari', 'Sitni popravci'],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

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
  { name: 'Zenica', slug: 'zenica', loc: 'Zenici' },
  { name: 'Mostar', slug: 'mostar', loc: 'Mostaru' },
  { name: 'Bihać', slug: 'bihac', loc: 'Bihaću' },
  { name: 'Cazin', slug: 'cazin', loc: 'Cazinu' },
  { name: 'Velika Kladuša', slug: 'velika-kladusa', loc: 'Velikoj Kladuši' },
  { name: 'Sanski Most', slug: 'sanski-most', loc: 'Sanskom Mostu' },
  { name: 'Travnik', slug: 'travnik', loc: 'Travniku' },
  { name: 'Jajce', slug: 'jajce', loc: 'Jajcu' },
  { name: 'Bugojno', slug: 'bugojno', loc: 'Bugojnu' },
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
  // Republika Srpska
  { name: 'Banja Luka', slug: 'banja-luka', loc: 'Banjoj Luci' },
  { name: 'Bijeljina', slug: 'bijeljina', loc: 'Bijeljini' },
  { name: 'Prijedor', slug: 'prijedor', loc: 'Prijedoru' },
  { name: 'Doboj', slug: 'doboj', loc: 'Doboju' },
  { name: 'Derventa', slug: 'derventa', loc: 'Derventi' },
  { name: 'Gradiška', slug: 'gradiska', loc: 'Gradišci' },
  { name: 'Zvornik', slug: 'zvornik', loc: 'Zvorniku' },
  { name: 'Istočno Sarajevo', slug: 'istocno-sarajevo', loc: 'Istočnom Sarajevu' },
  { name: 'Trebinje', slug: 'trebinje', loc: 'Trebinju' },
  { name: 'Foča', slug: 'foca', loc: 'Foči' },
  // Brčko distrikt
  { name: 'Brčko', slug: 'brcko', loc: 'Brčkom' },
];

/* ---------------------------------- FIRME / MAJSTORI ---------------------------------- */

export interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Worker {
  id: string;
  name: string;
  specialty: string;
  categorySlug: string;
  rating: number;
  reviews: number;
  location: string;
  projects: number;
  initial: string;
  about: string;
  services: string[];
  reviewList: Review[];
}

export const workers: Worker[] = [
  {
    id: 'edin-kovacevic', name: 'Edin Kovačević', specialty: 'Vodoinstalater',
    categorySlug: 'vodoinstalacije', rating: 4.9, reviews: 127, location: 'Sarajevo',
    projects: 340, initial: 'EK',
    about: 'Vodoinstalater sa 15 godina iskustva. Specijaliziran za kompletne adaptacije kupatila, hitne intervencije i ugradnju sanitarnih instalacija u novogradnji.',
    services: ['Adaptacije kupatila', 'Hitne intervencije', 'Ugradnja sanitarija', 'Vodovodne instalacije'],
    reviewList: [
      { author: 'Amir H.', rating: 5, date: 'Juli 2026', text: 'Kompletna adaptacija kupatila urađena u dogovorenom roku. Čisto, precizno i po dogovorenoj cijeni.' },
      { author: 'Lejla M.', rating: 5, date: 'Juni 2026', text: 'Došao isti dan kada je cijev pukla. Brzo riješeno, korektna cijena. Preporuka!' },
      { author: 'Tarik S.', rating: 4, date: 'Maj 2026', text: 'Kvalitetan rad. Jedina zamjerka — kasnio je prvi dan, ali je sve nadoknadio tempom.' },
    ],
  },
  {
    id: 'nikola-begic', name: 'Nikola Begić', specialty: 'Električar',
    categorySlug: 'elektroinstalacije', rating: 4.8, reviews: 98, location: 'Banja Luka',
    projects: 215, initial: 'NB',
    about: 'Ovlašteni električar za stambene i poslovne objekte. Kompletne elektroinstalacije, pametne instalacije i rekonstrukcije razvodnih ormara.',
    services: ['Elektroinstalacije', 'Pametna kuća', 'Razvodni ormari', 'Rasvjeta'],
    reviewList: [
      { author: 'Jelena M.', rating: 5, date: 'Juli 2026', text: 'Kompletne instalacije u novogradnji — sve po projektu i propisima. Profesionalac.' },
      { author: 'Dragan K.', rating: 5, date: 'Juni 2026', text: 'Brzo, uredno, fer cijena. Sve preporuke.' },
      { author: 'Ivana P.', rating: 4, date: 'April 2026', text: 'Dobar rad na zamjeni instalacija u staroj kući.' },
    ],
  },
  {
    id: 'samir-haskovic', name: 'Samir Hasković', specialty: 'Keramičar',
    categorySlug: 'keramicarski-radovi', rating: 5.0, reviews: 203, location: 'Tuzla',
    projects: 480, initial: 'SH',
    about: 'Keramičar sa preko 20 godina iskustva. Velikoformatne pločice, mozaik, podno grijanje i kompletna kupatila ključ u ruke.',
    services: ['Keramika', 'Velike pločice', 'Podno grijanje', 'Kupatila ključ u ruke'],
    reviewList: [
      { author: 'Fatima K.', rating: 5, date: 'Juli 2026', text: 'Savršeno postavljene pločice 120x60. Milimetarska preciznost. Najbolji u gradu.' },
      { author: 'Mirza D.', rating: 5, date: 'Juni 2026', text: 'Kupatilo ključ u ruke za 10 dana. Sve preporuke, majstor za svaku pohvalu.' },
      { author: 'Aida B.', rating: 5, date: 'Maj 2026', text: 'Čistoća, tačnost i ljubaznost. Rijetkost danas.' },
    ],
  },
  {
    id: 'mirza-delalic', name: 'Mirza Delalić', specialty: 'Fasader',
    categorySlug: 'izolacija', rating: 4.7, reviews: 85, location: 'Mostar',
    projects: 190, initial: 'MD',
    about: 'Specijaliziran za termo fasade i vanjsku izolaciju. Rad sa svim sistemima — stiropor, kamena vuna, dekorativne završnice.',
    services: ['Termo fasade', 'Kamena vuna', 'Dekorativne fasade', 'Hidroizolacija'],
    reviewList: [
      { author: 'Ante M.', rating: 5, date: 'Juni 2026', text: 'Fasada na kući 150m2 urađena kvalitetno i u roku. Kuća je neprepoznatljiva.' },
      { author: 'Ivana S.', rating: 5, date: 'Maj 2026', text: 'Profesionalan pristup, uredno gradilište.' },
      { author: 'Goran T.', rating: 4, date: 'April 2026', text: 'Dobar omjer cijene i kvaliteta.' },
    ],
  },
  {
    id: 'ante-milic', name: 'Ante Milić', specialty: 'Krovopokrivač',
    categorySlug: 'krovopokrivanje', rating: 4.9, reviews: 156, location: 'Zenica',
    projects: 310, initial: 'AM',
    about: 'Krovopokrivač sa iskustvom na svim tipovima krovova — limeni krovovi, crijep, ravni krovovi. Garancija na rad 10 godina.',
    services: ['Limeni krovovi', 'Crijep', 'Ravni krovovi', 'Oluci i žljebovi'],
    reviewList: [
      { author: 'Senad H.', rating: 5, date: 'Juli 2026', text: 'Novi limeni krov za 5 dana. Precizno, uredno, s garancijom. Preporuka.' },
      { author: 'Zlatko B.', rating: 5, date: 'Maj 2026', text: 'Sanacija curenja riješena iz prve. Končno bez problema.' },
      { author: 'Marko P.', rating: 4, date: 'April 2026', text: 'Kvalitetan rad, malo duži termin zbog vremena.' },
    ],
  },
];

export function getWorker(id: string) {
  return workers.find((w) => w.id === id);
}

/* ---------------------------------- POSLOVI ---------------------------------- */

export interface Project {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  location: string;
  budget: string;
  deadline: string;
  bids: number;
  description: string;
  timeAgo: string;
  urgent?: boolean;
}

export const projects: Project[] = [
  {
    id: 1, title: 'Adaptacija kupatila - kompletan renovis', category: 'Vodoinstalacije',
    categorySlug: 'vodoinstalacije', location: 'Sarajevo - Centar', budget: '2,000 - 3,500 KM',
    deadline: 'Do 15.08.2026', bids: 8,
    description: 'Potrebna adaptacija kupatila u stanu od 60m2. Uključuje demontažu stare keramike, nove vodoinstalacije, postavljanje keramike i sanitarije.',
    timeAgo: 'Prije 2 sata',
  },
  {
    id: 2, title: 'Postavljanje laminata u dnevnom boravku', category: 'Keramičarski radovi',
    categorySlug: 'keramicarski-radovi', location: 'Banja Luka - Centar', budget: '800 - 1,200 KM',
    deadline: 'Do 20.08.2026', bids: 5,
    description: 'Postavljanje laminata u dnevnom boravku površine 45m2. Materijal imam, potreban majstor za postavljanje.',
    timeAgo: 'Prije 5 sati',
  },
  {
    id: 3, title: 'Izrada fasade na kući', category: 'Izolacija',
    categorySlug: 'izolacija', location: 'Mostar - Jug', budget: '5,000 - 8,000 KM',
    deadline: 'Do 01.09.2026', bids: 12,
    description: 'Potrebna izrada termo fasade na kući od 150m2. Stiropor 10cm, završni sloj po želji. Sve uključujući materijal i rad.',
    timeAgo: 'Prije 1 dan', urgent: true,
  },
  {
    id: 4, title: 'Elektroinstalacije u novogradnji', category: 'Elektroinstalacije',
    categorySlug: 'elektroinstalacije', location: 'Tuzla - Centar', budget: '3,000 - 4,500 KM',
    deadline: 'Do 10.09.2026', bids: 7,
    description: 'Kompletne elektroinstalacije u kući od 120m2. Uključuje razvod struje, utičnice, prekidače i rasvjetu.',
    timeAgo: 'Prije 2 dana',
  },
  {
    id: 5, title: 'Molerski radovi u stanu 80m2', category: 'Molerski radovi',
    categorySlug: 'molerski-radovi', location: 'Zenica - Centar', budget: '600 - 900 KM',
    deadline: 'Do 25.08.2026', bids: 4,
    description: 'Molerski radovi u kompletnom stanu — bojanje zidova u bijelu boju. Zidovi su pripremljeni, potrebno dvostruko bojanje.',
    timeAgo: 'Prije 3 dana',
  },
  {
    id: 6, title: 'Montaža klime - 2 jedinice', category: 'Grijanje i hlađenje',
    categorySlug: 'grijanje-i-hladjenje', location: 'Sarajevo - Novo Sarajevo', budget: '300 - 500 KM',
    deadline: 'Do 05.08.2026', bids: 9,
    description: 'Montaža dvije inverter klima jedinice (12 i 18). Uređaji su kupljeni, potrebna profesionalna montaža.',
    timeAgo: 'Prije 3 dana', urgent: true,
  },
];

/* ---------------------------------- FAQ ---------------------------------- */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Koliko košta korištenje Zaposli.ba za kupce?',
    answer: 'Za kupce je korištenje platforme potpuno besplatno — objava posla, primanje ponuda i kontakt sa firmama ne plaćaju se. Platformu financiraju premium paketi za firme.',
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
    answer: 'Ne. Objava posla je neobavezujuća — ako vam nijedna ponuda ne odgovara, posao jednostavno zatvarate bez ikakvih troškova.',
  },
  {
    question: 'Šta ako nisam zadovoljan izvedenim radovima?',
    answer: 'Preporučujemo da prije početka radova s firmom dogovorite sve detalje pisanim putem kroz platformu. U slučaju spora, naš tim pomaže u posredovanju, a vaša recenzija štiti druge kupce.',
  },
  {
    question: 'Kako firma dobija oznaku dobre reputacije?',
    answer: 'Ocjena se računa isključivo od recenzija stvarnih kupaca kojima je firma radila posao preko platforme. Ocjene se ne mogu kupiti niti ukloniti na zahtjev firme.',
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
