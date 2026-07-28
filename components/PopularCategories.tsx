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
  ArrowRight,
} from 'lucide-react';

const categories = [
  { name: 'Građevinarstvo', slug: 'gradjevinarstvo', icon: BrickWall, count: 850 },
  { name: 'Vodoinstalacije', slug: 'vodoinstalacije', icon: Droplets, count: 620 },
  { name: 'Elektroinstalacije', slug: 'elektroinstalacije', icon: Zap, count: 540 },
  { name: 'Slikanje', slug: 'slikanje', icon: Paintbrush, count: 480 },
  { name: 'Krovopokrivanje', slug: 'krovopokrivanje', icon: Home, count: 390 },
  { name: 'Tilerski radovi', slug: 'tilerski-radovi', icon: Hammer, count: 420 },
  { name: 'Vrtlarstvo', slug: 'vrtlarstvo', icon: TreePine, count: 350 },
  { name: 'Adaptacije', slug: 'adaptacije', icon: Home, count: 720 },
  { name: 'Demoliranje', slug: 'demoliranje', icon: Shovel, count: 180 },
  { name: 'Alat i oprema', slug: 'alat-i-oprema', icon: Wrench, count: 290 },
];

export default function PopularCategories() {
  return (
    <section className="py-14 md:py-20 bg-cloud relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-100 to-orange-100 rounded-full opacity-30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
            Istražite kategorije
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Popularne kategorije
          </h2>
          <p className="text-lg text-gray-500">
            Pronađite majstore za sve vrste građevinskih i zanatskih radova
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/kategorije/${category.slug}/`}
              className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-4 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-brand-orange group-hover:to-brand-orange-dark transition-all duration-300">
                <category.icon className="w-7 h-7 text-brand-orange group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-ink mb-1 text-sm">{category.name}</h3>
              <p className="text-xs text-steel">{category.count} firmi</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategorije/"
            className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors group"
          >
            Pogledajte sve kategorije
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}