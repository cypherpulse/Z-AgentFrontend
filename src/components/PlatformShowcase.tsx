import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  Coins,
  MessageSquare,
  BarChart3,
  Zap,
  Eye,
  ArrowRight,
  Play,
  Smartphone,
  Globe,
  Activity,
  Target,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export function PlatformShowcase() {
  const [activeDemo, setActiveDemo] = useState("dashboard");

  const features = [
    {
      id: "dashboard",
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Comprehensive coin analytics with real-time price charts, volume tracking, and market insights",
      highlights: ["Live price charts", "Volume analysis", "Market trends", "Portfolio tracking"],
      demo: "View Dashboard"
    },
    {
      id: "ai-chat",
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AI Assistant",
      description: "Intelligent trading assistant providing market analysis, recommendations, and coin insights",
      highlights: ["Market analysis", "Trading signals", "Coin research", "Risk assessment"],
      demo: "Chat with AI"
    },
    {
      id: "trading",
      icon: <Activity className="h-6 w-6" />,
      title: "Trading Interface",
      description: "Seamless trading experience with advanced order types and real-time execution",
      highlights: ["Instant swaps", "Limit orders", "Price alerts", "Transaction history"],
      demo: "Start Trading"
    },
    {
      id: "creation",
      icon: <Sparkles className="h-6 w-6" />,
      title: "Coin Creation",
      description: "Create your own creator coin with our guided wizard and deploy to Base network",
      highlights: ["Guided setup", "Smart contracts", "Tokenomics", "Community tools"],
      demo: "Create Coin"
    }
  ];

  const stats = [
    { label: "Active Coins", value: "2,500+", icon: <Coins className="h-5 w-5" />, change: "+12%" },
    { label: "Total Traders", value: "15,000+", icon: <Users className="h-5 w-5" />, change: "+8%" },
    { label: "24h Volume", value: "$2.5M+", icon: <TrendingUp className="h-5 w-5" />, change: "+25%" },
    { label: "AI Interactions", value: "50K+", icon: <MessageSquare className="h-5 w-5" />, change: "+15%" }
  ];

  const activeFeature = features.find(f => f.id === activeDemo) || features[0];

  return (
    <div className="bg-gradient-to-b from-background via-muted/20 to-background py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 gap-2">
            <Eye className="h-3 w-3" />
            Platform Showcase
            <Zap className="h-3 w-3" />
          </Badge>
          <h2 className="text-4xl font-bold font-serif mb-4">
            Experience the Future of Creator Coins
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our AI-powered platform revolutionizes creator coin trading with
            real-time analytics, intelligent insights, and seamless user experience.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-4 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Feature Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Explore Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveDemo(feature.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeDemo === feature.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={activeDemo === feature.id ? 'text-primary-foreground' : 'text-primary'}>
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-medium">{feature.title}</div>
                        <div className={`text-sm ${activeDemo === feature.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {feature.highlights.length} features
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Demo Display */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{activeFeature.icon}</div>
                    <div>
                      <CardTitle>{activeFeature.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{activeFeature.description}</p>
                    </div>
                  </div>
                  <Link href={
                    activeDemo === 'dashboard' ? '/explore' :
                    activeDemo === 'ai-chat' ? '/ai' :
                    activeDemo === 'trading' ? '/trade' :
                    '/create'
                  }>
                    <Button size="sm" className="gap-2">
                      {activeFeature.demo}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mockup Display */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-lg border-2 border-dashed border-primary/20 relative overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-primary text-4xl">
                        {activeDemo === 'dashboard' && <BarChart3 className="h-16 w-16 mx-auto" />}
                        {activeDemo === 'ai-chat' && <MessageSquare className="h-16 w-16 mx-auto" />}
                        {activeDemo === 'trading' && <Activity className="h-16 w-16 mx-auto" />}
                        {activeDemo === 'creation' && <Sparkles className="h-16 w-16 mx-auto" />}
                      </div>
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg px-6 py-3 max-w-xs">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Play className="h-5 w-5 text-primary" />
                          <span className="font-medium">Interactive Demo</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activeDemo === 'dashboard' && "Explore real-time analytics and market data"}
                          {activeDemo === 'ai-chat' && "Chat with our AI trading assistant"}
                          {activeDemo === 'trading' && "Experience seamless coin trading"}
                          {activeDemo === 'creation' && "See how coin creation works"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Browser-like UI elements */}
                  <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground">
                      zora-base-coin.com/{activeDemo}
                    </div>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {activeFeature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <Target className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">How It Works</h3>
              <p className="text-muted-foreground">Get started in 3 simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold text-lg">Connect Wallet</h4>
                <p className="text-muted-foreground">
                  Connect your wallet to access all platform features and start trading creator coins securely
                </p>
                <div className="flex justify-center">
                  <Link href="/explore">
                    <Button variant="outline" size="sm">Get Started</Button>
                  </Link>
                </div>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold text-lg">Explore & Analyze</h4>
                <p className="text-muted-foreground">
                  Browse trending coins, view detailed analytics, and get AI-powered insights on market trends
                </p>
                <div className="flex justify-center gap-2">
                  <Link href="/ai">
                    <Button variant="outline" size="sm">Try AI</Button>
                  </Link>
                  <Link href="/explore">
                    <Button variant="outline" size="sm">Explore</Button>
                  </Link>
                </div>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold text-lg">Trade & Create</h4>
                <p className="text-muted-foreground">
                  Buy, sell, or create your own creator coins with our intuitive tools and smart contracts
                </p>
                <div className="flex justify-center gap-2">
                  <Link href="/trade">
                    <Button variant="outline" size="sm">Trade</Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline" size="sm">Create</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of traders and creators already using our platform.
              Experience the future of creator coins today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/explore">
                <Button size="lg" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Start Exploring
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create Your Coin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}