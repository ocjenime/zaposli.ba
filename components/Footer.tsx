import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import Logo from '@/components/Logo';

const footerLinks = {
  'Za kupce': [
    { name: 'Kako radi', href: '/kako-radi/' },
    { name: 'Objavi projekat', href: '/objavi-projekat/' },
    { name: 'Pronađi firmu', href: '/kategorije/' },
    { name: 'Savjeti', href: '/savjeti/' },
  ],
  'Za firme': [
    { name: 'Registracija', href: '/registracija/' },
    { name: 'Premium paketi', href: '/za-firme/' },
    { name: 'Aktivni projekti', href: '/projekti/' },
    { name: 'Podrška (FAQ)', href: '/faq/' },
  ],
  'O nama': [
    { name: 'O platformi', href: '/o-nama/' },
    { name: 'Kontakt', href: '/kontakt/' },
    { name: 'Uslovi korištenja', href: '/uslovi-koristenja/' },
    { name: 'Privacy policy', href: '/privacy/' },
  ],
  'Gradovi': [
    { name: 'Sarajevo', href: '/usluge/vodoinstalater-sarajevo/' },
    { name: 'Banja Luka', href: '/usluge/vodoinstalater-banja-luka/' },
    { name: 'Tuzla', href: '/usluge/keramicar-tuzla/' },
    { name: 'Mostar', href: '/usluge/izolacija-fasade-mostar/' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-5">
              <Logo variant="light" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Platforma koja spaja kupce sa građevinskim firmama i zanatlijama u Bosni i Hercegovini.
            </p>
            <p className="text-brand-orange text-sm font-semibold italic">
              Majstor na pravom mjestu. Kad ti treba.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group">
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@zaposli.ba</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+387 61 123 456</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Sarajevo, Bosna i Hercegovina</span>
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