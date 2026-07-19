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
} from 'lucide-react';

const categories = [
  {
    name: 'Građevinarstvo',
    slug: 'gradjevinarstvo',
    icon: BrickWall,
    count: 850,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    name: 'Vodoinstalacije',
    slug: 'vodoinstalacije',
    icon: Droplets,
    count: 620,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Elektroinstalacije',
    slug: 'elektroinstalacije',
    icon: Zap,
    count: 540,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    name: 'Slikanje',
    slug: 'slikanje',
    icon: Paintbrush,
    count: 480,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    name: 'Krovopokrivanje',
    slug: 'krovopokrivanje',
    icon: Home,
    count: 390,
    color: 'bg-red-50 text-red-600',
  },
  {
    name: 'Tilerski radovi',
    slug: 'tilerski-radovi',
    icon: Hammer,
    count: 420,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    name: 'Vrtlarstvo',
    slug: 'vrtlarstvo',
    icon: TreePine,
    count: 350,
    color: 'bg-green-50 text-green-600',
  },
  {
    name: 'Adaptacije',
    slug: 'adaptacije',
    icon: Home,
    count: 720,
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    name: 'Demoliranje',
    slug: 'demoliranje',
    icon: Shovel,
    count: 180,
    color: 'bg-gray-50 text-gray-600',
  },
  {
    name: 'Alat i oprema',
    slug: 'alat-i-oprema',
    icon: Wrench,
    count: 290,
    color: 'bg-pink-50 text-pink-600',
  },
];

export default function PopularCategories() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Popularne kategorije</h2>
          <p className="section-subtitle">
            Pronađite majstore za sve vrste građevinskih i zanatskih radova
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/kategorija/${category.slug}`}
              className="category-card p-6 text-center"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${category.color} mb-4 category-icon`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} firmi</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/kategorije"
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Pogledajte sve kategorije
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}