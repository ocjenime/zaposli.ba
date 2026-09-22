/**
 * Slika za hero sekciju usluge/kategorije.
 * Mapira slug kategorije na postojeću stock fotografiju, fallback na glavni hero.
 */
export function getServiceImage(catSlug: string): string {
  const map: Record<string, string> = {
    'keramicarski-radovi': '/images/kuhinja-renovacija.webp',
    'molerski-radovi': '/images/farbanje-zid.webp',
    'masinsko-nabacivanje': '/images/farbanje-zid.webp',
    'gipsarski-radovi': '/images/farbanje-zid.webp',
    'zavrsni-radovi': '/images/farbanje-zid.webp',
    'tapetarski-radovi': '/images/farbanje-zid.webp',
    vodoinstalacije: '/images/vodoinstalater.webp',
    elektroinstalacije: '/images/elektricar.webp',
    'hitne-intervencije': '/images/elektricar.webp',
    ciscenje: '/images/ciscenje.webp',
    'pranje-fasada-i-krovova': '/images/ciscenje.webp',
    'kuhinje-po-mjeri': '/images/kuhinja-renovacija.webp',
    adaptacije: '/images/kuhinja-renovacija.webp',
    'kupatila-kljuc-u-ruke': '/images/kuhinja-renovacija.webp',
    stolarija: '/images/renovacija-enterijer.webp',
    podovi: '/images/renovacija-enterijer.webp',
    'tlakovi-estrih': '/images/renovacija-enterijer.webp',
  };
  return map[catSlug] || '/images/herozaposli.png';
}
