'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { isFirmRole } from '@/lib/roles';

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
      const { data, error } = await callbackSupabase.auth.exchangeCodeForSession(
        window.location.href
      );
      if (error || !data.session) {
        console.error('Auth callback error:', error);
        router.push('/prijava/?error=Auth+failed');
        return;
      }

      const user = data.session.user;
      const { data: profile, error: profileError } = await callbackSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile lookup error:', profileError);
      }

      let isAdmin = false;
      const { data: adminData } = await callbackSupabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      isAdmin = adminData?.is_admin ?? false;

      if (isAdmin) {
        router.push('/admin/');
      } else if (isFirmRole(profile?.role ?? null)) {
        router.push('/dashboard/firma/');
      } else {
        router.push('/dashboard/');
      }
    };
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud">
      <p className="text-steel">Prijavljivanje...</p>
    </div>
  );
}
