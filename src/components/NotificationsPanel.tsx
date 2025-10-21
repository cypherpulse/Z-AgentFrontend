import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, BellRing, X, CheckCheck, Trash2 } from "lucide-react";
import { useAlertMonitor } from "@/hooks/use-watchlist";
import { formatTokenPrice } from "@/lib/format";
import { Link } from "wouter";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useAlertMonitor();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-2 left-2 top-16 bottom-4 sm:right-4 sm:left-auto sm:w-96 sm:max-h-[80vh] sm:bottom-auto bg-background border rounded-lg shadow-lg">
        <Card className="border-0 shadow-none h-full max-h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BellRing className="h-4 w-4 sm:h-5 sm:w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Bell className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-2" />
                  <p className="text-sm sm:text-base text-muted-foreground">No notifications yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Set price alerts to get notified
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={() => markAsRead(notification.id)}
                      onDelete={() => deleteNotification(notification.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete
}: {
  notification: any;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) {
  const timeAgo = getTimeAgo(notification.triggeredAt);

  const isPriceAlert = notification.alertType.startsWith('price_');
  const isVolumeAlert = notification.alertType.startsWith('volume_');
  const isAbove = notification.alertType.includes('_above');
  const isBelow = notification.alertType.includes('_below');

  const getAlertDescription = () => {
    if (isPriceAlert) {
      return `Price ${isAbove ? 'rose above' : 'fell below'} your alert`;
    } else if (isVolumeAlert) {
      return `24h Volume ${isAbove ? 'rose above' : 'fell below'} your alert`;
    }
    return 'Alert triggered';
  };

  const getCurrentValueDisplay = () => {
    return `Current: ${formatTokenPrice(notification.currentValue.toString(), '$')}`;
  };

  return (
    <div className={`p-3 sm:p-4 rounded-lg border transition-colors ${
      notification.isRead
        ? 'bg-muted/30 border-muted'
        : 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/coin/${notification.coinAddress}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <span className="font-medium text-sm sm:text-base hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate">
                {notification.coinName} ({notification.coinSymbol})
              </span>
              <Badge variant={isAbove ? 'default' : 'secondary'} className="text-xs w-fit">
                {isAbove ? '↗' : '↘'} {formatTokenPrice(notification.targetValue.toString(), '$')}
                {isVolumeAlert && ' (24h Vol)'}
              </Badge>
            </div>
          </Link>

          <p className="text-sm text-muted-foreground mb-2">
            {getAlertDescription()}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {getCurrentValueDisplay()}
            </span>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-xs sm:text-sm text-muted-foreground">{timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAsRead}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <BellRing className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}