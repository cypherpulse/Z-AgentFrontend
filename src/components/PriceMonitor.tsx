import { useEffect, useRef } from 'react';
import { useWatchlist, checkAlerts } from '@/hooks/use-watchlist';
import { useAlertMonitor } from '@/hooks/use-watchlist';
import { getCoin } from '@/lib/api';

export function usePriceMonitor() {
  const { watchlist } = useWatchlist();
  const { addNotification } = useAlertMonitor();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (watchlist.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check prices and volumes every 30 seconds
    intervalRef.current = setInterval(async () => {
      const currentData: Record<string, { price: number; volume24h?: number }> = {};

      // Fetch prices and volumes for all watchlist coins
      for (const coin of watchlist) {
        try {
          const coinData = await getCoin(coin.address);
          if (coinData?.tokenPrice?.priceInUsdc) {
            const price = parseFloat(coinData.tokenPrice.priceInUsdc);
            if (!isNaN(price)) {
              currentData[coin.address] = {
                price,
                volume24h: coinData.volume24h ? parseFloat(coinData.volume24h) : undefined
              };
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch data for ${coin.symbol}:`, error);
        }
      }

      // Check alerts if we have data
      if (Object.keys(currentData).length > 0) {
        checkAlerts(watchlist, currentData, addNotification);
      }
    }, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [watchlist, addNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}

// Hook to initialize price monitoring globally
export function PriceMonitor() {
  usePriceMonitor();
  return null; // This component doesn't render anything
}