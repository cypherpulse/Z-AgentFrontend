import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

const timeframes = ["1H", "24H", "7D", "30D"];

// Mock data generator
const generateMockData = (timeframe: string) => {
  const points = timeframe === "1H" ? 12 : timeframe === "24H" ? 24 : timeframe === "7D" ? 7 : 30;
  const data = [];
  let value = 0.0042;
  
  for (let i = 0; i < points; i++) {
    value = value * (1 + (Math.random() - 0.48) * 0.1);
    data.push({
      time: timeframe === "1H" ? `${i * 5}m` : timeframe === "24H" ? `${i}h` : `D${i + 1}`,
      price: parseFloat(value.toFixed(6)),
    });
  }
  return data;
};

export function PriceChart() {
  const [timeframe, setTimeframe] = useState("24H");
  const data = generateMockData(timeframe);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Price Chart</CardTitle>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors hover-elevate active-elevate-2 ${
                timeframe === tf ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
              data-testid={`button-timeframe-${tf.toLowerCase()}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(4)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
