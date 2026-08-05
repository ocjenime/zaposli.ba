import {
  BrickWall, Droplets, Zap, Paintbrush, Home, Hammer, TreePine,
  Shovel, Thermometer, Shield, Sparkles, Siren, Layers, KeySquare,
  Wifi, Armchair, Truck, Car, HelpCircle, Sun, Ruler, Palette,
  Waves, Flame, Wrench, LayoutGrid, Construction, Fence, Grid2x2,
  FlameKindling, Wind, Cog, GlassWater, House, SwatchBook, UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

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
  // HITNO 24/7
  {
    name: 'Hitne intervencije', slug: 'hitne-intervencije', seoSlug: 'hitne-intervencije',
    profession: 'Hitne intervencije 24/7', icon: Siren,
    description: 'Vodoinstalater, električar i bravar 24/7: dolazak u najkraćem roku',
    count: 0, priceRange: '50-120 KM', priceNote: 'po intervenciji',
    group: 'Hitno 24/7', featured: true,
    services: ['Vodoinstalater 24/7', 'Električar 24/7', 'Bravar: zaključana vrata', 'Servis bojlera', 'Odštopavanje odvoda', 'Kvar grijanja', 'Kvar klime'],
  },

  // Građevina i zidarski radovi
  {
    name: 'Građevinarstvo', slug: 'gradjevinarstvo', seoSlug: 'gradjevinske-firme',
    profession: 'Građevinske firme', icon: Construction,
    description: 'Temelji, konstrukcije, betoniranje, zidarski radovi i nadogradnje',
    count: 0, priceRange: '45-90 KM/m²', priceNote: 'zavisno od vrste radova',
    group: 'Građevina i zidarski radovi',
    services: ['Temelji i betoniranje', 'Zidarski radovi', 'Konstrukcije', 'Nadogradnja', 'Armatura i oplate'],
  },
  {
    name: 'Zidarski radovi', slug: 'zidarski-radovi', seoSlug: 'zidar',
    profession: 'Zidar', icon: BrickWall,
    description: 'Zidanje blokom, ciglom, prirodnim kamenom: pregradni zidovi, fasadno zidanje i ojačanja',
    count: 0, priceRange: '25-55 KM/m²', priceNote: 'po zidanom zidu',
    group: 'Građevina i zidarski radovi',
    services: ['Pregradni zidovi', 'Zidanje ciglom', 'Zidanje blokom', 'Fasadno zidanje', 'Ojačanje zidova'],
  },
  {
    name: 'Tesarski radovi', slug: 'tesarski-radovi', seoSlug: 'tesar',
    profession: 'Tesar', icon: Hammer,
    description: 'Drvene konstrukcije, skele, podovi, stropovi i krovne stanje',
    count: 0, priceRange: '20-50 KM/h', priceNote: 'ili po poslu',
    group: 'Građevina i zidarski radovi',
    services: ['Drvene konstrukcije', 'Skele', 'Drveni podovi', 'Stropovi', 'Krovne stanje', 'Tesarska montaža'],
  },
  {
    name: 'Betoniranje i armatura', slug: 'betoniranje-i-armatura', seoSlug: 'betoniranje-armatura',
    profession: 'Betonirac / Armirač', icon: Construction,
    description: 'Betoniranje ploča, temelja, stubova, stepeništa i armiranje konstrukcija',
    count: 0, priceRange: '30-70 KM/m²', priceNote: 'zavisno od konstrukcije',
    group: 'Građevina i zidarski radovi',
    services: ['Betoniranje temelja', 'Betoniranje ploča', 'Armatura', 'Oplate', 'Betonska stepeništa'],
  },
  {
    name: 'Rušenje i odvoz šuta', slug: 'rusenje', seoSlug: 'rusenje',
    profession: 'Firma za rušenje', icon: Shovel,
    description: 'Rušenje objekata, odvoz šuta, čišćenje gradilišta i rušenje stabala',
    count: 0, priceRange: '10-30 KM/m³', priceNote: 'sa odvozom',
    group: 'Građevina i zidarski radovi',
    services: ['Rušenje objekata', 'Odvoz šuta', 'Čišćenje gradilišta', 'Rušenje stabala'],
  },

  // Krov, fasada i izolacija
  {
    name: 'Krovopokrivanje', slug: 'krovopokrivanje', seoSlug: 'krovopokrivac',
    profession: 'Krovopokrivač', icon: House,
    description: 'Izrada i popravke krovova, oluci, hidroizolacija i ravni krovovi',
    count: 0, priceRange: '25-55 KM/m²', priceNote: 'zavisno od pokrivača',
    group: 'Krov, fasada i izolacija',
    services: ['Limeni krovovi', 'Crijep', 'Ravni krovovi', 'Oluci i žljebovi', 'Sanacija curenja'],
  },
  {
    name: 'Limarski radovi', slug: 'limarski-radovi', seoSlug: 'limar',
    profession: 'Limar', icon: Layers,
    description: 'Limarski radovi, oluci, žljebovi, krovni lim i metalne obloge',
    count: 0, priceRange: '20-45 KM/m', priceNote: 'po dužini / površini',
    group: 'Krov, fasada i izolacija',
    services: ['Oluci i žljebovi', 'Krovni lim', 'Fasadni lim', 'Ventilacioni krovni elementi', 'Popravke limarije'],
  },
  {
    name: 'Fasade i termoizolacija', slug: 'izolacija', seoSlug: 'fasade-i-izolacija',
    profession: 'Fasader / Izolater', icon: Shield,
    description: 'Termo fasade, kamena vuna, stiropor, hidroizolacija i zvučna izolacija',
    count: 0, priceRange: '20-45 KM/m²', priceNote: 'sa materijalom',
    group: 'Krov, fasada i izolacija',
    services: ['Termo fasade', 'Kamena vuna', 'Stiropor fasade', 'Hidroizolacija', 'Zvučna izolacija'],
  },
  {
    name: 'Hidroizolacija', slug: 'hidroizolacija', seoSlug: 'hidroizolacija',
    profession: 'Hidroizolater', icon: Waves,
    description: 'Hidroizolacija temelja, krovova, terasa, kupatila, bazena i podruma',
    count: 0, priceRange: '15-40 KM/m²', priceNote: 'zavisno od površine',
    group: 'Krov, fasada i izolacija',
    services: ['Hidroizolacija temelja', 'Hidroizolacija krovova', 'Hidroizolacija terasa', 'Hidroizolacija kupatila', 'Sanacija curenja'],
  },

  // Boje, zidovi i podovi
  {
    name: 'Molerski radovi', slug: 'molerski-radovi', seoSlug: 'soboslikar',
    profession: 'Soboslikar', icon: Paintbrush,
    description: 'Bojanje zidova i fasada, gletovanje, krečenje i dekorativne tehnike',
    count: 0, priceRange: '4-9 KM/m²', priceNote: 'sa ili bez materijala',
    group: 'Boje, zidovi i podovi',
    services: ['Bojanje zidova', 'Bojanje fasada', 'Gletovanje', 'Krečenje', 'Lakovane zidne boje'],
  },
  {
    name: 'Gipsarski radovi', slug: 'gipsarski-radovi', seoSlug: 'gipsar',
    profession: 'Gipsar', icon: LayoutGrid,
    description: 'Spušteni plafoni, pregradni zidovi od gips-kartona, ugradnja LED rasvjete',
    count: 0, priceRange: '12-28 KM/m²', priceNote: 'po površini',
    group: 'Boje, zidovi i podovi',
    services: ['Spušteni plafoni', 'Pregradni zidovi', 'Gips-karton obloge', 'Ugradnja LED rasvjete', 'Popravke gipsa'],
  },
  {
    name: 'Dekorativni zidovi i mikrocement', slug: 'zavrsni-radovi', seoSlug: 'dekorativni-zidovi',
    profession: 'Dekorater zidova', icon: Palette,
    description: 'Dekorativne tehnike, mikrocement, epoksidni podovi, dekorativni mort i vapno',
    count: 0, priceRange: '15-60 KM/m²', priceNote: 'zavisno od tehnike',
    group: 'Boje, zidovi i podovi',
    services: ['Mikrocement', 'Epoksidni podovi', 'Dekorativni mort', 'Vapneno krečenje', 'Teksturirani zidovi'],
  },
  {
    name: 'Tapetarski radovi', slug: 'tapetarski-radovi', seoSlug: 'tapetar',
    profession: 'Tapetar', icon: SwatchBook,
    description: 'Postavljanje tapeta, dekorativnih folija, staklo-flisa i zidnih obloga',
    count: 0, priceRange: '8-20 KM/m²', priceNote: 'sa ili bez materijala',
    group: 'Boje, zidovi i podovi',
    services: ['Postavljanje tapeta', 'Staklo-flis', 'Dekorativne folije', 'Zidne obloge', 'Uklanjanje starih tapeta'],
  },
  {
    name: 'Keramičarski radovi', slug: 'keramicarski-radovi', seoSlug: 'keramicar',
    profession: 'Keramičar', icon: Grid2x2,
    description: 'Postavljanje keramike, pločica, mozaika i granita u kupatilima, kuhinjama i poslovnim prostorima',
    count: 0, priceRange: '15-35 KM/m²', priceNote: 'postavljanje',
    group: 'Boje, zidovi i podovi',
    services: ['Keramičke pločice', 'Velike pločice', 'Mozaik', 'Granit i mermer', 'Hidroizolacija ispod keramike'],
  },
  {
    name: 'Postavljanje podova', slug: 'podovi', seoSlug: 'postavljanje-podova',
    profession: 'Postavljač podova', icon: Layers,
    description: 'Laminat, parket, vinil, tepih, industrijski podovi i nivelacija',
    count: 0, priceRange: '10-30 KM/m²', priceNote: 'po vrsti poda',
    group: 'Boje, zidovi i podovi',
    services: ['Laminat i vinil', 'Parket', 'Tepih', 'Nivelacija i estrihi', 'Industrijski podovi'],
  },
  {
    name: 'Staklarski radovi', slug: 'staklar', seoSlug: 'staklar',
    profession: 'Staklorezač', icon: GlassWater,
    description: 'Staklene obloge, tuš kabine, ogledala, staklena vrata i prozori',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od stakla',
    group: 'Boje, zidovi i podovi',
    services: ['Staklene obloge', 'Tuš kabine', 'Ogledala', 'Staklena vrata', 'Staklene ograde i prozori'],
  },
  {
    name: 'Kamen i popločavanje', slug: 'kamen-i-poplocavanje', seoSlug: 'kamen-i-poplocavanje',
    profession: 'Kamenorezač / Popločavač', icon: BrickWall,
    description: 'Prirodni i umjetni kamen, popločavanje podova, zidova, terasa i staza',
    count: 0, priceRange: '20-60 KM/m²', priceNote: 'zavisno od materijala',
    group: 'Boje, zidovi i podovi',
    services: ['Mermer i granit', 'Prirodni kamen', 'Popločavanje enterijera', 'Uređenje staza', 'Zidne obloge od kamena'],
  },

  // Kupatila, kuhinje i adaptacije
  {
    name: 'Adaptacije stanova i kuća', slug: 'adaptacije', seoSlug: 'adaptacije',
    profession: 'Majstor za adaptacije', icon: Home,
    description: 'Kompletne adaptacije stanova, kuća, kupatila i kuhinja – od srušenog do ključa u ruke',
    count: 0, priceRange: '150-400 KM/m²', priceNote: 'ključ u ruke',
    group: 'Kupatila, kuhinje i adaptacije',
    services: ['Adaptacije stanova', 'Adaptacije kuća', 'Kupatila ključ u ruke', 'Kuhinje po mjeri', 'Stan za izdavanje'],
  },
  {
    name: 'Kupatila ključ u ruke', slug: 'kupatila-kljuc-u-ruke', seoSlug: 'kupatila-kljuc-u-ruke',
    profession: 'Majstor za kupatila', icon: Droplets,
    description: 'Kompletna izrada i renoviranje kupatila: pločice, sanitarija, hidroizolacija i rasvjeta',
    count: 0, priceRange: '2500-8000 KM', priceNote: 'po kupatilu',
    group: 'Kupatila, kuhinje i adaptacije',
    services: ['Rušenje kupatila', 'Hidroizolacija', 'Keramika i sanitarija', 'Montaža bojlera', 'LED rasvjeta'],
  },
  {
    name: 'Kuhinje po mjeri', slug: 'kuhinje-po-mjeri', seoSlug: 'kuhinje-po-mjeri',
    profession: 'Izvođač kuhinja po mjeri', icon: UtensilsCrossed,
    description: 'Projektovanje, izrada i montaža kuhinja po mjeri, sa ugradnjom aparata i rasvjete',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od materijala',
    group: 'Kupatila, kuhinje i adaptacije',
    services: ['Kuhinja po mjeri', 'Ugradnja aparata', 'Tehnički kamen', 'LED rasvjeta', 'Izrada elementa'],
  },

  // Stolarija i namještaj
  {
    name: 'Stolarija i namještaj', slug: 'stolarija', seoSlug: 'stolar',
    profession: 'Stolar', icon: Armchair,
    description: 'Namještaj po mjeri, kuhinje, plakari, prozori, vrata i restauracija',
    count: 0, priceRange: 'po ponudi', priceNote: 'zavisno od mjere',
    group: 'Stolarija i namještaj',
    services: ['Namještaj po mjeri', 'Kuhinje i plakari', 'Prozori i vrata', 'Sklapanje namještaja', 'Restauracija namještaja'],
  },

  // Instalacije
  {
    name: 'Vodoinstalacije', slug: 'vodoinstalacije', seoSlug: 'vodoinstalater',
    profession: 'Vodoinstalater', icon: Droplets,
    description: 'Instalacije vode, kanalizacije, sanitarije, bojleri i odštopavanje odvoda',
    count: 0, priceRange: '30-60 KM/h', priceNote: 'ili po poslu',
    group: 'Instalacije',
    services: ['Vodovodne instalacije', 'Kanalizacija', 'Sanitarije', 'Odštopavanje odvoda', 'Servis bojlera'],
  },
  {
    name: 'Elektroinstalacije', slug: 'elektroinstalacije', seoSlug: 'elektricar',
    profession: 'Električar', icon: Zap,
    description: 'Elektroinstalacije, rasvjeta, razvodni ormari, automatske sklopke i pametna kuća',
    count: 0, priceRange: '30-60 KM/h', priceNote: 'ili po tački',
    group: 'Instalacije',
    services: ['Elektroinstalacije', 'Rasvjeta', 'Razvodni ormari', 'Automatske sklopke', 'Pametna kuća'],
  },
  {
    name: 'Grijanje, klimatizacija i ventilacija', slug: 'grijanje-i-hladjenje', seoSlug: 'grijanje-klima-ventilacija',
    profession: 'Tehničar grijanja i klime', icon: Thermometer,
    description: 'Centralno grijanje, klimatizacija, ventilacija, toplotne pumpe i rekuperatori',
    count: 0, priceRange: '40-80 KM/h', priceNote: 'servis i montaža',
    group: 'Instalacije',
    services: ['Montaža klime', 'Centralno grijanje', 'Toplotne pumpe', 'Ventilacija i rekuperacija', 'Servis klime'],
  },
  {
    name: 'Plinske instalacije', slug: 'plinske-instalacije', seoSlug: 'plinoinstalater',
    profession: 'Plinoinstalater', icon: Flame,
    description: 'Plinske instalacije, zamjena plinskih peći, spojevi za kuhinju i grijanje na plin',
    count: 0, priceRange: '40-80 KM/h', priceNote: 'sa materijalom',
    group: 'Instalacije',
    services: ['Plinske instalacije', 'Montaža plinskih peći', 'Plinski razvod', 'Servis plinskih uređaja', 'Isptivanje zaptivnosti'],
  },
  {
    name: 'Solarne instalacije', slug: 'solarne-instalacije', seoSlug: 'solarne-instalacije',
    profession: 'Solar instalater', icon: Sun,
    description: 'Montaža solarnih panela, solarnih bojlera i fotovoltaik sistema',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od snage',
    group: 'Instalacije',
    services: ['Solarni paneli', 'Solarni bojleri', 'Fotovoltaik sistemi', 'Servis solarne opreme'],
  },
  {
    name: 'Servis kućanskih aparata', slug: 'servis-aparata', seoSlug: 'servis-kucanskih-aparata',
    profession: 'Serviser kućanskih aparata', icon: Cog,
    description: 'Popravka frižidera, mašina za pranje suđa i veša, šporeta, bojlera i drugih aparata',
    count: 0, priceRange: '30-70 KM/h', priceNote: 'plus rezervni dijelovi',
    group: 'Instalacije',
    services: ['Popravka frižidera', 'Popravka mašina za veš', 'Popravka mašina za suđe', 'Popravka šporeta', 'Popravka usisivača'],
  },
  {
    name: 'Kamin i peći', slug: 'kamin-i-peci', seoSlug: 'kamin-i-peci',
    profession: 'Majstor za kamine i peći', icon: FlameKindling,
    description: 'Montaža, servis i čišćenje kamina, peći i kotlova na drva, pelet i plin',
    count: 0, priceRange: '40-90 KM/h', priceNote: 'ili po poslu',
    group: 'Instalacije',
    services: ['Montaža kamina', 'Servis peći', 'Čišćenje dimnjaka', 'Peći na pelet', 'Kotlovi na drva'],
  },

  // Pametni dom i sigurnost
  {
    name: 'Bravarstvo i sigurnosni sistemi', slug: 'sigurnost', seoSlug: 'bravarstvo',
    profession: 'Bravar', icon: KeySquare,
    description: 'Bravar, otključavanje vrata, video nadzor, alarmni sistemi i interfoni',
    count: 0, priceRange: '30-70 KM/h', priceNote: 'ili po poslu',
    group: 'Pametni dom i sigurnost',
    services: ['Otključavanje vrata', 'Zamjena brave', 'Video nadzor', 'Alarmni sistemi', 'Interfoni'],
  },
  {
    name: 'IT, računari i Smart Home', slug: 'tehnologija', seoSlug: 'it-i-smart-home',
    profession: 'IT tehničar', icon: Wifi,
    description: 'WiFi mreže, servis računara i laptopa, Smart Home, montaža TV-a i pametne instalacije',
    count: 0, priceRange: '30-70 KM/h', priceNote: 'ili po poslu',
    group: 'Pametni dom i sigurnost',
    services: ['Postavljanje WiFi mreže', 'Servis računara', 'Servis laptopa', 'Smart Home', 'Montaža TV-a'],
  },

  // Čišćenje i održavanje
  {
    name: 'Čišćenje prostora', slug: 'ciscenje', seoSlug: 'ciscenje',
    profession: 'Agencija za čišćenje', icon: Sparkles,
    description: 'Čišćenje stanova i kuća, dubinsko čišćenje, pranje prozora i održavanje zgrada',
    count: 0, priceRange: '3-8 KM/m²', priceNote: 'ili po satu',
    group: 'Čišćenje i održavanje',
    services: ['Čišćenje stanova i kuća', 'Dubinsko čišćenje namještaja', 'Pranje prozora', 'Održavanje zgrada', 'Pranje tepiha'],
  },
  {
    name: 'Pranje fasada i krovova', slug: 'pranje-fasada-i-krovova', seoSlug: 'pranje-fasada',
    profession: 'Čistač fasada i krovova', icon: Wind,
    description: 'Visinsko pranje fasada, krovova, oluka, prozora i uklanjanje mahovine i prljavštine',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od površine',
    group: 'Čišćenje i održavanje',
    services: ['Pranje fasada', 'Pranje krovova', 'Čišćenje oluka', 'Uklanjanje mahovine', 'Pranje prozora na visini'],
  },
  {
    name: 'Dimnjačarske usluge', slug: 'dimnjacar', seoSlug: 'dimnjacar',
    profession: 'Dimnjačar', icon: Wind,
    description: 'Čišćenje dimnjaka, kontrola i sanacija, ugradnja dimnih cijevi i peći',
    count: 0, priceRange: '50-120 KM', priceNote: 'po dimnjaku',
    group: 'Čišćenje i održavanje',
    services: ['Čišćenje dimnjaka', 'Kontrola dimnjaka', 'Sanacija dimnjaka', 'Ugradnja dimnih cijevi', 'Savjetovanje o pećima'],
  },
  {
    name: 'Održavanje zgrada', slug: 'odrzavanje-zgrada', seoSlug: 'odrzavanje-zgrada',
    profession: 'Firma za održavanje zgrada', icon: Wrench,
    description: 'Redovno održavanje zgrada, zajedničkih prostora, instalacija i popravke u stambenim zgradama',
    count: 0, priceRange: 'po dogovoru', priceNote: 'mjesečno ili po satu',
    group: 'Čišćenje i održavanje',
    services: ['Održavanje zajedničkih prostora', 'Popravke u zgradama', 'Održavanje instalacija', 'Zimska služba', 'Košenje okućnice zgrade'],
  },

  // Dvorište, bašta i okolica
  {
    name: 'Bašta, dvorište i ozelenjavanje', slug: 'vrtlarstvo', seoSlug: 'vrtlar',
    profession: 'Vrtlar', icon: TreePine,
    description: 'Košenje trave, orezivanje voća, sadnja, navodnjavanje i uređenje vrta',
    count: 0, priceRange: '20-45 KM/h', priceNote: 'ili po poslu',
    group: 'Dvorište, bašta i okolica',
    services: ['Košenje trave', 'Orezivanje voća', 'Rušenje stabala', 'Sadnja i uređenje vrta', 'Navodnjavanje'],
  },
  {
    name: 'Pergole, nadstrešnice i tende', slug: 'pergole-nadstresnice-tende', seoSlug: 'pergole-nadstresnice',
    profession: 'Montaža pergole / tende', icon: Sun,
    description: 'Izrada i montaža pergole, nadstrešnica, tendi, kapija i zaštitnih elemenata',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od materijala',
    group: 'Dvorište, bašta i okolica',
    services: ['Pergole', 'Nadstrešnice', 'Tende', 'Kapije', 'Gelenderi i ograde'],
  },
  {
    name: 'Bazeni i fontane', slug: 'bazeni-i-fontane', seoSlug: 'bazeni-i-fontane',
    profession: 'Majstor za bazene', icon: Waves,
    description: 'Izgradnja, održavanje i servis bazena, fontana i jezera',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od opsega',
    group: 'Dvorište, bašta i okolica',
    services: ['Izgradnja bazena', 'Održavanje bazena', 'Servis fontana', 'Hemija za bazene'],
  },
  {
    name: 'Popločavanje dvorišta i terasa', slug: 'poplocavanje-dvorista-i-terasa', seoSlug: 'poplocavanje-dvorista',
    profession: 'Popločavač dvorišta', icon: Grid2x2,
    description: 'Popločavanje dvorišta, terasa, staza, parkinga i prilaza',
    count: 0, priceRange: '15-45 KM/m²', priceNote: 'zavisno od ploče',
    group: 'Dvorište, bašta i okolica',
    services: ['Terase', 'Dvorišta', 'Staze', 'Parking', 'Prilazi i pristupni putevi'],
  },
  {
    name: 'Rušenje stabala i drvoreda', slug: 'rusenje-stabala-drvoreda', seoSlug: 'rusenje-stabala',
    profession: 'Rušilac stabala', icon: TreePine,
    description: 'Rušenje, orezivanje i uklanjanje stabala, drvoreda, grana i panjeva',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od veličine',
    group: 'Dvorište, bašta i okolica',
    services: ['Rušenje visokih stabala', 'Orezivanje grana', 'Uklanjanje panjeva', 'Drvoredi', 'Hitan rad'],
  },
  {
    name: 'Ograde i ograde', slug: 'ograde', seoSlug: 'ograde',
    profession: 'Ogradač / Ogradžija', icon: Fence,
    description: 'Izrada i montaža ograda, kapija, gelendera i zaštitnih ograda',
    count: 0, priceRange: 'po dogovoru', priceNote: 'zavisno od materijala',
    group: 'Dvorište, bašta i okolica',
    services: ['Metalne ograde', 'Drvene ograde', 'PVC ograde', 'Kapije i automatika', 'Gelenderi i balustrade'],
  },

  // Metalne konstrukcije i zavarivanje
  {
    name: 'Varilački radovi', slug: 'varilac', seoSlug: 'varilac',
    profession: 'Varilac', icon: Flame,
    description: 'Zavarivanje metala, izrada ograda, konstrukcija, reparacija i montaža čeličnih elemenata',
    count: 0, priceRange: '25-60 KM/h', priceNote: 'ili po poslu',
    group: 'Metalne konstrukcije i zavarivanje',
    services: ['Zavarivanje metala', 'Izrada ograda', 'Konstrukcije', 'Reparacija', 'Montaža čeličnih elemenata'],
  },

  // Selidbe i prevoz
  {
    name: 'Selidbe i kombi prevoz', slug: 'selidbe', seoSlug: 'selidbe',
    profession: 'Firma za selidbe', icon: Truck,
    description: 'Selidbe, odvoz starog namještaja, kombi prevoz robe i pakovanje',
    count: 0, priceRange: '50-150 KM', priceNote: 'po selidbi/vožnji',
    group: 'Selidbe i prevoz',
    services: ['Selidbe stanova i kuća', 'Odvoz starog namještaja', 'Kombi prevoz', 'Pakovanje i utovar'],
  },

  // Auto usluge
  {
    name: 'Auto usluge', slug: 'auto-usluge', seoSlug: 'auto-majstor',
    profession: 'Auto majstor', icon: Car,
    description: 'Autoelektričar, dijagnostika, limarija i lakiranje, vulkanizer i detailing',
    count: 0, priceRange: '20-80 KM/h', priceNote: 'ili po usluzi',
    group: 'Auto usluge',
    services: ['Autoelektričar', 'Auto dijagnostika', 'Limarija i lakiranje', 'Vulkanizer', 'Auto detailing', 'Pranje vozila'],
  },

  // Projektovanje i dizajn
  {
    name: 'Arhitektura i projektovanje', slug: 'projektovanje-i-arhitektura', seoSlug: 'arhitekt',
    profession: 'Arhitekta', icon: Ruler,
    description: 'Idejna rješenja, projekti za dozvolu, 3D vizualizacije i nadzor nad izvođenjem',
    count: 0, priceRange: 'po dogovoru', priceNote: 'po kvadraturi/projektu',
    group: 'Projektovanje i dizajn',
    services: ['Idejna rješenja', 'Projekti za dozvolu', '3D vizualizacije', 'Nadzor nad izvođenjem'],
  },
  {
    name: 'Dizajn interijera', slug: 'dizajn-enterijera', seoSlug: 'dizajner-interijera',
    profession: 'Dizajner interijera', icon: SwatchBook,
    description: 'Uređenje interijera, izbor materijala, boja, namještaja i rasvjete',
    count: 0, priceRange: 'po dogovoru', priceNote: 'po prostoru/satu',
    group: 'Projektovanje i dizajn',
    services: ['Dizajn interijera', 'Izbor materijala', 'Raspored namještaja', 'Savjetovanje o bojama'],
  },
  {
    name: 'Dizajn eksterijera i pejzažna arhitektura', slug: 'dizajn-eksterijera', seoSlug: 'dizajn-eksterijera',
    profession: 'Pejzažni arhitekta', icon: TreePine,
    description: 'Uređenje dvorišta, vrtova, terasa, rasvjete, fontana i vanjske arhitekture',
    count: 0, priceRange: 'po dogovoru', priceNote: 'po projektu',
    group: 'Projektovanje i dizajn',
    services: ['Dizajn vrta', 'Uređenje terasa', 'Rasvjeta dvorišta', 'Fontane i elementi', 'Savjetovanje o biljkama'],
  },
  {
    name: 'Statika i stručni nadzor', slug: 'statika-i-nadzor', seoSlug: 'statika-nadzor',
    profession: 'Statičar / Stručni nadzornik', icon: Ruler,
    description: 'Proračun konstrukcija, statika, stručni nadzor nad građevinskim radovima i prijemi objekata',
    count: 0, priceRange: 'po dogovoru', priceNote: 'po projektu',
    group: 'Projektovanje i dizajn',
    services: ['Statički proračun', 'Stručni nadzor', 'Prijem objekata', 'Sanacija konstrukcija', 'Tehnička savjetovanja'],
  },
  {
    name: 'Energetska obnova i certifikacija', slug: 'energetska-obnova', seoSlug: 'energetska-obnova',
    profession: 'Energetski certifikator', icon: Sun,
    description: 'Energetska obnova stanova i kuća, izrada energetskih certifikata i savjetovanje o subvencijama',
    count: 0, priceRange: 'po dogovoru', priceNote: 'po objektu',
    group: 'Projektovanje i dizajn',
    services: ['Energetski certifikati', 'Termografija', 'Savjetovanje o subvencijama', 'Energetska obnova', 'Izolacija i stolarija'],
  },

  // Ostalo
  {
    name: 'Ostale usluge', slug: 'ostale-usluge', seoSlug: 'ostale-usluge',
    profession: 'Majstor za sve', icon: HelpCircle,
    description: 'Sastavljanje kreveta, vješanje TV-a, odnošenje frižidera: bilo šta',
    count: 0, priceRange: 'po dogovoru', priceNote: 'opširnije u poslu',
    group: 'Ostalo', noSeo: true,
    services: ['Sastavljanje namještaja', 'Vješanje TV-a i polica', 'Odnošenje starih stvari', 'Sitni popravci'],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
