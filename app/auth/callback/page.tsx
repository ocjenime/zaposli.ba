'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { isFirmRole } from '@/lib/roles';
import { generateUniqueFirmSlug } from '@/lib/slugify';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use a dedicated client for the callback so the global client cannot
// auto-consume the auth code before we exchange it manually.
const callbackSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false,
    persistSession: true,
  },
});

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const url = new URL(window.location.href);
      const type = url.searchParams.get('type') as
        | 'signup'
        | 'recovery'
        | 'magiclink'
        | 'email_change'
        | 'invite'
        | null;
      const token = url.searchParams.get('token') || url.searchParams.get('code');
      const tokenHash = url.searchParams.get('token_hash');

      // Recovery flow: verify OTP and redirect to password reset page
      if (type === 'recovery' && (token || tokenHash)) {
        const { error } = await callbackSupabase.auth.verifyOtp({
          type: 'recovery',
          token: (token || tokenHash) as string,
          token_hash: tokenHash || token || '',
        });
        if (error) {
          console.error('Recovery verification error:', error);
          router.push('/prijava/?error=Recovery+failed');
          return;
        }
        router.push('/nova-lozinka/');
        return;
      }

      // Email change / magiclink / invite: verify OTP and redirect normally
      const otpTypes: Array<'signup' | 'magiclink' | 'email_change' | 'invite'> = ['signup', 'magiclink', 'email_change', 'invite'];
      const otpType = type && otpTypes.includes(type as any) ? (type as 'signup' | 'magiclink' | 'email_change' | 'invite') : null;
      if (otpType && (token || tokenHash)) {
        const { error } = await callbackSupabase.auth.verifyOtp({
          type: otpType,
          token: (token || tokenHash) as string,
          token_hash: tokenHash || token || '',
        });
        if (error) {
          console.error('OTP verification error:', error);
          router.push('/prijava/?error=Verification+failed');
          return;
        }
      } else {
        // OAuth or PKCE flow: exchange code for session
        const { data, error } = await callbackSupabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error || !data.session) {
          console.error('Auth callback error:', error);
          router.push('/prijava/?error=Auth+failed');
          return;
        }
      }

      const { data: sessionData } = await callbackSupabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.push('/prijava/?error=Auth+failed');
        return;
      }

      const { data: profile, error: profileError } = await callbackSupabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile lookup error:', profileError);
      }

      const isAdmin = profile?.is_admin ?? false;

      if (isAdmin) {
        router.push('/admin/');
        return;
      }

      if (isFirmRole(profile?.role ?? null)) {
        const { data: existingFirm } = await callbackSupabase
          .from('firms')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();
        if (!existingFirm) {
          const meta = user.user_metadata || {};
          const name = (meta.full_name as string) || (meta.name as string) || 'Firma';
          const slug = await generateUniqueFirmSlug(callbackSupabase, name);
          const { error: firmErr } = await callbackSupabase.from('firms').insert({
            owner_id: user.id,
            name,
            slug,
            email: user.email,
            phone: (meta.phone as string) || '',
          });
          if (firmErr) console.error('Firm creation error in callback:', firmErr);
        }
        router.push('/dashboard/firma/');
        return;
      }

      router.push('/dashboard/');
    };
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud">
      <p className="text-steel">Prijavljivanje...</p>
    </div>
  );
}
