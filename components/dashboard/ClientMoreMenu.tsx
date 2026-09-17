'use client';

import Link from 'next/link';
import { X, User, FolderOpen, MessageSquare, Bell, Sun, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';

interface ClientMoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function ClientMoreMenu({ open, onClose }: ClientMoreMenuProps) {
  const { signOut } = useAuth();

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 bg-white dark:bg-ink-950 rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-ink-800">
          <span className="font-bold text-gray-900 dark:text-white">Više opcija</span>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-white/80"
            aria-label="Zatvori"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          <Link
            href="/dashboard/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
          >
            <FolderOpen className="w-5 h-5 text-brand-orange" /> Dashboard
          </Link>
          <Link
            href="/dashboard/profil/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
          >
            <User className="w-5 h-5 text-brand-orange" /> Moj profil
          </Link>
          <Link
            href="/dashboard/razgovor/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-brand-orange" /> Poruke
          </Link>
          <div className="flex items-center justify-between px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors">
            <span className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-brand-orange" /> Obavještenja
            </span>
            <NotificationBell />
          </div>
          <div className="flex items-center justify-between px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors">
            <span className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-brand-orange" /> Tema
            </span>
            <ThemeToggle />
          </div>
          <Link
            href="/dashboard/?tab=settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-white/90 font-medium hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors"
          >
            <Settings className="w-5 h-5 text-brand-orange" /> Postavke
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              signOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Odjavi se
          </button>
        </nav>
      </div>
    </div>
  );
}
