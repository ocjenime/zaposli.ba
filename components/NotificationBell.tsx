'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { showToast } from '@/components/ToastProvider';
import { getNotificationHref } from '@/lib/notifications';
import type { Notification } from '@/lib/types';

export default function NotificationBell() {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function loadNotifications() {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error) {
        const list = (data as Notification[]) || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      }
    } catch (err) {
      console.error('loadNotifications error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!mounted || !user) return;
    loadNotifications();
  }, [mounted, user]);

  useEffect(() => {
    if (!mounted || !user) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const n = payload.new as Notification;
            setNotifications((prev) => [n, ...prev].slice(0, 20));
            setUnreadCount((c) => c + 1);
            const href = getNotificationHref(n, role);
            showToast(n.title, n.message, href);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const n = payload.new as Notification;
            setNotifications((prev) => prev.map((item) => (item.id === n.id ? n : item)));
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.warn('Notification realtime channel error');
          }
        });
    } catch (err) {
      console.warn('Notification realtime setup failed:', err);
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [mounted, user]);

  useEffect(() => {
    if (!mounted || !open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mounted, open]);

  async function markAllRead() {
    if (!user) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .in('id', unreadIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('markAllRead error:', err);
    }
  }

  async function markRead(id: string) {
    if (!user) return;
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('markRead error:', err);
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleDateString('bs-BA', { day: 'numeric', month: 'short' });
  }

  if (!mounted || !user) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200"
        aria-label="Obavještenja"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-[#ffffff] ring-2 ring-[#ffffff]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 mx-2 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:mx-0 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Obavještenja</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-brand-orange hover:text-brand-orange-dark font-medium flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Označi sve
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="sm:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Zatvori"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-sm text-steel text-center py-6">Učitavanje...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-steel text-center py-6">Nema obavještenja.</p>
            ) : (
              notifications.map((n) => {
                const href = getNotificationHref(n, role);

                const content = (
                  <div className="px-4 py-3 border-b border-gray-50 last:border-b-0 transition-colors hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-steel mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(n.created_at)}</p>
                  </div>
                );

                return href ? (
                  <Link
                    key={n.id}
                    href={href}
                    onClick={() => {
                      if (!n.read) markRead(n.id);
                      setOpen(false);
                    }}
                    className={`block ${n.read ? 'bg-white' : 'bg-orange-50/50'}`}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.read) markRead(n.id);
                    }}
                    className={`w-full text-left ${n.read ? 'bg-white' : 'bg-orange-50/50'}`}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-4 py-2.5">
            <Link
              href="/dashboard/notifications/"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-brand-orange hover:text-brand-orange-dark transition-colors"
            >
              Prikaži sve obavještenja
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
