import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { categories, cities } from '@/lib/data';
import { site } from '@/lib/site';

const footerLinks = {
  'Za klijente': [
    { name: 'Kako radi', href: '/kako-radi/' },
    { name: 'Objavi posao', href: '/objavi-projekat/' },
    { name: 'Kategorije', href: '/kategorije/' },
    { name: 'Izdvojeni majstori', href: '/izdvojeni-majstori/' },
    { name: 'Savjeti', href: '/savjeti/' },
  ],
  'Za firme': [
    { name: 'Registracija', href: '/registracija/' },
    { name: 'Premium paketi', href: '/za-firme/' },
    { name: 'Aktivni poslovi', href: '/poslovi/' },
    { name: 'Podrška (FAQ)', href: '/faq/' },
  ],
  'O nama': [
    { name: 'O platformi', href: '/o-nama/' },
    { name: 'Kontakt', href: '/kontakt/' },
    { name: 'Uslovi korištenja', href: '/uslovi-koristenja/' },
    { name: 'Privacy policy', href: '/privacy/' },
  ],
};

export default function Footer() {
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs'));

  return (
    <footer className="bg-ink text-[#ffffff]">
      {/* Glavni footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
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

          {/* Link columns — navigacijski modul */}
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

      {/* Direktorij: kategorije + gradovi (werkspot obrazac) */}
      <div className="border-t border-[#ffffff]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Majstori po kategorijama
              </h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                {categories.filter((cat) => !cat.noSeo).map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/kategorije/${cat.slug}/`} className="text-gray-400 hover:text-brand-orange text-sm transition-colors">
                      {cat.name}
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
                    <Link href={`/gradovi/${city.slug}/`} className="text-gray-400 hover:text-brand-orange text-sm transition-colors">
                      {city.name}
                    </Link>
                  </li>
              ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#ffffff]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{site.email}</span>
              </div>
              {site.phone && (
                <>
                  <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{site.phone}</span>
                  </div>
                </>
              )}
              <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{site.city}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Zaposli.ba. Sva prava zadržana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
