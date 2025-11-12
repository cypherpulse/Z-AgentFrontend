import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { config } from "@/lib/wagmi";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PriceMonitor } from "@/components/PriceMonitor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";
import ExplorePage from "@/pages/explore";
import CreatorCoinsPage from "@/pages/creator-coins";
import WatchlistPage from "@/pages/watchlist";
import CoinDetailPage from "@/pages/coin-detail";
import TradePage from "@/pages/trade";
import CreatePage from "@/pages/create";
import SchedulePage from "@/pages/schedule";
import ProfilePage from "@/pages/profile";
import MyProfilePage from "@/pages/my-profile";
import AIPage from "@/pages/ai";
import AgentDashboardPage from "@/pages/agent-dashboard";
import { useTheme } from "next-themes";
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/creator-coins" component={CreatorCoinsPage} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/coin/:address" component={CoinDetailPage} />
      {/* <Route path="/trade" component={TradePage} /> */}
      <Route path="/create" component={CreatePage} />
      <Route path="/schedule" component={SchedulePage} />
      <Route path="/ai" component={AIPage} />
      <Route path="/agent-dashboard" component={AgentDashboardPage} />
      <Route path="/my-profile" component={MyProfilePage} />
      <Route path="/profile/:identifier" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <RainbowKitProvider
      theme={theme === "dark" ? darkTheme() : lightTheme()}
      modalSize="compact"
    >
      {children}
    </RainbowKitProvider>
  );
}

function App() {
  const [location] = useLocation();
  const isAgentDashboard = location === '/agent-dashboard';

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize mini app:', error);
      }
    };
    initMiniApp();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ThemeProvider>
            <RainbowKitWrapper>
              <AuthProvider>
                <TooltipProvider>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <PriceMonitor />
                    <Router />
                    {!isAgentDashboard && <Footer />}
                  </div>
                  <Toaster />
                </TooltipProvider>
              </AuthProvider>
            </RainbowKitWrapper>
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
