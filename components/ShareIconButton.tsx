'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { site } from '@/lib/site';

interface ShareIconButtonProps {
  title: string;
  path: string;
  className?: string;
}

/** Mala share ikonica za preko kartica (unutar Linkova) - ne pokreće navigaciju. */
export default function ShareIconButton({ title, path, className = '' }: ShareIconButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}${path}`;

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? 'Link kopiran!' : 'Podijeli'}
      title={copied ? 'Link kopiran!' : 'Podijeli'}
      className={`w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center transition-all active:scale-95 ${className}`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
    </button>
  );
}
