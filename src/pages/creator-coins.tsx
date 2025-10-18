import { CoinCard } from "@/components/CoinCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Loader2, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
  useNewCreators,
  useMostValuableCreators,
} from "@/lib/queries";
import { formatTokenPrice } from "@/lib/format";

const categories = [
  { value: "new-creators", label: "New Creator Coins", hook: useNewCreators, icon: Sparkles },
  { value: "most-valuable-creators", label: "Most Valuable Creators", hook: useMostValuableCreators, icon: TrendingUp },
];

export default function CreatorCoinsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("new-creators");

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
          <h1 className="text-4xl font-bold font-serif">Creator Coins</h1>
          <p className="text-muted-foreground mt-2">Discover and invest in creator tokens on Base</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creator coins..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-creator-coins"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                data-testid={`tab-${cat.value}`}
                className="gap-2"
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabContent
              key={category.value}
              value={category.value}
              hook={category.hook}
              searchQuery={searchQuery}
              isActive={activeTab === category.value}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function TabContent({
  value,
  hook,
  searchQuery,
  isActive,
}: {
  value: string;
  hook: any;
  searchQuery: string;
  isActive: boolean;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = hook({
    count: 12,
  });

  // Flatten pages and deduplicate coins by address
  const coins = data?.pages.flatMap((page: any) => page.coins) || [];
  const uniqueCoins = Array.from(
    new Map(coins.map((coin: any) => [coin.address, coin])).values()
  );
  
  // Filter by search query
  const filteredCoins = searchQuery
    ? uniqueCoins.filter(
        (coin: any) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.creatorProfile?.handle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : uniqueCoins;
    
  return (
    <TabsContent value={value} className="space-y-4">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredCoins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? "No creator coins found matching your search" : "No creator coins available"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCoins.map((coin: any) => {
              // Use USDC price from backend (priceInUsdc)
              const priceInUsdc = coin.tokenPrice?.priceInUsdc || '0';
              const formattedPrice = formatTokenPrice(priceInUsdc, '$');
              
              // marketCap is already in USD format
              const marketCapValue = parseFloat(coin.marketCap || '0');
              const marketCapFormatted = marketCapValue > 0 
                ? `$${(marketCapValue / 1000000).toFixed(2)}M`
                : '$0';
              
              // Calculate price change from marketCapDelta24h
              const priceChange = coin.marketCapDelta24h 
                ? parseFloat(coin.marketCapDelta24h) 
                : undefined;
              
              // Get coin image from mediaContent
              const coinImage = coin.mediaContent?.previewImage?.small || 
                               coin.mediaContent?.previewImage?.medium || 
                               coin.creatorProfile?.avatar?.previewImage?.small ||
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
                  isNew={value === "new-creators"}
                  volume24h={coin.volume24h} // Added missing prop
                />
              );
            })}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </TabsContent>
  );
}
