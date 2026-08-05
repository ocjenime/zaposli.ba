import {
  BrickWall, Droplets, Zap, Paintbrush, Home, Hammer, TreePine,
  Shovel, Thermometer, Shield, Sparkles, Siren, Layers, KeySquare,
  Wifi, Armchair, Truck, Car, HelpCircle, Sun, Ruler, Palette,
  Waves, Flame, Wrench, LayoutGrid, type LucideIcon,
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
  featured?: boolean;     // hitne intervencije: izdvojeni stil
  noSeo?: boolean;        // bez programatskih stranica (npr. Ostale usluge)
}

export const categories: Category[] = [
  // HITNO 24/7: izdvojena kategorija
  {
    name: 'Hitne intervencije', slug: 'hitne-intervencije', seoSlug: 'hitne-intervencije',
    profession: 'Hitne intervencije 24/7', icon: Siren,
    description: 'Vodoinstalater, električar i bravar 24/7: dolazak u najkraćem roku',
    count: 320, priceRange: '50-120 KM', priceNote: 'po intervenciji',
    group: 'Hitno 24/7', featured: true,
    services: ['Vodoinstalater 24/7', 'Električar 24/7', 'Bravar: zaključana vrata', 'Servis bojlera', 'Odštopavanje odvoda', 'Kvar grijanja', 'Kvar klime'],
  },
  // Građevina i završni radovi
  {
    name: 'Građevinarstvo', slug: 'gradjevinarstvo', seoSlug: 'gradjevinske-firme',
    profession: 'Građevinske firme', icon: BrickWall,
    description: 'Temelji, konstrukcije, zidarski radovi, betoniranje',
    count: 850, priceRange: '45-90 KM/m²', priceNote: 'zavisno od vrste radova',
    group: 'Građevina i završni radovi',
    services: ['Temelji i betoniranje', 'Zidarski radovi', 'Konstrukcije', 'Nadogradnja'],
  },
  {
    name: 'Adaptacije', slug: 'adaptacije', seoSlug: 'adaptacije',
    profession: 'Majstor za adaptacije', icon: Home,
    description: 'Kompletne adaptacije stanova i kuća',
    count: 720, priceRange: '150-400 KM/m²', priceNote: 'ključ u ruke',
    group: 'Građevina i završni radovi',
    services: ['Adaptacije stanova', 'Adaptacije kuća', 'Kupatila ključ u ruke', 'Stan za izdavanje'],
  },
  {
    name: 'Završni radovi', slug: 'zavrsni-radovi', seoSlug: 'zavrsni-radovi',
    profession: 'Majstor završnih radova', icon: Layers,
    description: 'Gipsani ukrasi, epoksidni podovi, dekorativni zidovi, mikrocement',
    count: 260, priceRange: '10-40 KM/m²', priceNote: 'zavisno od tehnike',
    group: 'Građevina i završni radovi',
    services: ['Gipsani ukrasi', 'Epoksidni podovi', 'Dekorativni zidovi', 'Mikrocement'],
  },
  {
    name: 'Molerski radovi', slug: 'molerski-radovi', seoSlug: 'soboslikar',
    profession: 'Soboslikar', icon: Paintbrush,
    description: 'Molerski radovi, bojanje zidova i fasada',
    count: 480, priceRange: '4-9 KM/m²', priceNote: 'sa ili bez materijala',
    group: 'Građevina i završni radovi',
    services: ['Bojanje zidova', 'Bojanje fasada', 'Gletovanje', 'Dekorativne tehnike'],
  },
  {
    name: 'Keramičarski radovi', slug: 'keramicarski-radovi', seoSlug: 'keramicar',
    profession: 'Keramičar', icon: LayoutGrid,
    description: 'Postavljanje keramike, laminata i parketa',
    count: 420, priceRange: '15-35 KM/m²', priceNote: 'postavljanje',
    group: 'Građevina i završni radovi',
    services: ['Keramika', 'Velike pločice', 'Laminat i parket', 'Podno grijanje'],
  },
  {
    name: 'Krovopokrivanje', slug: 'krovopokrivanje', seoSlug: 'krovopokrivac',
    profession: 'Krovopokrivač', icon: Home,
    description: 'Izrada i popravke krovova, oluci, hidroizolacija',
    count: 390, priceRange: '25-55 KM/m²', priceNote: 'zavisno od pokrivača',
    group: 'Građevina i završni radovi',
    services: ['Limeni krovovi', 'Crijep', 'Ravni krovovi', 'Oluci i žljebovi'],
  },
  {
    name: 'Izolacija', slug: 'izolacija', seoSlug: 'izolacija-fasade',
    profession: 'Fasader / Izolater', icon: Shield,
    description: 'Termo izolacija, zvučna izolacija, hidroizolacija',
    count: 280, priceRange: '20-45 KM/m²', priceNote: 'sa materijalom',
    group: 'Građevina i završni radovi',
    services: ['Termo fasade', 'Kamena vuna', 'Hidroizolacija', 'Zvučna izolacija'],
  },
  {
    name: 'Rušenje i odvoz', slug: 'rusenje', seoSlug: 'rusenje',
    profession: 'Firma za rušenje', icon: Shovel,
    description: 'Rušenje objekata, odvoz šuta i čišćenje gradilišta',
    count: 180, priceRange: '10-30 KM/m³', priceNote: 'sa odvozom',
    group: 'Građevina i završni radovi',
    services: ['Rušenje objekata', 'Odvoz šuta', 'Čišćenje gradilišta', 'Rušenje stabala'],
  },
  {
    name: 'Varioce', slug: 'varioce', seoSlug: 'varilac',
    profession: 'Varilac', icon: Wrench,
    description: 'Zavarivanje metala, konstrukcija, ograda, reparacija i montaža čeličnih elemenata',
    count: 160, priceRange: '25-60 KM/h', priceNote: 'ili po poslu',
    group: 'Građevina i završni radovi',
    services: ['Zavarivanje metala', 'Izrada ograda', 'Konstrukcije', 'Reparacija', 'Montaža čeličnih elemenata'],
  },
  {
    name: 'Tesarski radovi', slug: 'tesarski-radovi', seoSlug: 'tesar',
    profession: 'Tesar', icon: Hammer,
    description: 'Tesarski radovi, drvene konstrukcije, skele, podovi, stropovi i krovne stanje',
    count: 200, priceRange: '20-50 KM/h', priceNote: 'ili po poslu',
    group: 'Građevina i završni radovi',
    services: ['Drvene konstrukcije', 'Skele', 'Drveni podovi', 'Stropovi', 'Krovne stanje', 'Tesarska montaža'],
  },
  // Instalacije
  {
    name: 'Vodoinstalacije', slug: 'vodoinstalacije', seoSlug: 'vodoinstalater',
    profession: 'Vodoinstalater', icon: Droplets,
    description: 'Instalacije vode, kanalizacije, sanitarije',
    count: 620, priceRange: '30-60 KM/h', priceNote: 'ili po poslu',
    group: 'Instalacije',
    services: ['Vodovodne instalacije', 'Sanitarije', 'Odštopavanje odvoda', 'Servis bojlera'],
  },
  {
    name: 'Elektroinstalacije', slug: 'elektroinstalacije', seoSlug: 'elektricar',
    profession: 'Električar', icon: Zap,
    description: 'Rasvjeta, struja, automatske sklopke',
    count: 540, priceRange: '30-60 KM/h', priceNote: 'ili po tački',
    group: 'Instalacije',
    services: ['Elektroinstalacije', 'Pametna kuća', 'Razvodni ormari', 'Rasvjeta'],
  },
  {
    name: 'Grijanje i hlađenje', slug: 'grijanje-i-hladjenje', seoSlug: 'grijanje-i-klima',
    profession: 'Tehničar grijanja i klime', icon: Thermometer,
    description: 'Centralno grijanje, klimatizacija, toplotne pumpe',
    count: 310, priceRange: '40-80 KM/h', priceNote: 'servis i montaža',
    group: 'Instalacije',
    services: ['Montaža klime', 'Centralno grijanje', 'Toplotne pumpe', 'Servis klime'],
  },
  // Dom i održavanje
  {
    name: 'Čišćenje i održavanje', slug: 'ciscenje', seoSlug: 'ciscenje',
    profession: 'Agencija za čišćenje', icon: Sparkles,
    description: 'Čišćenje stanova i kuća, dubinsko čišćenje, pranje prozora, dimnjačar',
    count: 290, priceRange: '3-8 KM/m²', priceNote: 'ili po satu',
    group: 'Dom i održavanje',
    services: ['Čišćenje stanova i kuća', 'Dubinsko čišćenje namještaja', 'Pranje prozora', 'Održavanje zgrada', 'Dimnjačar'],
  },
  {
    name: 'Sigurnost', slug: 'sigurnost', seoSlug: 'bravar',
    profession: 'Bravar', icon: KeySquare,
    description: 'Bravar, video nadzor, alarmni sistemi, interfoni',
    count: 190, priceRange: '30-70 KM/h', priceNote: 'ili po poslu',
    group: 'Dom i održavanje',
    services: ['Otključavanje vrata', 'Video nadzor', 'Alarmni sistemi', 'Interfoni'],
  },
  {
    name: 'Tehnologija', slug: 'tehnologija', seoSlug: 'it-tehnicar',
    profession: 'IT tehničar', icon: Wifi,
    description: 'WiFi mreže, servis računara i laptopa, Smart Home, montaža TV-a',
    count: 160, priceRange: '30-70 KM/h', priceNote: 'ili po poslu',
    group: 'Dom i održavanje',
    services: ['Postavljanje WiFi mreže', 'Servis računara', 'Servis laptopa', 'Smart Home', 'Montaža TV-a'],
  },
  // Namještaj
  {
    name: 'Stolarija i namještaj', slug: 'stolarija', seoSlug: 'stolar',
    profession: 'Stolar', icon: Armchair,
    description: 'Namještaj po mjeri, sklapanje namještaja, restauracija, prozori i vrata',
    count: 260, priceRange: 'po ponudi', priceNote: 'zavisno od mjere',
    group: 'Namještaj',
    services: ['Namještaj po mjeri', 'Sklapanje namještaja', 'Restauracija namještaja', 'Prozori i vrata'],
  },
  // Dvorište
  {
    name: 'Vrtlarstvo i dvorište', slug: 'vrtlarstvo', seoSlug: 'vrtlar',
    profession: 'Vrtlar', icon: TreePine,
    description: 'Košenje trave, orezivanje voća, sadnja i uređenje vrta, navodnjavanje',
    count: 350, priceRange: '20-45 KM/h', priceNote: 'ili po poslu',
    group: 'Dvorište',
    services: ['Košenje trave', 'Orezivanje voća', 'Rušenje stabala', 'Sadnja i uređenje vrta', 'Navodnjavanje'],
  },
  // Selidbe i prevoz
  {
    name: 'Selidbe i kombi prevoz', slug: 'selidbe', seoSlug: 'selidbe',
    profession: 'Firma za selidbe', icon: Truck,
    description: 'Selidbe, odvoz starog namještaja, kombi prevoz robe',
    count: 140, priceRange: '50-150 KM', priceNote: 'po selidbi/vožnji',
    group: 'Selidbe i prevoz',
    services: ['Selidbe stanova i kuća', 'Odvoz starog namještaja', 'Kombi prevoz', 'Pakovanje i utovar'],
  },
  // Auto usluge
  {
    name: 'Auto usluge', slug: 'auto-usluge', seoSlug: 'auto-majstor',
    profession: 'Auto majstor', icon: Car,
    description: 'Autoelektričar, dijagnostika, limarija i lakiranje, vulkanizer, detailing',
    count: 210, priceRange: '20-80 KM/h', priceNote: 'ili po usluzi',
    group: 'Auto usluge',
    services: ['Autoelektričar', 'Auto dijagnostika', 'Limarija i lakiranje', 'Vulkanizer', 'Auto detailing', 'Pranje vozila'],
  },
  // Specijalizovane instalacije
  {
    name: 'Solarne instalacije', slug: 'solarne-instalacije', seoSlug: 'solarne-instalacije',
    profession: 'Solar instalater', icon: Sun,
    description: 'Montaža solarnih panela, solarnih bojlera i fotovoltaik sistema',
    count: 95, priceRange: 'po dogovoru', priceNote: 'zavisno od snage',
    group: 'Instalacije',
    services: ['Solarni paneli', 'Solarni bojleri', 'Fotovoltaik sistemi', 'Servis solarne opreme'],
  },
  {
    name: 'Kamin i peći', slug: 'kamin-i-peci', seoSlug: 'kamin-i-peci',
    profession: 'Majstor za kamine i peći', icon: Flame,
    description: 'Montaža, servis i čišćenje kamina, peći i kotlova na drva i pelet',
    count: 110, priceRange: '40-90 KM/h', priceNote: 'ili po poslu',
    group: 'Instalacije',
    services: ['Montaža kamina', 'Servis peći', 'Čišćenje dimnjaka', 'Peći na pelet'],
  },
  // Dvorište i okućnica
  {
    name: 'Bazeni i fontane', slug: 'bazeni-i-fontane', seoSlug: 'bazeni-i-fontane',
    profession: 'Majstor za bazene', icon: Waves,
    description: 'Izgradnja, održavanje i servis bazena, fontana i jezera',
    count: 85, priceRange: 'po dogovoru', priceNote: 'zavisno od opsega',
    group: 'Dvorište',
    services: ['Izgradnja bazena', 'Održavanje bazena', 'Servis fontana', 'Hemija za bazene'],
  },
  // Projektovanje i dizajn
  {
    name: 'Projektovanje i arhitektura', slug: 'projektovanje-i-arhitektura', seoSlug: 'arhitekt',
    profession: 'Arhitekta', icon: Ruler,
    description: 'Idejna rješenja, projekti za dozvolu, 3D vizualizacije i nadzor',
    count: 140, priceRange: 'po dogovoru', priceNote: 'po kvadraturi/projektu',
    group: 'Projektovanje i dizajn',
    services: ['Idejna rješenja', 'Projekti za dozvolu', '3D vizualizacije', 'Nadzor nad izvođenjem'],
  },
  {
    name: 'Dizajn enterijera', slug: 'dizajn-enterijera', seoSlug: 'dizajner-enterijera',
    profession: 'Dizajner enterijera', icon: Palette,
    description: 'Uređenje interijera, izbor materijala, boja, namještaja i rasvjete',
    count: 120, priceRange: 'po dogovoru', priceNote: 'po prostoru/satu',
    group: 'Projektovanje i dizajn',
    services: ['Dizajn interijera', 'Izbor materijala', 'Raspored namještaja', 'Savjetovanje o bojama'],
  },
  // Ostale usluge: free text, bez SEO stranica
  {
    name: 'Ostale usluge', slug: 'ostale-usluge', seoSlug: 'ostale-usluge',
    profession: 'Majstor za sve', icon: HelpCircle,
    description: 'Sastavljanje kreveta, vješanje TV-a, odnošenje frižidera: bilo šta',
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
