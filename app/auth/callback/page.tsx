'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );
      if (error) {
        router.push('/prijava?error=Auth+failed');
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
