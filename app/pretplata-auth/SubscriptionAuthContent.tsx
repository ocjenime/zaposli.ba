'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { LogIn, UserPlus, ArrowRight, Loader2, Crown, Building2, Wrench, Mail } from 'lucide-react';

export default function SubscriptionAuthContent() {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && isFirmRole(role)) {
      router.replace('/dashboard/firma/pretplata/');
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </main>
        <Footer />
      </div>
    );
  }

  // Firm users are redirected above; this handles non-firm logged-in users.
  const isLoggedInClient = Boolean(user && !isFirmRole(role));

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
              <Crown className="w-7 h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Aktivirajte pretplatu
            </h1>
            <p className="text-steel">
              {isLoggedInClient
                ? 'Pretplata je dostupna samo za firme i majstore.'
                : 'Prijavite se ili registrujte kao firma / majstor da biste nastavili.'}
            </p>
          </div>

          {isLoggedInClient ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Želite postati firma / majstor?</h2>
                <p className="text-sm text-steel mb-4">
                  Trenutno ste prijavljeni kao klijent. Da biste aktivirali pretplatu, potrebno je da imate nalog firme ili majstora.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/registracija/"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                  >
                    <UserPlus className="w-4 h-4" /> Registruj novi nalog
                  </Link>
                  <Link
                    href="/kontakt/"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Kontaktirajte nas
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Već imate firmu?</h2>
                <p className="text-sm text-steel mb-4">
                  Ako ste registrovani kao firma ili majstor na drugom emailu, prijavite se tim nalogom.
                </p>
                <Link
                  href="/prijava/"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-brand-orange text-brand-orange font-semibold hover:bg-orange-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Prijavi se drugim nalogom
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/prijava/"
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <LogIn className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Već imate nalog?</h2>
                <p className="text-sm text-steel mb-4">
                  Prijavite se kao firma ili majstor da biste aktivirali ili promijenili pretplatu.
                </p>
                <span className="inline-flex items-center gap-1.5 text-brand-orange font-semibold text-sm">
                  Prijavite se <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link
                href="/registracija/"
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Nemate nalog?</h2>
                <p className="text-sm text-steel mb-4">
                  Registrujte se besplatno kao firma ili majstor i počnite dobijati poslove.
                </p>
                <span className="inline-flex items-center gap-1.5 text-brand-orange font-semibold text-sm">
                  Registrujte se <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
