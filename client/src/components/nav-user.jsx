"use client"

import {
  BadgeCheck,
  Lock,
  ChevronsUpDown,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useNavigate } from "react-router-dom"
export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()
  const avatarfallbacktext = (user.first_name && user.last_name)
    ? (user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase())
    : 'NA';

  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.name} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg text-sm">{avatarfallbacktext}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.first_name + " " + user.last_name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg text-sm">{avatarfallbacktext}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight" >
                  <span className="truncate font-medium">{user.first_name + " " +  user.last_name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem  onClick={()=>{navigate("/dashboard/account")}} className="cursor-pointer">
                <Settings />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={()=>{navigate("/dashboard/account?action=change-password")}} className="cursor-pointer">
                <Lock />
                Change Password
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>{navigate("/logout")}} className="cursor-pointer">
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
