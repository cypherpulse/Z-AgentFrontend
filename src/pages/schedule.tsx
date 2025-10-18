import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  Plus,
  Loader2,
  Image as ImageIcon,
  Video,
  Calendar,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL, scheduleCoin } from "@/lib/api";
import ScheduleForm from "./schedule/ScheduleForm";
import ScheduledCoinList from "./schedule/ScheduledCoinList";
import ScheduledCoinsViewer from "../components/ScheduledCoinsViewer";

// Helper: fetch scheduled coins for wallet
async function getScheduledCoins(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const response = await fetch(`/api/scheduler/scheduled-coins?${params}`);
  const result = await response.json();
  return result.data || [];
}

export default function SchedulePage() {
  const { address } = useAuth();
  const [scheduledCoins, setScheduledCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUri: "",
    scheduledFor: "",
    currency: "ZORA",
    startingMarketCap: "LOW",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    (async () => {
      try {
        const params = new URLSearchParams({ walletAddress: address });
        const response = await fetch(
          `/api/scheduler/scheduled-coins?${params}`
        );
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText); // Debugging log
          setError(`API error: ${response.status} ${errorText}`);
          setScheduledCoins([]);
          return;
        }
        if (!contentType || !contentType.includes("application/json")) {
          const rawText = await response.text();
          console.error("Non-JSON response:", rawText); // Debugging log
          throw new Error("Invalid response format. Expected JSON.");
        }
        const result = await response.json();
        if (!result || typeof result !== "object" || !Array.isArray(result.data)) {
          throw new Error("Invalid response format. Expected JSON with a data array.");
        }
        console.log("Fetched scheduled coins:", result.data); // Debugging log
        setScheduledCoins(result.data || []);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("Network or parsing error:", err); // Debugging log
        setError(
          `Network error: ${err instanceof Error ? err.message : String(err)}`
        );
        setScheduledCoins([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [address, showForm, success]);

  // Schedule coin creation (deferred execution, new backend spec)
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }
    if (!formData.name || !formData.symbol || !formData.scheduledFor) {
      setError("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      // Step 1: Upload metadata to IPFS (via backend) - EXACT create.tsx payload and extraction
      const metadataPayload = {
        creator: address,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
      };
      const metadataResponse = await fetch(
        `${API_BASE_URL}/api/write/upload-metadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadataPayload),
        }
      );
      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        setError(errorData.error || "Failed to upload metadata");
        setSubmitting(false);
        return;
      }
      const metadataData = await metadataResponse.json();
      // Align metadataUri extraction with create.tsx
      console.log("✅ Metadata uploaded:", metadataData);
      const metadataUri = metadataData.data?.uri; // Correctly access the URI from the data field
      if (!metadataUri) {
        setError("No metadata URI returned from backend");
        setSubmitting(false);
        return;
      }

      // Step 2: Prepare transaction calldata (but do not execute)
      const preparePayload = {
        creator: address,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
        currency: formData.currency,
        startingMarketCap: formData.startingMarketCap,
        chainId: 8453,
      };
      const prepareResponse = await fetch(
        `${API_BASE_URL}/api/write/create-coin/prepare`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preparePayload),
        }
      );
      if (!prepareResponse.ok) {
        const errorData = await prepareResponse.json();
        setError(errorData.error || "Failed to prepare transaction");
        setSubmitting(false);
        return;
      }
      const txData = await prepareResponse.json();
      const transaction = txData.data?.transaction || txData.data || txData;

      // Step 3: Extract and log the payload (do not execute transaction)
      const payload = {
        creator: address,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
        currency: formData.currency,
        startingMarketCap: formData.startingMarketCap,
        chainId: 8453,
        metadataUri,
        transaction,
      };
      console.log("Extracted payload for scheduling:", payload);
      setSuccess("Payload extracted. See console log.");
      // Optionally, you can display the payload in the UI or use it for further scheduling logic

      // Step 4: Schedule the coin using the extracted payload
      const schedulePayload = {
        walletAddress: address,
        scheduledFor: new Date(formData.scheduledFor).toISOString(),
        coinParams: {
          name: formData.name,
          symbol: formData.symbol,
          metadataUri: metadataUri || "https://default-metadata.com",
          currency: formData.currency,
          chainId: 8453,
          startingMarketCap: formData.startingMarketCap,
          additionalOwners: [],
        },
        maxRetries: 3,
        transaction: {
          to: transaction.to,
          data: transaction.data,
          value: transaction.value,
        },
      };

      console.log("Payload being sent to backend:", schedulePayload);
      const scheduleResponse = await scheduleCoin(schedulePayload);
      console.log("✅ Coin scheduled successfully:", scheduleResponse);
      setSuccess("Coin scheduled successfully!");
      setShowForm(false); // Hide the form
      setFormData({
        name: "",
        symbol: "",
        description: "",
        imageUri: "",
        scheduledFor: "",
        currency: "ZORA",
        startingMarketCap: "LOW",
      });
      setPreviewUrl("");
      setPreviewType(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract payload"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const walletAddress = address || ""; // Use the address from auth context
  const jwtToken = ""; // Replace with actual JWT token if available

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {success && !showForm ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Info className="h-8 w-8 mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2">
              Coin Scheduled Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your coin launch has been scheduled. You can view it in your
              scheduled coins list.
            </p>
            <Button onClick={() => setSuccess("")}>Schedule Another</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold font-serif">Scheduler</h1>
                <p className="text-muted-foreground mt-2">
                  Schedule coin launches for the future
                </p>
              </div>
              <Button
                className="gap-2"
                onClick={() => setShowForm(true)}
                data-testid="button-schedule-new"
              >
                <Plus className="h-4 w-4" />
                Schedule New
              </Button>
            </div>



            {!loading && !error && scheduledCoins.length === 0 && (
              <p>No scheduled coins found.</p>
            )}

            {!loading && !error && scheduledCoins.length > 0 && (
              <>
                <h2 className="text-2xl font-bold">Scheduled Coins</h2>
                <ScheduledCoinList scheduledCoins={scheduledCoins} loading={loading} />
              </>
            )}

            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Schedule New Coin</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScheduleForm
                    formData={formData}
                    setFormData={setFormData}
                    handleSchedule={handleSchedule}
                    uploading={uploading}
                    setUploading={setUploading}
                    uploadProgress={uploadProgress}
                    setUploadProgress={setUploadProgress}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    previewType={previewType}
                    setPreviewType={setPreviewType}
                    submitting={submitting}
                    setError={setError}
                    address={address || undefined} // Ensure address is passed as string | undefined
                  />
                </CardContent>
              </Card>
            )}

            <ScheduledCoinsViewer walletAddress={walletAddress} jwtToken={jwtToken} />
          </>
        )}
      </div>
    </div>
  );
}
