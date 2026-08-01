'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { supabase } from '@/lib/supabase';
import { site } from '@/lib/site';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none text-gray-900 text-sm';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: site.email,
    note: 'Odgovaramo u roku od 24 sata',
  },
  ...(site.phone
    ? [
        {
          icon: Phone,
          title: 'Telefon',
          value: site.phone,
          note: 'Poziv i poruka (Viber / WhatsApp)',
        },
      ]
    : []),
  {
    icon: MapPin,
    title: 'Adresa',
    value: site.city,
    note: 'Radimo u cijeloj BiH',
  },
  {
    icon: Clock,
    title: 'Radno vrijeme',
    value: 'Pon-Pet, 9-17h',
    note: 'Vikendom odgovaramo na email',
  },
];

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    ime: '',
    email: '',
    telefon: '',
    poruka: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      phone: formData.telefon || null,
      message: formData.poruka,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setFormData({ ime: '', email: '', telefon: '', poruka: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Kontakt' }]} />
        <PageHero
          title="Kontakt"
          subtitle="Imate pitanje ili prijedlog? Pišite nam: tu smo da pomognemo."
          image="/zaposli.ba/images/majstor-hero.webp"
        />

        <section className="py-16 bg-cloud">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Kontakt informacije */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kako nas možete kontaktirati</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {contactInfo.map((item) => (
                    <div
                      key={item.title}
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card"
                    >
                      <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5 text-brand-orange" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                      <p className="text-xs text-steel mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                  <h3 className="font-semibold text-gray-900 mb-2">Prije nego što nam pišete</h3>
                  <p className="text-sm text-steel leading-relaxed">
                    Možda je odgovor već na stranici{' '}
                    <Link href="/faq/" className="text-brand-orange font-medium hover:underline">
                      Česta pitanja
                    </Link>
                    . Ako tražite majstora za posao, najbrži put je da{' '}
                    <Link href="/objavi-projekat/" className="text-brand-orange font-medium hover:underline">
                      objavite posao
                    </Link>{' '}
                    i primite ponude direktno od firmi.
                  </p>
                </div>
              </div>

              {/* Kontakt forma */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pošaljite nam poruku</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="ime" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Ime i prezime <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text"
                      id="ime"
                      name="ime"
                      required
                      value={formData.ime}
                      onChange={handleChange}
                      placeholder="npr. Amila Softić"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                        Email <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vas@email.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="telefon" className="block text-sm font-medium text-gray-900 mb-1.5">
                        Telefon <span className="text-steel font-normal">(opcionalno)</span>
                      </label>
                      <input
                        type="tel"
                        id="telefon"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        placeholder="+387 6x xxx xxx"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="poruka" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Poruka <span className="text-brand-orange">*</span>
                    </label>
                    <textarea
                      id="poruka"
                      name="poruka"
                      required
                      rows={6}
                      value={formData.poruka}
                      onChange={handleChange}
                      placeholder="Kako vam možemo pomoći?"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Šaljem...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Pošalji poruku
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-green-800 font-medium">Hvala! Poruka je poslana. Odgovaramo u roku od 24 sata.</p>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="text-sm text-red-800 font-medium">Došlo je do greške. Molimo pokušajte ponovo ili pošaljite email direktno.</p>
                    </div>
                  )}

                  <p className="text-xs text-steel text-center">
                    Slanjem poruke prihvatate našu{' '}
                    <Link href="/privacy/" className="text-brand-orange hover:underline">
                      politiku privatnosti
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
