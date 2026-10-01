import type { SupabaseClient } from '@supabase/supabase-js';

/** Izvuci storage putanju iz public URL-a (samo za naše ad bannere). */
export function adBannerStoragePath(url: string | null): string | null {
  if (!url) return null;
  const marker = '/job-images/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length);
  if (!path.startsWith('promoted-ads-banners/')) return null;
  return path;
}

/** Best-effort brisanje banner fajla iz storagea (ne smije srušiti glavnu akciju). */
export async function removeAdBannerFile(
  supabase: SupabaseClient,
  url: string | null
): Promise<void> {
  try {
    const path = adBannerStoragePath(url);
    if (!path) return;
    await supabase.storage.from('job-images').remove([path]);
  } catch {
    // best-effort čišćenje
  }
}

/** Novi ends_at: od postojećeg isteka (ako je u budućnosti) ili od danas, +30 dana. */
export function nextAdEndsAt(currentEndsAt: string | null): string {
  const now = new Date();
  const base =
    currentEndsAt && new Date(currentEndsAt).getTime() > now.getTime()
      ? new Date(currentEndsAt)
      : now;
  base.setDate(base.getDate() + 30);
  return base.toISOString();
}
