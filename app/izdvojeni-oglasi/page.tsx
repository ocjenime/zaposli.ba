import type { Metadata } from 'next';
import { Megaphone, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PromotedAdCard from '@/components/PromotedAdCard';
import { fetchActivePromotedAds } from '@/lib/promoted-ads';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Izdvojeni oglasi | Zaposli.ba',
  description:
    'Pregledajte premium izdvojene oglase provjerenih firmi i majstora. Pronađite promocije usluga ili ponude posla širom Bosne i Hercegovine.',
  alternates: { canonical: `${site.url}/izdvojeni-oglasi/` },
  openGraph: {
    title: 'Izdvojeni oglasi | Zaposli.ba',
    description:
      'Pregledajte premium izdvojene oglase provjerenih firmi i majstora širom Bosne i Hercegovine.',
    url: `${site.url}/izdvojeni-oglasi/`,
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Izdvojeni oglasi' }],
  },
};

export const revalidate = 60;

export default async function PromotedAdsPage() {
  let ads: Awaited<ReturnType<typeof fetchActivePromotedAds>> = [];
  let fetchError: string | null = null;

  try {
    ads = await fetchActivePromotedAds();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Greška prilikom učitavanja oglasa.';
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <Breadcrumbs items={[{ name: 'Izdvojeni oglasi', href: '/izdvojeni-oglasi/' }]} />
      <main className="flex-grow">
        <PageHero
          title="Izdvojeni oglasi"
          subtitle="Premium promocije provjerenih firmi i majstora. Pronađite najbolje ponude usluga ili otvorena radna mjesta."
          eyebrow="Premium promocije"
          icon={Megaphone}
          align="center"
          size="md"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-6 mb-8 md:mb-10">
          <a
            href="/dashboard/firma/?tab=ads&destination=listing"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-4 shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Želite da vaš oglas bude ovdje?</p>
                <p className="text-sm text-white/90">Objavite oglas na stranici svih oglasa za samo 5 KM.</p>
              </div>
            </div>
            <span className="inline-flex items-center justify-center gap-2 self-start sm:self-center bg-white text-brand-orange px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shrink-0">
              Objavi oglas <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>

        <section className="relative py-12 md:py-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {fetchError ? (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                <p className="text-red-200">{fetchError}</p>
              </div>
            ) : ads.length === 0 ? (
              <div className="text-center py-16 md:py-24">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-ink-900 border border-ink-800 flex items-center justify-center mb-6">
                  <Megaphone className="w-10 h-10 text-brand-orange" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Trenutno nema izdvojenih oglasa</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8">
                  Budite prvi koji će istaknuti svoju firmu ili objaviti potrebu za radnicima.
                </p>
                <a
                  href="/za-firme/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                >
                  Promoviraj svoju firmu
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {ads.map((ad) => (
                  <PromotedAdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
