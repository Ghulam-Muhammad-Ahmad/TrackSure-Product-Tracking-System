"use client"

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router-dom';

// Permission filtering function
function hasPermission(requiredPermissions, userPermissions) {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

export function NavMain({
  items,
  userPermissions
}) {
  const location = useLocation();

  // Filter items by permissions
  const filteredItems = items.map((item) => {
    const filteredSubItems = item.items?.filter((subItem) =>
      subItem.permissions ? hasPermission(subItem.permissions, userPermissions) : true
    );
    return {
      ...item,
      items: filteredSubItems,
    };
  }).filter(item => item.items.length > 0);

  // Find the first item that has an active subItem
  const getDefaultOpenItemTitle = () => {
    for (const item of filteredItems) {
      if (item.items.some(subItem => subItem.url === location.pathname)) {
        return item.title;
      }
    }
    return null;
  };

  const [openItemTitle, setOpenItemTitle] = useState(getDefaultOpenItemTitle);

  // Update open group on route change (optional: if you want it to react to location changes dynamically)
  useEffect(() => {
    setOpenItemTitle(getDefaultOpenItemTitle());
  }, [location.pathname]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const isOpen = openItemTitle === item.title;

          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={() => setOpenItemTitle(isOpen ? null : item.title)}
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subItem.url}
                            className={`block py-2 pl-4 pr-4 rounded ${
                              location.pathname === subItem.url
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "hover:bg-sidebar-secondary hover:text-black"
                            }`}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
