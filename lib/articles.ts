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
];

export function getArticleMeta(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}
