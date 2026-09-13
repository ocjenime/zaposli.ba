import { supabase } from './supabase';

export interface FirmVisitStats {
  total: number;
  thisMonth: number;
  today: number;
}

export interface DailyVisit {
  date: string;
  count: number;
}

export interface ReferrerCount {
  referrer: string;
  count: number;
}

export async function recordFirmVisit(
  firmId: string,
  metadata?: { referrer?: string; path?: string }
): Promise<void> {
  try {
    await supabase.from('firm_visits').insert({
      firm_id: firmId,
      referrer: metadata?.referrer || null,
      path: metadata?.path || null,
    });
  } catch {
    // fail silently so analytics never break the profile page
  }
}

export async function getFirmVisitStats(firmId: string): Promise<FirmVisitStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [totalRes, monthRes, todayRes] = await Promise.all([
    supabase
      .from('firm_visits')
      .select('*', { count: 'exact', head: true })
      .eq('firm_id', firmId),
    supabase
      .from('firm_visits')
      .select('*', { count: 'exact', head: true })
      .eq('firm_id', firmId)
      .gte('visited_at', startOfMonth),
    supabase
      .from('firm_visits')
      .select('*', { count: 'exact', head: true })
      .eq('firm_id', firmId)
      .gte('visited_at', startOfDay),
  ]);

  return {
    total: totalRes.count ?? 0,
    thisMonth: monthRes.count ?? 0,
    today: todayRes.count ?? 0,
  };
}

export async function getFirmVisitDaily(firmId: string, days = 30): Promise<DailyVisit[]> {
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('firm_visits')
    .select('visited_at')
    .eq('firm_id', firmId)
    .gte('visited_at', start.toISOString())
    .order('visited_at', { ascending: true });

  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    counts.set(d.toISOString().slice(0, 10), 0);
  }

  data.forEach((row) => {
    const key = new Date(row.visited_at).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

export async function getFirmVisitReferrers(
  firmId: string,
  limit = 5
): Promise<ReferrerCount[]> {
  const { data, error } = await supabase
    .from('firm_visits')
    .select('referrer')
    .eq('firm_id', firmId)
    .not('referrer', 'is', null);

  if (error || !data) return [];

  const grouped = new Map<string, number>();
  data.forEach((row) => {
    const host = normalizeReferrer(row.referrer);
    grouped.set(host, (grouped.get(host) || 0) + 1);
  });

  return Array.from(grouped.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function normalizeReferrer(referrer: string | null): string {
  if (!referrer) return 'Direktno / nepoznato';
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'Direktno / nepoznato';
  }
}
