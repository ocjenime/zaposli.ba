'use client';

import { useState } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

interface CopyTextButtonProps {
  text: string;
  label?: string;
  className?: string;
}

/** Kopira gotov tekst objave (za lijepljenje u Facebook grupe i sl.). */
export default function CopyTextButton({ text, label = 'Kopiraj tekst objave', className = '' }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

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
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
        copied
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
      } ${className}`}
    >
      {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
      {copied ? 'Kopirano! Zalijepi u objavu.' : label}
    </button>
  );
}
