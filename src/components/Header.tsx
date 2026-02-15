"use client";

import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth.context";
import { NotificationList } from "@/features/notifications/notification-list";
import type { Notification } from "@/types/notification";

export function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleNotificationClick = (notification: Notification) => {
        // Handle notification click here - navigate or perform actions
        console.log("Notification clicked:", notification);
    };

    const initials =
        user?.username
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase() ?? "?";

    return (
        <header className="sticky top-0 z-30 border-b pb-1 bg-card">
            <div className="flex h-14 justify-between items-center gap-4 px-4 md:px-6">
                <SidebarTrigger className="-ml-1" />

                <div className="flex items-center gap-2">
                    <NotificationList onNotificationClick={handleNotificationClick} />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 px-2"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                        {user?.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground capitalize">
                                        {user?.role}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Thông tin cá nhân
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
