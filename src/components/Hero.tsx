import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-background to-accent-50/20 dark:from-primary-950/30 dark:to-accent-950/20" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/30 dark:bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/30 dark:bg-accent-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-700 shadow-lg shadow-primary-200/50 dark:shadow-primary-900/20">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Powered by Base Blockchain</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight">
          Discover & Trade
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Zora Creator Coins</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The complete platform for exploring, creating, and trading creator coins on Base.
          Connect your wallet to get started.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/explore">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-200 dark:shadow-primary-900/30 transition-all" data-testid="button-explore-coins">
              Explore Coins
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/create">
            <Button size="lg" variant="outline" className="border-2 border-accent-400 text-accent-700 dark:text-accent-300 hover:bg-accent-50 dark:hover:bg-accent-950/30 shadow-md" data-testid="button-create-coin">
              Create Your Coin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
          {[
            { label: "Total Volume", value: "$12.5M", color: "primary" },
            { label: "Active Coins", value: "1,234", color: "accent" },
            { label: "Total Holders", value: "50K+", color: "primary" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2 p-4 rounded-xl bg-background/50 backdrop-blur border-2 border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all hover:shadow-lg hover:shadow-primary-100 dark:hover:shadow-primary-900/20">
              <p className={`text-3xl font-bold font-mono ${stat.color === 'primary' ? 'text-primary-600 dark:text-primary-400' : 'text-accent-600 dark:text-accent-400'}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
