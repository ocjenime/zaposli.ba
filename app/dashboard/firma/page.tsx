'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';

export default function FirmDashboard() {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || role !== 'firm')) router.push('/prijava/');
  }, [user, role, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-ink mb-2">Dashboard firme</h1>
          <p className="text-steel mb-4">{user.email}</p>
          <p className="text-sm text-steel bg-white p-4 rounded-xl border border-gray-100">
            Ovaj dashboard je trenutno u izradi. Uskoro će ovdje biti poslovi i ponude.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
