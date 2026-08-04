export type NotificationType =
  | 'bid_received'
  | 'bid_accepted'
  | 'new_job'
  | 'message'
  | 'system'
  | 'payment'
  | 'review'
  | 'direct_request'
  | 'direct_request_accepted'
  | 'direct_request_in_progress'
  | 'direct_request_done'
  | 'direct_request_completed'
  | 'direct_request_declined'
  | 'direct_request_cancelled'
  | 'direct_request_problem';

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
