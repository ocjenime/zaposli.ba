import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Hammer,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  TreePine,
  Home,
  BrickWall,
  Roofing,
  Shovel,
  Thermometer,
  Wind,
  Sun,
  Shield,
  Building,
} from 'lucide-react';

const categories = [
  {
    name: 'Građevinarstvo',
    slug: 'gradjevinarstvo',
    icon: BrickWall,
    description: 'Temelji, konstrukcije, zidarski radovi, betoniranje',
    count: 850,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    name: 'Vodoinstalacije',
    slug: 'vodoinstalacije',
    icon: Droplets,
    description: 'Instalacije vode, kanalizacije, sanitarije',
    count: 620,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    name: 'Elektroinstalacije',
    slug: 'elektroinstalacije',
    icon: Zap,
    description: 'Rasvjeta, struja, automatske sklopke',
    count: 540,
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  },
  {
    name: 'Slikanje',
    slug: 'slikanje',
    icon: Paintbrush,
    description: 'Slikanje zidova, fasada, dekorativno slikanje',
    count: 480,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    name: 'Krovopokrivanje',
    slug: 'krovopokrivanje',
    icon: Roofing,
    description: 'Izrada i popravke krovova, oluci, hidroizolacija',
    count: 390,
    color: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    name: 'Tilerski radovi',
    slug: 'tilerski-radovi',
    icon: Hammer,
    description: 'Postavljanje keramike, laminata, parketa',
    count: 420,
    color: 'bg-teal-50 text-teal-600 border-teal-200',
  },
  {
    name: 'Vrtlarstvo',
    slug: 'vrtlarstvo',
    icon: TreePine,
    description: 'Održavanje bašta, sadnja, uređenje okoliša',
    count: 350,
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    name: 'Adaptacije',
    slug: 'adaptacije',
    icon: Home,
    description: 'Kompletne adaptacije stanova i kuća',
    count: 720,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    name: 'Demoliranje',
    slug: 'demoliranje',
    icon: Shovel,
    description: 'Rušenje, odvoz šuta, čišćenje gradilišta',
    count: 180,
    color: 'bg-gray-50 text-gray-600 border-gray-200',
  },
  {
    name: 'Grijanje i hlađenje',
    slug: 'grijanje-i-hladjenje',
    icon: Thermometer,
    description: 'Centralno grijanje, klimatizacija, toplotne pumpe',
    count: 310,
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    name: 'Izolacija',
    slug: 'izolacija',
    icon: Shield,
    description: 'Termo izolacija, zvučna izolacija, hidroizolacija',
    count: 280,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    name: 'Stolarija',
    slug: 'stolarija',
    icon: Wind,
    description: 'Prozori, vrata, namještaj po mjeri',
    count: 260,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Kategorije usluga</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Pronađite majstore za sve vrste građevinskih i zanatskih radova u Bosni i Hercegovini
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/kategorija/${category.slug}`}
                  className={`card-hover border-2 ${category.color} group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <category.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <p className="text-sm font-medium text-primary-600">{category.count} firmi</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ne pronalazite traženu kategoriju?</h2>
            <p className="text-gray-600 mb-6">Objavite projekat i opišite šta vam je potrebno. Majstori će vam se javiti sa ponudama.</p>
            <Link href="/objavi-projekat" className="btn-primary">
              Objavi projekat
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}