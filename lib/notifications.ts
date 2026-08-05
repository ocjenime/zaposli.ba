import type { Notification } from '@/lib/types';

export function getNotificationHref(notification: Notification, role: string | null): string | undefined {
  const { type, job_id } = notification;

  // Messages always go to the conversation if we have a job id
  if (type === 'message' && job_id) {
    return `/dashboard/razgovor/?job_id=${job_id}`;
  }

  if (!job_id) return undefined;

  if (type === 'bid_accepted') {
    return `/dashboard/razgovor/?job_id=${job_id}`;
  }

  if (type === 'bid_received') {
    return role === 'firm' || role === 'majstor'
      ? `/dashboard/firma/?expandJobId=${job_id}`
      : `/dashboard/poslovi/?id=${job_id}`;
  }

  if (type === 'new_job') {
    return role === 'firm' || role === 'majstor'
      ? `/dashboard/firma/?expandJobId=${job_id}`
      : `/dashboard/poslovi/?id=${job_id}`;
  }

  if (
    type === 'direct_request' ||
    type === 'direct_quote_request' ||
    type === 'direct_request_problem' ||
    type === 'direct_request_cancelled' ||
    type === 'direct_request_declined'
  ) {
    return role === 'firm' || role === 'majstor'
      ? `/dashboard/firma/?directJobId=${job_id}`
      : `/dashboard/poslovi/?id=${job_id}`;
  }

  if (
    type === 'direct_request_accepted' ||
    type === 'direct_request_in_progress' ||
    type === 'direct_request_done'
  ) {
    return `/dashboard/poslovi/?id=${job_id}`;
  }

  if (type === 'direct_request_completed') {
    return role === 'firm' || role === 'majstor'
      ? `/dashboard/firma/?directJobId=${job_id}`
      : `/dashboard/recenzija/?job_id=${job_id}`;
  }

  if (type === 'review') {
    return role === 'firm' || role === 'majstor'
      ? `/dashboard/firma/?directJobId=${job_id}`
      : `/dashboard/poslovi/?id=${job_id}`;
  }

  if (type === 'payment') {
    return role === 'firm' || role === 'majstor'
      ? '/dashboard/firma/pretplata/'
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
