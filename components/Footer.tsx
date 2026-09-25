import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowUpRight, ArrowRight, Apple, Play, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';
import { categories, cities, getCategory, getCategoryShortName } from '@/lib/data';
import { site } from '@/lib/site';

const footerLinks = {
  'Za klijente': [
    { name: 'Kako funkcioniše', href: '/kako-funkcionise/' },
    { name: 'Objavi posao', href: '/objavi-projekat/' },
    { name: 'Kategorije', href: '/kategorije/' },
    { name: 'Top firme', href: '/top-firme/' },
    { name: 'Blog', href: '/blog/' },
  ],
  'Za profesionalce': [
    { name: 'Registracija', href: '/registracija/' },
    { name: 'Paketi', href: '/za-firme/#cijene' },
    { name: 'Aktivni poslovi', href: '/poslovi/' },
    { name: 'Podrška (FAQ)', href: '/faq/' },
  ],
  'O nama': [
    { name: 'O platformi', href: '/o-nama/' },
    { name: 'Kontakt', href: '/kontakt/' },
    { name: 'Uslovi korištenja', href: '/uslovi-koristenja/' },
    { name: 'Politika privatnosti', href: '/privacy/' },
  ],
};

const topCategorySlugs = [
  'adaptacije',
  'auto-usluge',
  'vrtlarstvo',
  'betoniranje-i-armatura',
  'ciscenje',
  'elektroinstalacije',
  'izolacija',
  'keramicarski-radovi',
];

const popularCitySlugs = [
  'bihac',
  'cazin',
  'velika-kladusa',
  'sarajevo',
  'banja-luka',
  'mostar',
  'tuzla',
  'zenica',
];

const companyLinks = [
  { name: 'O nama', href: '/o-nama/' },
  { name: 'Kontakt', href: '/kontakt/' },
  { name: 'Uslovi korištenja', href: '/uslovi-koristenja/' },
  { name: 'Privatnost', href: '/privacy/' },
  { name: 'Česta pitanja', href: '/faq/' },
  { name: 'Blog', href: '/blog/' },
];

// TODO: zamijeniti pravim URL-ovima za Instagram, YouTube i LinkedIn kad stignu
const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/18X8fQ3FxZ/?mibextid=wwXlfr',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://www.facebook.com/share/18X8fQ3FxZ/?mibextid=wwXlfr',
    icon: Instagram,
  },
  {
    name: 'YouTube',
    href: 'https://www.facebook.com/share/18X8fQ3FxZ/?mibextid=wwXlfr',
    icon: Youtube,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.facebook.com/share/18X8fQ3FxZ/?mibextid=wwXlfr',
    icon: Linkedin,
  },
];

function BosniaFlag({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`${className} shrink-0`} role="img" aria-label="Zastava Bosne i Hercegovine">
      <defs>
        <clipPath id="bihFlagClip">
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <polygon
          id="bihStar"
          points="0,-2.1 0.49,-0.68 1.99,-0.65 0.8,0.26 1.23,1.7 0,0.84 -1.23,1.7 -0.8,0.26 -1.99,-0.65 -0.49,-0.68"
        />
      </defs>
      <g clipPath="url(#bihFlagClip)">
        <rect width="48" height="48" fill="#002395" />
        <polygon points="24,0 48,0 48,48" fill="#FECB00" />
        <use href="#bihStar" transform="translate(19.5,8)" fill="#ffffff" />
        <use href="#bihStar" transform="translate(22.5,13.5)" fill="#ffffff" />
        <use href="#bihStar" transform="translate(25.5,19)" fill="#ffffff" />
        <use href="#bihStar" transform="translate(28.5,24.5)" fill="#ffffff" />
        <use href="#bihStar" transform="translate(31.5,30)" fill="#ffffff" />
        <use href="#bihStar" transform="translate(34.5,35.5)" fill="#ffffff" />
        <use href="#bihStar" transform="translate(37.5,41)" fill="#ffffff" />
      </g>
    </svg>
  );
}

