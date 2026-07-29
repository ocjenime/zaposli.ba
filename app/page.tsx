import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import EmergencySection from '@/components/EmergencySection';
import PopularCategories from '@/components/PopularCategories';
import StatsSection from '@/components/StatsSection';
import RecentProjects from '@/components/RecentProjects';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/jsonld';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <EmergencySection />
        <PopularCategories />
        <StatsSection />
        <RecentProjects />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}