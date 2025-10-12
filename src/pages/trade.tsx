import { TradingPanel } from "@/components/TradingPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CHAIN_ID } from "@/lib/api";

const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME || 'Base';

export default function TradePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold font-serif">Trade</h1>
          <p className="text-muted-foreground mt-2">Swap ETH for creator coins and vice versa</p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Trading is executed on Base blockchain. Make sure you have enough ETH for gas fees.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TradingPanel />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trading Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">{CHAIN_NAME} (Chain ID: {CHAIN_ID})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol Fee</span>
                  <span className="font-medium">0.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min. Trade</span>
                  <span className="font-medium">0.0001 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Slippage</span>
                  <span className="font-medium">5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Swap #{i}</span>
                    <span className="font-medium">0.{i} ETH</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
