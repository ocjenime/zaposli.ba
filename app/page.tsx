import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import PopularCategories from '@/components/PopularCategories';
import FeaturedWorkers from '@/components/FeaturedWorkers';
import StatsSection from '@/components/StatsSection';
import RecentProjects from '@/components/RecentProjects';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <FeaturedWorkers />
        <StatsSection />
        <RecentProjects />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}