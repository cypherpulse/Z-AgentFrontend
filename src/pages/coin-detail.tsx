import { useRoute, Link } from "wouter";
import { useState } from "react";
import { PriceChart } from "@/components/PriceChart";
import { TradingPanel } from "@/components/TradingPanel";
import { TransactionTable } from "@/components/TransactionTable";
import { CommentsSection } from "@/components/CommentsSection";
import CoinChat from "@/components/CoinChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Coins, Activity, ExternalLink, User, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { useCoin, useCoinHolders, useCoinSwaps, useCoinComments } from "@/lib/queries";
import { safeParseNumber, truncateAddress, formatNumber, formatTokenPrice, getExplorerUrl, formatHolderBalance } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CoinDetailPage() {
  const [, params] = useRoute("/coin/:address");
  const coinAddress = (params as any)?.address || "";
  const [showAllHolders, setShowAllHolders] = useState(false);

  const { data: coin, isLoading: loadingCoin } = useCoin(coinAddress, !!coinAddress);
  const { 
    data: holdersData, 
    isLoading: loadingHolders,
    fetchNextPage: fetchMoreHolders,
    hasNextPage: hasMoreHolders,
    isFetchingNextPage: isFetchingMoreHolders
  } = useCoinHolders(coinAddress);
  const { 
    data: swapsData, 
    isLoading: loadingSwaps,
    fetchNextPage: fetchMoreSwaps,
    hasNextPage: hasMoreSwaps,
    isFetchingNextPage: isFetchingMoreSwaps
  } = useCoinSwaps(coinAddress);
  const {
    data: commentsData,
    isLoading: loadingComments,
    fetchNextPage: fetchMoreComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingMoreComments
  } = useCoinComments(coinAddress);

  const holders = holdersData?.pages.flatMap((page) => page.holders) || [];
  const swaps = swapsData?.pages.flatMap((page: any) => page.swaps) || [];
  const comments = commentsData?.pages.flatMap((page: any) => page.comments) || [];

  if (loadingCoin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Coin Not Found</h2>
          <p className="text-muted-foreground">
            The coin at address {truncateAddress(coinAddress)} could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="group hover:bg-accent -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        {/* Header */}
        <div className="flex items-start gap-4">
          {coin.mediaContent?.previewImage?.medium ? (
            <img 
              src={coin.mediaContent.previewImage.medium} 
              alt={coin.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="font-mono font-bold text-primary text-2xl">
                {coin.symbol.slice(0, 2)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold font-serif">{coin.name}</h1>
              <Badge variant="secondary">{coin.symbol}</Badge>
            </div>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              {coin.description || coin.metadata?.description || "Creator coin on Base"}
            </p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-muted-foreground">
                  {truncateAddress(coin.address)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(getExplorerUrl(coin.address, 'address'), '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Creator Info */}
              {coin.creatorProfile && (
                <Link href={`/profile/${coin.creatorProfile.handle || coin.creatorAddress}`}>
                  <Button variant="outline" size="sm" className="gap-2 group">
                    <Avatar className="h-5 w-5">
                      {coin.creatorProfile.avatar?.previewImage?.small ? (
                        <AvatarImage src={coin.creatorProfile.avatar.previewImage.small} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">by</span>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {coin.creatorProfile.handle || truncateAddress(coin.creatorAddress || '')}
                    </span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-mono">
              {formatTokenPrice(coin.tokenPrice?.priceInUsdc || '0', '$')}
            </p>
            <p className="text-sm text-muted-foreground">
              {safeParseNumber(coin.tokenPrice?.priceInPoolToken).toFixed(8)} ETH
            </p>
            {coin.marketCapDelta24h !== undefined && (
              <p className={parseFloat(coin.marketCapDelta24h) >= 0 ? "text-green-600" : "text-red-600"}>
                {parseFloat(coin.marketCapDelta24h) >= 0 ? "+" : ""}
                {formatNumber(parseFloat(coin.marketCapDelta24h))}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${formatNumber(safeParseNumber(coin.marketCap))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(coin.uniqueHolders || coin.holders || 0, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(safeParseNumber(coin.totalSupply))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${formatNumber(safeParseNumber(coin.volume24h))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PriceChart />

            <CoinChat coinAddress={coinAddress} />

            <Card>
              <CardHeader>
                <CardTitle>Top Holders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingHolders ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : holders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No holders data available</p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {(showAllHolders ? holders : holders.slice(0, 5)).map((holder: any, i: number) => (
                        <div key={holder.ownerAddress || i} className="flex items-center justify-between hover:bg-accent/50 p-2 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                              #{i + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                              {holder.ownerProfile?.avatar?.previewImage?.small ? (
                                <AvatarImage src={holder.ownerProfile.avatar.previewImage.small} />
                              ) : null}
                              <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/5">
                                {holder.ownerProfile?.handle?.slice(0, 2).toUpperCase() || '??'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {holder.ownerProfile?.handle || truncateAddress(holder.ownerAddress)}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {truncateAddress(holder.ownerAddress)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatHolderBalance(holder.balance)}</p>
                            <p className="text-xs text-muted-foreground">tokens</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {!showAllHolders && holders.length > 5 && (
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={() => setShowAllHolders(true)}
                          variant="outline"
                          size="sm"
                        >
                          Show More ({holders.length - 5} more)
                        </Button>
                      </div>
                    )}
                    
                    {showAllHolders && hasMoreHolders && (
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={() => fetchMoreHolders()}
                          disabled={isFetchingMoreHolders}
                          variant="outline"
                          size="sm"
                        >
                          {isFetchingMoreHolders ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load More Holders"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Swaps Table with Buy/Sell Stats */}
            {loadingSwaps ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <TransactionTable 
                transactions={swaps} 
                hasMore={hasMoreSwaps}
                onLoadMore={fetchMoreSwaps}
                isLoadingMore={isFetchingMoreSwaps}
              />
            )}
            
            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              isLoading={loadingComments}
              hasMore={hasMoreComments}
              onLoadMore={fetchMoreComments}
              isLoadingMore={isFetchingMoreComments}
            />
          </div>

          <div>
            <TradingPanel coinAddress={coin.address} />
          </div>
        </div>
      </div>
    </div>
  );
}
