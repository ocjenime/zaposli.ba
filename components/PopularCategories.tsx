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
  {
    name: 'Građevinarstvo',
    slug: 'gradjevinarstvo',
    icon: BrickWall,
    count: 850,
    gradient: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-50',
  },
  {
    name: 'Vodoinstalacije',
    slug: 'vodoinstalacije',
    icon: Droplets,
    count: 620,
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Elektroinstalacije',
    slug: 'elektroinstalacije',
    icon: Zap,
    count: 540,
    gradient: 'from-yellow-400 to-amber-600',
    bg: 'bg-amber-50',
  },
  {
    name: 'Slikanje',
    slug: 'slikanje',
    icon: Paintbrush,
    count: 480,
    gradient: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
  },
  {
    name: 'Krovopokrivanje',
    slug: 'krovopokrivanje',
    icon: Home,
    count: 390,
    gradient: 'from-red-400 to-red-600',
    bg: 'bg-red-50',
  },
  {
    name: 'Tilerski radovi',
    slug: 'tilerski-radovi',
    icon: Hammer,
    count: 420,
    gradient: 'from-teal-400 to-teal-600',
    bg: 'bg-teal-50',
  },
  {
    name: 'Vrtlarstvo',
    slug: 'vrtlarstvo',
    icon: TreePine,
    count: 350,
    gradient: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    name: 'Adaptacije',
    slug: 'adaptacije',
    icon: Home,
    count: 720,
    gradient: 'from-indigo-400 to-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    name: 'Demoliranje',
    slug: 'demoliranje',
    icon: Shovel,
    count: 180,
    gradient: 'from-slate-400 to-slate-600',
    bg: 'bg-slate-50',
  },
  {
    name: 'Alat i oprema',
    slug: 'alat-i-oprema',
    icon: Wrench,
    count: 290,
    gradient: 'from-pink-400 to-pink-600',
    bg: 'bg-pink-50',
  },
];

export default function PopularCategories() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-100 to-orange-100 rounded-full opacity-30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
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
              href={`/kategorije/`}
              className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${category.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7 text-gray-700 group-hover:text-gray-900" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
              <p className="text-xs text-gray-400">{category.count} firmi</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategorije/"
            className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors group"
          >
            Pogledajte sve kategorije
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}