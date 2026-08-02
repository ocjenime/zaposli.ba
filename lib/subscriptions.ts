import { supabase } from './supabase';

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  bids_per_month: number;
  featured: boolean;
  verified_badge: boolean;
  priority_support: boolean;
  payment_provider?: string | null;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
  payment_link_url?: string | null;
  paypal_plan_id?: string | null;
  sort_order?: number;
}

export interface Subscription {
  id: string;
  firm_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  starts_at: string;
  ends_at: string | null;
  is_promo: boolean;
  notes: string | null;
  created_at: string;
  plans: Plan | null;
}

export async function getPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_public', true)
    .order('price_monthly', { ascending: true });
  if (error) throw error;
  return (data as Plan[]) || [];
}

export async function getCurrentSubscription(firmId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plans(*)')
    .eq('firm_id', firmId)
    .in('status', ['active', 'cancelled', 'paused'])
    .or('ends_at.is.null,ends_at.gt.now')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return data as unknown as Subscription;
}

export async function getBidsUsedThisMonth(firmId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count, error } = await supabase
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('firm_id', firmId)
    .gte('created_at', startOfMonth);
  if (error) throw error;
  return count ?? 0;
}

export async function getPlanAndUsage(firmId: string): Promise<{
  subscription: Subscription | null;
  bidsUsed: number;
  bidsLimit: number;
  canBid: boolean;
}> {
  const subscription = await getCurrentSubscription(firmId);
  const bidsUsed = await getBidsUsedThisMonth(firmId);
  // Fallback to free plan (5 bids) when no subscription record exists
  const bidsLimit = subscription?.plans?.bids_per_month ?? 5;
  const canBid = bidsLimit === 9999 || bidsUsed < bidsLimit;
  return { subscription, bidsUsed, bidsLimit, canBid };
}

export function planLabel(plan: Plan | null, fallback = 'Besplatno') {
  if (!plan) return fallback;
  return plan.name;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('bs-BA', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function remainingBidsText(bidsUsed: number, bidsLimit: number) {
  if (bidsLimit === 9999) return 'Neograničene ponude';
  const remaining = Math.max(0, bidsLimit - bidsUsed);
  return `${bidsUsed}/${bidsLimit} iskorišteno · ${remaining} preostalo`;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getNextResetDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export function getResetCountdownText() {
  const next = getNextResetDate();
  const now = new Date();
  const diff = next.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `Reset za ${days} dan${days === 1 ? '' : 'a'}`;
}
