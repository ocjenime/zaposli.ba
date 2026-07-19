import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ClipboardList, Users, CheckCircle, Star, Shield, Clock, MessageSquare } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Kako funkcioniše Zaposli.ba?</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Jednostavan proces u 3 koraka do idealnog majstora za vaš projekat
            </p>
          </div>
        </section>

        {/* Steps for Customers */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Za kupce</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-sm font-bold text-primary-600 mb-2">KORAK 1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Objavite projekat</h3>
                <p className="text-gray-600">
                  Opišite šta vam je potrebno, dodajte fotografije i postavite budžet. 
                  Traje samo 2 minute i potpuno je besplatno.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-success-600" />
                </div>
                <div className="text-sm font-bold text-success-600 mb-2">KORAK 2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Primite ponude</h3>
                <p className="text-gray-600">
                  Provjereni majstori i firme će vam poslati svoje ponude sa cijenama i rokovima. 
                  Obično u roku od 24 sata.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-accent-600" />
                </div>
                <div className="text-sm font-bold text-accent-600 mb-2">KORAK 3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Odaberite majstora</h3>
                <p className="text-gray-600">
                  Uporedite ponude, pročitajte recenzije i odaberite najboljeg izvođača za vaš projekat.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/objavi-projekat" className="btn-primary text-lg">
                Objavi projekat besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* Steps for Professionals */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Za firme i majstore</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-sm font-bold text-primary-600 mb-2">KORAK 1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Registrujte firmu</h3>
                <p className="text-gray-600">
                  Napravite profil vaše firme, dodajte portfolio i opišite usluge koje nudite.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-success-600" />
                </div>
                <div className="text-sm font-bold text-success-600 mb-2">KORAK 2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pregledajte projekte</h3>
                <p className="text-gray-600">
                  Pregledajte dostupne projekte u vašem okrugu i odaberite one koji vam odgovaraju.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-accent-600" />
                </div>
                <div className="text-sm font-bold text-accent-600 mb-2">KORAK 3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pošaljite ponudu</h3>
                <p className="text-gray-600">
                  Pošaljite svoju ponudu sa cijenom i rokovima. Ako vas kupac odabere, dobijate posao!
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/registracija-firme" className="btn-primary text-lg">
                Registrujte firmu besplatno
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Zašto koristiti Zaposli.ba?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ocjene i recenzije</h3>
                <p className="text-sm text-gray-600">Pročitajte iskustva drugih kupaca prije nego što odaberete firmu.</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verificirane firme</h3>
                <p className="text-sm text-gray-600">Sve firme prolaze provjeru identiteta i poslovanja.</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Brze ponude</h3>
                <p className="text-sm text-gray-600">Primite ponude u roku od 24 sata od objave projekta.</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Direktna komunikacija</h3>
                <p className="text-sm text-gray-600">Komunicirajte direktno sa majstorima putem platforme.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}