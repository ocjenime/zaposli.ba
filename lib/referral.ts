import type { SupabaseClient } from '@supabase/supabase-js';

const REF_KEY = 'zaposli-ref';
const UTM_KEY = 'zaposli-utm';

export interface StoredUtm {
  source: string;
  medium?: string;
  campaign?: string;
}

function safeGet(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  } catch {}
}

/** Sačuvaj ?ref=<firm_slug> iz URL-a za kasniju atribuciju pri registraciji. */
export function saveRefFromUrl(): string | null {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref')?.trim();
    if (ref) {
      safeSet(REF_KEY, ref);
      return ref;
    }
  } catch {}
  return safeGet(REF_KEY);
}

export function getStoredRef(): string | null {
  return safeGet(REF_KEY);
}

export function clearStoredRef() {
  safeRemove(REF_KEY);
}

/** Sačuvaj utm_* parametre sa prvog dolaska (ne prepisuj postojeće). */
export function saveUtmFromUrl() {
  try {
    if (safeGet(UTM_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source')?.trim();
    if (!source) return;
    const utm: StoredUtm = {
      source,
      medium: params.get('utm_medium')?.trim() || undefined,
      campaign: params.get('utm_campaign')?.trim() || undefined,
    };
    safeSet(UTM_KEY, JSON.stringify(utm));
  } catch {}
}

export function getStoredUtm(): StoredUtm | null {
  try {
    const raw = safeGet(UTM_KEY);
    return raw ? (JSON.parse(raw) as StoredUtm) : null;
  } catch {
    return null;
  }
}

/** Nađi vlasnika firme po slugu (javno čitljivo). */
export async function resolveReferrerId(
  supabase: SupabaseClient,
  firmSlug: string
): Promise<{ ownerId: string; firmName: string } | null> {
  const { data } = await supabase
    .from('firms')
    .select('owner_id, name')
    .eq('slug', firmSlug)
    .maybeSingle();
  if (!data) return null;
  return { ownerId: data.owner_id as string, firmName: data.name as string };
}

/**
 * Upiši referred_by + utm_source na profil novog korisnika.
 * Poziva se nakon registracije (direktno) i u auth callbacku (email potvrda).
 */
export async function applyAttribution(supabase: SupabaseClient, userId: string) {
  try {
    const updates: { referred_by?: string; utm_source?: string } = {};

    const refSlug = getStoredRef();
    if (refSlug) {
      const ref = await resolveReferrerId(supabase, refSlug);
      // Ne dozvoli samopozivanje
      if (ref && ref.ownerId !== userId) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('referred_by')
          .eq('id', userId)
          .maybeSingle();
        if (existing && !existing.referred_by) {
          updates.referred_by = ref.ownerId;
        }
      }
      clearStoredRef();
    }

    const utm = getStoredUtm();
    if (utm?.source) {
      updates.utm_source = utm.medium
        ? `${utm.source} / ${utm.medium}${utm.campaign ? ` / ${utm.campaign}` : ''}`
        : utm.source;
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from('profiles').update(updates).eq('id', userId);
    }
  } catch {
    // Atribucija ne smije srušiti registraciju
  }
}
