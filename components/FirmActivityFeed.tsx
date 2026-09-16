'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  Send,
  CheckCircle,
  FolderOpen,
  Mail,
  Star,
  MessageSquare,
  DollarSign,
  Crown,
  Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getNotificationHref } from '@/lib/notifications';
import { formatDate } from '@/lib/date';
import type { Notification } from '@/lib/types';

const typeMeta: Record<string, { icon: typeof Bell; tone: string }> = {
  new_job: { icon: FolderOpen, tone: 'text-brand-orange bg-brand-orange/10' },
  bid_received: { icon: Send, tone: 'text-blue-500 bg-blue-500/10' },
  bid_accepted: { icon: CheckCircle, tone: 'text-emerald-500 bg-emerald-500/10' },
  direct_request: { icon: Mail, tone: 'text-purple-500 bg-purple-500/10' },
  direct_request_accepted: { icon: CheckCircle, tone: 'text-emerald-500 bg-emerald-500/10' },
  direct_request_in_progress: { icon: Clock, tone: 'text-amber-500 bg-amber-500/10' },
  direct_request_done: { icon: CheckCircle, tone: 'text-emerald-500 bg-emerald-500/10' },
  direct_request_completed: { icon: Star, tone: 'text-brand-orange bg-brand-orange/10' },
  review: { icon: Star, tone: 'text-amber-500 bg-amber-500/10' },
  message: { icon: MessageSquare, tone: 'text-blue-500 bg-blue-500/10' },
  payment: { icon: DollarSign, tone: 'text-emerald-500 bg-emerald-500/10' },
  subscription_request: { icon: Crown, tone: 'text-brand-orange bg-brand-orange/10' },
  default: { icon: Bell, tone: 'text-steel bg-gray-100 dark:bg-ink-800' },
};

export default function FirmActivityFeed() {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);
      if (!error) {
        setNotifications((data as Notification[]) || []);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('FirmActivityFeed load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 5) return 'Upravo sada';
    if (minutes < 60) return `Prije ${minutes} min`;
    if (hours < 24) return `Prije ${hours} ${hours === 1 ? 'sat' : 'sata'}`;
    return `Prije ${days} dan${days === 1 ? '' : 'a'}`;
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-orange" />
          Šta se događa?
        </h3>
        <span className="text-xs font-medium text-steel">Zadnje aktivnosti</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-ink-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 dark:bg-ink-800 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 dark:bg-ink-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-6">
          <Bell className="w-8 h-8 text-steel/40 mx-auto mb-2" />
          <p className="text-sm text-steel">Još nema aktivnosti.</p>
          <p className="text-xs text-steel/70 mt-1">Ponude, poruke i recenzije pojavit će se ovdje.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => {
            const meta = typeMeta[n.type] || typeMeta.default;
            const Icon = meta.icon;
            const href = getNotificationHref(n, role);
            const content = (
              <div className="flex items-start gap-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-ink-800 transition-colors px-2 -mx-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    {n.title}
                  </p>
                  <p className="text-xs text-steel line-clamp-2 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{relativeTime(n.created_at)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-brand-orange mt-2 shrink-0" />}
              </div>
            );
            return href ? (
              <Link key={n.id} href={href} className="block">
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
