import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { useNotifications } from "@/providers/notificationProvider";

export default function TenantNotifications() {
  const { notifications, markAsRead } = useNotifications();
  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    setLocalNotifications(Array.isArray(notifications) ? notifications : []);
  }, [notifications]);

  const markAll = () => {
    const ids = localNotifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);
    markAsRead(ids);
    toast.success("All notifications marked as read");
  };

  const formatDate = (date) =>
    date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

  return (
    <>
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🔔 Notifications</h1>
          <Button variant="outline" size="sm" onClick={markAll}>
            Mark all as read
          </Button>
        </div>

        {localNotifications.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            🎉 You have no notifications.
          </p>
        ) : (
          <div className="space-y-4">
            {localNotifications.map((n) => (
              <div key={n.id}>
                <Card
                  className={`p-4 flex justify-between items-start relative rounded-2xl gap-0 border ${
                    n.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white shadow-md border-gray-100"
                  }`}
                >
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      {n.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {n.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(new Date(n.date))}
                    </p>
                  </div>

                  <div className="flex items-center mt-3 space-x-2">
                    {!n.read && (
                      <Badge variant="secondary" key="new-badge">
                        New
                      </Badge>
                    )}
                    {n.tags.map((tag, index) => (
                      <Badge
                        variant="secondary"
                        className="capitalize"
                        key={`tag-${index}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 absolute top-2 right-2"
                        onClick={() => markAsRead(n.id)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toaster richColors position="bottom-right" />
    </>
  );
}
