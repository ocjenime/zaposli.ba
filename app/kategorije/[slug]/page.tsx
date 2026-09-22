import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, ArrowRight, Shield, Zap, Star } from 'lucide-react';
import { EmergencyProcessAnimation } from '@/components/EmergencyProcessAnimation';
import EmergencyBottomBar from '@/components/EmergencyBottomBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/jsonld';
import { categories, getCategory, cities } from '@/lib/data';
import { site } from '@/lib/site';
import { getGroupHeroStyle } from '@/lib/hero';
import { getServiceImage } from '@/lib/service-image';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import CategoryFirms from '@/components/CategoryFirms';

export function generateStaticParams() {
  return categories.filter((c) => !c.noSeo).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} u BiH - pronađite majstora ili objavite posao | Zaposli.ba`,
    description: `${cat.description}. Pronađite provjerenog ${cat.profession.toLowerCase()} širom BiH ili objavite posao besplatno i primite ponude od firmi i majstora.`,
    keywords: [
      `${cat.name.toLowerCase()} BiH`,
      `${cat.profession.toLowerCase()}`,
      'majstor BiH',
      'objavi posao',
      'ponude majstora',
      'građevinske firme',
    ],
    alternates: { canonical: `${site.url}/kategorije/${cat.slug}/` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const Icon = cat.icon;
  const groupStyle = getGroupHeroStyle(cat.group);
  const heroImage = getServiceImage(cat.slug);
  const objaviHref = `/objavi-projekat/?service=${encodeURIComponent(cat.name)}`;

  const servicesShort = cat.services.slice(0, 4).map((s) => s.toLowerCase()).join(', ');
  const subtitle = `Pronađite provjerene firme i majstore za ${servicesShort} širom Bosne i Hercegovine.`;

  const faqItems = [
    {
      question: `Koliko košta ${cat.profession.toLowerCase()} u BiH?`,
      answer: `Cijene se kreću oko ${cat.priceRange} (${cat.priceNote}). Tačnu cijenu dobijate kroz ponude: objavite posao besplatno i firme širom BiH će vam poslati svoje cijene.`,
    },
    {
      question: 'Koliko brzo mogu dobiti majstora?',
      answer: 'Većina poslova dobije prve ponude u roku od 24 sata. Za hitne poslove firme često odgovore u roku od nekoliko sati.',
    },
    {
      question: 'Kako znam da je firma pouzdana?',
      answer: 'Svaka firma na platformi prolazi verifikaciju identiteta i poslovanja. Dodatno, za svaku firmu vidite ocjene i recenzije stvarnih klijenata.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-12 md:pt-16">
        <JsonLd data={serviceSchema({ name: cat.name, description: cat.description, area: 'Bosna i Hercegovina', url: `/kategorije/${cat.slug}/` })} />
        <JsonLd data={faqSchema(faqItems)} />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Kategorije', url: '/kategorije/' },
            { name: cat.name },
          ])}
        />

        {/* Breadcrumb - kao na mockupu */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 pb-1">
          <ol className="flex items-center gap-1.5 text-[12px] text-steel overflow-x-auto whitespace-nowrap">
            <li><Link href="/" className="hover:text-brand-orange transition-colors">Početna</Link></li>
            <li aria-hidden="true" className="text-gray-300">›</li>
            <li><Link href="/kategorije/" className="hover:text-brand-orange transition-colors">Kategorije</Link></li>
            <li aria-hidden="true" className="text-gray-300">›</li>
            <li aria-current="page" className="text-gray-900 font-medium">{cat.name}</li>
          </ol>
        </nav>

        {/* Hero - isti stil kao /usluge/ */}
        <section className="relative bg-[#faf8f5] overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-[58%] sm:w-[52%] md:w-[46%]">
            <Image
              src={heroImage}
              alt={`${cat.name} - majstor na gradilištu`}
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
                {groupStyle.eyebrow}
              </p>
              <h1 className="text-[30px] sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-2">
                {cat.profession} u<br />BiH
              </h1>
              <p className="text-[13px] sm:text-[15px] text-steel leading-snug mb-4 max-w-md">
                {subtitle}
              </p>
              <Link
                href={objaviHref}
                className={`inline-flex items-center gap-2 text-white px-5 sm:px-6 py-3 rounded-xl text-[14px] sm:text-[15px] font-bold hover:shadow-xl transition-all active:scale-95 ${
                  cat.featured
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-600/25'
                    : 'bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:shadow-brand-orange/25'
                }`}
              >
                {cat.featured ? 'Objavi hitan posao besplatno' : 'Objavi posao besplatno'}
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

        {/* Firme u kategoriji - ranking: ocjena ključna + verifikacija + premium */}
        <CategoryFirms categorySlug={cat.slug} />

        {/* Istaknuti poslovi u kategoriji */}
        <FeaturedJobsSection categorySlug={cat.slug} />

        {/* Kako funkcioniše: samo za hitne intervencije */}
        {cat.featured && (
        <section className="py-8 md:py-10 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Kako funkcioniše hitna intervencija?</h2>
              <p className="text-steel">Tri koraka do majstora, u bilo koje doba dana ili noći.</p>
            </div>

            <div className="bg-red-50/40 border border-red-100 rounded-3xl p-6 md:p-8 mb-8">
              <EmergencyProcessAnimation />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { n: '01', title: 'Opišite kvar', text: 'Objavite hitan posao za 30 sekundi: šta se desilo i gdje se nalazite.' },
                { n: '02', title: 'Firme se javljaju odmah', text: 'Vaš posao dobija prioritet i firme za hitne intervencije u vašem gradu odmah šalju ponude.' },
                { n: '03', title: 'Majstor dolazi', text: 'Dogovorite dolazak, često isti dan. Dostupno vikendom, noću i za praznike.' },
              ].map((step) => (
                <div key={step.n} className="bg-red-50/60 border border-red-100 rounded-2xl p-6 text-center">
                  <div className="text-red-600 text-sm font-extrabold mb-2">{step.n}</div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-steel text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Gradovi */}
        <section className="py-8 md:py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!cat.noSeo && (
            <div className="mb-14">
              <div className="bg-cloud rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-brand-orange" />
                  <h2 className="text-xl font-bold text-gray-900">{cat.profession} po gradovima</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {[...cities].sort((a, b) => a.name.localeCompare(b.name, 'bs')).map((city) => (
                    <Link
                      key={city.slug}
                      href={`/usluge/${cat.seoSlug}-${city.slug}/`}
                      className="flex items-center justify-between px-3 py-2 bg-white rounded-lg text-sm text-steel hover:text-brand-orange hover:border-brand-orange/30 hover:shadow-sm transition-all border border-gray-100"
                    >
                      <span>{city.name}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            )}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trebate {cat.profession.toLowerCase()}?</h2>
            <p className="text-steel mb-6 max-w-xl mx-auto">Objavite posao besplatno i primite ponude od provjerenih firmi u roku od 24 sata.</p>
            <Link href="/objavi-projekat/" className="btn-primary">Objavi posao besplatno</Link>
          </div>
        </section>

      </main>

        {cat.featured && (
          <EmergencyBottomBar position="corner" href={`/objavi-projekat/?service=${encodeURIComponent(cat.name)}`} />
        )}

      <Footer />
    </div>
  );
}
