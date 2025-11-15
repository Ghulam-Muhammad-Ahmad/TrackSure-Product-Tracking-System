import React, { useEffect, useState } from 'react';
import { Bell, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function NotificationsSettings() {
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
        console.log('Notification permission:', perm);
      });
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-primary" />
        <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {permission === 'default' && (
          <>
            <p className="text-sm text-muted-foreground">
              You haven't enabled notifications yet. Click below to allow them.
            </p>
            <Button onClick={handleRequestPermission}>Enable Notifications</Button>
          </>
        )}

        {permission === 'granted' && (
          <div className="flex items-center gap-3 text-green-600">
            <ShieldCheck className="w-5 h-5" />
            <p>Notifications are enabled. Now you will receive notifications from the system.</p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="flex items-start gap-3 text-red-500">
            <ShieldX className="w-5 h-5 mt-1" />
            <div>
              <p>Notifications are blocked.</p>
              <p className="text-sm text-muted-foreground">
                Please change your browser settings to enable them.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NotificationsSettings;
