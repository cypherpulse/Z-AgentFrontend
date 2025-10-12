import { StatCard } from "../StatCard";
import { TrendingUp } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <StatCard
        title="Total Volume"
        value="$12.5M"
        change={20.1}
        icon={TrendingUp}
        subtitle="Last 24 hours"
      />
    </div>
  );
}
