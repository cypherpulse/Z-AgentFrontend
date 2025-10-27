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
          <span className="text-sm font-medium">Powered by Zora</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight">
          Discover & Trade
          <br />
          <span className=" text-primary-600 ">Zora Creator Coins</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The complete AI powered platform for exploring, creating, and trading creator coins on Zora.
          Connect your wallet to get started with intelligent insights and market analysis.
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
          <Link href="/ai">
            <Button size="lg" variant="secondary" className="gap-2 text-gray-50 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 shadow-lg shadow-accent-200 dark:shadow-accent-900/30 transition-all" data-testid="button-talk-to-ai">
              Talk to Z-Agent
              <Zap className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
