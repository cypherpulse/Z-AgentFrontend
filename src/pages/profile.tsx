import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useProfile, useProfileCoins, useProfileBalances } from "@/lib/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinCard } from "@/components/CoinCard";
import { formatAddress, formatNumber, formatTokenPrice, formatHolderBalance } from "@/lib/format";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Wallet,
  Coins,
  TrendingUp,
  Twitter,
  Globe,
  Link as LinkIcon,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { CHAIN_ID } from "@/lib/api";

export default function ProfilePage() {
  const params = useParams<{ identifier: string }>();
  const [, navigate] = useLocation();
  const identifier = params.identifier;
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("portfolio");

  // Fetch profile data
  const { data: profile, isLoading: loadingProfile } = useProfile(identifier);

  // Fetch created coins (with chain filter)
  const {
    data: coinsData,
    isLoading: loadingCoins,
    fetchNextPage: fetchMoreCoins,
    hasNextPage: hasMoreCoins,
    isFetchingNextPage: isFetchingMoreCoins,
  } = useProfileCoins(identifier, { count: 12, chainIds: CHAIN_ID.toString() });

  // Fetch balances (portfolio)
  const {
    data: balancesData,
    isLoading: loadingBalances,
    fetchNextPage: fetchMoreBalances,
    hasNextPage: hasMoreBalances,
    isFetchingNextPage: isFetchingMoreBalances,
  } = useProfileBalances(identifier, { count: 12 });

  const coins = coinsData?.pages.flatMap((page: any) => page.coins) || [];
  const totalCoins = coinsData?.pages[0]?.totalCount || 0;
  const balances = balancesData?.pages.flatMap((page: any) => page.balances) || [];

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleBackNavigation = () => {
    window.history.back();
  };

  if (loadingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Card>
            <CardHeader>
              <div className="flex gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Profile not found</p>
            <Button onClick={handleBackNavigation} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const walletAddress = profile.publicWallet.walletAddress;
  const avatarUrl = profile.avatar?.previewImage?.medium || profile.avatar?.medium;
  const hasCreatorCoin = !!profile.creatorCoin;
  const linkedWalletCount = profile.linkedWallets.edges.length;

  // Calculate total portfolio market cap
  const totalPortfolioMarketCap = balances.reduce((total, balance) => {
    const coin = balance.coin;
    const marketCap = parseFloat(coin.marketCap || "0");
    return total + marketCap;
  }, 0);


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={handleBackNavigation}
            className="group hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>

          {/* Profile Header Card */}
          <Card className="border-2 shadow-lg overflow-hidden">
            {/* Gradient Background Banner */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            </div>

            <CardHeader className="-mt-16 relative">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
                    <AvatarImage src={avatarUrl} alt={profile.handle} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profile.handle.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {hasCreatorCoin && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg border-2 border-background">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      <CardTitle className="text-3xl font-bold font-serif">
                        {profile.displayName || profile.handle}
                      </CardTitle>
                      {hasCreatorCoin && (
                        <Badge variant="secondary" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          Creator
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">@{profile.handle}</CardDescription>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Wallet Address & Social Links */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAddress(walletAddress)}
                      className="gap-2 group"
                    >
                      <Wallet className="h-3 w-3" />
                      <code className="text-xs">{formatAddress(walletAddress)}</code>
                      {copiedAddress === walletAddress ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Button>

                    {profile.socialAccounts.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <a
                          href={`https://twitter.com/${profile.socialAccounts.twitter.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="h-3 w-3" />
                          {profile.socialAccounts.twitter.displayName}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}

                    {profile.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3 w-3" />
                          Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={`https://basescan.org/address/${walletAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="h-3 w-3" />
                        Basescan
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Coins className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{totalCoins}</div>
                        <div className="text-xs text-muted-foreground">Coins Created</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          ${formatNumber(totalPortfolioMarketCap, 2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Portfolio Market Cap</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Wallet className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{linkedWalletCount}</div>
                        <div className="text-xs text-muted-foreground">Linked Wallets</div>
                      </div>
                    </div>

                    {hasCreatorCoin && profile.creatorCoin && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Sparkles className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <div className="text-lg font-bold">
                            ${formatNumber(parseFloat(profile.creatorCoin.marketCap), 2)}
                          </div>
                          <div className="text-xs text-muted-foreground">Creator Coin Cap</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="portfolio" className="gap-2">
                <Wallet className="h-4 w-4" />
                Portfolio ({balances.length})
              </TabsTrigger>
              <TabsTrigger value="created" className="gap-2">
                <Coins className="h-4 w-4" />
                Created ({totalCoins})
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-4">
              {loadingBalances ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6 space-y-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : balances.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No coins in portfolio</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {balances.map((balance: any) => {
                      const coin = balance.coin;
                      const formattedBalance = formatHolderBalance(balance.balance);
                      const priceInUsdc = coin.tokenPrice?.priceInUsdc;
                      let value = "N/A";
                      if (priceInUsdc) {
                        const numericBalance = parseFloat(formattedBalance.replace(/,/g, ""));
                        const numericPrice = parseFloat(priceInUsdc);
                        value = formatTokenPrice(
                          (numericBalance * numericPrice).toString(),
                          "USDC"
                        );
                      }

                      return (
                        <Card
                          key={balance.id}
                          className="group hover:border-primary transition-all cursor-pointer hover:shadow-lg"
                          onClick={() => navigate(`/coin/${coin.address}`)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={
                                    coin.mediaContent?.previewImage?.small ||
                                    coin.creatorProfile?.avatar?.previewImage?.small
                                  }
                                  alt={coin.name}
                                />
                                <AvatarFallback>
                                  {coin.symbol?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                    {coin.name}
                                  </h3>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {coin.symbol}
                                </p>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Balance:</span>
                                    <span className="font-medium">{formattedBalance}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Value:</span>
                                    <span className="font-medium text-primary">{value}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Market Cap:</span>
                                    <span className="font-medium">
                                      ${formatNumber(parseFloat(coin.marketCap || "0"), 2)}
                                    </span>
                                  </div>
                                  {coin.tokenPrice?.priceInUsdc && (
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Price:</span>
                                      <span>
                                        {formatTokenPrice(
                                          coin.tokenPrice.priceInUsdc,
                                          "USDC"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {hasMoreBalances && (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => fetchMoreBalances()}
                        disabled={isFetchingMoreBalances}
                        variant="outline"
                        className="gap-2"
                      >
                        {isFetchingMoreBalances ? (
                          <>Loading...</>
                        ) : (
                          <>
                            Load More
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Created Coins Tab */}
            <TabsContent value="created" className="space-y-4">
              {loadingCoins ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6 space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : coins.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No coins created yet</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coins.map((coin: any) => {
                      const coinImage =
                        coin.mediaContent?.previewImage?.small ||
                        coin.creatorProfile?.avatar?.previewImage?.small ||
                        coin.image;
                      const priceInUsdc = coin.tokenPrice?.priceInUsdc || "0";
                      const formattedPrice = formatTokenPrice(priceInUsdc, "$");
                      const marketCapDelta = coin.marketCapDelta24h
                        ? parseFloat(coin.marketCapDelta24h)
                        : 0;

                      return (
                        <CoinCard
                          key={coin.address}
                          address={coin.address}
                          name={coin.name}
                          symbol={coin.symbol}
                          image={coinImage}
                          price={formattedPrice}
                          priceChange24h={marketCapDelta}
                          marketCap={`$${formatNumber(parseFloat(coin.marketCap || "0"), 2)}`}
                          holders={coin.uniqueHolders || 0}
                        />
                      );
                    })}
                  </div>

                  {hasMoreCoins && (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => fetchMoreCoins()}
                        disabled={isFetchingMoreCoins}
                        variant="outline"
                        className="gap-2"
                      >
                        {isFetchingMoreCoins ? (
                          <>Loading...</>
                        ) : (
                          <>
                            Load More
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Linked Wallets Section */}
          {linkedWalletCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Linked Wallets
                </CardTitle>
                <CardDescription>
                  All wallets associated with this profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.linkedWallets.edges.map((edge, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{edge.node.walletType}</Badge>
                        <code className="text-sm">{formatAddress(edge.node.walletAddress)}</code>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyAddress(edge.node.walletAddress)}
                        >
                          {copiedAddress === edge.node.walletAddress ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://basescan.org/address/${edge.node.walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

