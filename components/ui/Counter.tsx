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
    const target = parseFloat(match[1].replace(',', '.'));
    const suffix = match[2];
    const isDecimal = match[1].includes('.');
    const duration = 1200;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = target * eased;
      setDisplay(
        (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString('en-US')) + suffix
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
