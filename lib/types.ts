export type NotificationType =
  | 'bid_received'
  | 'bid_accepted'
  | 'new_job'
  | 'message'
  | 'system'
  | 'payment'
  | 'review';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  job_id: string | null;
  created_at: string;
}