export default function Footer() {
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs'));
  const sortedCategories = [...categories]
    .filter((cat) => !cat.noSeo)
    .sort((a, b) => getCategoryShortName(a).localeCompare(getCategoryShortName(b), 'bs'));
  const topCategories = topCategorySlugs
    .map((slug) => getCategory(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const popularCities = popularCitySlugs
    .map((slug) => cities.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <footer className="bg-ink text-[#ffffff]">
      {/* Mobilni premium footer */}
      <div className="md:hidden px-4 pt-10 pb-8">
        {/* Direktorij */}
        <div className="grid grid-cols-[1fr_1.12fr_1fr] gap-3">
          <div>
            <Link
              href="/"
              className="inline-flex items-center origin-left scale-[0.68]"
              aria-label="Zaposli.ba početna"
            >
              <Logo variant="light" />
            </Link>
            <p className="text-slate-400 text-[10px] font-bold tracking-[0.18em] mt-4 leading-relaxed">
              BOLJI LJUDI.
              <br />
              BOLJI PROJEKTI.
            </p>
            <ul className="space-y-2 mt-4">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 text-[13px] hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l border-white/10 pl-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
              Najtraženije kategorije
            </h3>
            <ul className="space-y-2">
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategorije/${cat.slug}/`}
                    className="text-gray-100 text-[13px] leading-tight tracking-tight hover:text-brand-orange transition-colors"
                  >
                    {getCategoryShortName(cat)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/kategorije/"
              className="inline-flex items-center gap-1 text-brand-orange font-bold text-[13px] mt-3"
            >
              Sve kategorije
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="border-l border-white/10 pl-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
              Popularni gradovi
            </h3>
            <ul className="space-y-2">
              {popularCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/gradovi/${city.slug}/`}
                    className="text-gray-100 text-[13px] leading-tight tracking-tight hover:text-brand-orange transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/gradovi/"
              className="inline-flex items-center gap-1 text-brand-orange font-bold text-[13px] mt-3"
            >
              Svi gradovi
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Društvene mreže */}
        <div className="flex gap-2 mt-6 justify-center">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-brand-orange/50 hover:text-brand-orange transition-colors"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        <div className="h-px bg-white/10 my-6" />

        {/* Aplikacije + BiH */}
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full px-2.5 py-1">
            Uskoro dostupno
          </span>
          <div className="flex items-stretch gap-3 mt-2.5">
            <div className="flex-[1.4] flex flex-col gap-2">
              <div
                className="flex-1 flex items-center gap-1.5 bg-black border border-white/40 rounded-lg px-2.5 py-1.5"
                title="Uskoro dostupno"
                aria-label="App Store - uskoro dostupno"
              >
                <Apple className="w-5 h-5 shrink-0 text-white" />
                <span className="leading-tight">
                  <span className="block text-[8px] uppercase text-white/70">Preuzmite na</span>
                  <span className="block text-[13px] font-semibold text-white">App Store</span>
                </span>
              </div>
              <div
                className="flex-1 flex items-center gap-1.5 bg-black border border-white/40 rounded-lg px-2.5 py-1.5"
                title="Uskoro dostupno"
                aria-label="Google Play - uskoro dostupno"
              >
                <Play className="w-5 h-5 shrink-0 fill-current text-white" />
                <span className="leading-tight">
                  <span className="block text-[8px] uppercase text-white/70">Preuzmite na</span>
                  <span className="block text-[13px] font-semibold text-white">Google Play</span>
                </span>
              </div>
            </div>
            <div className="w-px bg-white/10" aria-hidden="true" />
            <div className="flex-1 flex items-center gap-2.5">
              <BosniaFlag className="w-9 h-9" />
              <p className="text-gray-400 text-xs leading-snug">
                Iz Bosne i Hercegovine.
                <br />
                Za pravi izbor.
              </p>
            </div>
          </div>
        </div>

        {/* Dno */}
        <div className="mt-8">
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{site.email}</span>
          </a>
          <p className="text-gray-600 text-xs mt-1.5 leading-relaxed">
            &copy; {new Date().getFullYear()} Zaposli.ba. Sva prava zadržana.
            <br />
            Powered by Luxari
          </p>
        </div>
      </div>

      {/* Glavni footer - desktop */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center mb-5">
              <Logo variant="light" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Platforma koja spaja klijente sa građevinskim firmama i majstorima u Bosni i Hercegovini.
            </p>
            <p className="text-brand-orange text-sm font-semibold italic">
              Majstor na pravom mjestu. Kad ti treba.
            </p>
          </div>

          {/* Link columns - navigacijski modul */}
          <div className="md:col-span-3 border-t border-[#ffffff]/5 md:border-t-0 pt-8 md:pt-0">
            <div className="grid grid-cols-3 gap-4 md:gap-0 md:divide-x md:divide-[#ffffff]/5">
              {Object.entries(footerLinks).map(([category, links], index) => (
                <div
                  key={category}
                  className={`text-center md:text-left ${index > 0 ? 'md:pl-8' : ''} ${index < Object.keys(footerLinks).length - 1 ? 'md:pr-8' : ''}`}
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500 mb-4">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-[#ffffff] text-[13px] leading-tight transition-colors inline-flex items-center justify-center md:justify-start gap-1 group"
                        >
                          <span>{link.name}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Direktorij: kategorije + gradovi (werkspot obrazac) - desktop */}
      <div className="hidden md:block border-t border-[#ffffff]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Majstori po kategorijama
              </h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                {sortedCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/kategorije/${cat.slug}/`} className="text-gray-400 hover:text-brand-orange text-sm leading-5 transition-colors">
                      {getCategoryShortName(cat)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Majstori po gradovima
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                {sortedCities.map((city) => (
                  <li key={city.slug}>
                    <Link href={`/gradovi/${city.slug}/`} className="text-gray-400 hover:text-brand-orange text-sm leading-5 transition-colors">
                      {city.name}
                    </Link>
                  </li>
              ))}
              </ul>

              {/* App sticker - desktop only, no glass frame, no animation */}
              <div className="hidden md:block mt-10 max-w-[460px] mx-auto">
                <Image
                  src="/images/hero-sticker.png"
                  alt="Uskoro i mobilna aplikacija Zaposli.ba"
                  width={460}
                  height={345}
                  className="w-full h-auto drop-shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar - desktop */}
      <div className="hidden md:block border-t border-[#ffffff]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
              <Mail className="w-4 h-4" />
              <span>{site.email}</span>
            </a>
            <p className="text-gray-600 text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} Zaposli.ba. Sva prava zadržana.
              <span className="block md:inline md:ml-1">
                Powered by Luxari
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
