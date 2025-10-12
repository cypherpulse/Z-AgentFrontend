import { CoinCard } from "../CoinCard";

export default function CoinCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <CoinCard
        address="0x1234"
        name="Creator Coin"
        symbol="CREATOR"
        price="0.0042"
        priceChange24h={15.5}
        marketCap="$2.1M"
        holders={1250}
        isNew={true}
      />
    </div>
  );
}
