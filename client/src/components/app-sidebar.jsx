import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Layers,
  User,
  Package,
  Logs,
  BellIcon,
  QrCodeIcon,
  BotIcon,
  FileIcon,
  LayoutDashboardIcon,
  Moon,
  Sun,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { AuthContext } from "@/providers/authProvider";
import { useNotifications } from "@/providers/notificationProvider";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function AppSidebar({ ...props }) {
  const { profile } = useContext(AuthContext);
  const { notifications } = useNotifications();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };
  
  const isActive = (path) => {
    if (!path) return false;
  
    // Exact match only for dashboard
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
  
    // Nested match for other items
    return location.pathname.startsWith(path) && path !== "/";
  };
  
  
  // Check if any submenu item is active
  const hasActiveChild = (items = []) => {
    return items.some(item => isActive(item.url));
  };

  useEffect(() => {
    if (Array.isArray(notifications)) {
      const unreadCount = notifications.filter(
        (notification) => !notification.read
      ).length;
      setUnreadNotificationsCount(unreadCount);
    }
  }, [notifications]);

  // Debugging the profile properly
  console.log("profile:", profile);

  // Guard clause: if profile is missing or invalid, do not render
  if (
    !profile ||
    typeof profile !== "object" ||
    !profile.username ||
    profile.username === "undefined"
  ) {
    console.error("profile error:", profile);

    return null; // or show a spinner/loading UI
  }

  const userPermissions =
    profile?.roles_users_role_idToroles?.permissions ?? [];

  const data = {
    user: {
      username: profile.username,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
    },
    navMain: [
      {
        title: "Products",
        url: "#",
        icon: Package,
        isActive: true,
        items: [
          {
            title: "View Product",
            url: "/dashboard/tanent-products",
            description: "View all available products",
            permissions: ["PRODUCT_READ"],
          },
          {
            title: "View Product Status",
            url: "/dashboard/tanent-product-status",
            description: "View all product statuses",
            permissions: ["PRODUCT_STATUS_READ"],
          },
        ],
      },
      {
        title: "QR Generator",
        url: "#",
        icon: QrCodeIcon,
        isActive: false,
        items: [
          {
            title: "Create QR",
            url: "/dashboard/tanent-qr-generator",
            description: "View all available products",
            permissions: ["PRODUCT_CREATE"],
          },
          {
            title: "Config ScanPage",
            url: "/dashboard/tanent-qr-config",
            description: "Add a new product to the system",
            permissions: ["PRODUCT_CREATE"],
          },
        ],
      },
      {
        title: "Categories",
        url: "#",
        icon: Layers,
        items: [
          {
            title: "View Categories",
            url: "/dashboard/tanent-categories",
            description: "View all categories",
            permissions: ["CATEGORY_READ"],
          },
        ],
      },
      {
        title: "Users",
        url: "#",
        icon: User,
        items: [
          {
            title: "View Users",
            url: "/dashboard/tanent-users",
            description: "Manage and view all users",
            permissions: ["USER_READ"],
          },
          {
            title: "View Roles",
            url: "/dashboard/tanent-roles",
            description: "Manage user roles and permissions",
            permissions: [
              "ROLE_CREATE",
              "ROLE_READ",
              "ROLE_UPDATE",
              "ROLE_DELETE",
            ],
          },
        ],
      },
      {
        title: "Document Center",
        url: "#",
        icon: FileIcon,
        items: [
          {
            title: "View All Docs",
            url: "/dashboard/document-center",
            description: "Overview of the system",
            permissions: ["DOCUMENT_CREATE", "DOCUMENT_READ"],
          },
        ],
      },
      {
        title: "TrackBot",
        url: "#",
        icon: BotIcon,
        items: [
          {
            title: "View Chats",
            url: "/dashboard/trackbot",
            description: "Overview of the system",
          }
        ],
      },
      // {
      //   title: "Documentation",
      //   url: "#",
      //   icon: BookOpen,
      //   items: [
      //     {
      //       title: "Introduction",
      //       url: "#",
      //       description: "Overview of the system",
      //     },
      //     {
      //       title: "Get Started",
      //       url: "#",
      //       description: "Step-by-step guide for getting started",
      //     },
      //     {
      //       title: "Tutorials",
      //       url: "#",
      //       description: "Learn with tutorials on how to use the platform",
      //     },
      //     {
      //       title: "Changelog",
      //       url: "#",
      //       description: "Keep track of updates and new features",
      //     },
      //   ],
      // },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="
            data-[state=open]:bg-sidebar-accent
            data-[state=open]:text-sidebar-accent-foreground
            hover:bg-transparent
            hover:text-inherit
            focus:bg-transparent
            focus:text-inherit
            active:bg-transparent
            active:text-inherit
          "
        >
          <div className="bg-sidebar-secondary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <img src="/favicon.png" alt="Logo" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-xl">TrackSure</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full gap-0">
      <SidebarGroup className="pb-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="dashboard">
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboardIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain 
          items={data.navMain.map(item => ({
            ...item,
            isActive: hasActiveChild(item.items)
          }))} 
          userPermissions={userPermissions} 
          currentPath={location.pathname}
        />
        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="activity-logs">
                <SidebarMenuButton asChild isActive={isActive('/dashboard/tanent-activity-logs')}>
                  <Link to="/dashboard/tanent-activity-logs" className="flex items-center gap-3">
                    <Logs className="h-5 w-5" />
                    <span>Activity Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="notifications">
                <SidebarMenuButton asChild isActive={isActive('/dashboard/tanent-notifications')}>
                  <Link
                    to="/dashboard/tanent-notifications"
                    className="relative flex items-center gap-3"
                  >
                    <BellIcon className="h-5 w-5" />
                    <span>Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute bg-red-600 text-white rounded-4xl w-5 h-5 text-sm text-center right-2">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto">
        <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Label htmlFor="theme-toggle">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </Label>
    </div>
        </div>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
