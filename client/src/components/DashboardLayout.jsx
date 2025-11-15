// DashboardLayout.jsx
import React, { useContext } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import DashboardHeader from "./DashboardHeader";
const DashboardLayout = () => {
  const location = useLocation();
  // Split pathname into segments
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Build breadcrumb items dynamically
  const breadcrumbItems = pathnames.map((value, index) => {
    const to = '/' + pathnames.slice(0, index + 1).join('/');
    const title = value.charAt(0).toUpperCase() + value.slice(1);
    return { title, to };
  });
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
     <DashboardHeader breadcrumbItems={breadcrumbItems} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
