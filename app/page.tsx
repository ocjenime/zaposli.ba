import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AppStickerPopup from '@/components/AppStickerPopup';
import CategoryIconRow from '@/components/CategoryIconRow';
import RoleCTACards from '@/components/RoleCTACards';
import PromoBanner from '@/components/PromoBanner';
import FeaturedAdsSection from '@/components/FeaturedAdsSection';
import LatestAdsSection from '@/components/LatestAdsSection';
import RecommendedFirmsSection from '@/components/RecommendedFirmsSection';
import HowItWorks from '@/components/HowItWorks';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import LazySection from '@/components/LazySection';
import HomeStickyCTA from '@/components/HomeStickyCTA';
import { JsonLd, organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/jsonld';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Posao u BiH - pronađite majstora ili objavite posao besplatno | Zaposli.ba',
  description:
    'Trebate posao ili majstora u Bosni i Hercegovini? Objavite posao besplatno i uporedite ponude provjerenih firmi: vodoinstalateri, električari, keramičari i drugi majstori u Sarajevu, Banjoj Luci, Mostaru, Tuzli i ostalim gradovima.',
  keywords: [
    'posao BiH',
    'posao Sarajevo',
    'posao Banja Luka',
    'posao Mostar',
    'posao Tuzla',
    'poslovi BiH',
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
  ],
  alternates: { canonical: site.url },
  openGraph: {
    title: 'Posao u BiH - pronađite majstora ili objavite posao besplatno',
    description:
      'Besplatno objavite posao i primite ponude od provjerenih građevinskih firmi i majstora u Sarajevu, Banjoj Luci, Mostaru, Tuzli i širom Bosne i Hercegovine.',
    url: site.url,
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Pronađite majstora za vaš posao' }],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: 'Početna', url: '/' }])} />
      <Header />
      <AppStickerPopup />
      <main className="flex-grow">
        <HeroSection />
        <CategoryIconRow />
        <RoleCTACards />
        <PromoBanner />
        <FeaturedAdsSection />
        <LatestAdsSection />
        <RecommendedFirmsSection />
        <LazySection minHeight="18rem">
          <HowItWorks />
        </LazySection>
        <LazySection minHeight="16rem">
          <StatsSection />
        </LazySection>
        <LazySection minHeight="20rem">
          <Testimonials />
        </LazySection>
        <CTASection />
      </main>
      <HomeStickyCTA />
      <Footer />
    </div>
  );
}