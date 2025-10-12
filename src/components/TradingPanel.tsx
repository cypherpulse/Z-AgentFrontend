import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownUp, Settings, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTradeQuote } from "@/lib/queries";
import { ethToWei, weiToEth } from "@/lib/format";

interface TradingPanelProps {
  coinAddress?: string;
}

export function TradingPanel({ coinAddress }: TradingPanelProps) {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState<"ETH" | "COIN">("ETH");
  const [toToken, setToToken] = useState<"ETH" | "COIN">("COIN");
  const [slippage, setSlippage] = useState(0.05); // 5% default

  // Build trade params for quote
  const tradeParams = fromAmount && parseFloat(fromAmount) > 0 && coinAddress
    ? {
        sell: fromToken === "ETH" 
          ? { type: "eth" as const }
          : { type: "erc20" as const, address: coinAddress },
        buy: toToken === "ETH"
          ? { type: "eth" as const }
          : { type: "erc20" as const, address: coinAddress },
        amountIn: ethToWei(fromAmount),
        slippage,
      }
    : null;

  // Get live quote
  const { data: quote, isLoading: loadingQuote } = useTradeQuote(
    tradeParams!,
    !!tradeParams
  );

  // Update toAmount when quote changes
  useEffect(() => {
    if (quote?.expectedOutput) {
      setToAmount(weiToEth(quote.expectedOutput));
    }
  }, [quote]);

  const handleSwap = () => {
    if (!coinAddress) {
      alert("No coin address provided");
      return;
    }
    console.log("Swap:", { fromAmount, fromToken, toAmount, toToken, coinAddress });
    // This would trigger wallet transaction
    alert(`Swapping ${fromAmount} ${fromToken} for ~${toAmount} ${toToken}`);
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Swap Tokens</CardTitle>
        <Button variant="ghost" size="icon" data-testid="button-swap-settings">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from-amount">From</Label>
          <div className="flex gap-2">
            <Input
              id="from-amount"
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1"
              data-testid="input-from-amount"
            />
            <div className="w-24 px-3 py-2 border rounded-md bg-muted text-center font-medium">
              {fromToken}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Balance: -- {fromToken}</p>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={switchTokens}
            className="rounded-full"
            data-testid="button-switch-tokens"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-amount">To (estimated)</Label>
          <div className="flex gap-2">
            <Input
              id="to-amount"
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="flex-1 bg-muted"
              data-testid="input-to-amount"
            />
            <div className="w-24 px-3 py-2 border rounded-md bg-muted text-center font-medium">
              {toToken}
            </div>
          </div>
          {loadingQuote && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Fetching quote...
            </div>
          )}
        </div>

        {quote && (
          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected Output</span>
              <span className="font-medium">{weiToEth(quote.expectedOutput)} {toToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Received</span>
              <span className="font-medium">{weiToEth(quote.minimumOutput)} {toToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={`font-medium ${
                quote.priceImpact > 5 ? 'text-red-600' : 
                quote.priceImpact > 3 ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span className="font-medium">{(slippage * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleSwap}
          disabled={!fromAmount || !toAmount || loadingQuote || !coinAddress}
          data-testid="button-swap"
        >
          {loadingQuote ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Quote...
            </>
          ) : !coinAddress ? (
            "Connect Wallet"
          ) : (
            "Swap Tokens"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
