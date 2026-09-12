'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  value: string; // npr. "12,500+" ili "4.8"
  className?: string;
}

export default function Counter({ value, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStarted(true),
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const match = value.match(/^([\d.,]+)(.*)$/);
    if (!match) return;
    const raw = match[1];
    const suffix = match[2];
    /* bs thousands format: "1.234" = 1234 (dot followed by exactly 3 digits);
       decimal format: "4.8" (dot followed by 1-2 digits) */
    const isThousands = /^\d{1,3}(\.\d{3})+$/.test(raw);
    const isDecimal = !isThousands && raw.includes('.');
    const target = isThousands ? parseInt(raw.replace(/\./g, ''), 10) : parseFloat(raw.replace(',', '.'));
    const duration = 1200;
    const start = performance.now();

    const formatInt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    let frame: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = target * eased;
      setDisplay(
        (isDecimal ? current.toFixed(1) : formatInt(Math.round(current))) + suffix
      );
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
