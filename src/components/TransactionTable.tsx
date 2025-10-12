import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { truncateAddress, formatTokenPrice, formatNumber } from "@/lib/format";

interface Swap {
  id: string;
  currencyAmountWithPrice: {
    priceUsdc: string;
    currencyAmount: {
      currencyAddress: string;
      amountDecimal: number;
    };
  };
  senderAddress: string;
  recipientAddress: string;
  transactionHash: string;
  coinAmount: string;
  blockTimestamp: string;
  activityType: 'BUY' | 'SELL';
  senderProfile: {
    __typename: 'GraphQLAccountProfile' | 'GraphQLWalletProfile';
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        medium: string;
        small: string;
      };
    } | null;
  };
}

interface TransactionTableProps {
  transactions: Swap[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  initialCount?: number;
}

export function TransactionTable({ transactions, hasMore, onLoadMore, isLoadingMore, initialCount = 5 }: TransactionTableProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Filter out any null/undefined transactions
  const validTransactions = transactions.filter(tx => tx && tx.transactionHash);
  
  // Display transactions based on showAll state
  const displayedTransactions = showAll ? validTransactions : validTransactions.slice(0, initialCount);

  // Calculate buy/sell percentages
  const buyCount = validTransactions.filter(tx => tx.activityType === 'BUY').length;
  const sellCount = validTransactions.filter(tx => tx.activityType === 'SELL').length;
  const totalCount = validTransactions.length;
  
  const buyPercentage = totalCount > 0 ? ((buyCount / totalCount) * 100).toFixed(1) : '0';
  const sellPercentage = totalCount > 0 ? ((sellCount / totalCount) * 100).toFixed(1) : '0';

  if (validTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Swaps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No swaps yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Swaps</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{buyPercentage}% Buy</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">{sellPercentage}% Sell</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Trader</TableHead>
                <TableHead>Coin Amount</TableHead>
                <TableHead>Value (USDC)</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((tx) => {
                const coinAmountFormatted = formatNumber(parseFloat(tx.coinAmount) / 1e18, 2);
                const usdcValue = formatTokenPrice(tx.currencyAmountWithPrice.priceUsdc, '$');
                
                return (
                  <TableRow key={tx.id} data-testid={`row-transaction-${tx.transactionHash}`}>
                    <TableCell>
                      <Badge 
                        variant={tx.activityType === "BUY" ? "default" : "secondary"}
                        className={tx.activityType === "BUY" ? "bg-primary" : "bg-destructive"}
                      >
                        {tx.activityType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {tx.senderProfile?.avatar?.previewImage?.small ? (
                            <AvatarImage src={tx.senderProfile.avatar.previewImage.small} />
                          ) : null}
                          <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/5">
                            {tx.senderProfile?.handle?.slice(0, 2).toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-mono text-sm">
                          {tx.senderProfile?.handle || truncateAddress(tx.senderAddress)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{coinAmountFormatted}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold">{usdcValue}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.blockTimestamp), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://basescan.org/tx/${tx.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Show More button - shows when there are more than initialCount items but not showing all */}
        {!showAll && validTransactions.length > initialCount && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              size="sm"
            >
              Show More ({validTransactions.length - initialCount} more)
            </Button>
          </div>
        )}
        
        {/* Load More button - fetches next page from API when showing all */}
        {showAll && hasMore && onLoadMore && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              size="sm"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Swaps"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
