'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const themes = [
  { key: 'light', label: 'Svijetla', icon: Sun },
  { key: 'dark', label: 'Tamna', icon: Moon },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-ink-800 animate-pulse"
        aria-label="Tema"
      />
    );
  }

  const active = theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-gray-600 dark:text-gray-300 transition-colors"
        aria-label="Tema"
        aria-expanded={isOpen}
      >
        {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-white dark:bg-ink-800 shadow-float border border-gray-100 dark:border-ink-700 z-50 overflow-hidden">
          {themes.map((t) => {
            const ItemIcon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTheme(t.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-ink-700 text-brand-orange dark:text-brand-orange font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-700'
                }`}
              >
                <ItemIcon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
