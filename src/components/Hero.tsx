import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Powered by Base Blockchain</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight">
          Discover & Trade
          <br />
          <span className="text-primary">Zora Creator Coins</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The complete platform for exploring, creating, and trading creator coins on Base.
          Connect your wallet to get started.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/explore">
            <Button size="lg" className="gap-2" data-testid="button-explore-coins">
              Explore Coins
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/create">
            <Button size="lg" variant="outline" data-testid="button-create-coin">
              Create Your Coin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
          {[
            { label: "Total Volume", value: "$12.5M" },
            { label: "Active Coins", value: "1,234" },
            { label: "Total Holders", value: "50K+" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-3xl font-bold font-mono">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
