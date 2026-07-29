import Link from 'next/link';
import { Siren, ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

export default function EmergencySection() {
  const cat = categories.find((c) => c.slug === 'hitne-intervencije');
  if (!cat) return null;

  return (
    <section className="relative bg-ink overflow-hidden">
      {/* Diskretan crveni sjaj */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-72 h-72 bg-red-600/15 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 md:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Identitet */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/25">
              <Siren className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-extrabold leading-tight">Hitne intervencije</h2>
                <span className="inline-flex items-center gap-1 bg-red-600/20 border border-red-500/30 text-red-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
                  24/7
                </span>
              </div>
              <p className="text-white/50 text-sm truncate">
                Pukla cijev ili zaključana vrata — majstor dolazi odmah.
              </p>
            </div>
          </div>

          {/* Akcije */}
          <div className="flex items-center gap-4 sm:ml-auto shrink-0">
            <Link
              href={`/kategorije/${cat.slug}/`}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors hidden sm:block"
            >
              Sve hitne usluge
            </Link>
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-red-600/25 transition-all active:scale-95"
            >
              Objavi hitan posao
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
