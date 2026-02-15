import {
  listNotificationsApi,
  markNotificationAsReadApi,
  countUnreadNotificationsApi,
} from "@/api/notification.api";
import { getApiError } from "@/api/error-handler";
import type {
  NotificationListResponse,
  MarkAsReadResponse,
} from "@/types/notification";

export const fetchNotifications = async (
  page: number = 1,
  limit: number = 10
): Promise<NotificationListResponse> => {
  try {
    const res = await listNotificationsApi(page, limit);
    return res.data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const markNotificationAsRead = async (
  id: number
): Promise<MarkAsReadResponse> => {
  try {
    const res = await markNotificationAsReadApi(id);
    return res.data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const fetchUnreadCount = async (): Promise<number> => {
  try {
    const res = await countUnreadNotificationsApi();
    return res.data.unread_count;
  } catch (error) {
    throw getApiError(error);
  }
};
