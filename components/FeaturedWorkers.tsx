import { Star, MapPin, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

const workers = [
  {
    name: 'Edin Kovačević',
    specialty: 'Vodoinstalater',
    rating: 4.9,
    reviews: 127,
    location: 'Sarajevo',
    verified: true,
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    projects: 340,
    initial: 'EK',
  },
  {
    name: 'Nikola Begić',
    specialty: 'Električar',
    rating: 4.8,
    reviews: 98,
    location: 'Banja Luka',
    verified: true,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    projects: 215,
    initial: 'NB',
  },
  {
    name: 'Samir Hasković',
    specialty: 'Keramičar',
    rating: 5.0,
    reviews: 203,
    location: 'Tuzla',
    verified: true,
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    projects: 480,
    initial: 'SH',
  },
  {
    name: 'Mirza Delalić',
    specialty: 'Fasader',
    rating: 4.7,
    reviews: 85,
    location: 'Mostar',
    verified: true,
    gradient: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    projects: 190,
    initial: 'MD',
  },
  {
    name: 'Ante Milić',
    specialty: 'Krovopokrivač',
    rating: 4.9,
    reviews: 156,
    location: 'Zenica',
    verified: true,
    gradient: 'from-rose-500 to-rose-700',
    bg: 'bg-rose-50',
    projects: 310,
    initial: 'AM',
  },
];

export default function FeaturedWorkers() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-50 rounded-full opacity-60 blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full opacity-60 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-semibold mb-4">
            Naši najbolji
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Izdvojeni majstori
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Provjereni profesionalci sa najboljim ocjenama na našoj platformi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {workers.map((worker) => (
            <div
              key={worker.name}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 text-center cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${worker.gradient} flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {worker.initial}
              </div>

              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{worker.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{worker.specialty}</p>

              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 text-brand-amber fill-brand-amber" />
                <span className="text-sm font-bold text-gray-900">{worker.rating}</span>
                <span className="text-xs text-gray-400">({worker.reviews})</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-3">
                <MapPin className="w-3 h-3" />
                <span>{worker.location}</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1 mx-auto">
                <BadgeCheck className="w-3 h-3" />
                <span className="font-medium">{worker.projects} projekata</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategorije/"
            className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors group"
          >
            Pogledajte sve majstore
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}