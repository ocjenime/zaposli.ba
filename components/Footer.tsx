import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  'Za kupce': [
    { name: 'Kako radi', href: '/kako-radi' },
    { name: 'Objavi projekat', href: '/objavi-projekat' },
    { name: 'Pronađi firmu', href: '/kategorije' },
    { name: ' Savjeti', href: '/savjeti' },
  ],
  'Za firme': [
    { name: 'Registracija', href: '/registracija-firme' },
    { name: 'Premium paketi', href: '/premium' },
    { name: 'Uspjeh na platformi', href: '/uspjeh' },
    { name: 'Podrška', href: '/podrska' },
  ],
  'O nama': [
    { name: 'O platformi', href: '/o-nama' },
    { name: 'Kontakt', href: '/kontakt' },
    { name: 'Uslovi korištenja', href: '/uslovi' },
    { name: 'Privacy policy', href: '/privacy' },
  ],
  'Gradovi': [
    { name: 'Sarajevo', href: '/grad/sarajevo' },
    { name: 'Banja Luka', href: '/grad/banja-luka' },
    { name: 'Tuzla', href: '/grad/tuzla' },
    { name: 'Mostar', href: '/grad/mostar' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-xl font-bold">
                Zaposli<span className="text-primary-400">.ba</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Platforma koja spaja kupce sa građevinskim firmama i zanatlijama u Bosni i Hercegovini.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@gradjevinskioglasi.ba</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+387 61 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Sarajevo, Bosna i Hercegovina</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Zaposli.ba. Sva prava zadržana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}