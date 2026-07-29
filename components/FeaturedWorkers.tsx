import { Star, MapPin, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

import { workers } from '@/lib/data';

export default function FeaturedWorkers() {
  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-50 rounded-full opacity-60 blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cloud rounded-full opacity-80 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
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
            <Link
              key={worker.name}
              href={`/firma/${worker.id}/`}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 text-center cursor-pointer block"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-extrabold text-xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {worker.initial}
              </div>

              <h3 className="font-bold text-ink text-sm mb-0.5">{worker.name}</h3>
              <p className="text-xs text-steel mb-3">{worker.specialty}</p>

              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                <span className="text-sm font-bold text-ink">{worker.rating}</span>
                <span className="text-xs text-steel">({worker.reviews})</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-steel mb-3">
                <MapPin className="w-3 h-3" />
                <span>{worker.location}</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-brand-orange bg-primary-50 rounded-lg px-2 py-1 mx-auto">
                <BadgeCheck className="w-3 h-3" />
                <span className="font-medium">{worker.projects} poslova</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategorije/"
            className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors group"
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