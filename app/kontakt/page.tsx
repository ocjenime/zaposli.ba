'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { JsonLd, organizationSchema } from '@/lib/jsonld';
import { supabase } from '@/lib/supabase';
import { site } from '@/lib/site';
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Headphones,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const topics = ['Općenito', 'Pomoć korisnicima', 'Za firme', 'Prijava problema'];

const helpCards = [
  {
    icon: Headphones,
    title: 'Pomoć korisnicima',
    description: 'Pitanja o oglasima, nalogu i korištenju platforme.',
    topic: 'Pomoć korisnicima',
  },
  {
    icon: Briefcase,
    title: 'Za firme',
    description: 'Podrška za poslodavce, verifikaciju i oglašavanje radnih mjesta.',
    topic: 'Za firme',
  },
  {
    icon: AlertTriangle,
    title: 'Prijava problema',
    description: 'Primijetili ste grešku ili sumnjiv oglas? Javite nam.',
    topic: 'Prijava problema',
  },
];

const inputClass =
  'w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none text-gray-900 text-sm transition-all placeholder:text-gray-400';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    tema: '',
    ime: '',
    email: '',
    poruka: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const { error } = await supabase.from('contact_messages').insert({
      name: formData.ime,
      email: formData.email,
      phone: null,
      message: `[${formData.tema}] ${formData.poruka}`,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setFormData({ tema: '', ime: '', email: '', poruka: '' });
    }
  };

  function pickTopic(topic: string) {
    setFormData((prev) => ({ ...prev, tema: topic }));
    document.getElementById('kontakt-forma')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kontakt' }]} />

        {/* Hero */}
        <section className="relative min-h-[300px] sm:min-h-[360px] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/kontakt-hero.png"
              alt="Zaposli.ba majstori na gradilištu u zalazak sunca"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-ink-950/25" />
          </div>

          <div className="relative z-20 flex-1 flex items-end">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-14">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 animate-fade-in">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Kontakt
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.05] tracking-tight mb-2 animate-fade-in">
                  Tu smo da <span className="text-brand-orange">pomognemo.</span>
                </h1>
                <p className="text-sm text-white/85 leading-snug max-w-xl animate-fade-in">
                  Imate pitanja, prijedlog ili vam treba podrška? Naš tim je tu za vas.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f8f7f4] to-transparent z-10" />
        </section>

        {/* Form card overlapping hero */}
        <section className="relative z-20 -mt-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div
              id="kontakt-forma"
              className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xl shadow-black/5 scroll-mt-24"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">
                Pošaljite nam poruku
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Ispunite formu i naš tim će vam se javiti u najkraćem roku.
              </p>

              {status === 'success' && (
                <div className="mb-5 bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-semibold">Hvala! Poruka je poslana.</p>
                    <p className="text-sm text-green-700">Odgovaramo u roku od 24 sata.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-5 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 font-semibold">Došlo je do greške.</p>
                    <p className="text-sm text-red-700">
                      Molimo pokušajte ponovo ili pošaljite email direktno na{' '}
                      <a href={`mailto:${site.email}`} className="underline">
                        {site.email}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <select
                    id="tema"
                    name="tema"
                    required
                    value={formData.tema}
                    onChange={handleChange}
                    aria-label="Tema poruke"
                    className={`${inputClass} appearance-none pr-10 cursor-pointer ${
                      formData.tema ? '' : 'text-gray-400'
                    }`}
                  >
                    <option value="" disabled>
                      Tema poruke
                    </option>
                    {topics.map((t) => (
                      <option key={t} value={t} className="text-gray-900">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900 pointer-events-none" />
                </div>

                <input
                  type="text"
                  id="ime"
                  name="ime"
                  required
                  value={formData.ime}
                  onChange={handleChange}
                  placeholder="Ime i prezime"
                  aria-label="Ime i prezime"
                  className={inputClass}
                />

                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email adresa"
                  aria-label="Email adresa"
                  className={inputClass}
                />

                <textarea
                  id="poruka"
                  name="poruka"
                  required
                  rows={4}
                  value={formData.poruka}
                  onChange={handleChange}
                  placeholder="Vaša poruka"
                  aria-label="Vaša poruka"
                  className={`${inputClass} resize-none`}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-base rounded-xl px-6 py-3.5 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/25 min-h-[52px]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Šaljem...
                    </>
                  ) : (
                    <>
                      Pošalji poruku
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Slanjem poruke prihvatate našu{' '}
                  <Link href="/privacy/" className="text-brand-orange hover:underline">
                    politiku privatnosti
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Help cards */}
        <section className="py-6 md:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
              Kako vam možemo pomoći?
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {helpCards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => pickTopic(card.topic)}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 text-left shadow-sm hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 overflow-hidden"
                >
                  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-orange-50 flex items-center justify-center mb-2 sm:mb-3">
                    <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                  </span>
                  <h3 className="text-[13px] sm:text-base font-bold text-gray-900 leading-snug mb-1">
                    {card.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-gray-500 leading-snug mb-6 sm:mb-8">
                    {card.description}
                  </p>
                  <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-orange text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback banner */}
        <section className="pb-8 md:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl min-h-[190px] sm:min-h-[220px] flex items-center">
              <Image
                src="/images/kontakt-hero.png"
                alt=""
                aria-hidden="true"
                fill
                className="object-cover object-[70%_center]"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-ink-950/30" />
              <div className="relative z-10 p-5 sm:p-8 max-w-xl">
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-white/50 uppercase mb-1.5">
                  Za bolje usluge
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1.5">
                  Vaš feedback
                  <br />
                  nam je <span className="text-brand-orange">važan.</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  Zajedno gradimo pouzdaniju platformu za sve u BiH.
                </p>
              </div>
              <div
                className="absolute z-10 right-4 sm:right-10 top-8 sm:top-1/2 sm:-translate-y-1/2 flex"
                aria-hidden="true"
              >
                <div className="relative bg-white rounded-2xl rounded-br-sm px-5 py-3.5 shadow-xl">
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Kontakt | Zaposli.ba',
          url: `${site.url}/kontakt/`,
          mainEntity: organizationSchema(),
        }}
      />
    </div>
  );
}
