'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import useFirmActivityHeartbeat from '@/lib/hooks/useFirmActivityHeartbeat';

export default function FirmActivityTracker() {
  const { user, role } = useAuth();
  const [firmId, setFirmId] = useState<string | null>(null);
  const isFirm = isFirmRole(role);

  useFirmActivityHeartbeat(firmId);

  useEffect(() => {
    if (!user || !isFirm) {
      setFirmId(null);
      return;
    }

    let cancelled = false;
    supabase
      .from('firms')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('FirmActivityTracker error:', error);
          return;
        }
        const id = data?.id ?? null;
        setFirmId(id);
      });

    return () => {
      cancelled = true;
    };
  }, [user, isFirm]);

  return null;
}
