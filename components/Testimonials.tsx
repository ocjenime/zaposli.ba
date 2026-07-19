import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Amir Hadžić',
    role: 'Vlasnik kuće, Sarajevo',
    content: 'Zaposli.ba mi je pomogao da pronađem odličnog majstora za adaptaciju kupatila. Proces je bio jednostavan, a ponude koje sam dobio bile su vrlo konkurentne.',
    rating: 5,
    avatar: 'AH',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'Jelena Marić',
    role: 'Investitorica, Banja Luka',
    content: 'Kao investitor, redovno tražim izvođače radova. Zaposli.ba mi je uštedio mnogo vremena jer na jednom mjestu mogu pronaći sve firme sa recenzijama.',
    rating: 5,
    avatar: 'JM',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    id: 3,
    name: 'Marko Petrović',
    role: 'Vlasnik firme, Tuzla',
    content: 'Otkad sam registrovao firmu na Zaposli.ba, dobijam redovno nove projekte. Sistem recenzija mi pomaže da se istaknem od konkurencije.',
    rating: 5,
    avatar: 'MP',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 4,
    name: 'Fatima Kadić',
    role: 'Vlasnica stana, Mostar',
    content: 'Trebala sam hitno vodoinstalatera. Preko Zaposli.ba sam u roku od sat vremena imala 3 ponude. Fenomenalno iskustvo!',
    rating: 5,
    avatar: 'FK',
    gradient: 'from-brand-orange to-brand-red',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-semibold mb-4">
            Naši korisnici
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Šta kažu naši korisnici?
          </h2>
          <p className="text-lg text-gray-500">
            Hiljade zadovoljnih kupaca i firmi koriste Zaposli.ba svaki dan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-amber to-brand-orange opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

              <Quote className="w-8 h-8 text-gray-200 mb-3" />

              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-brand-amber fill-brand-amber' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-4">{t.content}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.gradient} flex items-center justify-center text-white font-semibold text-xs shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}