import React, { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthContext } from "@/providers/authProvider";
import { AlertTriangle, BellElectricIcon, BellIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardHeader({ breadcrumbItems }) {
  const { profile } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (!profile.email_verified) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [profile.email_verified, window.location.href]);

  return (
    <header className={`flex ${showAlert ? 'h-30' : 'h-16'} shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12`}>
      <div className="flex items-center gap-1 px-4 w-full justify-between flex-col">
        <div className="flex items-center justify-between gap-2 w-full">
         <div className="flex items-center gap-2 ">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem
                    className={
                      index !== breadcrumbItems.length - 1
                        ? "hidden md:block"
                        : ""
                    }
                  >
                    {index !== breadcrumbItems.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link to={item.to}>{item.title}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index !== breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          </div>
          <div>
         
          </div>
        </div>

        {/* Tailwind-only alert for unverified email with close button */}
        {showAlert && (
          <div className="flex items-center relative gap-2 w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800 shadow-sm relative">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Email not verified. Please check your inbox for the verification email. If you can't find it, try checking your spam folder or contact our support team for assistance.</span>
            <button className="absolute top-2 cursor-pointer right-2 text-red text-sm font-bold uppercase rounded-full" onClick={() => setShowAlert(false)}><XIcon /></button>
          </div>
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;
