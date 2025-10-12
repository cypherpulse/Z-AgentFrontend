import { Hero } from "@/components/Hero";
import { CoinCard } from "@/components/CoinCard";
import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Coins, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTopGainers, useTopVolume } from "@/lib/queries";
import { safeParseNumber, formatTokenPrice } from "@/lib/format";

export default function HomePage() {
  const { data: topGainersData, isLoading: loadingGainers } = useTopGainers({ count: 6 });
  const { data: topVolumeData, isLoading: loadingVolume } = useTopVolume({ count: 3 });

  const trendingCoins = topGainersData?.pages[0]?.coins.slice(0, 3) || [];
  const allCoins = topVolumeData?.pages[0]?.coins || [];

  // Calculate stats from real data (backend returns values already formatted)
  const totalMarketCap = allCoins.reduce(
    (sum, coin) => sum + safeParseNumber(coin.marketCap),
    0
  );
  const totalHolders = allCoins.reduce((sum, coin) => sum + (coin.uniqueHolders || coin.holders || 0), 0);
  const totalVolume = allCoins.reduce(
    (sum, coin) => sum + safeParseNumber(coin.volume24h),
    0
  );

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingVolume ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Total Market Cap"
                value={`$${(totalMarketCap / 1000000).toFixed(1)}M`}
                change={12.5}
                icon={TrendingUp}
              />
              <StatCard
                title="Active Traders"
                value={`${(totalHolders / 1000).toFixed(1)}K`}
                change={8.3}
                icon={Users}
              />
              <StatCard
                title="Total Coins"
                value={allCoins.length.toString()}
                change={15.7}
                icon={Coins}
              />
              <StatCard
                title="24h Volume"
                value={`$${(totalVolume / 1000000).toFixed(1)}M`}
                change={-3.2}
                icon={Activity}
              />
            </>
          )}
        </div>
      </section>

      {/* Trending Coins */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold font-serif">Trending Coins</h2>
            <p className="text-muted-foreground mt-1">Top performing coins in the last 24 hours</p>
          </div>
          <Link href="/explore">
            <Button variant="outline" data-testid="button-view-all">View All</Button>
          </Link>
        </div>
        
        {loadingGainers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCoins.map((coin) => {
              const priceInUsdc = coin.tokenPrice?.priceInUsdc || '0';
              const formattedPrice = formatTokenPrice(priceInUsdc, '$');
              
              const marketCapValue = safeParseNumber(coin.marketCap);
              const marketCapFormatted = marketCapValue > 0 
                ? `$${(marketCapValue / 1000000).toFixed(2)}M`
                : '$0';
              
              const priceChange = coin.marketCapDelta24h 
                ? parseFloat(coin.marketCapDelta24h) 
                : undefined;
              
              // Get coin image from mediaContent
              const coinImage = coin.mediaContent?.previewImage?.small || 
                               coin.mediaContent?.previewImage?.medium || 
                               coin.image;
              
              return (
                <CoinCard
                  key={coin.address}
                  address={coin.address}
                  name={coin.name}
                  symbol={coin.symbol}
                  image={coinImage}
                  price={formattedPrice}
                  priceChange24h={priceChange}
                  marketCap={marketCapFormatted}
                  holders={coin.uniqueHolders || coin.holders || 0}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
