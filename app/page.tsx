import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import PopularCategories from '@/components/PopularCategories';
import StatsSection from '@/components/StatsSection';
import RecentProjects from '@/components/RecentProjects';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import LazySection from '@/components/LazySection';
import { JsonLd, organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/jsonld';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Zaposli.ba - Pronađite majstore i građevinske firme u BiH | Besplatne ponude',
  description:
    'Tražite majstora ili posao u Bosni i Hercegovini? Objavite posao besplatno i uporedite ponude provjerenih građevinskih firmi, vodoinstalatera, električara, keramičara i drugih majstora u Sarajevu, Banjoj Luci, Mostaru i ostalim gradovima.',
  keywords: [
    'majstor BiH',
    'građevinske firme BiH',
    'posao majstor',
    'vodoinstalater',
    'električar',
    'keramičar',
    'moler',
    'adaptacija',
    'renoviranje',
    'ponude majstora',
    'objavi posao',
    'Sarajevo',
    'Banja Luka',
    'Mostar',
  ],
  alternates: { canonical: site.url },
  openGraph: {
    title: 'Zaposli.ba - Pronađite majstore i građevinske firme u BiH',
    description:
      'Besplatno objavite posao i primite ponude od provjerenih građevinskih firmi i majstora širom Bosne i Hercegovine.',
    url: site.url,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: 'Početna', url: '/' }])} />
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <LazySection minHeight="18rem">
          <HowItWorks />
        </LazySection>
        <PopularCategories />
        <LazySection minHeight="16rem">
          <StatsSection />
        </LazySection>
        <LazySection minHeight="24rem">
          <RecentProjects />
        </LazySection>
        <LazySection minHeight="20rem">
          <Testimonials />
        </LazySection>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}