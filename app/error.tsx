'use client';

import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cloud px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
        <span className="text-3xl font-extrabold text-brand-orange">!</span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
        Nešto je pošlo po zlu
      </h1>
      <p className="text-steel mb-8 max-w-sm">
        Došlo je do privremene greške pri učitavanju stranice. Pokušajte ponovo, a ako se
        greška ponovi, javite nam na info@zaposli.ba.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Pokušaj ponovo
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
}
