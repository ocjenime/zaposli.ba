'use client';

import { useLayoutEffect } from 'react';

export default function ScrollToTop() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent the browser from restoring a previous scroll position on load/reload.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return null;
}
