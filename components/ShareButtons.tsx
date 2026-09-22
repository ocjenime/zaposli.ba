'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Link2, Check, Share2 } from 'lucide-react';
import { site } from '@/lib/site';

interface ShareButtonsProps {
  title: string;
  path: string;
  compact?: boolean;
}

export default function ShareButtons({ title, path, compact }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}${path}`;
  const text = `${title} - Zaposli.ba`;
  const encoded = encodeURIComponent(`${text}\n${url}`);

  const links = [
    {
      label: 'Viber',
      href: `viber://forward?text=${encoded}`,
      bg: 'bg-[#7360f2] hover:bg-[#6350e0]',
      Icon: Phone,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encoded}`,
      bg: 'bg-[#25d366] hover:bg-[#1eb856]',
      Icon: MessageCircle,
    },
  ];

  async function copyLink() {
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
    <div className="flex items-center gap-2">
      {!compact && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-steel">
          <Share2 className="w-3.5 h-3.5" />
          Podijeli:
        </span>
      )}
      {links.map(({ label, href, bg, Icon }) => (
        <a
          key={label}
          href={href}
          target={label === 'WhatsApp' ? '_blank' : undefined}
          rel="noopener noreferrer"
          aria-label={`Podijeli putem ${label}`}
          title={`Podijeli putem ${label}`}
          className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 ${bg}`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </a>
      ))}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Podijeli na Facebooku"
        title="Podijeli na Facebooku"
        className="inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2 rounded-xl bg-[#1877f2] hover:bg-[#1466d6] transition-all active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Kopiraj link"
        title="Kopiraj link"
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all active:scale-95 ${
          copied
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {copied ? 'Kopirano!' : 'Kopiraj'}
      </button>
    </div>
  );
}
