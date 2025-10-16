import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";

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
  onExecute,
  onUpdateTime,
  onCancel,
  isExecutable,
}: CoinCardProps & {
  onExecute: () => void;
  onUpdateTime: () => void;
  onCancel: () => void;
  isExecutable: boolean;
}) {
  const isPositive = (priceChange24h || 0) >= 0;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Card className="hover-elevate active-elevate-2 transition-all h-full hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/20 rounded-lg overflow-hidden">
      <CardHeader className="flex flex-col items-center justify-center gap-2 space-y-0 pb-3 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-300 to-primary-100 dark:from-primary-700 dark:to-primary-800 flex items-center justify-center overflow-hidden border-2 border-primary-400 dark:border-primary-600">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-mono font-bold text-primary-600 dark:text-primary-400 text-lg">
              {symbol.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <h3
          className="font-semibold text-lg"
          data-testid={`text-coin-name-${address}`}
        >
          {name}
        </h3>
        <p className="text-sm text-muted-foreground font-mono">{symbol}</p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-semibold">{marketCap}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Holders</p>
            <p className="text-sm font-semibold">{holders}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={onExecute}
            disabled={!isExecutable}
            className="bg-primary-500 hover:bg-primary-600 text-white w-full py-2 rounded-md shadow-md"
          >
            Execute
          </Button>
          <Button
            onClick={onUpdateTime}
            className="bg-accent-500 hover:bg-accent-600 text-white w-full py-2 rounded-md shadow-md"
          >
            Update Time
          </Button>
          <Button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md shadow-md"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
