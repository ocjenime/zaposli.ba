import type { LucideIcon } from 'lucide-react';
import {
  Hammer, Wrench, Home, Car, PaintRoller, Zap, Droplet, Leaf, Briefcase, LayoutGrid,
} from 'lucide-react';
import { getCategory, type Category } from './categories';

/**
 * Kanoničnih 10 grupa kategorija - isti nazivi, ikonice i sastav na
 * homepage baru, /kategorije/ listi i objavi-posao koracima (single source).
 *
 * Slugovi kategorija se NIKAD ne mijenjaju: firme, poslovi i SEO stranice
 * vezuju slugove, pa su sve postojeće potkategorije samo svrstane - nijedna
 * nije obrisana niti preimenovana.
 */
export interface CategoryGroup {
  /** stabilni slug grupe za anchore (npr. /kategorije/#grupa-gradevina) */
  slug: string;
  title: string;
  sub: string;
  Icon: LucideIcon;
  /** slugovi potkategorija koje pripadaju grupi */
  slugs: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: 'gradevina',
    title: 'Građevina',
    sub: 'Fasade, zidanje, adaptacije...',
    Icon: Hammer,
    slugs: ['gradjevinarstvo', 'zidarski-radovi', 'tesarski-radovi', 'betoniranje-i-armatura', 'zemljani-radovi', 'rusenje', 'krovopokrivanje', 'limarski-radovi', 'izolacija', 'hidroizolacija'],
  },
  {
    slug: 'popravke-montaza',
    title: 'Popravke i montaža',
    sub: 'Montaža, popravke, instalacije...',
    Icon: Wrench,
    slugs: ['stolarija', 'varilac', 'servis-aparata', 'sigurnost'],
  },
  {
    slug: 'dom-odrzavanje',
    title: 'Dom i održavanje',
    sub: 'Čišćenje, vrt, održavanje...',
    Icon: Home,
    slugs: ['ciscenje', 'pranje-fasada-i-krovova', 'dimnjacar', 'odrzavanje-zgrada'],
  },
  {
    slug: 'auto-transport',
    title: 'Auto i transport',
    sub: 'Prijevoz, selidbe, automehanika...',
    Icon: Car,
    slugs: ['auto-usluge', 'selidbe'],
  },
  {
    slug: 'adaptacije-uredenje',
    title: 'Adaptacije i uređenje',
    sub: 'Moleraj, keramika, podovi...',
    Icon: PaintRoller,
    slugs: ['molerski-radovi', 'masinsko-nabacivanje', 'gipsarski-radovi', 'zavrsni-radovi', 'tapetarski-radovi', 'keramicarski-radovi', 'podovi', 'tlakovi-estrih', 'staklar', 'kamen-i-poplocavanje', 'adaptacije', 'kupatila-kljuc-u-ruke', 'kuhinje-po-mjeri'],
  },
  {
    slug: 'elektricne-instalacije',
    title: 'Električne instalacije',
    sub: 'Električari, rasvjeta, smart home...',
    Icon: Zap,
    slugs: ['elektroinstalacije', 'tehnologija'],
  },
  {
    slug: 'voda-grijanje',
    title: 'Voda i grijanje',
    sub: 'Vodoinstalacije, grijanje, klima...',
    Icon: Droplet,
    slugs: ['vodoinstalacije', 'grijanje-i-hladjenje', 'plinske-instalacije', 'solarne-instalacije', 'kamin-i-peci'],
  },
  {
    slug: 'vrt-okucnica',
    title: 'Vrt i okućnica',
    sub: 'Košenje, sadnja, uređenje vrta...',
    Icon: Leaf,
    slugs: ['vrtlarstvo', 'pergole-nadstresnice-tende', 'bazeni-i-fontane', 'poplocavanje-dvorista-i-terasa', 'rusenje-stabala-drvoreda', 'ograde'],
  },
  {
    slug: 'poslovne-usluge',
    title: 'Poslovne usluge',
    sub: 'IT, marketing, dizajn...',
    Icon: Briefcase,
    slugs: ['projektovanje-i-arhitektura', 'dizajn-enterijera', 'dizajn-eksterijera', 'statika-i-nadzor', 'energetska-obnova'],
  },
  {
    slug: 'ostalo',
    title: 'Ostalo',
    sub: 'Ostale usluge...',
    Icon: LayoutGrid,
    slugs: ['ostale-usluge', 'hitne-intervencije'],
  },
];

/** Riješene potkategorije grupe (postojećim imenima, nepoznati slugovi se preskaču). */
export function getGroupCategories(group: CategoryGroup): Category[] {
  return group.slugs
    .map((slug) => getCategory(slug))
    .filter((c): c is Category => Boolean(c));
}

/** Indeks grupe koja sadrži kategoriju sa datim slugom (za prefill/selekciju). */
export function findGroupIndexForSlug(slug: string): number | null {
  const idx = CATEGORY_GROUPS.findIndex((g) => g.slugs.includes(slug));
  return idx >= 0 ? idx : null;
}
