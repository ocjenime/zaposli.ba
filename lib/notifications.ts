import type { Notification } from '@/lib/types';

export function getNotificationHref(notification: Notification, role: string | null): string | undefined {
  const { type, job_id } = notification;
  if (!job_id) return undefined;

  if (type === 'bid_accepted') {
    return `/dashboard/razgovor/?job_id=${job_id}`;
  }

  if (type === 'new_job') {
    return role === 'firm' || role === 'majstor'
      ? `/dashboard/firma/?expandJobId=${job_id}`
      : `/dashboard/poslovi/?id=${job_id}`;
  }

  // Default job-related routes
  return `/dashboard/poslovi/?id=${job_id}`;
}

export function formatNotificationTime(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNotificationDate(iso: string) {
  return new Date(iso).toLocaleDateString('bs-BA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
