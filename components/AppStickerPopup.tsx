'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const STORAGE_KEY = 'appStickerDismissed';
const SCROLL_THRESHOLD = 400;

export default function AppStickerPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true') {
        setDismissed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const close = () => {
    setVisible(false);
    setDismissed(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    } catch {}
  };

  if (!visible || dismissed) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm animate-in slide-in-from-bottom-8 duration-300">
        <button
          type="button"
          onClick={close}
          className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-white text-gray-900 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Zatvori"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]">
          <Image
            src="/images/hero-sticker.png"
            alt="Uskoro i mobilna aplikacija Zaposli.ba"
            width={560}
            height={420}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
