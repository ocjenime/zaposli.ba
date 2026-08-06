import type { Metadata } from 'next';
import { Suspense } from 'react';
import FirmProfileContent from './FirmProfileContent';

export const metadata: Metadata = {
  title: 'Profil firme | Zaposli.ba',
  description: 'Pogledajte profil, ocjene, recenzije i kontakt podatke provjerenog majstora ili firme na Zaposli.ba marketplaceu.',
  alternates: { canonical: 'https://zaposli.ba/firma-profil/' },
};

export default function FirmProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Učitavanje...</p></div>}>
      <FirmProfileContent />
    </Suspense>
  );
}
