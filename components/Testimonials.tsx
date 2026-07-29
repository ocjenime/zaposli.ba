import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Amir Hadžić',
    role: 'Vlasnik kuće, Sarajevo',
    content: 'Zaposli.ba mi je pomogao da pronađem odličnog majstora za adaptaciju kupatila. Proces je bio jednostavan, a ponude koje sam dobio bile su vrlo konkurentne.',
    rating: 5,
    avatar: 'AH',
  },
  {
    id: 2,
    name: 'Jelena Marić',
    role: 'Investitorica, Banja Luka',
    content: 'Kao investitor, redovno tražim izvođače radova. Zaposli.ba mi je uštedio mnogo vremena jer na jednom mjestu mogu pronaći sve firme sa recenzijama.',
    rating: 5,
    avatar: 'JM',
  },
  {
    id: 3,
    name: 'Marko Petrović',
    role: 'Vlasnik firme, Tuzla',
    content: 'Otkad sam registrovao firmu na Zaposli.ba, dobijam redovno nove poslove. Sistem recenzija mi pomaže da se istaknem od konkurencije.',
    rating: 5,
    avatar: 'MP',
  },
  {
    id: 4,
    name: 'Fatima Kadić',
    role: 'Vlasnica stana, Mostar',
    content: 'Trebala sam hitno vodoinstalatera. Preko Zaposli.ba sam u roku od sat vremena imala 3 ponude. Fenomenalno iskustvo!',
    rating: 5,
    avatar: 'FK',
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

              <Quote className="w-8 h-8 text-primary-100 mb-3" />

              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-brand-orange fill-brand-orange' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              <p className="text-steel text-sm mb-6 leading-relaxed line-clamp-4">{t.content}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink-800 to-ink flex items-center justify-center text-brand-orange font-bold text-xs shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm">{t.name}</div>
                  <div className="text-xs text-steel">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}