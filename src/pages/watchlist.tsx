import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, StarOff, Bell, BellOff, Trash2, Plus } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useCoin } from "@/lib/queries";
import { formatTokenPrice } from "@/lib/format";
import { PriceAlertDialog } from "@/components/PriceAlertDialog";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const handleAddAlert = (coinAddress: string) => {
    setSelectedCoin(coinAddress);
    setAlertDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="group hover:bg-accent -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        <div>
          <h1 className="text-4xl font-bold font-serif">My Watchlist</h1>
          <p className="text-muted-foreground mt-2">Track your favorite coins and set price alerts</p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start building your watchlist by adding coins from the explore page
            </p>
            <Link href="/explore">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Explore Coins
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((coin) => (
              <WatchlistCard
                key={coin.address}
                coin={coin}
                onRemove={() => removeFromWatchlist(coin.address)}
                onAddAlert={() => handleAddAlert(coin.address)}
              />
            ))}
          </div>
        )}

        <PriceAlertDialog
          open={alertDialogOpen}
          onOpenChange={setAlertDialogOpen}
          coinAddress={selectedCoin}
        />
      </div>
    </div>
  );
}

function WatchlistCard({
  coin,
  onRemove,
  onAddAlert
}: {
  coin: any;
  onRemove: () => void;
  onAddAlert: () => void;
}) {
  const { data: coinData, isLoading } = useCoin(coin.address);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  const priceInUsdc = coinData?.tokenPrice?.priceInUsdc || '0';
  const formattedPrice = formatTokenPrice(priceInUsdc, '$');

  const volume24h = coinData?.volume24h ? parseFloat(coinData.volume24h) : 0;
  const formattedVolume = volume24h > 0 ? formatTokenPrice(volume24h.toString(), '$') : '$0';

  const marketCapValue = parseFloat(coinData?.marketCap || '0');
  const marketCapFormatted = marketCapValue > 0
    ? `$${(marketCapValue / 1000000).toFixed(2)}M`
    : '$0';

  const priceChange = coinData?.marketCapDelta24h
    ? parseFloat(coinData.marketCapDelta24h)
    : undefined;

  const activeAlerts = coin.alerts?.filter((alert: any) => alert.isActive) || [];

  return (
    <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-950/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {coin.image ? (
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-mono font-bold text-primary-600 dark:text-primary-400 text-sm">
                  {coin.symbol.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <Link href={`/coin/${coin.address}`}>
                <h3 className="font-semibold text-lg hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {coin.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground font-mono">{coin.symbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onAddAlert}
              className="h-8 w-8"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <StarOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Volume</span>
            <span className="font-semibold">{formattedVolume}</span>
          </div>

          {priceChange !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <Badge variant={priceChange >= 0 ? "default" : "destructive"}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </Badge>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="text-sm font-medium">{marketCapFormatted}</span>
          </div>

          {activeAlerts.length > 0 && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">Active Alerts</span>
              <Badge variant="secondary">{activeAlerts.length}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}