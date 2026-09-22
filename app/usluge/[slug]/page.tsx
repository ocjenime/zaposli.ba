import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Shield, Zap, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/jsonld';
import { categories, cities, type Category, type City } from '@/lib/data';
import { site } from '@/lib/site';
import { getGroupHeroStyle } from '@/lib/hero';
import { getServiceImage } from '@/lib/service-image';
import ServiceCityFirms from '@/components/ServiceCityFirms';

function parseSlug(slug: string): { cat: Category; city: City } | null {
  for (const city of cities) {
    if (slug.endsWith(`-${city.slug}`)) {
      const catSlug = slug.slice(0, -(city.slug.length + 1));
      const cat = categories.find((c) => c.seoSlug === catSlug);
      if (cat) return { cat, city };
    }
  }
  return null;
}

export function generateStaticParams() {
  return categories
    .filter((c) => !c.noSeo)
    .flatMap((c) => cities.map((city) => ({ slug: `${c.seoSlug}-${city.slug}` })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const { cat, city } = parsed;
  return {
    title: `${cat.profession} ${city.name} - majstori i firme | Zaposli.ba`,
    description: `Tražite ${cat.profession.toLowerCase()} u ${city.loc}? Pronađite provjerene firme i majstore u ${city.loc}. Objavite posao besplatno i uporedite ponude za vaš projekt.`,
    keywords: [
      `${cat.profession.toLowerCase()} ${city.name.toLowerCase()}`,
      `${cat.name.toLowerCase()} ${city.name.toLowerCase()}`,
      'majstor',
      'firma',
      'objavi posao',
      'ponude',
    ],
    alternates: { canonical: `${site.url}/usluge/${slug}/` },
  };
}

export default async function ServiceCityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { cat, city } = parsed;
  const Icon = cat.icon;
  const groupStyle = getGroupHeroStyle(cat.group);
  const heroImage = getServiceImage(cat.slug);
  const objaviHref = `/objavi-projekat/?service=${encodeURIComponent(cat.name)}&city=${encodeURIComponent(city.name)}`;

  const servicesShort = cat.services.slice(0, 4).map((s) => s.toLowerCase()).join(', ');
  const subtitle = `Pronađite provjerene firme i majstore za ${servicesShort} u ${city.loc}.`;

  const faqItems = [
    {
      question: `Koliko košta ${cat.profession.toLowerCase()} u ${city.loc}?`,
      answer: `Cijene se kreću oko ${cat.priceRange} (${cat.priceNote}). Tačnu cijenu dobijate kroz ponude: objavite posao besplatno i firme iz vašeg grada će vam poslati svoje cijene.`,
    },
    {
      question: 'Koliko brzo mogu dobiti majstora?',
      answer: `Većina poslova u ${city.loc} dobije prve ponude u roku od 24 sata. Za hitne poslove firme često odgovore u roku od nekoliko sati.`,
    },
    {
      question: 'Kako znam da je firma iz mog grada pouzdana?',
      answer: 'Svaka firma na platformi prolazi verifikaciju identiteta i poslovanja. Dodatno, za svaku firmu vidite ocjene i recenzije stvarnih klijenata iz vašeg grada i okoline.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-12 md:pt-16">
        <JsonLd data={serviceSchema({ name: `${cat.profession} ${city.name}`, description: cat.description, area: city.name, url: `/usluge/${slug}/` })} />
        <JsonLd data={faqSchema(faqItems)} />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Gradovi', url: '/gradovi/' },
            { name: city.name, url: `/gradovi/${city.slug}/` },
            { name: groupStyle.eyebrow, url: `/kategorije/${cat.slug}/` },
            { name: cat.profession },
          ])}
        />

        {/* Breadcrumb - kao na mockupu */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 pb-1">
          <ol className="flex items-center gap-1.5 text-[12px] text-steel overflow-x-auto whitespace-nowrap">
            <li><Link href="/" className="hover:text-brand-orange transition-colors">Početna</Link></li>
            <li aria-hidden="true" className="text-gray-300">›</li>
            <li><Link href="/gradovi/" className="hover:text-brand-orange transition-colors">Gradovi</Link></li>
            <li aria-hidden="true" className="text-gray-300">›</li>
            <li><Link href={`/gradovi/${city.slug}/`} className="hover:text-brand-orange transition-colors">{city.name}</Link></li>
            <li aria-hidden="true" className="text-gray-300">›</li>
            <li><Link href={`/kategorije/${cat.slug}/`} className="hover:text-brand-orange transition-colors">{groupStyle.eyebrow}</Link></li>
            <li aria-hidden="true" className="text-gray-300">›</li>
            <li aria-current="page" className="text-gray-900 font-medium">{cat.profession}</li>
          </ol>
        </nav>

        {/* Hero - 1:1 sa mockupom */}
        <section className="relative bg-[#faf8f5] overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-[58%] sm:w-[52%] md:w-[46%]">
            <Image
              src={heroImage}
              alt={`${cat.profession} ${city.name}`}
              fill
              priority
              sizes="(max-width: 768px) 60vw, 46vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 pb-8 sm:py-10 md:py-14">
            <div className="max-w-[68%] sm:max-w-xl md:max-w-2xl">
              <p className="inline-flex items-center gap-1.5 text-brand-orange text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wide mb-1.5">
                <Icon className="w-4 h-4" />
                {cat.name}
              </p>
              <h1 className="text-[30px] sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-2">
                {cat.profession} u<br />{city.loc}
              </h1>
              <p className="text-[13px] sm:text-[15px] text-steel leading-snug mb-4 max-w-md">
                {subtitle}
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
          <div className="absolute z-10 right-3 sm:right-8 md:right-16 bottom-8 sm:bottom-10 rotate-[-4deg]">
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
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              <div className="flex items-start gap-2">
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[12px] sm:text-sm leading-tight">Provjerene firme</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight mt-0.5">Provjereni profili i poslovni podaci</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[12px] sm:text-sm leading-tight">Brze ponude</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight mt-0.5">Primite ponude od dostupnih majstora</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[12px] sm:text-sm leading-tight">Stvarne recenzije</p>
                  <p className="text-steel text-[11px] sm:text-[13px] leading-tight mt-0.5">Iskustva korisnika nakon završenog posla</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Firme iz kategorije i grada */}
        <ServiceCityFirms
          categorySlug={cat.slug}
          cityName={city.name}
          citySlug={city.slug}
          profession={cat.profession}
          categoryName={cat.name}
        />

        {/* Česta pitanja */}
        <section className="py-6 sm:py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-[22px] sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-4">Česta pitanja</h2>
            <div className="space-y-2.5 max-w-3xl">
              {faqItems.map((f) => (
                <details key={f.question} className="group bg-[#f0f7ff] rounded-2xl px-5 py-4 open:bg-[#f0f7ff] transition-all">
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
      </main>
      <Footer />
    </div>
  );
}
