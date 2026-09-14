'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Bell } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message?: string;
  link?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, message?: string, link?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastListeners: Array<(toast: Toast) => void> = [];

export function showToast(title: string, message?: string, link?: string) {
  const toast: Toast = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title,
    message,
    link,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleToast = (toast: Toast) => setToasts((prev) => [...prev, toast]);
    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== handleToast);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  /* each toast owns its own 6s auto-dismiss timer (set once on mount) */
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = (
      <div className="flex items-start gap-3 p-4 pr-10 bg-ink-800 rounded-xl shadow-xl border border-ink-800 pointer-events-auto relative">
      <div className="shrink-0 w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
        <Bell className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-white/70 mt-0.5 line-clamp-2">{toast.message}</p>
        )}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-lg text-white/50 hover:text-white/70 hover:bg-ink-800 transition-colors"
        aria-label="Zatvori obavještenje"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  if (toast.link) {
    return (
      <Link
        href={toast.link}
        onClick={() => onClose()}
        className="block animate-slide-in"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="animate-slide-in" onClick={onClose} role="status" aria-live="polite">
      {content}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
