import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { MoreVertical } from "lucide-react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { getScheduledCoinTransactionData } from "@/lib/api";
import { useSendTransaction } from "wagmi";

interface ScheduledCoinCardProps {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  scheduledFor: string;
  status: string;
  jwtToken: string;
  onActionComplete: () => void;
}

const ScheduledCoinCard: React.FC<ScheduledCoinCardProps> = ({
  id,
  name,
  symbol,
  image,
  scheduledFor,
  status,
  jwtToken,
  onActionComplete,
}) => {
  const { address: walletAddress } = useAuth(); // Retrieve walletAddress from AuthContext
  const [loading, setLoading] = useState(false);
  const { sendTransaction } = useSendTransaction();

  const handleExecute = async () => {
    if (!walletAddress) {
      alert("Wallet address is required.");
      return;
    }

    try {
      setLoading(true);
      const transactionData = await getScheduledCoinTransactionData({
        id,
        walletAddress,
        jwtToken,
      });

      sendTransaction({
        to: transactionData.to as `0x${string}`,
        data: transactionData.data as `0x${string}`,
        value: BigInt(transactionData.value),
      });

      alert("Transaction sent. Please confirm in your wallet.");
      onActionComplete();
    } catch (error) {
      console.error("Failed to execute scheduled coin:", error);
      alert("Failed to execute the coin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    const newTime = prompt(
      "Enter new scheduled time (ISO format):",
      scheduledFor
    );
    if (!newTime) return;

    // Validate newTime to ensure it is at least 5 minutes in the future
    const newTimeDate = new Date(newTime);
    const currentTime = new Date();
    if (
      isNaN(newTimeDate.getTime()) ||
      newTimeDate <= new Date(currentTime.getTime() + 5 * 60000)
    ) {
      alert(
        "Invalid time. Please enter a valid ISO date at least 5 minutes in the future."
      );
      return;
    }

    if (!walletAddress || walletAddress.trim() === "") {
      alert("Wallet address is required.");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending payload:", { walletAddress, scheduledFor: newTime });
      const response = await axios.put(
        `http://localhost:3000/api/scheduler/scheduled-coins/${id}`,
        { walletAddress, scheduledFor: newTime },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log("Backend response:", response.data);
      onActionComplete();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Backend error response:", error.response.data);
        alert(`Failed to update scheduled time: ${error.response.data.message}`);
      } else {
        console.error("Failed to update scheduled time:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this scheduled coin?")) return;

    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:3000/api/scheduler/scheduled-coins/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          params: {
            walletAddress,
          },
        }
      );
      onActionComplete();
    } catch (error) {
      console.error("Failed to delete scheduled coin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all h-full hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-950/30 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary-200 dark:border-primary-800">
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
            <div>
              <h3 className="font-semibold text-lg">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">{symbol}</p>
            </div>
          </div>
          <Menu
            menuButton={
              <MenuButton className="p-2 rounded-full hover:bg-muted">
                <MoreVertical className="w-5 h-5" />
              </MenuButton>
            }
          >
            <MenuItem onClick={handleEdit}>Edit Time</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
            <MenuItem onClick={handleExecute}>Execute</MenuItem>
          </Menu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Scheduled For</p>
            <p className="text-md font-medium">
              {new Date(scheduledFor).toLocaleString()}
            </p>
          </div>
          <Badge variant={status === "pending" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledCoinCard;