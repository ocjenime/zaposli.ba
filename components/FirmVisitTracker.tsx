'use client';

import { useEffect, useRef } from 'react';
import { recordFirmVisit } from '@/lib/analytics';

interface FirmVisitTrackerProps {
  firmId: string;
}

export default function FirmVisitTracker({ firmId }: FirmVisitTrackerProps) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    recordFirmVisit(firmId, {
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }, [firmId]);

  return null;
}
