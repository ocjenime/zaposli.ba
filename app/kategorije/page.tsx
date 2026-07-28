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
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Vodoinstalacije',
    slug: 'vodoinstalacije',
    icon: Droplets,
    description: 'Instalacije vode, kanalizacije, sanitarije',
    count: 620,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Elektroinstalacije',
    slug: 'elektroinstalacije',
    icon: Zap,
    description: 'Rasvjeta, struja, automatske sklopke',
    count: 540,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Slikanje',
    slug: 'slikanje',
    icon: Paintbrush,
    description: 'Slikanje zidova, fasada, dekorativno slikanje',
    count: 480,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Krovopokrivanje',
    slug: 'krovopokrivanje',
    icon: Home,
    description: 'Izrada i popravke krovova, oluci, hidroizolacija',
    count: 390,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Tilerski radovi',
    slug: 'tilerski-radovi',
    icon: Hammer,
    description: 'Postavljanje keramike, laminata, parketa',
    count: 420,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Vrtlarstvo',
    slug: 'vrtlarstvo',
    icon: TreePine,
    description: 'Održavanje bašta, sadnja, uređenje okoliša',
    count: 350,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Adaptacije',
    slug: 'adaptacije',
    icon: Home,
    description: 'Kompletne adaptacije stanova i kuća',
    count: 720,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Demoliranje',
    slug: 'demoliranje',
    icon: Shovel,
    description: 'Rušenje, odvoz šuta, čišćenje gradilišta',
    count: 180,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Grijanje i hlađenje',
    slug: 'grijanje-i-hladjenje',
    icon: Thermometer,
    description: 'Centralno grijanje, klimatizacija, toplotne pumpe',
    count: 310,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Izolacija',
    slug: 'izolacija',
    icon: Shield,
    description: 'Termo izolacija, zvučna izolacija, hidroizolacija',
    count: 280,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
  {
    name: 'Stolarija',
    slug: 'stolarija',
    icon: Wind,
    description: 'Prozori, vrata, namještaj po mjeri',
    count: 260,
    color: 'bg-white text-ink border-gray-100 hover:border-brand-orange/40',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-hero py-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Kategorije usluga</h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
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
                  className={`card-hover rounded-2xl p-6 border-2 ${category.color} group transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <category.icon className="w-7 h-7 text-brand-orange" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-ink mb-1 group-hover:text-brand-orange transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm text-steel mb-2">{category.description}</p>
                      <p className="text-sm font-medium text-brand-orange">{category.count} firmi</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Ne pronalazite traženu kategoriju?</h2>
            <p className="text-steel mb-6">Objavite projekat i opišite šta vam je potrebno. Majstori će vam se javiti sa ponudama.</p>
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