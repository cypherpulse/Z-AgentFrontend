import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

// Mock data - todo: remove mock functionality
const scheduledCoins = [
  {
    id: "1",
    name: "Future Coin",
    symbol: "FUTURE",
    scheduledDate: new Date(Date.now() + 86400000 * 2),
    status: "pending",
  },
  {
    id: "2",
    name: "Tomorrow Coin",
    symbol: "TMR",
    scheduledDate: new Date(Date.now() + 86400000),
    status: "pending",
  },
  {
    id: "3",
    name: "Next Week Coin",
    symbol: "NEXT",
    scheduledDate: new Date(Date.now() + 86400000 * 7),
    status: "pending",
  },
];

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-serif">Scheduler</h1>
            <p className="text-muted-foreground mt-2">Schedule coin launches for the future</p>
          </div>
          <Link href="/schedule/new">
            <Button className="gap-2" data-testid="button-schedule-new">
              <Plus className="h-4 w-4" />
              Schedule New
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {scheduledCoins.map((coin) => (
            <Card key={coin.id} className="hover-elevate active-elevate-2 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center">
                    <span className="font-mono font-bold text-chart-2 text-lg">
                      {coin.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{coin.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{coin.symbol}</p>
                  </div>
                </div>
                <Badge variant="secondary">{coin.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{coin.scheduledDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(coin.scheduledDate, { addSuffix: true })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {scheduledCoins.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scheduled coins</h3>
              <p className="text-muted-foreground mb-4">
                Schedule your first coin launch to get started
              </p>
              <Link href="/schedule/new">
                <Button data-testid="button-schedule-first">Schedule Your First Coin</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
