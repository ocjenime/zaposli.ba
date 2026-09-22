'use client';

import { useState } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';
import { site } from '@/lib/site';

interface CopyAdTextButtonProps {
  title: string;
  category: string;
  city: string;
  budget: string;
  jobId: string;
}

/** Gotov tekst oglasa za lijepljenje u Facebook/Viber grupe (sa ličnog profila). */
export default function CopyAdTextButton({ title, category, city, budget, jobId }: CopyAdTextButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}/posao/${jobId}/`;
  const text = `🔨 POSAO: ${title}\n📍 ${city} | 🏷️ ${category}\n💰 Budžet: ${budget}\n\n👉 Detalji i prijava ovdje:\n${url}\n\nObjavljeno preko ${site.name} - besplatno za majstore i firme.`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
        copied
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
      {copied ? 'Tekst kopiran! Zalijepi ga u grupu.' : 'Kopiraj tekst oglasa za grupe'}
    </button>
  );
}
