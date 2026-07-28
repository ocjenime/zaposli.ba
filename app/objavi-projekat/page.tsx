'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, X, MapPin, Calendar, DollarSign, ChevronRight } from 'lucide-react';

const categories = [
  'Građevinarstvo',
  'Vodoinstalacije',
  'Elektroinstalacije',
  'Slikanje',
  'Krovopokrivanje',
  'Tilerski radovi',
  'Vrtlarstvo',
  'Adaptacije',
  'Grijanje i hlađenje',
  'Izolacija',
  'Stolarija',
  'Ostalo',
];

import { cities as allCities } from '@/lib/data';

const cities = allCities.map((c) => c.name);

export default function PostProjectPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    city: '',
    address: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    images: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Project submitted:', formData);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-orange/25 animate-fade-in">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-ink mb-3">Projekat je objavljen!</h1>
            <p className="text-steel mb-8 leading-relaxed">
              Vaš projekat <b className="text-ink">"{formData.title || 'Adaptacija'}"</b> je sada vidljiv provjerenim firmama.
              Prve ponude obično stižu u roku od <b className="text-ink">24 sata</b> — javimo vam emailom čim stignu.
            </p>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8 text-left">
              <h2 className="font-bold text-ink mb-4 text-sm uppercase tracking-wider">Šta se dešava dalje?</h2>
              <div className="space-y-4">
                {[
                  { n: '1', text: 'Firme iz vaše kategorije i grada dobijaju notifikaciju o projektu' },
                  { n: '2', text: 'Primate ponude s cijenama i rokovima — obično 3–8 ponuda' },
                  { n: '3', text: 'Uporedite ponude, pročitajte recenzije i odaberite majstora' },
                ].map((s) => (
                  <div key={s.n} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-50 text-brand-orange font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {s.n}
                    </span>
                    <p className="text-steel text-sm">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/projekti/" className="btn-secondary">Pogledajte aktivne projekte</Link>
              <button
                onClick={() => { setSubmitted(false); setStep(1); setFormData({ title: '', category: '', description: '', city: '', address: '', budgetMin: '', budgetMax: '', deadline: '', images: [] }); }}
                className="btn-primary"
              >
                Objavite još jedan projekat
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`hidden sm:block w-24 h-1 mx-2 ${
                        step > s ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="hidden sm:flex justify-between mt-2 text-sm text-gray-500">
              <span>Osnovne informacije</span>
              <span>Detalji projekta</span>
              <span>Pregled i objava</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Objavite novi projekat</h1>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Naslov projekta *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="npr. Adaptacija kupatila"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategorija *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Odaberite kategoriju</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opis projekta *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Opišite detaljno šta vam je potrebno..."
                      rows={5}
                      className="input-field"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Što detaljniji opis, to ćete preciznije ponude dobiti.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    Nastavi
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Grad *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Odaberite grad</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresa / Lokacija
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ulica, broj..."
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Budžet (min)
                      </label>
                      <input
                        type="number"
                        name="budgetMin"
                        value={formData.budgetMin}
                        onChange={handleInputChange}
                        placeholder="Minimalni budžet (KM)"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Budžet (max)
                      </label>
                      <input
                        type="number"
                        name="budgetMax"
                        value={formData.budgetMax}
                        onChange={handleInputChange}
                        placeholder="Maksimalni budžet (KM)"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Rok izvršenja
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Fotografije (opcionalno)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Kliknite za upload ili prevucite slike</p>
                      <p className="text-sm text-gray-500">PNG, JPG do 10MB</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary"
                    >
                      Nazad
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      Nastavi
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pregled projekta</h3>
                    
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Naslov:</dt>
                        <dd className="font-medium text-gray-900">{formData.title || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Kategorija:</dt>
                        <dd className="font-medium text-gray-900">{formData.category || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Grad:</dt>
                        <dd className="font-medium text-gray-900">{formData.city || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Budžet:</dt>
                        <dd className="font-medium text-gray-900">
                          {formData.budgetMin && formData.budgetMax
                            ? `${formData.budgetMin} - ${formData.budgetMax} KM`
                            : 'Nije specificiran'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Rok:</dt>
                        <dd className="font-medium text-gray-900">{formData.deadline || 'Fleksibilno'}</dd>
                      </div>
                    </dl>

                    {formData.description && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <dt className="text-gray-500 mb-2">Opis:</dt>
                        <dd className="text-gray-700 whitespace-pre-wrap">{formData.description}</dd>
                      </div>
                    )}
                  </div>

                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-sm text-primary-800">
                      <strong>Napomena:</strong> Vaš projekat će biti vidljiv svim firmama u odabranom gradu. 
                      Obično primate ponude u roku od 24 sata.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 btn-secondary"
                    >
                      Nazad
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-accent"
                    >
                      Objavi projekat besplatno
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}