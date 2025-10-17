import React, { useEffect, useState } from "react";
import axios from "axios";
import ScheduledCoinCard from "./ScheduledCoinCard";
import { getScheduledCoins } from "@/lib/api";

interface CoinParams {
  name: string;
  symbol: string;
  metadataUri?: string;
}

interface ScheduledCoin {
  id: string;
  scheduledFor: string;
  status: string;
  coinParams: CoinParams;
}

const ScheduledCoinsViewer: React.FC<{ walletAddress: string; jwtToken: string }> = ({ walletAddress, jwtToken }) => {
  const [scheduledCoins, setScheduledCoins] = useState<ScheduledCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduledCoins = async () => {
      try {
        setLoading(true);
        const response = await getScheduledCoins({ walletAddress });

        setScheduledCoins(response.scheduledCoins);
      } catch (err) {
        setError("An error occurred while fetching scheduled coins.");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledCoins();
  }, [walletAddress, jwtToken]);

  const handleActionComplete = async () => {
    try {
      setLoading(true);
      const response = await getScheduledCoins({ walletAddress });
      setScheduledCoins(response.scheduledCoins);
    } catch (err) {
      setError("An error occurred while fetching scheduled coins.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading scheduled coins...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Scheduled Coins</h2>
      {scheduledCoins.length === 0 ? (
        <p>No scheduled coins found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledCoins.map((coin) => (
            <ScheduledCoinCard
              key={coin.id}
              id={coin.id}
              name={coin.coinParams.name}
              symbol={coin.coinParams.symbol}
              image={coin.coinParams.metadataUri}
              scheduledFor={coin.scheduledFor}
              status={coin.status}
              jwtToken={jwtToken}
              onActionComplete={handleActionComplete} // Pass the handler to child
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledCoinsViewer;