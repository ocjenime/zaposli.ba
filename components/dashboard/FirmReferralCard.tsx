'use client';

import { useEffect, useState } from 'react';
import { Gift, Copy, Check, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { site } from '@/lib/site';

const REWARD_EVERY = 3;

export default function FirmReferralCard() {
  const { user } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: firm } = await supabase
        .from('firms')
        .select('slug')
        .eq('owner_id', user!.id)
        .maybeSingle();
      if (firm) setSlug((firm as { slug: string }).slug);
      try {
        const { data } = await supabase.rpc('get_referral_count');
        if (typeof data === 'number') setCount(data);
      } catch {
        // RPC ne postoji dok se ne primijeni migracija - tiho ignoriši
      }
    }
    load();
  }, [user]);

  if (!slug) return null;

  const link = `${site.url}/registracija/?ref=${slug}`;
  const progress = Math.min(count % REWARD_EVERY, REWARD_EVERY);
  const earned = Math.floor(count / REWARD_EVERY);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/50 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-xl bg-brand-orange flex items-center justify-center shrink-0 shadow-md shadow-brand-orange/25">
          <Gift className="w-5 h-5 text-white" />
        </span>
        <div className="min-w-0">
          <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-base leading-tight">
            Pozovi kolegu - zaradi Pro
          </h3>
          <p className="text-[13px] text-steel leading-snug mt-0.5">
            Za svake {REWARD_EVERY} dovedene firme dobijaš <strong className="text-gray-900">1 mjesec Pro gratis</strong>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <code className="flex-1 min-w-0 truncate bg-white border border-orange-100 rounded-xl px-3 py-2.5 text-xs text-gray-700">
          {link}
        </code>
        <button
          type="button"
          onClick={copy}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 shrink-0 ${
            copied ? 'bg-green-500 text-white' : 'bg-ink text-white hover:bg-ink-800'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Kopirano!' : 'Kopiraj'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <Users className="w-4 h-4 text-brand-orange" />
          Dovedeno: <strong>{count}</strong>
          {earned > 0 && (
            <span className="text-green-700">· zarađeno {earned} {earned === 1 ? 'mjesec' : 'mjeseca'} Pro</span>
          )}
        </span>
        {count >= REWARD_EVERY && (
          <a
            href={`mailto:info@zaposli.ba?subject=${encodeURIComponent('Referral nagrada - Pro mjesec')}&body=${encodeURIComponent(`Doveo sam ${count} firmi preko referral linka. Molim aktivaciju Pro nagrade.`)}`}
            className="text-xs font-bold text-brand-orange hover:underline shrink-0"
          >
            Zatraži nagradu →
          </a>
        )}
      </div>
      <div className="h-1.5 bg-white rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-orange to-amber-400 rounded-full transition-all"
          style={{ width: `${(progress / REWARD_EVERY) * 100}%` }}
        />
      </div>
    </div>
  );
}
