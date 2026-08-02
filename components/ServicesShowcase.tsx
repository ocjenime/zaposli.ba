import Image from 'next/image';
import { Wrench, Paintbrush, Zap, Droplets, Sparkles, Hammer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LiveCategoryCount from '@/components/ui/LiveCategoryCount';

const services = [
  {
    title: 'Adaptacije i renovacije',
    description: 'Kompletne adaptacije stanova, kuhinja i kupatila.',
    image: '/images/renovacija-enterijer.webp',
    icon: Hammer,
    slug: 'adaptacije',
  },
  {
    title: 'Vodoinstalaterski radovi',
    description: 'Cijevi, bojleri, kupatila, kanalizacija i popravke.',
    image: '/images/vodoinstalater.webp',
    icon: Droplets,
    slug: 'vodoinstalacije',
  },
  {
    title: 'Elektroinstalacije',
    description: 'Rasvjeta, utičnice, osigurači i kompletne instalacije.',
    image: '/images/elektricar.webp',
    icon: Zap,
    slug: 'elektroinstalacije',
  },
  {
    title: 'Molersko-farbarski radovi',
    description: 'Krečenje, gletovanje, bojenje zidova i fasade.',
    image: '/images/farbanje-zid.webp',
    icon: Paintbrush,
    slug: 'molerski-radovi',
  },
  {
    title: 'Čišćenje i održavanje',
    description: 'Čišćenje stanova, kuća, poslovnih prostora i selidbe.',
    image: '/images/ciscenje.webp',
    icon: Sparkles,
    slug: 'ciscenje-i-odrzavanje',
  },
  {
    title: 'Sve usluge',
    description: 'Pronađite majstore za bilo koju vrstu posla.',
    image: '/images/majstor-cekic.webp',
    icon: Wrench,
    cta: true,
  },
];

export default function ServicesShowcase() {
  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-4">
            Pronađite majstora
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Stvarni majstori za svaki posao
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Pogledajte samo neke od kategorija u kojima svakodnevno povezujemo klijente i profesionalce.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = service.icon;
            const content = (
              <div className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h3 className="text-white font-bold text-lg shadow-black drop-shadow-md">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-steel leading-relaxed mb-4 flex-1">{service.description}</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${service.cta ? 'text-brand-orange' : 'text-steel'}`}>
                    {service.cta ? 'Pogledajte sve kategorije' : 'Pronađite majstora'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );

            return service.cta ? (
              <Link key={service.title} href="/kategorije/" className="block">
                {content}
              </Link>
            ) : (
              <Link key={service.title} href={`/kategorije/${service.slug}/`} className="block">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
