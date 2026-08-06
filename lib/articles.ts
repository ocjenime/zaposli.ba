export interface ArticleMeta {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
}

export const articles: ArticleMeta[] = [
  {
    slug: 'cijena-adaptacije-kupatila',
    category: 'Cijene',
    title: 'Koliko košta adaptacija kupatila u 2026?',
    excerpt:
      'Detaljan prikaz cijena adaptacije kupatila u BiH: od demontaže i instalacija do keramike i sanitarija, sa realnim rasponima u KM.',
    readTime: '6 min čitanja',
    date: '15. juli 2026.',
  },
  {
    slug: 'kako-provjeriti-majstora',
    category: 'Vodiči',
    title: 'Kako provjeriti majstora prije nego što mu date avans',
    excerpt:
      'Praktična kontrolna lista: registracija firme, recenzije, fotografije radova, ugovor i pravila sigurnog plaćanja po fazama.',
    readTime: '5 min čitanja',
    date: '10. juli 2026.',
  },
  {
    slug: 'cijena-fasade-po-m2',
    category: 'Cijene',
    title: 'Cijena fasade po m² u BiH: vodič za 2026.',
    excerpt:
      'Stiropor ili kamena vuna? Koliko košta fasada po kvadratu, šta ulazi u cijenu i koje greške najviše poskupljuju radove.',
    readTime: '6 min čitanja',
    date: '5. juli 2026.',
  },
  {
    slug: 'cijena-molerskih-radova-po-m2',
    category: 'Cijene',
    title: 'Cijena molerskih radova po m² u BiH 2026',
    excerpt:
      'Koliko košta krečenje i farbanje po m² u BiH 2026: cijene radova, materijala, faktori koji utiču na cijenu i savjeti za uštedu.',
    readTime: '5 min čitanja',
    date: '20. juli 2026.',
  },
  {
    slug: 'cijena-keramike-po-m2',
    category: 'Cijene',
    title: 'Cijena keramičarskih radova po m² u BiH 2026',
    excerpt:
      'Koliko košta postavljanje pločica po m² u BiH 2026: cijene radova, uticaj formata pločica, priprema podloge i najčešće greške.',
    readTime: '6 min čitanja',
    date: '22. juli 2026.',
  },
  {
    slug: 'adaptacija-stana-50-m2',
    category: 'Cijene',
    title: 'Koliko košta adaptacija stana od 50 m² u BiH 2026',
    excerpt:
      'Kompletna adaptacija stana od 50 m² u BiH: cijene po fazama, šta uključuje i kako planirati budžet bez skrivenih troškova.',
    readTime: '7 min čitanja',
    date: '25. juli 2026.',
  },
  {
    slug: 'hitne-intervencije-cijene',
    category: 'Cijene',
    title: 'Cijene hitnih majstorskih intervencija u BiH 2026',
    excerpt:
      'Cijene hitnih intervencija - vodoinstalater, električar, bravar - po satnici i po dolasku u BiH 2026.',
    readTime: '5 min čitanja',
    date: '27. juli 2026.',
  },
  {
    slug: 'kako-napisati-oglas-za-posao',
    category: 'Savjeti',
    title: 'Kako napisati oglas za posao koji privlači majstore',
    excerpt:
      'Napišite jasan oglas za majstora i dobijte više kvalitetnih ponuda. Primjer dobro napisanog oglasa i lista grešaka koje izbjegavati.',
    readTime: '4 min čitanja',
    date: '28. juli 2026.',
  },
];

export function getArticleMeta(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}
