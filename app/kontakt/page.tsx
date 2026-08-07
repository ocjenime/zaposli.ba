'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { JsonLd, organizationSchema } from '@/lib/jsonld';
import { supabase } from '@/lib/supabase';
import { site } from '@/lib/site';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageCircleQuestion,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const inputClass =
  'w-full px-4 py-3.5 bg-cloud/60 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none text-gray-900 text-sm transition-all placeholder:text-gray-400';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    note: 'Odgovaramo u roku od 24 sata',
  },
  ...(site.phone
    ? [
        {
          icon: Phone,
          title: 'Telefon',
          value: site.phone,
          href: `tel:${site.phone.replace(/\s/g, '')}`,
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

const trustBadges = [
  { icon: ShieldCheck, label: 'Sigurnost', value: 'Zaštićeni podaci' },
  { icon: Users, label: 'Brz odgovor', value: 'U roku 24h' },
  { icon: Sparkles, label: 'Podrška', value: 'Na bosanskom' },
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
          title="Kontaktirajte nas"
          subtitle="Imate pitanje, prijedlog ili trebate pomoć? Naš tim odgovara u roku od 24 sata."
          eyebrow="Tu smo za vas"
          icon={Mail}
          align="center"
          size="lg"
        >
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <a
              href={`mailto:${site.email}`}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {site.email}
            </a>
            {site.phone && (
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-colors duration-200"
              >
                <Phone className="w-5 h-5" />
                Pozovite nas
              </a>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-orange" />
              Odgovor u 24 sata
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-orange" />
              Zaštićeni podaci
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-orange" />
              Podrška na bosanskom
            </span>
          </div>
        </PageHero>

        <section className="relative py-20 md:py-28 bg-cloud overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-brand-orange text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                <Sparkles className="h-4 w-4" /> Brzi odgovor
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-balance">
                Imate pitanje? Tu smo.
              </h2>
              <p className="text-steel text-lg">
                Najbrži put do majstora je da{' '}
                <Link href="/objavi-projekat/" className="text-brand-orange font-semibold hover:underline">
                  objavite posao
                </Link>{' '}
                i primite ponude direktno od provjerenih firmi. Ako imate pitanje o platformi, profilu
                ili suradnji: pišite nam.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Contact panel */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-8 md:p-10 shadow-2xl shadow-black/20 border border-white/10">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl" />

                  <div className="relative">
                    <h3 className="text-2xl font-bold text-white mb-8">Podaci za kontakt</h3>
                    <div className="space-y-4">
                      {contactInfo.map((item) => (
                        <a
                          key={item.title}
                          href={item.href || '#'}
                          className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <item.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-white/50 mb-1">{item.title}</p>
                            <p className="text-white font-semibold">{item.value}</p>
                            <p className="text-white/60 text-sm mt-0.5">{item.note}</p>
                          </div>
                        </a>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-3">
                      {trustBadges.map((badge) => (
                        <div key={badge.label} className="text-center">
                          <badge.icon className="w-6 h-6 text-brand-orange mx-auto mb-2" strokeWidth={1.5} />
                          <p className="text-white font-bold text-sm">{badge.value}</p>
                          <p className="text-white/50 text-xs">{badge.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center shrink-0">
                      <MessageCircleQuestion className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Prije nego što nam pišete</h4>
                      <p className="text-sm text-steel leading-relaxed">
                        Možda je odgovor već na stranici{' '}
                        <Link href="/faq/" className="text-brand-orange font-medium hover:underline">
                          Česta pitanja
                        </Link>
                        . Ako tražite majstora, najbrži put je da{' '}
                        <Link href="/objavi-projekat/" className="text-brand-orange font-medium hover:underline">
                          objavite posao
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-7">
                <div className="relative bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-float overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pošaljite nam poruku</h3>
                    <p className="text-steel mb-8">Popunite formu i odgovaramo u roku od 24 sata.</p>

                    {status === 'success' && (
                      <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-800 font-semibold">Hvala! Poruka je poslana.</p>
                          <p className="text-sm text-green-700">Odgovaramo u roku od 24 sata.</p>
                        </div>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="ime" className="block text-sm font-semibold text-gray-900 mb-1.5">
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
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
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
                          <label htmlFor="telefon" className="block text-sm font-semibold text-gray-900 mb-1.5">
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
                        <label htmlFor="poruka" className="block text-sm font-semibold text-gray-900 mb-1.5">
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
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed py-4 text-lg"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Šaljem...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Pošalji poruku
                          </>
                        )}
                      </button>

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
