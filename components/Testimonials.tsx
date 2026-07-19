import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Amir Hadžić',
    role: 'Vlasnik kuće, Sarajevo',
    content: 'Zaposli.ba mi je pomogao da pronađem odličnog majstora za adaptaciju kupatila. Proces je bio jednostavan, a ponude koje sam dobio bile su vrlo konkurentne. Preporučujem svima!',
    rating: 5,
    avatar: 'AH',
  },
  {
    id: 2,
    name: 'Jelena Marić',
    role: 'Investitorica, Banja Luka',
    content: 'Kao investitor, redovno tražim izvođače radova. Zaposli.ba mi je uštedio mnogo vremena jer na jednom mjestu mogu pronaći sve firme sa recenzijama i cijenama. Odlična platforma!',
    rating: 5,
    avatar: 'JM',
  },
  {
    id: 3,
    name: 'Marko Petrović',
    role: 'Vlasnik građevinske firme, Tuzla',
    content: 'Otkad sam registrovao firmu na Zaposli.ba, dobijam redovno nove projekte. Platforma je profesionalna, a sistem recenzija mi pomaže da se istaknem od konkurencije.',
    rating: 5,
    avatar: 'MP',
  },
  {
    id: 4,
    name: 'Fatima Kadić',
    role: 'Vlasnica stana, Mostar',
    content: 'Trebala sam hitno vodoinstalatera. Preko Zaposli.ba sam u roku od sat vremena imala 3 ponude. Odabrala sam najbolju i majstor je došao isti dan. Fenomenalno!',
    rating: 5,
    avatar: 'FK',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Šta kažu naši korisnici?</h2>
          <p className="section-subtitle">
            Hiljade zadovoljnih kupaca i firmi koriste Zaposli.ba svaki dan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-200" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-gray-600 text-sm mb-6 line-clamp-4">{testimonial.content}</p>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}