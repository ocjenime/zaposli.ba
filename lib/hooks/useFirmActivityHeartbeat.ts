'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function isOnline(lastActiveIso: string | null | undefined) {
  if (!lastActiveIso) return false;
  const last = new Date(lastActiveIso).getTime();
  return Date.now() - last < ONLINE_THRESHOLD_MS;
}

export function formatLastActive(lastActiveIso: string | null | undefined) {
  if (!lastActiveIso) return 'Nepoznato';
  const last = new Date(lastActiveIso).getTime();
  const diffMs = Date.now() - last;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diffMs < ONLINE_THRESHOLD_MS) return 'Online sada';
  if (minutes < 60) return `prije ${minutes} min`;
  if (hours < 24) return `prije ${hours} h`;
  if (days < 7) return `prije ${days} dana`;
  return new Date(lastActiveIso).toLocaleDateString('bs-BA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function useFirmActivityHeartbeat(firmId: string | null | undefined) {
  const firmIdRef = useRef(firmId);
  firmIdRef.current = firmId;

  useEffect(() => {
    if (!firmIdRef.current) return;

    const update = async () => {
      const id = firmIdRef.current;
      if (!id) return;
      await supabase
        .from('firms')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', id);
    };

    update();
    const interval = setInterval(update, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
}
