import type { NotificationListResponse, UnreadCountResponse, MarkAsReadResponse } from "@/types/notification";
import { api } from "./axios";

export const listNotificationsApi = (
  page: number = 1,
  limit: number = 10
) => {
  return api.get<NotificationListResponse>(
    `/api/notifications?page=${page}&limit=${limit}`
  );
};

export const markNotificationAsReadApi = (id: number) => {
  return api.put<MarkAsReadResponse>(
    `/api/notifications/${id}/read`
  );
};

export const countUnreadNotificationsApi = () => {
  return api.get<UnreadCountResponse>(
    `/api/notifications/unread/count`
  );
};
