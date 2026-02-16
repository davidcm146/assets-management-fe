"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Notification } from "@/types/notification";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
} from "@/features/notifications/notification.service";

import {
  cn,
  formatNotificationDate, getNotificationTypeColor, getNotificationTypeLabel
} from "@/lib/utils";
import { handleApiError } from "@/api/error-handler";

interface NotificationListProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationList({ onNotificationClick }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [now, setNow] = useState(Date.now());

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUnread, setIsLoadingUnread] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(1);

  const limit = 10;

  const hasMore = notifications.length < total;

  useEffect(() => {
    const onFocus = async () => await loadUnreadCount();

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications(1);
    }
  }, [isOpen]);

  const loadUnreadCount = useCallback(async () => {
    try {
      setIsLoadingUnread(true);
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      handleApiError(err)
    } finally {
      setIsLoadingUnread(false);
    }
  }, []);

  const loadNotifications = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const res = await fetchNotifications(pageNum, limit);

      if (pageNum === 1) {
        setNotifications(res.items);
      } else {
        setNotifications((prev) => [...prev, ...res.items]);
      }

      setTotal(res.total);
      setPage(pageNum);
    } catch (err: any) {
      handleApiError(err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (
    e: React.MouseEvent,
    notification: Notification
  ) => {
    e.stopPropagation();

    if (notification.is_read) return;

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(
        { stopPropagation: () => { } } as React.MouseEvent,
        notification
      );
    }

    onNotificationClick?.(notification);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadNotifications(page + 1);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(id);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("h-5 w-5", isLoadingUnread && "animate-pulse")} />
          {unreadCount > 0 && !isLoadingUnread && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Thông báo</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        {isLoading && notifications.length === 0 ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Không có thông báo nào
          </div>
        ) : (
          <>
            <ScrollArea className="h-96">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 cursor-pointer hover:bg-accent ${!notification.is_read ? "bg-muted/50" : ""
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium">
                        {notification.title}
                      </h4>

                      {!notification.is_read && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>


                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.content}
                    </p>

                    <div className="flex justify-between mt-2">
                      <Badge
                        variant={getNotificationTypeColor(notification.type)}
                        className="text-xs"
                      >
                        {getNotificationTypeLabel(notification.type)}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {formatNotificationDate(notification.created_at, now)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {hasMore && (
              <div className="border-t p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Đang tải...
                    </>
                  ) : (
                    "Xem thêm"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
