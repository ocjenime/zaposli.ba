import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

// Izbor za homepage: izvodi se iz lib/data (single source of truth)
const featuredSlugs = [
  'gradjevinarstvo',
  'adaptacije',
  'vodoinstalacije',
  'elektroinstalacije',
  'molerski-radovi',
  'keramicarski-radovi',
  'krovopokrivanje',
  'hitne-intervencije',
  'ciscenje',
  'selidbe',
];

const popular = featuredSlugs.flatMap((slug) => {
  const cat = categories.find((c) => c.slug === slug);
  return cat ? [cat] : [];
});

export default function PopularCategories() {
  return (
    <section className="py-10 md:py-14 bg-cloud relative overflow-hidden">
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
            Pronađite majstore za sve vrste usluga: od građevine do čišćenja i selidbi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {popular.map((category) => (
            <Link
              key={category.slug}
              href={`/kategorije/${category.slug}/`}
              className={`group bg-white rounded-2xl p-6 text-center border hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${
                category.featured ? 'border-red-200' : 'border-gray-100'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${
                category.featured ? 'from-red-600 to-red-700' : 'from-brand-orange to-brand-orange-dark'
              }`} />

              {category.featured && (
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-red-600 text-[#ffffff] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  24/7
                </span>
              )}

              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300 ${
                category.featured
                  ? 'bg-red-50 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-red-700'
                  : 'bg-primary-50 group-hover:bg-gradient-to-br group-hover:from-brand-orange group-hover:to-brand-orange-dark'
              }`}>
                <category.icon className={`w-7 h-7 group-hover:text-[#ffffff] transition-colors duration-300 ${
                  category.featured ? 'text-red-600' : 'text-brand-orange'
                }`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
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
