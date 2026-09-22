import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, ArrowRight, Shield, Zap, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cities, categories } from '@/lib/data';
import { site } from '@/lib/site';
import CityCategoriesGrid from '@/components/CityCategoriesGrid';
import CityFirms from '@/components/CityFirms';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/jsonld';

export const revalidate = 60;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};
  return {
    title: `Majstori i firme u ${city.loc} - sve kategorije usluga | Zaposli.ba`,
    description: `Pronađite provjerene majstore i građevinske firme u ${city.loc}. Sve kategorije usluga: vodoinstalateri, električari, keramičari i više. Besplatna objava posla, ponude u roku od 24 sata.`,
    keywords: [
      `majstori ${city.name.toLowerCase()}`,
      `firme ${city.name.toLowerCase()}`,
      `građevinske firme ${city.name.toLowerCase()}`,
      'objavi posao',
      'ponude majstora',
      'sve kategorije',
    ],
    alternates: { canonical: `${site.url}/gradovi/${city.slug}/` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const objaviHref = `/objavi-projekat/?city=${encodeURIComponent(city.name)}`;

  const faqItems = [
    {
      question: `Koliko brzo mogu dobiti majstora u ${city.loc}?`,
      answer: `Većina poslova u ${city.loc} dobije prve ponude u roku od 24 sata. Za hitne poslove firme često odgovore u roku od nekoliko sati.`,
    },
    {
      question: 'Da li je objava posla besplatna?',
      answer: 'Da, za klijente je sve besplatno: objava posla, primanje ponuda i kontakt sa firmama se ne plaćaju.',
    },
    {
      question: 'Kako znam da je firma iz mog grada pouzdana?',
      answer: 'Svaka firma na platformi prolazi verifikaciju identiteta i poslovanja. Dodatno, za svaku firmu vidite ocjene i recenzije stvarnih klijenata iz vašeg grada i okoline.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <JsonLd data={serviceSchema({ name: `Majstori ${city.name}`, description: `Provjerene firme i majstori u ${city.loc}.`, area: city.name, url: `/gradovi/${city.slug}/` })} />
        <JsonLd data={faqSchema(faqItems)} />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Gradovi', url: '/gradovi/' },
            { name: city.name },
          ])}
        />
        <Breadcrumbs items={[{ name: 'Gradovi', href: '/gradovi/' }, { name: city.name }]} />

        {/* Hero - isti stil kao kategorije/usluge */}
        <section className="relative bg-[#faf8f5] overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-[44%] sm:w-[52%] md:w-[46%]">
            <Image
              src="/images/gradovi-hero.jpg"
              alt={`Grad ${city.name}`}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 46vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/85 to-transparent sm:via-[#faf8f5]/60" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 pb-8 sm:py-10 md:py-14">
            <div className="max-w-[64%] sm:max-w-xl md:max-w-2xl">
              <p className="inline-flex items-center gap-1.5 text-brand-orange text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wide mb-1.5">
                <MapPin className="w-4 h-4" />
                {city.name} · BiH
              </p>
              <h1 className="text-[30px] sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-2">
                Majstori u<br />{city.loc}
              </h1>
              <p className="text-[13px] sm:text-[15px] text-steel leading-snug mb-4 max-w-md">
                Provjerene firme i majstori u vašem gradu. Objavite posao besplatno i primite ponude u roku od 24 sata.
              </p>
              <Link
                href={objaviHref}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-5 sm:px-6 py-3 rounded-xl text-[14px] sm:text-[15px] font-bold hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95"
              >
                Objavi posao besplatno
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rukom pisana napomena */}
          <div className="absolute z-10 right-3 sm:right-8 md:right-16 top-5 sm:top-auto sm:bottom-10 rotate-[-4deg]">
            <div className="bg-black/25 backdrop-blur-[2px] rounded-lg px-3 py-2 max-w-[150px] sm:max-w-[180px]">
              <p className="text-white text-[14px] sm:text-base italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Kvalitetni majstori za vaš dom.
              </p>
              <div className="h-[3px] bg-brand-orange rounded-full mt-1 w-3/4" />
            </div>
          </div>
        </section>

        {/* Trust traka */}
        <section className="bg-white border-b border-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-6">
              <div className="flex items-start gap-1.5 sm:gap-2">
                <span className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[11px] sm:text-sm leading-tight">Provjerene firme</p>
                  <p className="text-steel text-[10px] sm:text-[13px] leading-tight mt-0.5">Provjereni profili i poslovni podaci</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <span className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[11px] sm:text-sm leading-tight">Brze ponude</p>
                  <p className="text-steel text-[10px] sm:text-[13px] leading-tight mt-0.5">Primite ponude od dostupnih majstora</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <span className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[11px] sm:text-sm leading-tight">Stvarne recenzije</p>
                  <p className="text-steel text-[10px] sm:text-[13px] leading-tight mt-0.5">Iskustva korisnika nakon završenog posla</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Firme i majstori iz grada */}
        <CityFirms cityName={city.name} />

        {/* Istaknuti poslovi u gradu */}
        <FeaturedJobsSection city={city.name} />

        {/* Sve usluge u gradu */}
        <section className="py-8 md:py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-1.5">Sve usluge · {city.name}</h2>
            <p className="text-steel text-sm md:text-base mb-5">Odaberite kategoriju i pronađite majstore u {city.loc}</p>
            <CityCategoriesGrid slugs={categories.filter((cat) => !cat.noSeo).map((cat) => cat.slug)} citySlug={city.slug} />
          </div>
        </section>

        {/* Česta pitanja */}
        <section className="py-6 sm:py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-[22px] sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-4">Česta pitanja</h2>
            <div className="space-y-2.5 max-w-3xl">
              {faqItems.map((f) => (
                <details key={f.question} className="group bg-[#f0f7ff] rounded-2xl px-5 py-4 transition-all">
                  <summary className="font-medium text-gray-900 text-[14px] sm:text-[15px] cursor-pointer list-none flex justify-between items-center gap-4 [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <span className="text-brand-orange text-xl font-light shrink-0 group-open:rotate-45 transition-transform leading-none">+</span>
                  </summary>
                  <p className="text-steel text-[13px] sm:text-sm mt-2 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 md:py-10 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trebate majstora u {city.loc}?</h2>
            <p className="text-steel mb-6 max-w-xl mx-auto">Objavite posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.</p>
            <Link href={objaviHref} className="btn-primary">Objavi posao besplatno</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
