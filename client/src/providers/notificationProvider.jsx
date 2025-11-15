 import { API } from '@/config/api';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './authProvider';

const WS_URL = API.NOTIFY_WS;
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(notifications);
  const ws = useRef(null);
  const { token } = useContext(AuthContext);

  // Keep ref in sync with state to avoid stale closure in WS handler
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    if (!token) return;

    const wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      console.log("got message", event.data);
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'notification') {
          const next = msg.payload;
          setNotifications(next);
          console.log("notification updated");
          // Check if notifications state is not set or if it's already set, get the newest notification
          next.forEach(notification => {
            if (notification.toShow) {
              // Send the notification as a JS notification to the browser
              if (window.Notification && Notification.permission === "granted") {
                new Notification("TrackSure - " + notification.title, { body: notification.description });
              }
            }
          });
        } else {
          console.log('Notification payload unchanged, skipping update');
        }
      } catch (err) {
        console.error('WebSocket message parse error', err);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
      // Optionally implement auto-reconnect
    };

    return () => {
      ws.current?.close();
    };
  }, [token]);

  const markAsRead = async (ids) => {
    try {
      const response = await fetch(`${API.NOTIFICATION_UPDATE_READ}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-jwt-bearer": token,
        },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }
      // const updatedNotifications = await response.json();
      // setNotifications(updatedNotifications);
      console.log("Notifications marked as read");
    } catch (error) {
      console.error('Error marking notifications as read', error);
    }
  };

  const sendMessage = (payload) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, sendMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
