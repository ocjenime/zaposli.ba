import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  ArrowRight,
  CheckCircle,
  Building2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CityGrid from '@/components/CityGrid';
import { cities } from '@/lib/data';
import { site } from '@/lib/site';
import { normalizeCityName } from '@/lib/city-utils';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getCitiesWithFirms(): Promise<Set<string>> {
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase.from('firms').select('city').not('slug', 'like', 'test-%');
    const set = new Set<string>();
    (data || []).forEach((row: { city: string | null }) => {
      if (row.city) set.add(normalizeCityName(row.city));
    });
    return set;
  } catch {
    return new Set<string>();
  }
}

export const metadata: Metadata = {
  title: `Majstori po gradovima - ${cities.length} gradova u BiH | Zaposli.ba`,
  description: `Pronađite provjerene majstore i građevinske firme u ${cities.length} gradova širom Bosne i Hercegovine. Sarajevo, Banja Luka, Mostar, Tuzla i ostali - objavite posao besplatno.`,
  keywords: [
    'majstori po gradovima',
    'građevinske firme BiH',
    'majstor Sarajevo',
    'majstor Banja Luka',
    'majstor Mostar',
    'majstor Tuzla',
    'objavi posao',
    'ponude majstora',
  ],
  alternates: { canonical: `${site.url}/gradovi/` },
};

export default async function CitiesPage() {
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs'));
  const citiesWithFirms = await getCitiesWithFirms();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Gradovi' }]} />

        <PageHero
          title={
            <>
              Majstori{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                po gradovima
              </span>
            </>
          }
          subtitle={`Provjerene firme i majstori u ${cities.length} gradova širom Bosne i Hercegovine. Od Sarajeva do Banja Luke, Mostara i Tuzle.`}
          eyebrow="Svi gradovi u BiH"
          icon={MapPin}
          align="center"
          size="lg"
          image="/images/gradovi-hero.jpg"
        >
          <Link
            href="/objavi-projekat/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
          >
            Objavi posao besplatno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </PageHero>

        {/* City grid */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-brand-orange text-sm font-semibold mb-4 border border-orange-100">
                <MapPin className="h-4 w-4" /> Izaberite grad
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Svi gradovi u Bosni i Hercegovini
              </h2>
              <p className="text-steel text-lg">
                Kliknite na grad i pronađite provjerene majstore koji rade u vašem kraju.
              </p>
            </div>

            <CityGrid cities={sortedCities} initialHasFirms={Array.from(citiesWithFirms)} />
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 md:py-20 bg-gradient-hero overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-brand-orange" />
                <span className="text-sm font-semibold text-white/80">Bilo koji grad u BiH</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
                Koji god grad da ste: objavite posao
              </h2>
              <p className="text-white/70 text-base md:text-lg">
                Firme iz vašeg kraja će se javiti s ponudama. Besplatno, bez obaveze i bez posrednika.
              </p>
            </div>
            <Link
              href="/objavi-projekat/"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-orange hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shrink-0"
            >
              <CheckCircle className="w-5 h-5" />
              Objavi posao besplatno
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
