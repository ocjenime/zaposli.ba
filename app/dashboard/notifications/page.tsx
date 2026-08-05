'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { getNotificationHref, formatNotificationTime } from '@/lib/notifications';
import type { Notification } from '@/lib/types';
import { Bell, Check, Trash2, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

const PAGE_SIZE = 50;

export default function NotificationsPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/prijava/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadNotifications(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadNotifications(reset = false) {
    if (!user) return;
    if (reset) setLoadingNotifications(true);
    else setLoadingMore(true);
    setError('');

    const offset = reset ? 0 : notifications.length;
    const { data, error: err } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (err) {
      setError('Došlo je do greške prilikom učitavanja obavještenja.');
      console.error('loadNotifications error:', err);
    } else {
      const list = (data as Notification[]) || [];
      setNotifications((prev) => (reset ? list : [...prev, ...list]));
      setHasMore(list.length === PAGE_SIZE);
    }

    if (reset) setLoadingNotifications(false);
    else setLoadingMore(false);
  }

  async function markRead(id: string) {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('markRead error:', err);
    }
  }

  async function markAllRead() {
    if (!user) return;
    setActionId('all');
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('markAllRead error:', err);
    } finally {
      setActionId(null);
    }
  }

  async function deleteNotification(id: string) {
    if (!user) return;
    setActionId(id);
    try {
      await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('deleteNotification error:', err);
      setError('Nije uspjelo brisanje obavještenja.');
    } finally {
      setActionId(null);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Obavještenja</h1>
              <p className="text-steel text-sm">
                {unreadCount > 0
                  ? `${unreadCount} nepročitanih obavještenja`
                  : 'Sva obavještenja su pročitana'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  disabled={actionId === 'all'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-brand-orange border-2 border-brand-orange hover:bg-primary-50 transition-colors disabled:opacity-50"
                >
                  {actionId === 'all' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Označi sve kao pročitano
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {loadingNotifications ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje obavještenja...
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Nemate obavještenja</h3>
              <p className="text-steel text-sm">Nova obavještenja će se pojaviti ovdje.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => {
                  const href = getNotificationHref(n, role);
                  const isBusy = actionId === n.id;

                  const content = (
                    <div className="flex items-start gap-3 px-4 py-4">
                      <div
                        className={`shrink-0 w-2 h-2 mt-2 rounded-full ${
                          n.read ? 'bg-transparent' : 'bg-brand-orange'
                        }`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-steel mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{formatNotificationTime(n.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markRead(n.id);
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                            aria-label="Označi kao pročitano"
                            title="Označi kao pročitano"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          disabled={isBusy}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          aria-label="Izbriši obavještenje"
                          title="Izbriši obavještenje"
                        >
                          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );

                  if (href) {
                    return (
                      <Link
                        key={n.id}
                        href={href}
                        onClick={() => markRead(n.id)}
                        className={`block transition-colors hover:bg-gray-50 ${
                          n.read ? 'bg-white' : 'bg-orange-50/40'
                        }`}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={n.id}
                      className={`transition-colors hover:bg-gray-50 ${
                        n.read ? 'bg-white' : 'bg-orange-50/40'
                      }`}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => loadNotifications(false)}
                    disabled={loadingMore}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-brand-orange hover:bg-orange-50 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...
                      </span>
                    ) : (
                      'Učitaj još'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            href="/dashboard/"
            className="inline-flex items-center text-sm text-steel hover:text-gray-900 mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Nazad na dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
