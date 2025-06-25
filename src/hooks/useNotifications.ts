import { useState, useEffect } from 'react';
import { NotificationSystem, Notification, NotificationSettings } from '../utils/notification-system';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(NotificationSystem.getSettings());

  useEffect(() => {
    // Initialize notification system
    NotificationSystem.initialize();

    // Subscribe to notifications
    const unsubscribe = NotificationSystem.subscribe(setNotifications);

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    NotificationSystem.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    NotificationSystem.markAllAsRead();
  };

  const removeNotification = (notificationId: string) => {
    NotificationSystem.removeNotification(notificationId);
  };

  const clearAll = () => {
    NotificationSystem.clearAll();
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    NotificationSystem.updateSettings(newSettings);
    setSettings(NotificationSystem.getSettings());
  };

  const triggerTestNotification = () => {
    NotificationSystem.triggerTestNotification();
  };

  const unreadCount = NotificationSystem.getUnreadCount();

  return {
    notifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,
    triggerTestNotification
  };
};