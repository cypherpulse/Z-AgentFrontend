import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ExternalLink,
  Twitter,
  Globe,
  Users,
  Zap,
  Shield,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Coins,
  ArrowLeft,
  Heart,
  Sparkles,
  Target,
  Rocket
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="group hover:bg-accent -ml-2 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            About Z-Agent
          </div>

          {/* Z-Agent Logo/Image */}
          <div className="mb-8">
            <img
              src="https://res.cloudinary.com/dbczn8b8l/image/upload/v1761577556/jon1axyjdaaet67rcbh4.png"
              alt="Z-Agent Logo"
              className="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-primary/20"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6  bg-clip-text ">
            AI-Powered Trading Intelligence for Zora
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Z-Agent empowers degens, traders, and buyers on Zora with cutting edge AI insights to make smarter decisions.
            Analyze coins, schedule trades, create tokens, and build winning watchlists with our intelligent platform.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">AI Coin Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get intelligent analysis and trading recommendations for any Zora coin through our advanced AI assistant.
                Make data-driven decisions with real-time market intelligence.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Create & Schedule Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Launch your own creator coins and schedule automated deployments. Perfect for timed releases and strategic market entries.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Schedule Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automate your trading strategy with scheduled buy/sell orders. Execute trades at optimal times without constant monitoring.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Smart Watchlists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build intelligent watchlists with AI-powered alerts and notifications. Never miss a trading opportunity on Zora.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track coin performance, market trends, and holder statistics with our comprehensive analytics dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Secure Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Trade with confidence using our secure wallet integration and advanced risk management tools.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-serif mb-6">Empowering Zora Traders</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We're revolutionizing trading on Zora by combining AI intelligence with blockchain technology.
              Our platform gives degens, traders, and buyers the tools they need to make smarter decisions,
              automate strategies, and stay ahead of the market with real time insights and automated trading features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
                <Target className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">For Degens</h3>
                <p className="text-sm text-muted-foreground text-center">
                  AI-powered insights to identify the next 100x opportunities on Zora
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
                <TrendingUp className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">For Traders</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Schedule trades, build watchlists, and automate your strategies
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
                <Coins className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">For Creators</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Launch coins, engage communities, and monetize your creativity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Creators Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif mb-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the minds behind Z-Agent and the platform that's revolutionizing trading on Zora
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Z-Agent Coin Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src="https://res.cloudinary.com/dbczn8b8l/image/upload/v1761577556/jon1axyjdaaet67rcbh4.png"
                    alt="Z-Agent Coin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl font-serif">Z-Agent Coin</CardTitle>
                <p className="text-muted-foreground">The heart of our trading ecosystem</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Z-Agent coin powers our AI trading insights and rewards active traders and community members.
                  Join the revolution in intelligent Zora trading.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="gap-2"
                  >
                    <a
                      href="https://zora.co/@zedagent"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Coins className="h-4 w-4" />
                      Buy Zedagent
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="gap-2"
                  >
                    <a
                      href="https://x.com/Z_AgentAI"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                      Follow on X
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Developer Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage
                    src="https://res.cloudinary.com/dbczn8b8l/image/upload/v1761571296/l2crt9gvimd745ssetu1.png"
                    alt="cypherpulse.base.eth"
                  />
                  <AvatarFallback>CP</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-serif">cypherpulse.base.eth</CardTitle>
                <Badge variant="secondary" className="mt-2">Platform Developer</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Just a dev and tutor passionate about Web3, AI, and decentralization.
                  Learning and growing in the decentralized space.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1"
                  >
                    <a
                      href="https://zora.co/@cypherpulse"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-3 w-3" />
                      Zora
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1"
                  >
                    <a
                      href="https://farcaster.xyz/cypherpulse"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Farcaster
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1"
                  >
                    <a
                      href="https://base.app/profile/bradley1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Shield className="h-3 w-3" />
                      Base App
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1"
                  >
                    <a
                      href="https://x.com/Bradley0mx"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-3 w-3" />
                      Twitter
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20">
            <CardContent className="p-8">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-serif mb-4">Start Trading Smarter</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of degens and traders using AI-powered insights to make better decisions on Zora.
                Create watchlists, schedule trades, and never miss an opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/explore">Explore Coins</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/create">Create Coin</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}