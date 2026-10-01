'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Share2, Check } from 'lucide-react';
import { site } from '@/lib/site';

const STORAGE_KEY = 'zaposli-saved-ads';

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

interface AdSaveShareProps {
  adId: string;
  title: string;
}

/** Sačuvaj oglas (localStorage) + Podijeli oglas (sistemski share ili kopiranje). */
export default function AdSaveShare({ adId, title }: AdSaveShareProps) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const url = `${site.url}/izdvojeni-oglasi/${adId}/`;

  useEffect(() => {
    setSaved(readSaved().includes(adId));
  }, [adId]);

  function toggleSave() {
    const list = readSaved();
    const next = list.includes(adId) ? list.filter((x) => x !== adId) : [...list, adId];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setSaved(next.includes(adId));
  }

  async function share() {
    const text = `${title} - Zaposli.ba`;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ title: text, text, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = `${text}\n${url}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  const btn =
    'flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cloud hover:bg-gray-100 text-gray-900 text-sm font-bold transition-colors min-h-[48px]';

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button type="button" onClick={toggleSave} className={btn} aria-pressed={saved}>
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-orange text-brand-orange' : ''}`} />
        {saved ? 'Sačuvano' : 'Sačuvaj oglas'}
      </button>
      <button type="button" onClick={share} className={btn}>
        {shared ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            Kopirano!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Podijeli oglas
          </>
        )}
      </button>
    </div>
  );
}
