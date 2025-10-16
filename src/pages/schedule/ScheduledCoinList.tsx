import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ScheduledCoin {
  id: string;
  name: string;
  symbol: string;
  status: string;
  scheduledFor: string;
  createdAt: string;
}

interface ScheduledCoinListProps {
  scheduledCoins: ScheduledCoin[];
  loading: boolean;
}

export default function ScheduledCoinList({
  scheduledCoins,
  loading,
}: ScheduledCoinListProps) {
  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading scheduled coins...
      </div>
    );
  }

  if (scheduledCoins.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No scheduled coins found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {scheduledCoins.map((coin: ScheduledCoin) => (
        <Card
          key={coin.id}
          className="hover-elevate active-elevate-2 cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center">
                <span className="font-mono font-bold text-chart-2 text-lg">
                  {coin.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg">{coin.name}</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">
                  {coin.symbol}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{coin.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Scheduled {" "}
                {formatDistanceToNow(new Date(coin.scheduledFor), {
                  addSuffix: true,
                })}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Created {" "}
                {formatDistanceToNow(new Date(coin.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
