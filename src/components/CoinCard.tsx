import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface CoinCardProps {
  address: string;
  name: string;
  symbol: string;
  image?: string;
  price: string;
  priceChange24h?: number; // Make optional
  marketCap: string;
  holders: number;
  isNew?: boolean;
}

export function CoinCard({
  address,
  name,
  symbol,
  image,
  price,
  priceChange24h,
  marketCap,
  holders,
  isNew,
}: CoinCardProps) {
  const isPositive = (priceChange24h || 0) >= 0;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link href={`/coin/${address}`} data-testid={`card-coin-${address}`}>
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all h-full hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/20">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-950/30 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary-200 dark:border-primary-800">
              {image && !imageError ? (
                <>
                  {imageLoading && (
                    <span className="font-mono font-bold text-primary-600 dark:text-primary-400 text-lg">
                      {symbol.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <img 
                    src={image} 
                    alt={name} 
                    className={`w-12 h-12 rounded-full object-cover ${imageLoading ? 'hidden' : 'block'}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      console.warn(`Failed to load image for ${symbol}:`, image);
                      setImageError(true);
                    }}
                  />
                </>
              ) : (
                <span className="font-mono font-bold text-primary-600 dark:text-primary-400 text-lg">
                  {symbol.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate" data-testid={`text-coin-name-${address}`}>{name}</h3>
              <p className="text-sm text-muted-foreground font-mono">{symbol}</p>
            </div>
          </div>
          {isNew && <Badge variant="secondary">NEW</Badge>}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-bold font-mono truncate" data-testid={`text-price-${address}`}>{price}</p>
            </div>
            {priceChange24h !== undefined && (
              <div className={`flex items-center gap-1 flex-shrink-0 ${isPositive ? "text-primary" : "text-destructive"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{isPositive ? "+" : ""}{priceChange24h.toFixed(2)}%</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Market Cap</p>
              <p className="text-sm font-semibold">{marketCap}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Holders</p>
              <p className="text-sm font-semibold">{holders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
