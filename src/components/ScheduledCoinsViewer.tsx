import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CoinCard } from '../components/CoinCard';
import { Button } from '../components/ui/button';

interface CoinParams {
  name: string;
  symbol: string;
  chainId: number;
}

interface ScheduledCoin {
  id: string;
  scheduledFor: string;
  status: string;
  coinParams: CoinParams;
  createdAt: string;
}

const ScheduledCoinsViewer: React.FC<{ walletAddress: string; jwtToken: string }> = ({ walletAddress, jwtToken }) => {
  const [scheduledCoins, setScheduledCoins] = useState<ScheduledCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const executeCoin = async (id: string) => {
    try {
      await axios.post(
        `http://localhost:3000/api/scheduler/scheduled-coins/${id}/execute`,
        { walletAddress },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Coin executed successfully!');
    } catch (err) {
      alert('Failed to execute coin.');
    }
  };

  const updateTime = async (id: string, newTime: string) => {
    try {
      await axios.put(
        `http://localhost:3000/api/scheduler/scheduled-coins/${id}`,
        { walletAddress, scheduledFor: newTime },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Scheduled time updated successfully!');
    } catch (err) {
      alert('Failed to update scheduled time.');
    }
  };

  const cancelCoin = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/scheduler/scheduled-coins/${id}?walletAddress=${walletAddress}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Coin canceled successfully!');
    } catch (err) {
      alert('Failed to cancel coin.');
    }
  };

  useEffect(() => {
    const fetchScheduledCoins = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/scheduler/scheduled-coins?walletAddress=${walletAddress}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.data.success) {
          setScheduledCoins(response.data.data.scheduledCoins);
        } else {
          setError(response.data.message || 'Failed to fetch scheduled coins.');
        }
      } catch (err) {
        setError('An error occurred while fetching scheduled coins.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledCoins();
  }, [walletAddress, jwtToken]);

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
            <CoinCard
              key={coin.id}
              address={coin.id}
              name={coin.coinParams.name}
              symbol={coin.coinParams.symbol}
              price={'N/A'} // Placeholder as price is not available
              marketCap={'N/A'} // Placeholder as market cap is not available
              holders={0} // Placeholder as holders count is not available
              isNew={coin.status === 'pending'}
              onExecute={() => executeCoin(coin.id)}
              onUpdateTime={() => {
                const newTime = prompt('Enter new scheduled time (ISO 8601 format):');
                if (newTime) updateTime(coin.id, newTime);
              }}
              onCancel={() => cancelCoin(coin.id)}
              isExecutable={new Date(coin.scheduledFor) <= new Date()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledCoinsViewer;