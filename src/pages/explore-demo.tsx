import { useTopGainers, useMostValuable, useNewCoins } from '@/lib/queries';
import { formatCurrency, formatPercentage, truncateAddress, weiToEth } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Coins, Sparkles } from 'lucide-react';

export default function ExplorePage() {
  const { data: topGainers, isLoading: loadingGainers, fetchNextPage: fetchMoreGainers, hasNextPage: hasMoreGainers } = useTopGainers({ count: 10 });
  const { data: mostValuable, isLoading: loadingValuable } = useMostValuable({ count: 10 });
  const { data: newCoins, isLoading: loadingNew } = useNewCoins({ count: 10 });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Zora Coins</h1>
        <p className="text-muted-foreground">
          Discover trending coins, new launches, and top performers on Base
        </p>
      </div>

      {/* Top Gainers Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">🔥 Top Gainers (24h)</h2>
        </div>
        
        {loadingGainers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topGainers?.pages.flatMap(page => page.coins).map((coin) => (
              <Card key={coin.address} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{coin.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                    </div>
                    {coin.priceChange24h !== undefined && (
                      <Badge variant={coin.priceChange24h >= 0 ? 'default' : 'destructive'}>
                        {formatPercentage(coin.priceChange24h)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market Cap:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(weiToEth(coin.marketCap)))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(weiToEth(coin.price)))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Holders:</span>
                      <span className="font-medium">{coin.holders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-mono text-xs">{truncateAddress(coin.address)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hasMoreGainers && (
          <div className="text-center mt-4">
            <button
              onClick={() => fetchMoreGainers()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Most Valuable Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">💎 Most Valuable</h2>
        </div>

        {loadingValuable ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {mostValuable?.pages.flatMap(page => page.coins).map((coin, index) => (
              <Card key={coin.address} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold">{coin.name}</h3>
                        <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(parseFloat(weiToEth(coin.marketCap)))}</p>
                      <p className="text-sm text-muted-foreground">{coin.holders} holders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* New Coins Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">✨ New Launches</h2>
        </div>

        {loadingNew ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newCoins?.pages.flatMap(page => page.coins).map((coin) => (
              <Card key={coin.address} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{coin.name}</h3>
                        <Badge variant="secondary" className="text-xs">NEW</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Cap:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(weiToEth(coin.marketCap)))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Holders:</span>
                      <span className="font-medium">{coin.holders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
