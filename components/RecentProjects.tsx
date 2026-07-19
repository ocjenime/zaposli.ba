import Link from 'next/link';
import { MapPin, Clock, BadgeCheck } from 'lucide-react';

const recentProjects = [
  {
    id: 1,
    title: 'Adaptacija kupatila - kompletan renovis',
    category: 'Vodoinstalacije',
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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="section-title">Nedavno objavljeni projekti</h2>
            <p className="section-subtitle mb-0">
              Pogledajte šta kupci traže u vašem okrugu
            </p>
          </div>
          <Link
            href="/projekti"
            className="hidden md:inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Svi projekti
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recentProjects.map((project) => (
            <div key={project.id} className="card-hover">
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  {project.category}
                </span>
                <span className="text-sm text-gray-500">{project.timeAgo}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                <Link href={`/projekat/${project.id}`}>{project.title}</Link>
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.deadline}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="font-semibold text-success-600">{project.budget}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <BadgeCheck className="w-4 h-4 text-primary-500" />
                  <span>{project.bids} ponuda</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/projekti" className="btn-primary">
            Pogledajte sve projekte
          </Link>
        </div>
      </div>
    </section>
  );
}