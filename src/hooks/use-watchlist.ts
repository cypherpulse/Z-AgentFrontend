import { useState, useEffect } from 'react';

// Types for watchlist and alerts
export interface WatchlistItem {
  address: string;
  name: string;
  symbol: string;
  image?: string;
  addedAt: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'price_above' | 'price_below' | 'volume_above' | 'volume_below';
  value: number; // price or volume value
  isActive: boolean;
  createdAt: number;
  triggeredAt?: number;
}

export interface AlertNotification {
  id: string;
  coinAddress: string;
  coinName: string;
  coinSymbol: string;
  alertType: 'price_above' | 'price_below' | 'volume_above' | 'volume_below';
  targetValue: number; // target price or volume
  currentValue: number; // current price or volume
  triggeredAt: number;
  isRead: boolean;
}

// Storage keys
const WATCHLIST_STORAGE_KEY = 'zora_watchlist';
const ALERTS_STORAGE_KEY = 'zora_alerts';
const NOTIFICATIONS_STORAGE_KEY = 'zora_notifications';

// Watchlist hooks
export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
      }
    }
  }, []);

  const saveWatchlist = (newWatchlist: WatchlistItem[]) => {
    setWatchlist(newWatchlist);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(newWatchlist));
  };

  const addToWatchlist = (coin: Omit<WatchlistItem, 'addedAt' | 'alerts'>) => {
    const existingIndex = watchlist.findIndex(item => item.address === coin.address);
    if (existingIndex >= 0) return; // Already in watchlist

    const newItem: WatchlistItem = {
      ...coin,
      addedAt: Date.now(),
      alerts: []
    };

    saveWatchlist([...watchlist, newItem]);
  };

  const removeFromWatchlist = (address: string) => {
    const newWatchlist = watchlist.filter(item => item.address !== address);
    saveWatchlist(newWatchlist);
  };

  const isInWatchlist = (address: string) => {
    return watchlist.some(item => item.address === address);
  };

  const addAlert = (coinAddress: string, alert: Omit<Alert, 'id' | 'createdAt'>) => {
    const newWatchlist = watchlist.map(item => {
      if (item.address === coinAddress) {
        const newAlert: Alert = {
          ...alert,
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now()
        };
        return {
          ...item,
          alerts: [...item.alerts, newAlert]
        };
      }
      return item;
    });
    saveWatchlist(newWatchlist);
  };

  const removeAlert = (coinAddress: string, alertId: string) => {
    const newWatchlist = watchlist.map(item => {
      if (item.address === coinAddress) {
        return {
          ...item,
          alerts: item.alerts.filter(alert => alert.id !== alertId)
        };
      }
      return item;
    });
    saveWatchlist(newWatchlist);
  };

  const toggleAlert = (coinAddress: string, alertId: string) => {
    const newWatchlist = watchlist.map(item => {
      if (item.address === coinAddress) {
        return {
          ...item,
          alerts: item.alerts.map(alert =>
            alert.id === alertId
              ? { ...alert, isActive: !alert.isActive }
              : alert
          )
        };
      }
      return item;
    });
    saveWatchlist(newWatchlist);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addAlert,
    removeAlert,
    toggleAlert
  };
};

// Alert monitoring hook
export const useAlertMonitor = () => {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
      }
    }
  }, []);

  const saveNotifications = (newNotifications: AlertNotification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifications));
  };

  const addNotification = (notification: Omit<AlertNotification, 'id' | 'triggeredAt' | 'isRead'>) => {
    const newNotification: AlertNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: Date.now(),
      isRead: false
    };

    saveNotifications([newNotification, ...notifications]);
  };

  const markAsRead = (notificationId: string) => {
    const newNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    saveNotifications(newNotifications);
  };

  const markAllAsRead = () => {
    const newNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    saveNotifications(newNotifications);
  };

  const deleteNotification = (notificationId: string) => {
    const newNotifications = notifications.filter(notification => notification.id !== notificationId);
    saveNotifications(newNotifications);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};

// Alert monitoring function (to be called periodically)
export const checkAlerts = (
  watchlist: WatchlistItem[],
  currentData: Record<string, { price: number; volume24h?: number }>,
  addNotification: (notification: Omit<AlertNotification, 'id' | 'triggeredAt' | 'isRead'>) => void
) => {
  watchlist.forEach(coin => {
    const coinData = currentData[coin.address];
    if (!coinData) return;

    coin.alerts.forEach(alert => {
      if (!alert.isActive || alert.triggeredAt) return;

      let shouldTrigger = false;
      let currentValue = 0;

      if (alert.type.startsWith('price_')) {
        currentValue = coinData.price;
        shouldTrigger =
          (alert.type === 'price_above' && currentValue >= alert.value) ||
          (alert.type === 'price_below' && currentValue <= alert.value);
      } else if (alert.type.startsWith('volume_') && coinData.volume24h !== undefined) {
        currentValue = coinData.volume24h;
        shouldTrigger =
          (alert.type === 'volume_above' && currentValue >= alert.value) ||
          (alert.type === 'volume_below' && currentValue <= alert.value);
      }

      if (shouldTrigger) {
        addNotification({
          coinAddress: coin.address,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          alertType: alert.type,
          targetValue: alert.value,
          currentValue
        });

        // Mark alert as triggered
        alert.triggeredAt = Date.now();
      }
    });
  });
};