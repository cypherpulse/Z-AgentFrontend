import { useLocation } from "wouter";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useProfileCoins, useProfileBalances } from "@/lib/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CoinCard } from "@/components/CoinCard";
import { formatAddress, formatNumber, formatTokenPrice, formatHolderBalance, PROFILE_BANNER_URL } from "@/lib/format";
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
  AlertCircle,
  UserX,
  Instagram,
  Music,
  User,
  Shield,
  Calendar,
  Activity,
  BarChart3,
} from "lucide-react";
import { CHAIN_ID } from "@/lib/api";

export default function MyProfilePage() {
  const [, navigate] = useLocation();
  const { address, isConnected } = useAuth(); // Use only wallet address and connection
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("portfolio");

  // Fetch profile data using wallet address
  const { data: profile, isLoading: loadingProfile, error: profileError } = useProfile(address || "");

  // Fetch created coins (with chain filter)
  const {
    data: coinsData,
    isLoading: loadingCoins,
    fetchNextPage: fetchMoreCoins,
    hasNextPage: hasMoreCoins,
    isFetchingNextPage: isFetchingMoreCoins,
  } = useProfileCoins(address || "", { count: 12 });

  // Fetch balances (portfolio)
  const {
    data: balancesData,
    isLoading: loadingBalances,
    fetchNextPage: fetchMoreBalances,
    hasNextPage: hasMoreBalances,
    isFetchingNextPage: isFetchingMoreBalances,
  } = useProfileBalances(address || "", { count: 12 });

  // Show wallet connection required state
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to view your profile.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-96" />
                  </div>
                </div>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show "No Zora Profile" state
  if (!profile || profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card className="max-w-2xl mx-auto mt-20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <UserX className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl">No Zora Profile Found</CardTitle>
              <CardDescription>
                This wallet address doesn't have a Zora profile yet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Wallet Address</AlertTitle>
                <AlertDescription className="font-mono text-xs mt-2">
                  {address}
                </AlertDescription>
              </Alert>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Your connected wallet doesn't have a Zora creator profile. A Zora profile is created when you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Launch your first creator coin on Zora</li>
                  <li>Set up your profile on the Zora platform</li>
                  <li>Engage with the Zora creator economy</li>
                </ul>
                <p className="pt-4">
                  You can still explore other creators and their coins!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => navigate("/explore")}
                  className="flex-1 gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Explore Coins
                </Button>
                <Button
                  onClick={() => navigate("/creator-coins")}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Coins className="h-4 w-4" />
                  Creator Coins
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://zora.co`, "_blank")}
                  className="w-full gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Zora Platform
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Process coins data
  const createdCoins = coinsData?.pages.flatMap((page) => page.coins) || [];

  // Process balances data
  const balances = balancesData?.pages.flatMap((page) => page.balances) || [];

  // Calculate stats
  const totalPortfolioMarketCap = balances.reduce((total, balance) => {
    return total + parseFloat(balance.coin.marketCap || "0");
  }, 0);

  const totalCoinsCreated = createdCoins.length;
  const creatorCoinMarketCap = profile.creatorCoin
    ? parseFloat(profile.creatorCoin.marketCap || "0")
    : 0;

  const handleCopyAddress = (addressToCopy: string) => {
    navigator.clipboard.writeText(addressToCopy);
    setCopiedAddress(addressToCopy);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Profile Header - Enhanced Design */}
        <Card className="mb-6 overflow-hidden border-2">
          {/* Banner Image */}
          <div className="relative h-48 md:h-64 w-full overflow-hidden">
            <img 
              src={PROFILE_BANNER_URL}
              alt="Profile Banner"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          </div>
          <CardContent className="pt-0 px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-16 relative z-10">
              {/* Avatar with border */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
                  <AvatarImage
                    src={
                      profile.avatar?.previewImage?.medium || 
                      profile.avatar?.previewImage?.small || 
                      profile.avatar?.medium || 
                      profile.avatar?.small
                    }
                    alt={profile.displayName || profile.handle}
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    {(profile.displayName || profile.handle)
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>

              {/* Profile Info - Enhanced */}
              <div className="flex-1 space-y-4 mt-4 md:mt-16">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {profile.displayName || profile.handle}
                    </h1>
                    <Badge variant="default" className="gap-1.5 px-3 py-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      My Profile
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    @{profile.handle}
                  </p>
                  {profile.username && profile.username !== profile.handle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Username: {profile.username}
                    </p>
                  )}
                </div>

                {profile.bio && (
                  <Card className="bg-muted/50 border-none shadow-none">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{profile.bio}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Social Links - Enhanced Grid */}
                <div className="flex flex-wrap gap-2">
                  {profile.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(profile.website!, "_blank")}
                      className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Button>
                  )}
                  {profile.socialAccounts.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/${profile.socialAccounts.twitter?.username}`,
                          "_blank"
                        )
                      }
                      className="gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500"
                    >
                      <Twitter className="h-4 w-4" />
                      @{profile.socialAccounts.twitter.username}
                    </Button>
                  )}
                  {profile.socialAccounts.farcaster && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://warpcast.com/${profile.socialAccounts.farcaster?.username}`,
                          "_blank"
                        )
                      }
                      className="gap-2 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Farcaster
                    </Button>
                  )}
                  {profile.socialAccounts.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://instagram.com/${profile.socialAccounts.instagram?.username}`,
                          "_blank"
                        )
                      }
                      className="gap-2 hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Button>
                  )}
                  {profile.socialAccounts.tiktok && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://tiktok.com/@${profile.socialAccounts.tiktok?.username}`,
                          "_blank"
                        )
                      }
                      className="gap-2 hover:bg-black/10 hover:text-foreground hover:border-foreground dark:hover:bg-white/10"
                    >
                      <Music className="h-4 w-4" />
                      TikTok
                    </Button>
                  )}
                </div>

                {/* Wallet Address - Enhanced */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs px-3 py-1.5 gap-2">
                    <Wallet className="h-3.5 w-3.5" />
                    {formatAddress(profile.publicWallet.walletAddress)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyAddress(profile.publicWallet.walletAddress)
                    }
                    className="h-8 w-8 p-0"
                  >
                    {copiedAddress === profile.publicWallet.walletAddress ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://basescan.org/address/${profile.publicWallet.walletAddress}`,
                        "_blank"
                      )
                    }
                    className="h-8 gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on Basescan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden border-2 hover:border-primary-400 transition-all hover:shadow-lg hover:shadow-primary-100 dark:hover:shadow-primary-900/20">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  Portfolio Market Cap
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                ${formatNumber(totalPortfolioMarketCap)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {balances.length} {balances.length === 1 ? "coin" : "coins"}
                </Badge>
                <p className="text-xs text-muted-foreground">in portfolio</p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 hover:border-accent-400 transition-all hover:shadow-lg hover:shadow-accent-100 dark:hover:shadow-accent-900/20">
            <CardHeader className="pb-3 bg-gradient-to-br from-accent-50 to-transparent dark:from-accent-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  Coins Created
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent-600 to-accent-400 bg-clip-text text-transparent">
                {totalCoinsCreated}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Creator
                </Badge>
                <p className="text-xs text-muted-foreground">tokens launched</p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 hover:border-primary-400 transition-all hover:shadow-lg hover:shadow-primary-100 dark:hover:shadow-primary-900/20">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  Creator Coin Value
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                {profile.creatorCoin
                  ? `$${formatNumber(creatorCoinMarketCap)}`
                  : "N/A"}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {profile.creatorCoin ? (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <p className="text-xs text-muted-foreground">market cap</p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">No creator coin yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="portfolio">
              Portfolio ({balances.length})
            </TabsTrigger>
            <TabsTrigger value="created">
              Created ({createdCoins.length})
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            {loadingBalances ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : balances.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-lg mb-2">No Coins Yet</CardTitle>
                  <CardDescription className="text-center max-w-sm">
                    Your portfolio is empty. Start by trading some creator coins!
                  </CardDescription>
                  <Button
                    onClick={() => navigate("/explore")}
                    className="mt-6 gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Explore Coins
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {balances.map((balance) => {
                    const coinImage = 
                      balance.coin.mediaContent?.previewImage?.medium ||
                      balance.coin.mediaContent?.previewImage?.small ||
                      balance.coin.media?.previewImage?.medium ||
                      balance.coin.media?.previewImage?.small;
                    
                    console.log(`Coin ${balance.coin.symbol} image:`, coinImage);
                    
                    return (
                      <CoinCard
                        key={balance.coin.address}
                        address={balance.coin.address}
                        name={balance.coin.displayName || balance.coin.name}
                        symbol={balance.coin.symbol}
                        price={formatTokenPrice(balance.coin.ethPrice)}
                        image={coinImage}
                        priceChange24h={parseFloat(balance.coin.marketCapDelta24h || "0")}
                        marketCap={formatNumber(parseFloat(balance.coin.marketCap || "0"))}
                        holders={balance.coin.uniqueHolders || balance.coin.holders || 0}
                      />
                    );
                  })}
                </div>
                {hasMoreBalances && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => fetchMoreBalances()}
                      disabled={isFetchingMoreBalances}
                      variant="outline"
                      className="gap-2"
                    >
                      {isFetchingMoreBalances ? "Loading..." : "Load More"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Created Tab */}
          <TabsContent value="created" className="mt-6">
            {loadingCoins ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : createdCoins.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Coins className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-lg mb-2">
                    No Coins Created Yet
                  </CardTitle>
                  <CardDescription className="text-center max-w-sm">
                    You haven't created any creator coins yet. Launch your first coin to get started!
                  </CardDescription>
                  <Button
                    onClick={() => navigate("/create")}
                    className="mt-6 gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create Coin
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {createdCoins.map((coin) => {
                    const coinImage = 
                      coin.mediaContent?.previewImage?.medium ||
                      coin.mediaContent?.previewImage?.small ||
                      coin.media?.previewImage?.medium ||
                      coin.media?.previewImage?.small;
                    
                    console.log(`Created coin ${coin.symbol} image:`, coinImage);
                    
                    return (
                      <CoinCard
                        key={coin.address}
                        address={coin.address}
                        name={coin.displayName || coin.name}
                        symbol={coin.symbol}
                        price={formatTokenPrice(coin.ethPrice)}
                        image={coinImage}
                        priceChange24h={parseFloat(coin.marketCapDelta24h || "0")}
                        marketCap={formatNumber(parseFloat(coin.marketCap || "0"))}
                        holders={coin.uniqueHolders || coin.holders || 0}
                      />
                    );
                  })}
                </div>
                {hasMoreCoins && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => fetchMoreCoins()}
                      disabled={isFetchingMoreCoins}
                      variant="outline"
                      className="gap-2"
                    >
                      {isFetchingMoreCoins ? "Loading..." : "Load More"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Linked Wallets Section - Enhanced */}
        {profile.linkedWallets.edges.length > 0 && (
          <Card className="mt-8 border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Linked Wallets</CardTitle>
              </div>
              <CardDescription>
                {profile.linkedWallets.edges.length} wallet{profile.linkedWallets.edges.length !== 1 ? 's' : ''} connected to this profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.linkedWallets.edges.map((edge, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border-2 bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Wallet className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-medium truncate">
                          {formatAddress(edge.node.walletAddress)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs">
                            {edge.node.walletType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyAddress(edge.node.walletAddress)}
                        className="h-9 w-9 p-0"
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
                        onClick={() =>
                          window.open(
                            `https://basescan.org/address/${edge.node.walletAddress}`,
                            "_blank"
                          )
                        }
                        className="h-9 w-9 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
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
  );
}
