'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { Briefcase, Star, MessageSquare, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, role, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/prijava');
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cloud"><p className="text-steel">Učitavanje...</p></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-ink">Dobrodošli</h1>
              <p className="text-steel">{user.email}</p>
            </div>
            <button onClick={signOut} className="text-sm text-steel hover:text-ink underline">Odjavi se</button>
          </div>

          {role === 'firm' ? (
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/dashboard/firma/" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Briefcase className="w-8 h-8 text-brand-orange mb-3" />
                <h3 className="font-bold text-ink mb-1">Poslovi</h3>
                <p className="text-sm text-steel">Pregledajte aktivne poslove i pošaljite ponudu</p>
              </Link>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-50">
                <Star className="w-8 h-8 text-gray-300 mb-3" />
                <h3 className="font-bold text-ink mb-1">Recenzije</h3>
                <p className="text-sm text-steel">Vaše ocjene i utisci klijenata</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-50">
                <User className="w-8 h-8 text-gray-300 mb-3" />
                <h3 className="font-bold text-ink mb-1">Profil</h3>
                <p className="text-sm text-steel">Uredite podatke firme</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/objavi-projekat/" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Briefcase className="w-8 h-8 text-brand-orange mb-3" />
                <h3 className="font-bold text-ink mb-1">Objavi posao</h3>
                <p className="text-sm text-steel">Pronađite majstora za vaš posao</p>
              </Link>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-50">
                <MessageSquare className="w-8 h-8 text-gray-300 mb-3" />
                <h3 className="font-bold text-ink mb-1">Moji poslovi</h3>
                <p className="text-sm text-steel">Pratite status vaših poslova</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-50">
                <Star className="w-8 h-8 text-gray-300 mb-3" />
                <h3 className="font-bold text-ink mb-1">Recenzije</h3>
                <p className="text-sm text-steel">Ocijenite majstore koje ste angažovali</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
