import { Suspense } from 'react';
import FirmProfileContent from './FirmProfileContent';

export default function FirmProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Učitavanje...</p></div>}>
      <FirmProfileContent />
    </Suspense>
  );
}
