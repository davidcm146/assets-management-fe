"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, FileText, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    title: "Quản lý phiếu mượn",
    href: "/loan-slips",
    icon: FileText,
  },
  {
    title: "Nhật ký",
    href: "/audit-logs",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3 border-b group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <Link
          to="/"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              Quản lý Phiếu mượn
            </span>
            <span className="text-[11px] text-sidebar-foreground/60">
              Hệ thống quản lý
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[11px] tracking-wider">
            Điều hướng
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <SidebarSeparator />
        <div className="px-2 py-2">
          <p className="text-[11px] text-sidebar-foreground/40">
            Phiên bản 1.0.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
