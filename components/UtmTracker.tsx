'use client';

import { useEffect } from 'react';
import { saveRefFromUrl, saveUtmFromUrl } from '@/lib/referral';

/** Bilježi ?ref= i utm_* sa prvog dolaska u localStorage. Ne renderuje ništa. */
export default function UtmTracker() {
  useEffect(() => {
    saveRefFromUrl();
    saveUtmFromUrl();
  }, []);
  return null;
}
