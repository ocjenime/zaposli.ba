'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

/**
 * Stranica pretplata je zamijenjena besplatnim sistemom.
 * Sve je besplatno - samo verifikacija profila (ID broj firme) je potrebna.
 * Preusmjeravamo na profil gdje se radi verifikacija.
 */
export default function FirmSubscriptionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/firma/profil/');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sve je besplatno</h1>
          <p className="text-steel text-sm mb-6 max-w-md">
            Nema paketa ni pretplata. Jedina obaveza je verifikacija profila - unosom ID broja firme.
            Preusmjeravamo vas na profil...
          </p>
          <div className="inline-flex items-center gap-2 text-brand-orange font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Učitavanje profila...
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
