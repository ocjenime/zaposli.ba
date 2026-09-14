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
  status: 'pending' | 'active' | 'expired' | 'rejected';
  ends_at: string | null;
  created_at: string;
  homepage_position: number | null;
  homepage_sticky_until: string | null;
  firms: {
    name: string | null;
    slug: string | null;
    city: string | null;
    logo_url: string | null;
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
      'id,title,description,image_url,banner_url,cta_url,ad_type,ends_at,created_at,firms(name,slug,city,logo_url,verified)'
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

  return (data || []) as unknown as PublicPromotedAd[];
}

export function getPromotedAdHref(ad: PublicPromotedAd): string {
  if (ad.cta_url) return ad.cta_url;
  return `/izdvojeni-oglasi/${ad.id}/`;
}

export function getAdTypeLabel(adType: PublicPromotedAd['ad_type']): string {
  return adType === 'worker_search' ? 'Tražim radnike' : 'Promocija';
}
