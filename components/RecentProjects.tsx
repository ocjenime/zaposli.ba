import Link from 'next/link';
import { MapPin, Clock, BadgeCheck, ArrowRight, TrendingUp } from 'lucide-react';

const recentProjects = [
  {
    id: 1,
    title: 'Adaptacija kupatila - kompletan renovis',
    category: 'Vodoinstalacije',
    catColor: 'bg-blue-50 text-blue-600',
    location: 'Sarajevo - Centar',
    budget: '2,000 - 3,500 KM',
    deadline: 'Do 15.08.2026',
    bids: 8,
    description: 'Potrebna adaptacija kupatila u stanu od 60m2. Uključuje demontažu stare keramike, nove vodoinstalacije, postavljanje keramike i sanitarije.',
    timeAgo: 'Prije 2 sata',
  },
  {
    id: 2,
    title: 'Postavljanje laminata u dnevnom boravku',
    category: 'Tilerski radovi',
    catColor: 'bg-teal-50 text-teal-600',
    location: 'Banja Luka - Centar',
    budget: '800 - 1,200 KM',
    deadline: 'Do 20.08.2026',
    bids: 5,
    description: 'Postavljanje laminata u dnevnom boravku površine 45m2. Materijal imam, potreban majstor za postavljanje.',
    timeAgo: 'Prije 5 sati',
  },
  {
    id: 3,
    title: 'Izrada fasade na kući',
    category: 'Građevinarstvo',
    catColor: 'bg-orange-50 text-orange-600',
    location: 'Mostar - Jug',
    budget: '5,000 - 8,000 KM',
    deadline: 'Do 01.09.2026',
    bids: 12,
    description: 'Potrebna izrada termo fasade na kući od 150m2. Stiropor 10cm, završni sloj po želji. Sve uključujući materijal i rad.',
    timeAgo: 'Prije 1 dan',
  },
  {
    id: 4,
    title: 'Elektroinstalacije u novogradnji',
    category: 'Elektroinstalacije',
    catColor: 'bg-amber-50 text-amber-600',
    location: 'Tuzla - Centar',
    budget: '3,000 - 4,500 KM',
    deadline: 'Do 10.09.2026',
    bids: 7,
    description: 'Kompletne elektroinstalacije u kući od 120m2. Uključuje razvod struje, utičnice, prekidače i rasvjetu.',
    timeAgo: 'Prije 2 dana',
  },
];

export default function RecentProjects() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Najnoviji projekti
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Nedavno objavljeni projekti
            </h2>
          </div>
          <Link
            href="/kategorije/"
            className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors group whitespace-nowrap"
          >
            Svi projekti
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {recentProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${project.catColor}`}>
                  {project.category}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{project.timeAgo}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                {project.title}
              </h3>

              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{project.deadline}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="font-bold text-emerald-600 text-sm">{project.budget}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                  <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />
                  <span>{project.bids} ponuda</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}