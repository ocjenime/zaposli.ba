import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const publicAdsClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export interface PublicPromotedAd {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  banner_url: string | null;
  cta_url: string | null;
  ad_type: 'promotion' | 'worker_search';
  destination: 'homepage' | 'homepage_banner' | 'listing' | null;
  status: 'pending' | 'active' | 'expired' | 'rejected';
  ends_at: string | null;
  created_at: string;
  show_phone: boolean | null;
  homepage_position: number | null;
  homepage_sticky_until: string | null;
  /** true = firma ima aktivni Premium paket -> sticky vrh liste */
  is_premium?: boolean;
  firms: {
    name: string | null;
    slug: string | null;
    city: string | null;
    logo_url: string | null;
    phone: string | null;
    verified: boolean | null;
    average_rating: number | null;
    review_count: number | null;
  } | null;
}

export interface PromotedAdsListResponse {
  ads: PublicPromotedAd[];
  error: string | null;
}

export async function fetchActivePromotedAds(limit?: number): Promise<PublicPromotedAd[]> {
  let query = publicAdsClient
    .from('promoted_ads')
    .select(
      'id,title,description,image_url,banner_url,cta_url,ad_type,destination,ends_at,created_at,show_phone,firms(name,slug,city,logo_url,phone,verified,average_rating,review_count)'
    )
    .eq('status', 'active')
    .gt('ends_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (typeof limit === 'number' && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const ads = (data || []) as unknown as PublicPromotedAd[];

  // Označi Premium firme (sticky vrh) - ignoriši grešku, samo neće biti stickyja.
  try {
    const { data: premiumIds } = await publicAdsClient.rpc('get_premium_firm_ids');
    const premiumSet = new Set((premiumIds || []) as string[]);
    const firmIds = await resolveAdFirmIds(ads);
    for (const ad of ads) {
      const fid = firmIds.get(ad.id);
      ad.is_premium = !!fid && premiumSet.has(fid);
    }
  } catch {
    for (const ad of ads) ad.is_premium = false;
  }

  return ads;
}

async function resolveAdFirmIds(ads: PublicPromotedAd[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (ads.length === 0) return map;
  const { data } = await publicAdsClient
    .from('promoted_ads')
    .select('id, firm_id')
    .in('id', ads.map((a) => a.id));
  for (const row of (data || []) as { id: string; firm_id: string }[]) {
    map.set(row.id, row.firm_id);
  }
  return map;
}

export function getPromotedAdHref(ad: PublicPromotedAd): string {
  if (ad.cta_url) return ad.cta_url;
  return `/izdvojeni-oglasi/${ad.id}/`;
}

export function getAdTypeLabel(adType: PublicPromotedAd['ad_type']): string {
  return adType === 'worker_search' ? 'Tražim radnike' : 'Promocija';
}
