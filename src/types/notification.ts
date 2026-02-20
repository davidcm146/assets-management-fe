export type NotificationType =
  | "loan_slip_overdue";

export interface Notification {
  id: number;
  recipient_id: number;
  sender_id: number | null;
  title: string;
  type: NotificationType;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  payload?: NotificationPayload
}

export interface NotificationPayload {
  entity: string;
  action: string;
  url: string;
  extra?: Record<string, unknown>;
}


export interface NotificationListResponse {
  items: Notification[];
  total: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkAsReadResponse {
  message: string;
}
