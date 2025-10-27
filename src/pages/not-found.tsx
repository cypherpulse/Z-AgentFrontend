import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw, Search, TrendingUp } from "lucide-react";

export default function NotFound() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-8xl md:text-9xl font-bold text-primary/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Oops! Page Not Found
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                  The page you're looking for doesn't exist or may have been moved.
                  Let's get you back on track with your Zora trading journey.
                </p>
              </div>

              {/* Features Teaser */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-border/50">
                <div className="flex flex-col items-center p-4 rounded-lg bg-primary/5">
                  <Search className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Explore Coins</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-primary/5">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">AI Insights</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-primary/5">
                  <RefreshCw className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Live Trading</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="lg"
                  className="gap-2 hover:bg-primary/5"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
                </Button>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Go Back Home
                  </Link>
                </Button>
              </div>

              {/* Additional Help */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">
                  Still having trouble? Try these popular pages:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/explore">Explore</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/create">Create Coin</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/watchlist">Watchlist</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/about">About</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Lost in the crypto wilderness? Z-Agent has your back! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
