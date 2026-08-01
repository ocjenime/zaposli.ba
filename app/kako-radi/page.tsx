import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ClipboardList, Users, CheckCircle, Star, Shield, Clock, MessageSquare } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/zaposli.ba/images/renovacija-enterijer.webp"
              alt="Renovacija enterijera"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-ink/70" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Kako funkcioniše Zaposli.ba?</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Jednostavan proces u 3 koraka do idealnog majstora za vaš posao
            </p>
          </div>
        </section>

        {/* Steps for Customers */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Za klijente</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-sm font-bold text-primary-600 mb-2">KORAK 1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Objavite posao</h3>
                <p className="text-gray-600">
                  Opišite šta vam je potrebno, dodajte fotografije i postavite budžet. 
                  Traje samo 2 minute i potpuno je besplatno.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-brand-orange" />
                </div>
                <div className="text-sm font-bold text-brand-orange mb-2">KORAK 2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Primite ponude</h3>
                <p className="text-gray-600">
                  Provjereni majstori i firme će vam poslati svoje ponude sa cijenama i rokovima. 
                  Obično u roku od 24 sata.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-brand-orange" />
                </div>
                <div className="text-sm font-bold text-brand-orange mb-2">KORAK 3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Odaberite majstora</h3>
                <p className="text-gray-600">
                  Uporedite ponude, pročitajte recenzije i odaberite najboljeg izvođača za vaš posao.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/objavi-projekat" className="btn-primary text-lg">
                Objavi posao besplatno
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
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-brand-orange" />
                </div>
                <div className="text-sm font-bold text-brand-orange mb-2">KORAK 2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pregledajte poslove</h3>
                <p className="text-gray-600">
                  Pregledajte dostupne poslove u vašem okrugu i odaberite one koji vam odgovaraju.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-brand-orange" />
                </div>
                <div className="text-sm font-bold text-brand-orange mb-2">KORAK 3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pošaljite ponudu</h3>
                <p className="text-gray-600">
                  Pošaljite svoju ponudu sa cijenom i rokovima. Ako vas klijent odabere, dobijate posao!
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

        {/* Real project gallery */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Stvarni majstori, stvarni poslovi</h2>
              <p className="text-steel text-lg">
                Na platformi svakodnevno pronalazite profesionalce za sve vrste radova u domu i poslovnom prostoru.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                <Image
                  src="/zaposli.ba/images/vodoinstalater.webp"
                  alt="Vodoinstalater na poslu"
                  width={400}
                  height={280}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <h3 className="text-white font-bold">Vodoinstalateri</h3>
                  <p className="text-white/80 text-sm">Popravke, cijevi, kupatila, bojleri</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                <Image
                  src="/zaposli.ba/images/elektricar.webp"
                  alt="Električar na poslu"
                  width={400}
                  height={280}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <h3 className="text-white font-bold">Električari</h3>
                  <p className="text-white/80 text-sm">Instalacije, osigurači, rasvjeta</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                <Image
                  src="/zaposli.ba/images/ciscenje.webp"
                  alt="Čišćenje prostora"
                  width={400}
                  height={280}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <h3 className="text-white font-bold">Čišćenje</h3>
                  <p className="text-white/80 text-sm">Stanovi, kuće, poslovni prostori</p>
                </div>
              </div>
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
                <p className="text-sm text-gray-600">Pročitajte iskustva drugih klijenata prije nego što odaberete firmu.</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verificirane firme</h3>
                <p className="text-sm text-gray-600">Sve firme prolaze provjeru identiteta i poslovanja.</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Brze ponude</h3>
                <p className="text-sm text-gray-600">Primite ponude u roku od 24 sata od objave posla.</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-brand-orange" />
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